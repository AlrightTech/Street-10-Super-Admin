import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import UserSummaryCard from "../components/users/UserSummaryCard";
import UserStatsCard from "../components/users/UserStatsCard";
import SpendingSummary from "../components/users/SpendingSummary";
import OrderHistoryTable from "../components/users/OrderHistoryTable";
import ConfirmModal from "../components/ui/ConfirmModal";
import { usersApi } from "../services/users.api";
import type {
  UserDetails as UserDetailsType,
  BiddingItem,
  OrderItem,
} from "../types/userDetails";

/**
 * User Details page component
 */
export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<
    BiddingItem | OrderItem | null
  >(null);
  const [userUuid, setUserUuid] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      if (id) {
        try {
          // Check if user data is passed from navigation state (e.g., after edit)
          if (location.state?.user) {
            setUser(location.state.user as UserDetailsType);
            setLoading(false);
            return;
          }

          // Check if id is a numeric ID (not a UUID)
          // UUIDs contain hyphens, numeric IDs don't
          let userIdToFetch = id;
          
          // Check if it's numeric (no hyphens and all digits or starts with digits)
          const isNumericId = !id.includes("-") && /^\d+$/.test(id);
          
          if (isNumericId) {
            // This is a numeric ID, we need to convert it to UUID
            // Fetch users list to build the mapping
            console.log(
              "Numeric ID detected, fetching users list to find UUID...",
              id
            );
            
            try {
              const usersResult = await usersApi.getAll({ page: 1, limit: 1000 });
              console.log("Fetched users for mapping:", usersResult.data.length);
              
              const userIdMap = new Map<number, string>();
              usersResult.data.forEach((user: any) => {
                try {
                  const numericId =
                    parseInt(user.id.replace(/-/g, "").substring(0, 10), 16) %
                    1000000;
                  userIdMap.set(numericId, user.id);
                } catch (e) {
                  console.error("Error converting user ID:", user.id, e);
                }
              });
              
              console.log("User ID map built with", userIdMap.size, "entries");
              
              const numericId = parseInt(id);
              const uuid = userIdMap.get(numericId);
              
              if (!uuid) {
                console.error(`User with numeric ID ${id} not found in mapping. Available IDs:`, Array.from(userIdMap.keys()));
                throw new Error(`User with ID ${id} not found`);
              }
              
              userIdToFetch = uuid;
              console.log(`Converted numeric ID ${id} to UUID: ${uuid}`);
            } catch (error) {
              console.error("Error converting numeric ID to UUID:", error);
              throw error;
            }
          } else {
            // It's already a UUID, use it directly
            console.log("Using UUID directly:", userIdToFetch);
          }

          // Store the UUID for later use (for edit, block, etc.)
          setUserUuid(userIdToFetch);

          // Fetch from API using UUID
          console.log("Fetching user with UUID:", userIdToFetch);
          const apiUser = await usersApi.getById(userIdToFetch);

          // Transform API response to frontend format
          const transformedUser: UserDetailsType = {
            id:
              parseInt(apiUser.user.id.replace(/-/g, "").substring(0, 10), 16) %
              1000000,
            name: apiUser.user.email.split("@")[0],
            email: apiUser.user.email,
            phone: apiUser.user.phone || "",
            avatar: "",
            role: apiUser.user.role,
            accountStatus:
              apiUser.user.status === "active"
                ? "verified"
                : apiUser.user.status === "blocked"
                ? "unverified"
                : "pending",
            status:
              apiUser.user.status === "active"
                ? "active"
                : apiUser.user.status === "blocked"
                ? "blocked"
                : "pending",
            ordersMade: apiUser.stats?.ordersCount || 0,
            biddingWins: apiUser.stats?.bidsWon || 0,
            totalSpent:
              parseFloat(apiUser.stats?.totalSpent?.toString() || "0") / 100,
            totalRefunds: 0,
            pendingRefunds: 0,
            netSpending:
              parseFloat(apiUser.stats?.totalSpent?.toString() || "0") / 100,
            walletBalance:
              parseFloat(
                apiUser.user.wallet?.availableMinor?.toString() || "0"
              ) / 100,
            walletLimit: 10000,
            interests: [],
            interestsImage: "",
            biddings: (apiUser.recentBids || []).map((bid: any) => ({
              id: bid.id,
              productName: bid.auction?.product?.title || "Product",
              productImage: bid.auction?.product?.media?.[0]?.url || "",
              category: "",
              bidId: bid.id,
              bidAmount: parseFloat(bid.amountMinor?.toString() || "0") / 100,
              currentPrice:
                parseFloat(bid.amountMinor?.toString() || "0") / 100,
              result: bid.isWinning ? "won" : "lost",
              endDate: new Date(
                bid.auction?.endAt || new Date()
              ).toLocaleDateString(),
              status: bid.isWinning ? "won-fully-paid" : "lost",
            })),
            orders: (apiUser.recentOrders || []).map((order: any) => ({
              id: order.id,
              productName: order.items?.[0]?.product?.title || "Product",
              productImage: order.items?.[0]?.product?.media?.[0]?.url || "",
              orderId: order.orderNumber,
              amount: parseFloat(order.totalMinor?.toString() || "0") / 100,
              date: new Date(order.createdAt).toLocaleDateString(),
              status: order.status,
            })),
          };

          setUser(transformedUser);
        } catch (error) {
          console.error("Error fetching user details:", error);
          navigate("/users");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [id, navigate, location.state]);

  const handleEdit = () => {
    if (user && userUuid) {
      navigate(`/users/${userUuid}/edit`, { state: { user } });
    }
  };

  const handleBlock = async () => {
    if (!user || !userUuid) return;

    try {
      const isCurrentlyBlocked = user.status === "blocked";
      await usersApi.toggleBlock(userUuid, !isCurrentlyBlocked);
      // Reload user data
      window.location.reload();
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to update user status");
    }
  };

  const handleDelete = (item: BiddingItem | OrderItem) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (user && itemToDelete) {
      // Update user data by removing the item
      if ("status" in itemToDelete && "bidId" in itemToDelete) {
        // It's a bidding item
        const biddingItem = itemToDelete as BiddingItem;
        setUser({
          ...user,
          biddings: user.biddings.filter((b) => b.id !== biddingItem.id),
        });
      } else {
        // It's an order item
        const orderItem = itemToDelete as OrderItem;
        setUser({
          ...user,
          orders: user.orders.filter((o) => o.id !== orderItem.id),
        });
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">User not found</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="mb-2 text-xl sm:text-2xl font-bold text-gray-900">
          Users
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">Dashboard • Users</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* User Summary Card */}
        <UserSummaryCard user={user} />

        {/* User Stats Card */}
        <UserStatsCard
          user={user}
          onEdit={handleEdit}
          onBlock={handleBlock}
          onDelete={() => {
            // Handle user delete
            console.log("Delete user:", user.id);
          }}
        />

        {/* Spending Summary */}
        <SpendingSummary user={user} />

        {/* Order History Table */}
        <OrderHistoryTable
          user={user}
          onEdit={(item) => {
            console.log("Edit item:", item);
          }}
          onBlock={(item) => {
            console.log("Block item:", item);
          }}
          onDelete={handleDelete}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
