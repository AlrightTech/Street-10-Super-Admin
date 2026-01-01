import { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Lazy load dashboard pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Users = lazy(() => import('./pages/Users'))
const UserDetails = lazy(() => import('./pages/UserDetails'))
const EditUser = lazy(() => import('./pages/EditUser'))
const Vendors = lazy(() => import('./pages/Vendors'))
const Orders = lazy(() => import('./pages/Orders'))
const OrderDetail = lazy(() => import('./pages/OrderDetail'))
const OrderDetailView = lazy(() => import('./pages/OrderDetailView'))
const ProcessRefundOrder = lazy(() => import('./pages/ProcessRefundOrder'))
const StartRefundProcess = lazy(() => import('./pages/StartRefundProcess'))
const Invoice = lazy(() => import('./pages/Invoice'))
const EcommerceOrderView = lazy(() => import('./pages/EcommerceOrderView'))
const BidDetailPage = lazy(() => import('./pages/BidDetailPage'))
const ViewKYC = lazy(() => import('./pages/ViewKYC'))
const RefundRequest = lazy(() => import('./pages/RefundRequest'))
const EditVendor = lazy(() => import('./pages/EditVendor'))
const VendorDetail = lazy(() => import('./pages/VendorDetail'))
const AllVendorProducts = lazy(() => import('./pages/AllVendorProducts'))
const EditUserDetail = lazy(() => import('./pages/EditUserDetail'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const VendorRequestDetail = lazy(() => import('./pages/VendorRequestDetail'))
const Finance = lazy(() => import('./pages/Finance'))
const AllTransactions = lazy(() => import('./pages/AllTransactions'))
const VendorFinanceDetail = lazy(() => import('./pages/VendorFinanceDetail'))
const UserFinanceDetail = lazy(() => import('./pages/UserFinanceDetail'))
const Marketing = lazy(() => import('./pages/Marketing'))
const AddStoryHighlight = lazy(() => import('./pages/AddStoryHighlight'))
const AddBanner = lazy(() => import('./pages/AddBanner'))
const BannerDetail = lazy(() => import('./pages/BannerDetail'))
const PushNotificationSendDetail = lazy(() => import('./pages/PushNotificationSendDetail'))
const PushNotificationPendingDetail = lazy(() => import('./pages/PushNotificationPendingDetail'))
const PushNotificationScheduledDetail = lazy(() => import('./pages/PushNotificationScheduledDetail'))
const AddPushNotification = lazy(() => import('./pages/AddPushNotification'))
const AddProduct = lazy(() => import('./pages/AddProduct'))
const ProductActiveDetail = lazy(() => import('./pages/ProductActiveDetail'))
const ProductScheduledDetail = lazy(() => import('./pages/ProductScheduledDetail'))
const ProductExpiredDetail = lazy(() => import('./pages/ProductExpiredDetail'))
const Analytics = lazy(() => import('./pages/Analytics'))
const TopPerformerDetail = lazy(() => import('./pages/TopPerformerDetail'))
const AnalyticsOrderDetail = lazy(() => import('./pages/AnalyticsOrderDetail'))
const MainControl = lazy(() => import('./pages/MainControl'))
const Categories = lazy(() => import('./pages/Categories'))
const AddCategory = lazy(() => import('./pages/AddCategory'))
const AddSubCategory = lazy(() => import('./pages/AddSubCategory'))
const CategoryFilters = lazy(() => import('./pages/CategoryFilters'))
const AddCategoryFilter = lazy(() => import('./pages/AddCategoryFilter'))
const EditFilter = lazy(() => import('./pages/EditFilter'))
const Products = lazy(() => import('./pages/Products'))
const BiddingProducts = lazy(() => import('./pages/BiddingProducts'))
const AddBiddingProduct = lazy(() => import('./pages/AddBiddingProduct'))
const EcommerceProducts = lazy(() => import('./pages/EcommerceProducts'))
const AddEcommerceProduct = lazy(() => import('./pages/AddEcommerceProduct'))
const EditEcommerceProduct = lazy(() => import('./pages/EditEcommerceProduct'))
const EcommerceProductDetail = lazy(() => import('./pages/EcommerceProductDetail'))
const EndedUnsoldDetailRoute = lazy(() => import('./pages/bidding/EndedUnsoldDetailRoute'))
const PaymentRequestedDetailRoute = lazy(() => import('./pages/bidding/PaymentRequestedDetailRoute'))
const FullyPaidSoldDetailRoute = lazy(() => import('./pages/bidding/FullyPaidSoldDetailRoute'))
const ScheduledDetailRoute = lazy(() => import('./pages/bidding/ScheduledDetailRoute'))
const LiveDetailRoute = lazy(() => import('./pages/bidding/LiveDetailRoute'))
const EditBiddingProduct = lazy(() => import('./pages/EditBiddingProduct'))
const BiddingHistory = lazy(() => import('./pages/bidding/BiddingHistory'))
const Wallet = lazy(() => import('./pages/Wallet'))
const TransactionDetails = lazy(() => import('./pages/TransactionDetails'))
const UserWallets = lazy(() => import('./pages/UserWallets'))
const Withdrawals = lazy(() => import('./pages/Withdrawals'))
const WalletSettings = lazy(() => import('./pages/WalletSettings'))
const Settings = lazy(() => import('./pages/Settings'))
const AllUsers = lazy(() => import('./pages/AllUsers'))

/**
 * Loading fallback component
 */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#F7941D] border-r-transparent"></div>
      <p className="mt-4 text-sm text-gray-600">Loading...</p>
    </div>
  </div>
)

/**
 * Main App component with routes and language context
 */
function App() {
  return (
    <LanguageProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="all-users" element={<AllUsers />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="users/:id/edit" element={<EditUser />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="vendors/:id/edit" element={<EditVendor />} />
            <Route path="vendors/:id/detail" element={<VendorDetail />} />
            <Route path="vendors/:id/products" element={<AllVendorProducts />} />
            <Route path="vendors/:id/edit-user-detail" element={<EditUserDetail />} />
            <Route path="vendor/product/:productId" element={<ProductDetail />} />
            <Route path="/vendors/vendor-request-detail/:id" element={<VendorRequestDetail />} />

            <Route path="orders" element={<Orders />} />
            <Route path="orders/:orderId/view" element={<OrderDetailView />} />
            <Route path="orders/:orderId/detail" element={<OrderDetail />} />
            <Route path="orders/:orderId/process-refund" element={<ProcessRefundOrder />} />
            <Route path="orders/:orderId/start-refund-process" element={<StartRefundProcess />} />
            <Route path="orders/:orderId/invoice" element={<Invoice />} />
            <Route path="orders/:orderId" element={<OrderDetail />} />
            <Route path="biddings/:bidId" element={<BidDetailPage />} />
            <Route path="view-kyc/:id" element={<ViewKYC />} />
            <Route path="refund-request/:id" element={<RefundRequest />} />
            <Route path="finance" element={<Finance />} />
            <Route path="finance/all-transactions" element={<AllTransactions />} />
            <Route path="finance/vendor/:vendorId" element={<VendorFinanceDetail />} />
            <Route path="finance/user/:userId" element={<UserFinanceDetail />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="marketing/add-story" element={<AddStoryHighlight />} />
            <Route path="marketing/edit-story/:id" element={<AddStoryHighlight />} />
            <Route path="marketing/add-banner" element={<AddBanner />} />
            <Route path="marketing/edit-banner/:id" element={<AddBanner />} />
            <Route path="marketing/banner/:id" element={<BannerDetail />} />
            <Route path="marketing/push-notification/send/:id" element={<PushNotificationSendDetail />} />
            <Route path="marketing/push-notification/pending/:id" element={<PushNotificationPendingDetail />} />
            <Route path="marketing/push-notification/scheduled/:id" element={<PushNotificationScheduledDetail />} />
            <Route path="marketing/add-push-notification" element={<AddPushNotification />} />
            <Route path="marketing/edit-push-notification/:id" element={<AddPushNotification />} />
            <Route path="marketing/add-product" element={<AddProduct />} />
            <Route path="marketing/edit-product/:id" element={<AddProduct />} />
            <Route path="marketing/product/active/:id" element={<ProductActiveDetail />} />
            <Route path="marketing/product/scheduled/:id" element={<ProductScheduledDetail />} />
            <Route path="marketing/product/expired/:id" element={<ProductExpiredDetail />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="analytics/top-performer-detail" element={<TopPerformerDetail />} />
            <Route path="analytics/order-detail/:userId" element={<AnalyticsOrderDetail />} />
            <Route path="main-control" element={<MainControl />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/add" element={<AddCategory />} />
            <Route path="categories/edit/:id" element={<AddCategory />} />
            <Route path="categories/add-sub-category" element={<AddSubCategory />} />
            <Route path="categories/edit-subcategory/:id" element={<AddSubCategory />} />
            <Route path="categories/filters" element={<CategoryFilters />} />
            <Route path="categories/add-filter" element={<AddCategoryFilter />} />
            <Route path="categories/edit-filter/:id" element={<AddCategoryFilter />} />
            <Route path="categories/edit-filter" element={<EditFilter />} />
            <Route path="products" element={<Products />} />
            <Route path="products/bidding" element={<BiddingProducts />} />
            <Route path="products/ecommerce" element={<EcommerceProducts />} />
            <Route path="building-products" element={<BiddingProducts />} />
            <Route path="building-products/add" element={<AddBiddingProduct />} />
            <Route path="building-products/:id/edit" element={<EditBiddingProduct />} />
            <Route path="building-products/:id/history" element={<BiddingHistory />} />
            <Route path="building-products/:id/ended-unsold" element={<EndedUnsoldDetailRoute />} />
            <Route path="building-products/:id/payment-requested" element={<PaymentRequestedDetailRoute />} />
            <Route path="building-products/:id/fully-paid-sold" element={<FullyPaidSoldDetailRoute />} />
            <Route path="building-products/:id/scheduled" element={<ScheduledDetailRoute />} />
            <Route path="building-products/:id/live" element={<LiveDetailRoute />} />
            <Route path="ecommerce-products/orders/:orderId" element={<EcommerceOrderView />} />
            <Route path="ecommerce-products/add" element={<AddEcommerceProduct />} />
            <Route path="ecommerce-products/:productId/edit" element={<EditEcommerceProduct />} />
            <Route path="ecommerce-products/:productId" element={<EcommerceProductDetail />} />
            <Route path="ecommerce-products" element={<EcommerceProducts />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="wallet/all-transactions" element={<AllTransactions />} />
            <Route path="wallet/user-wallets" element={<UserWallets />} />
            <Route path="wallet/withdrawals" element={<Withdrawals />} />
            <Route path="wallet/settings" element={<WalletSettings />} />
            <Route path="transactions/detail/:id" element={<TransactionDetails />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </LanguageProvider>
  )
}

export default App
