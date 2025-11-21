# Street10 Super Admin Dashboard

A comprehensive, modern admin dashboard built with React, TypeScript, and Tailwind CSS for managing the Street10 Mazad platform. This application provides a complete administrative interface for managing users, vendors, products, orders, bidding, finances, marketing, and analytics.

## 🚀 Features

### Core Functionality
- **User Management**: Complete user administration with profile editing, wallet management, and KYC verification
- **Vendor Management**: Vendor onboarding, approval workflows, product management, and transaction tracking
- **Product Management**: E-commerce and bidding product catalogs with detailed product management
- **Order Management**: Order processing, tracking, and fulfillment workflows
- **Bidding System**: Auction management with status tracking (ended-unsold, payment-requested, fully-paid-sold, scheduled)
- **Financial Management**: Transaction tracking, wallet management, withdrawals, and refund processing
- **Marketing Tools**: Banner management, push notifications, story highlights, and campaign tracking
- **Analytics Dashboard**: Comprehensive analytics with charts, performance metrics, and insights
- **Category Management**: Product category organization and hierarchy

### Technical Features
- ✅ **TypeScript**: Fully typed codebase with comprehensive type safety
- ✅ **Responsive Design**: Mobile-first approach with adaptive layouts
- ✅ **Modern UI**: Clean, professional interface with Tailwind CSS
- ✅ **Language Support**: Arabic/English switcher with RTL/LTR support
- ✅ **Form Validation**: Typed form state with validation
- ✅ **React Router**: Typed navigation with protected routes
- ✅ **Accessibility**: ARIA labels, keyboard navigation, focus management
- ✅ **Data Visualization**: Charts and graphs using Recharts

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - Modern UI library with latest features
- **TypeScript 5.9** - Type safety and enhanced developer experience
- **Vite 7** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM 7** - Client-side routing

### Additional Libraries
- **Recharts 2.12** - Data visualization and charting library

## 📁 Project Structure

```
super-admin/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── analytics/       # Analytics-specific components
│   │   ├── bidding/         # Bidding system components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── ecommerce/       # E-commerce components
│   │   ├── finance/         # Financial components
│   │   ├── icons/           # Icon components
│   │   ├── layout/          # Layout components (Sidebar, etc.)
│   │   ├── marketing/       # Marketing components
│   │   ├── orders/          # Order management components
│   │   ├── products/        # Product components
│   │   ├── ui/              # Base UI components
│   │   ├── users/           # User management components
│   │   └── vendors/         # Vendor management components
│   ├── contexts/            # React contexts
│   │   └── LanguageContext.tsx
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   │   ├── Dashboard.tsx
│   │   ├── LoginPage.tsx
│   │   ├── Users.tsx
│   │   ├── Vendors.tsx
│   │   ├── Products.tsx
│   │   ├── EcommerceProducts.tsx
│   │   ├── BiddingProducts.tsx
│   │   ├── Orders.tsx
│   │   ├── Finance.tsx
│   │   ├── Marketing.tsx
│   │   ├── Analytics.tsx
│   │   └── ... (many more)
│   ├── routes/              # Route configuration
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── data/                # Static data and constants
│   ├── assets/              # Images and static assets
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚦 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd street10-super-admin-dashboard/super-admin
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build the application for production:
```bash
npm run build
```

The production build will be output to the `dist/` directory.

### Preview

Preview the production build locally:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## 📄 Available Pages

### Authentication
- `/` - Login page with split-screen layout
- `/reset-password` - Password reset page

### Dashboard
- `/dashboard` - Main dashboard with overview metrics

### User Management
- `/users` - User list and management
- `/user-details/:id` - Individual user details
- `/edit-user/:id` - Edit user information
- `/user-wallets` - User wallet management

### Vendor Management
- `/vendors` - Vendor list and management
- `/vendor-detail/:id` - Individual vendor details
- `/edit-vendor/:id` - Edit vendor information
- `/vendor-request-detail/:id` - Vendor request details
- `/view-kyc/:id` - KYC document viewing
- `/all-vendor-products/:id` - Vendor's product catalog

### Product Management
- `/products` - Product catalog management
- `/product-detail/:id` - Individual product details
- `/ecommerce-products` - E-commerce products management
- `/bidding-products` - Bidding/auction products management
- `/categories` - Category management

### Order Management
- `/orders` - Order list and management
- `/order-details/:id` - Individual order details

### Financial Management
- `/finance` - Financial overview and transactions
- `/all-transactions` - Complete transaction history
- `/transaction-details/:id` - Individual transaction details
- `/wallet` - Wallet management
- `/wallet-settings` - Wallet configuration
- `/withdrawals` - Withdrawal requests management
- `/refund-request` - Refund processing

### Marketing
- `/marketing` - Marketing tools overview
- `/add-banner` - Create new banner
- `/banner-detail/:id` - Banner details
- `/add-push-notification` - Create push notification
- `/add-story-highlight` - Create story highlight
- `/add-category` - Add new category

### Analytics
- `/analytics` - Analytics dashboard
- `/analytics-order-detail/:id` - Order analytics details
- `/top-performer-detail/:id` - Top performer details

### Settings
- `/settings` - Application settings
- `/main-control` - Main control panel

## 🎨 Design System

### Color Palette
- **Primary Orange**: `#F7931E` / `#F7941D` - Primary actions and highlights
- **Purple**: `#6B46C1` / `#3A388D` - Secondary actions and footer
- **Success Green**: `#118D57` - Success states
- **Warning Yellow**: `#B76E00` - Warning states
- **Error Red**: `#B71D18` - Error states
- **Gray Scale**: Various shades for backgrounds, borders, and text

### Typography
- **Font Family**: Inter (with system font fallbacks)
- **Headings**: Bold, large sizes for hierarchy
- **Body Text**: Regular weight, readable sizes
- **Small Text**: Used for labels, captions, and metadata

### Component Patterns
- Consistent spacing using Tailwind's spacing scale
- Rounded corners (`rounded-lg`, `rounded-xl`) for modern look
- Shadow utilities for depth (`shadow-sm`, `shadow-md`)
- Consistent border colors and widths
- Hover states for interactive elements

## 🔒 Type Safety

All components are fully typed with TypeScript:

- **Component Props**: Typed interfaces for all component props
- **State Management**: Typed state with `useState` and `useReducer`
- **Event Handlers**: Typed event handlers for forms and interactions
- **API Responses**: Typed interfaces for data structures
- **Route Params**: Typed route parameters and query strings

## 🌐 Internationalization

The application supports multiple languages:

- **Arabic (ar)**: Right-to-left (RTL) layout support
- **English (en)**: Left-to-right (LTR) layout support

Language switching is handled through `LanguageContext` with automatic document direction switching.

## ♿ Accessibility

The application follows accessibility best practices:

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **ARIA Labels**: Proper ARIA labels on buttons, inputs, and navigation
- **Focus Management**: Proper focus handling for modals and dynamic content
- **Screen Reader Support**: Semantic HTML and proper heading hierarchy
- **Color Contrast**: WCAG AA compliant color combinations

## 📊 Data Visualization

The dashboard includes comprehensive data visualization using Recharts:

- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Area charts for cumulative data
- Custom tooltips and legends

## 🔧 Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow React best practices and hooks patterns
- Use functional components exclusively
- Implement proper error boundaries
- Write self-documenting code with clear variable names

### Component Organization
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Separate concerns (UI, logic, data)

### Styling
- Use Tailwind CSS utility classes
- Maintain consistent spacing and sizing
- Follow the established design system
- Use responsive design patterns

## 📝 License

Private project for Street10 Mazad. All rights reserved.

## 👥 Contributing

This is a private project. For contributions or questions, please contact the development team.

---

**Built with ❤️ for Street10 Mazad**
