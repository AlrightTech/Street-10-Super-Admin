# Category Module Documentation - Super Admin

## Overview
The Category Module in Super Admin manages product categories, subcategories, and filters. It consists of three main sections accessible via tabs: **Categories**, **Sub Category**, and **Filter**.

---

## Routes

### Frontend Routes (Super Admin)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/categories` | `Categories.tsx` | Main page with tabs for Categories, Sub Category, and Filter |
| `/categories/add` | `AddCategory.tsx` | Add new category (also used for editing) |
| `/categories/edit/:id` | `AddCategory.tsx` | Edit existing category |
| `/categories/add-sub-category` | `AddSubCategory.tsx` | Add new subcategory |
| `/categories/edit-subcategory/:id` | `AddSubCategory.tsx` | Edit existing subcategory |
| `/categories/filters` | `CategoryFilters.tsx` | View and manage category filters |
| `/categories/add-filter` | `AddCategoryFilter.tsx` | Add new filter |
| `/categories/edit-filter/:id` | `AddCategoryFilter.tsx` | Edit existing filter |
| `/categories/edit-filter` | `EditFilter.tsx` | Manage filter options (used from AddCategory page) |

### Backend API Routes

#### Category Routes (`/api/v1/categories`)
| Method | Route | Purpose | Auth Required |
|--------|-------|---------|---------------|
| `GET` | `/tree` | Get category tree (hierarchical) | No |
| `GET` | `/:id` | Get category by ID | No |
| `POST` | `/` | Create category | Yes (super-admin, sub-admin) |
| `PATCH` | `/:id` | Update category | Yes (super-admin, sub-admin) |
| `DELETE` | `/:id` | Delete category | Yes (super-admin, sub-admin) |

#### Category Filter Routes (`/api/v1/categories/:id/filters`)
| Method | Route | Purpose | Auth Required |
|--------|-------|---------|---------------|
| `GET` | `/:id/filters` | Get filters assigned to a category | Yes (super-admin, sub-admin) |
| `POST` | `/:id/filters` | Assign filter to category | Yes (super-admin, sub-admin) |
| `DELETE` | `/:id/filters/:filterId` | Remove filter from category | Yes (super-admin, sub-admin) |

#### Filter Routes (`/api/v1/admin/filters`)
| Method | Route | Purpose | Auth Required |
|--------|-------|---------|---------------|
| `GET` | `/` | Get all filters | Yes (super-admin, sub-admin) |
| `GET` | `/:id` | Get filter by ID | Yes (super-admin, sub-admin) |
| `POST` | `/` | Create filter | Yes (super-admin, sub-admin) |
| `PATCH` | `/:id` | Update filter | Yes (super-admin, sub-admin) |
| `DELETE` | `/:id` | Delete filter | Yes (super-admin, sub-admin) |

---

## Current Implementation Status

### ✅ What's Working

1. **Category Tree API Integration**
   - `Categories.tsx` uses `categoriesApi.getTree()` to fetch categories
   - Used in product forms (Add/Edit E-commerce, Add Bidding) to populate category dropdowns
   - Backend returns hierarchical category structure with parent-child relationships

2. **Category Display**
   - Categories page shows categories in a table format
   - Supports pagination (5 items per page)
   - Search functionality by category name
   - Filter by parent category (All Categories, Top Level, or specific parent)

3. **Subcategory Management**
   - Subcategories displayed in grid format
   - Each subcategory card shows title, description, icon, item count, and items
   - Supports adding/editing subcategories
   - Items can be added/removed from subcategories
   - Data stored in localStorage (not connected to backend API yet)

### ⚠️ What's Using Mock Data (Not Connected to Backend)

1. **Categories List Page (`Categories.tsx`)**
   - Uses `CATEGORIES_DATA` mock array instead of API
   - Edit, Delete, and Toggle Status operations work on local state only
   - Not synced with backend database

2. **Add/Edit Category (`AddCategory.tsx`)**
   - Form fields: Category Name, Description, Icon Upload, Filter Selection
   - Currently just logs to console, doesn't call API
   - Filter options loaded from localStorage (synced with EditFilter page)
   - Icon upload not implemented (file handling missing)

3. **Subcategories (`AddSubCategory.tsx` & `Categories.tsx`)**
   - All subcategory data stored in localStorage
   - No backend API integration
   - Subcategory structure: `{ id, title, description, icon, items[], subCategoryCount, status }`

4. **Category Filters (`CategoryFilters.tsx`, `AddCategoryFilter.tsx`)**
   - Filter data stored in localStorage
   - No backend API integration
   - Filter structure: `{ id, filterName, inputType, options[], description, category, status }`

5. **Edit Filter (`EditFilter.tsx`)**
   - Manages filter options (like "Brand", "Mileage", etc.)
   - Stored in localStorage as `filterOptions`
   - Used by `AddCategory.tsx` to show available filters when creating categories

---

## Filter Options

### Filter Input Types
The system supports the following filter input types:

1. **Text** - Single-line text input
2. **Number** - Numeric input
3. **Radio** - Single selection from options
4. **Checkbox** - Multiple selection from options

### Filter Structure (Backend)
```typescript
{
  key: string;              // Unique identifier (e.g., "brand", "mileage")
  type: string;             // Input type (text, number, select, etc.)
  options?: any;            // Options for select/multi-select types
  validation?: any;         // Validation rules
  i18n?: {                  // Internationalization
    en?: { label: string; placeholder?: string };
    ar?: { label: string; placeholder?: string };
  };
  isIndexed?: boolean;      // Whether to index for search
}
```

### Filter Assignment to Categories
- Filters can be assigned to specific categories
- Each assignment includes:
  - `displayOrder` - Order in which filter appears
  - `required` - Whether filter is required
  - `visibility` - Where filter appears: `listing`, `detail`, or `admin`

---

## Data Flow

### Categories
```
Backend API (✅ Connected)
  ↓
categoriesApi.getTree() → Used in product forms
  ↓
Categories.tsx → Currently uses mock data (❌ Not connected)
  ↓
AddCategory.tsx → Currently just logs (❌ Not connected)
```

### Subcategories
```
localStorage (❌ No backend)
  ↓
AddSubCategory.tsx → Saves to localStorage
  ↓
Categories.tsx → Reads from localStorage
```

### Filters
```
localStorage (❌ No backend)
  ↓
EditFilter.tsx → Manages filter options → localStorage
  ↓
AddCategory.tsx → Reads filter options from localStorage
  ↓
CategoryFilters.tsx → Manages filters → localStorage
  ↓
AddCategoryFilter.tsx → Creates/edits filters → localStorage
```

---

## What Needs to Be Done

### 1. Connect Categories to Backend API
- Replace mock data in `Categories.tsx` with API calls
- Implement API calls in `AddCategory.tsx` for create/update
- Connect delete and status toggle to backend
- Implement icon upload (store URL in database)

### 2. Implement Subcategory Backend
- Create subcategory API endpoints
- Replace localStorage with API calls
- Define subcategory data model in database

### 3. Connect Filters to Backend API
- Replace localStorage in `CategoryFilters.tsx` with API calls
- Connect `AddCategoryFilter.tsx` to filter API
- Connect `EditFilter.tsx` to filter API
- Implement filter assignment to categories

### 4. Category-Filter Assignment
- Connect filter selection in `AddCategory.tsx` to category-filter assignment API
- Show assigned filters when editing category

---

## Current Filter Options (Mock Data)

The system currently has these default filter options (stored in localStorage):
- Brand
- Mileage
- Model Year
- Gear Type
- Engine Capacity
- Conditions
- Fuel Type
- Color

These can be managed via the "Edit Filter" page (`/categories/edit-filter`).

---

## Notes

1. **Category Tree**: The backend returns a hierarchical structure where categories can have parent categories (subcategories). The tree is built by filtering root categories (where `parentId` is null).

2. **Category Status**: Categories have an `isActive` field that controls visibility. Only active categories are returned in the tree API.

3. **Category Deletion**: Backend prevents deletion if:
   - Category has child categories
   - Category has associated products

4. **Filter Types**: Backend supports more filter types than frontend currently uses:
   - `text`, `textarea`, `number`, `range`, `select`, `multi-select`, `boolean`, `date`, `rating`

5. **Data Persistence**: Currently, only category tree fetching is connected to backend. All CRUD operations for categories, subcategories, and filters use localStorage or mock data.

