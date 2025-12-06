# NeonShop - Modern E-Commerce Platform

A full-stack, bilingual e-commerce platform built with Next.js, Express, and PostgreSQL. Features include real-time inventory management, comprehensive admin dashboard, multi-language support (English/Arabic with RTL), and seamless shopping experience for both authenticated and guest users.

## 🌟 Live Demo

**Status**: Coming Soon - Local Development

## 📸 Screenshots

> **Note**: Add your screenshots to a `screenshots/` folder in the project root.

### 🏠 Homepage

![Homepage Hero Section](screenshots/homepage-hero.png)
*Hero section with promotional banners and call-to-action buttons*

---
*Key features section highlighting delivery, payment security, and customer service*

---
*Featured products grid with quick view and add to cart functionality*

---

### 🛍️ Product Catalog

![Product Catalog](screenshots/products-page.png)
*Responsive product grid with advanced filtering and sorting options*

---

*Sidebar filters with category selection, price range slider, and search functionality*

---

### 📦 Product Detail Page

![Product Detail](screenshots/product-detail.png)
*Product detail page with image gallery, description, reviews, and purchase options*

---

### 🛒 Shopping Cart & Checkout

![Shopping Cart](screenshots/cart-full.png)
*Shopping cart with item management, quantity controls, and order summary*

---

![Checkout Page](screenshots/checkout-page.png)
*Multi-step checkout process with address, delivery, and payment information*

---

### 👤 User Authentication & Profile

![Login Page](screenshots/login-page.png)
*Login form with email verification and password recovery options*

---

![Register Page](screenshots/register-page.png)
*Registration form with validation and email verification flow*

---

![User Profile](screenshots/profile-page.png)
*User profile page with personal information, addresses, and account settings*

---

![Orders Page](screenshots/orders-page.png)
*Order history with status tracking and order details*

---

### ❤️ Wishlist

![Wishlist Page](screenshots/wishlist-page.png)
*Wishlist page showing saved favorite products with options to add to cart*

---

### 🎛️ Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)
*Comprehensive admin dashboard with real-time statistics and analytics*

---

![Admin Products](screenshots/admin-products.png)
*Product management interface with CRUD operations*

---

![Admin Orders](screenshots/admin-orders.png)
*Order management system with status updates and filtering*

---

![Admin Analytics](screenshots/admin-analytics.png)
*Sales analytics with charts and revenue tracking*

---

### 📄 Other Pages

![About Page](screenshots/about-page.png)
*About us page with company story and values*

---

![Contact Page](screenshots/contact-page.png)
*Contact form with information and map integration*

---

![FAQ Page](screenshots/faq-page.png)
*Frequently asked questions with categorized sections*

---

## 📋 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

## ✨ Features

### Core E-Commerce Features

- **Product Management**: Full CRUD operations for products with multiple images, categories, and stock tracking
- **Advanced Search & Filtering**: Real-time search with category filters, price range, and multiple sorting options
- **Shopping Cart**: Persistent cart for authenticated users, localStorage-based cart for guests
- **Wishlist**: Save favorite products for later purchase
- **Order Management**: Complete order lifecycle from creation to delivery tracking
- **Product Reviews**: Users can rate and review purchased products
- **Checkout Process**: Multi-step checkout with address management and order confirmation

### User Features

- **Authentication System**: JWT-based auth with email verification
- **Email Verification**: Secure account activation via email
- **Password Recovery**: Forgot password and reset password functionality
- **User Profile**: Manage personal information, addresses, and view order history
- **Address Management**: Multiple addresses with default selection
- **Guest Shopping**: Full shopping experience without account creation

### Admin Features

- **Dashboard Analytics**: Real-time statistics on orders, revenue, products, and users
- **Sales Analytics**: Visual charts showing sales trends over 7 days, 30 days, or 12 months
- **Product Management**: Add, edit, delete products with inventory tracking
- **Order Management**: View and update order statuses
- **User Management**: View users, update roles, and manage accounts
- **Low Stock Alerts**: Track products with low or out-of-stock inventory
- **Revenue Reports**: Category-wise revenue breakdown
- **Customer Insights**: Top customers by spending and order count
- **Contact Management**: Handle customer inquiries and support tickets

### Internationalization (i18n)

- **Bilingual Support**: Complete English and Arabic translations
- **RTL Layout**: Automatic right-to-left layout for Arabic
- **Language Switcher**: Easy language toggle in navigation
- **Localized Routes**: Language prefix in URLs (e.g., `/en/products`, `/ar/products`)

### UI/UX Features

- **Responsive Design**: Mobile-first design, fully responsive across all devices
- **Dark/Light Mode**: Theme switcher with system preference detection
- **Animations**: Smooth transitions using Framer Motion
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Skeleton loaders and loading indicators
- **Form Validation**: Client-side and server-side validation with Zod
- **Error Handling**: Graceful error messages and recovery options
- **SEO Optimized**: Meta tags, semantic HTML, and proper heading structure

## 🛠️ Technologies Used

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.6 | React framework with App Router |
| **React** | 19.1.0 | UI library |
| **TypeScript** | 5.x | Type-safe development |
| **Tailwind CSS** | 3.4.18 | Utility-first CSS framework |
| **Radix UI** | Various | Accessible component primitives |
| **Redux Toolkit** | 2.11.0 | Global state management |
| **Zustand** | 5.0.8 | Lightweight state management |
| **TanStack Query** | 5.90.11 | Server state management & caching |
| **React Hook Form** | 7.67.0 | Form state management |
| **Zod** | 4.1.13 | Schema validation |
| **Axios** | 1.13.2 | HTTP client |
| **next-intl** | 4.5.6 | Internationalization |
| **Framer Motion** | 12.23.24 | Animation library |
| **Recharts** | 2.15.4 | Charting library |
| **Lucide React** | 0.555.0 | Icon library |
| **Sonner** | 2.0.7 | Toast notifications |
| **next-themes** | 0.4.6 | Theme management |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | JavaScript runtime |
| **Express** | 5.1.0 | Web framework |
| **TypeScript** | 5.9.3 | Type-safe development |
| **Prisma** | 7.0.1 | ORM for PostgreSQL |
| **PostgreSQL** | - | Relational database (Neon) |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcryptjs** | 3.0.3 | Password hashing |
| **Nodemailer** | 7.0.11 | Email service |
| **Zod** | 4.1.13 | Schema validation |
| **Helmet** | 8.1.0 | Security middleware |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **Express Rate Limit** | 8.2.1 | API rate limiting |

## 🏗️ Architecture

### Frontend Architecture

```
├── App Router (Next.js 15)
│   ├── [locale] (Internationalized routes)
│   ├── Client Components (Interactive UI)
│   └── Server Components (SSR)
│
├── State Management
│   ├── Redux Toolkit (Global app state)
│   ├── Zustand (UI state)
│   └── TanStack Query (Server state & caching)
│
├── API Integration Layer
│   ├── Axios Client (HTTP requests)
│   ├── Token Manager (JWT handling)
│   └── API Services (Organized by domain)
│
└── UI Components
    ├── Radix UI (Accessible primitives)
    ├── Custom Components
    └── shadcn/ui (Pre-built components)
```

### Backend Architecture

```
├── Express Server
│   ├── RESTful API
│   ├── JWT Authentication
│   └── Rate Limiting
│
├── Prisma ORM
│   ├── PostgreSQL Database
│   ├── Schema Definitions
│   └── Migrations
│
├── Layered Architecture
│   ├── Routes (API endpoints)
│   ├── Controllers (Business logic)
│   ├── Services (External integrations)
│   ├── Middleware (Auth, Error handling)
│   └── Validators (Zod schemas)
│
└── External Services
    ├── Nodemailer (Email)
    └── Neon Database (PostgreSQL)
```

## 💾 Database Schema

### Core Models

**User**
- Authentication & profile management
- Role-based access control (USER, ADMIN)
- Email verification system
- Password reset functionality

**Product**
- Multi-language support (name, description)
- Multiple images array
- Category relationship
- Stock tracking
- Featured flag

**Category**
- Bilingual names (English/Arabic)
- Slug-based routing
- Product count tracking

**Cart & CartItem**
- User-specific carts
- Quantity management
- Product relationships

**Order & OrderItem**
- Order lifecycle tracking
- Multiple status states (PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- Shipping address (JSON)
- Payment information
- Price history preservation

**Wishlist**
- User-product relationships
- Duplicate prevention

**Review**
- Product ratings (1-5)
- User comments
- One review per user per product

**Address**
- Multiple addresses per user
- Default address selection

**Contact**
- Customer inquiries
- Status tracking (PENDING, IN_PROGRESS, RESOLVED)
- Admin replies

### Database Relationships

```
User (1) ──── (M) Order
User (1) ──── (1) Cart
User (1) ──── (M) Wishlist
User (1) ──── (M) Review
User (1) ──── (M) Address

Category (1) ──── (M) Product

Product (1) ──── (M) CartItem
Product (1) ──── (M) OrderItem
Product (1) ──── (M) Wishlist
Product (1) ──── (M) Review

Order (1) ──── (M) OrderItem
Cart (1) ──── (M) CartItem
```

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: TBD
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/logout` | Logout user | ✅ |
| GET | `/auth/me` | Get current user | ✅ |
| POST | `/auth/refresh` | Refresh access token | ❌ |
| POST | `/auth/verify-email` | Verify email address | ❌ |
| POST | `/auth/send-verification` | Resend verification email | ✅ |
| POST | `/auth/forgot-password` | Request password reset | ❌ |
| POST | `/auth/reset-password` | Reset password | ❌ |
| POST | `/auth/change-password` | Change password | ✅ |

### Product Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products (with filters) | ❌ |
| GET | `/products/:id` | Get product by ID | ❌ |
| GET | `/products/category/:slug` | Get products by category | ❌ |
| POST | `/products` | Create product | ✅ Admin |
| PUT | `/products/:id` | Update product | ✅ Admin |
| DELETE | `/products/:id` | Delete product | ✅ Admin |

### Category Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/categories` | Get all categories | ❌ |
| GET | `/categories/:id` | Get category by ID | ❌ |
| POST | `/categories` | Create category | ✅ Admin |
| PUT | `/categories/:id` | Update category | ✅ Admin |
| DELETE | `/categories/:id` | Delete category | ✅ Admin |

### Cart Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cart` | Get user cart | ✅ |
| POST | `/cart/add` | Add item to cart | ✅ |
| PUT | `/cart/update/:id` | Update cart item | ✅ |
| DELETE | `/cart/remove/:id` | Remove item from cart | ✅ |
| DELETE | `/cart/clear` | Clear entire cart | ✅ |

### Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orders` | Create order | ✅ |
| GET | `/orders/my-orders` | Get user orders | ✅ |
| GET | `/orders/:id` | Get order by ID | ✅ |
| PATCH | `/orders/:id/cancel` | Cancel order | ✅ |
| GET | `/orders/admin/all` | Get all orders | ✅ Admin |
| PATCH | `/orders/:id/status` | Update order status | ✅ Admin |
| GET | `/orders/admin/stats` | Get order statistics | ✅ Admin |

### Wishlist Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/wishlist` | Get user wishlist | ✅ |
| POST | `/wishlist/add` | Add to wishlist | ✅ |
| DELETE | `/wishlist/remove/:id` | Remove from wishlist | ✅ |
| GET | `/wishlist/check/:productId` | Check if in wishlist | ✅ |
| DELETE | `/wishlist/clear` | Clear wishlist | ✅ |

### Review Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/reviews/product/:productId` | Get product reviews | ❌ |
| GET | `/reviews/product/:productId/my-review` | Get user's review | ✅ |
| POST | `/reviews` | Create review | ✅ |
| PUT | `/reviews/:id` | Update review | ✅ |
| DELETE | `/reviews/:id` | Delete review | ✅ |
| GET | `/reviews/my-reviews` | Get all user reviews | ✅ |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| PUT | `/users/profile` | Update profile | ✅ |
| GET | `/users/addresses` | Get addresses | ✅ |
| GET | `/users/addresses/:id` | Get address by ID | ✅ |
| POST | `/users/addresses` | Create address | ✅ |
| PUT | `/users/addresses/:id` | Update address | ✅ |
| PATCH | `/users/addresses/:id/default` | Set default address | ✅ |
| DELETE | `/users/addresses/:id` | Delete address | ✅ |

### Contact Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/contact` | Submit contact form | ❌ |
| GET | `/contact/admin/all` | Get all contacts | ✅ Admin |
| GET | `/contact/:id` | Get contact by ID | ✅ Admin |
| POST | `/contact/:id/reply` | Reply to contact | ✅ Admin |
| PATCH | `/contact/:id/status` | Update status | ✅ Admin |
| DELETE | `/contact/:id` | Delete contact | ✅ Admin |
| GET | `/contact/admin/stats` | Get statistics | ✅ Admin |

### Admin Dashboard Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/dashboard/stats` | Get dashboard stats | ✅ Admin |
| GET | `/admin/dashboard/sales-analytics` | Get sales analytics | ✅ Admin |
| GET | `/admin/dashboard/top-products` | Get top products | ✅ Admin |
| GET | `/admin/dashboard/recent-orders` | Get recent orders | ✅ Admin |
| GET | `/admin/dashboard/low-stock` | Get low stock products | ✅ Admin |
| GET | `/admin/dashboard/revenue-by-category` | Get revenue breakdown | ✅ Admin |
| GET | `/admin/dashboard/customer-stats` | Get customer statistics | ✅ Admin |
| GET | `/admin/users` | Get all users | ✅ Admin |
| GET | `/admin/users/:id` | Get user by ID | ✅ Admin |
| PUT | `/admin/users/:id/role` | Update user role | ✅ Admin |
| DELETE | `/admin/users/:id` | Delete user | ✅ Admin |

### Query Parameters

**Products:**
```
GET /products?page=1&limit=12&category=electronics&search=phone&minPrice=100&maxPrice=1000&sort=price_asc&featured=true
```

**Orders:**
```
GET /orders/my-orders?page=1&limit=10&status=DELIVERED
```

**Contacts:**
```
GET /contact/admin/all?page=1&limit=10&status=PENDING&search=customer@email.com
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env` file in the backend root:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database"

   # JWT Secrets
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   JWT_EXPIRE="15m"
   JWT_REFRESH_EXPIRE="7d"

   # Server
   PORT=5000
   NODE_ENV="development"

   # Frontend URL (for CORS)
   FRONTEND_URL="http://localhost:3000"

   # Email (Gmail example)
   EMAIL_HOST="smtp.gmail.com"
   EMAIL_PORT=587
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-app-specific-password"
   EMAIL_FROM="NeonShop <noreply@neonshop.com>"
   ```

4. **Setup database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # Or push schema directly (for development)
   npm run prisma:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env.local` file in the frontend root:
   ```env
   # Backend API
   NEXT_PUBLIC_API_URL=http://localhost:5000/api

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET="your-nextauth-secret"

   # App
   NEXT_PUBLIC_APP_NAME=NeonShop
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   App will run on `http://localhost:3000`

5. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

### Database Seeding (Optional)

You can create a seed script to populate the database with sample data:

```bash
cd backend
# Create seed script in prisma/seed.ts
npx prisma db seed
```

## 📁 Project Structure

### Backend Structure

```
backend/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
│
├── src/
│   ├── config/
│   │   ├── database.ts      # Prisma client setup
│   │   └── env.ts           # Environment configuration
│   │
│   ├── controllers/         # Request handlers
│   │   ├── admin.controller.ts
│   │   ├── admin-users.controller.ts
│   │   ├── auth.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── category.controller.ts
│   │   ├── contact.controller.ts
│   │   ├── order.controller.ts
│   │   ├── product.controller.ts
│   │   ├── review.controller.ts
│   │   ├── user.controller.ts
│   │   └── wishlist.controller.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts          # Authentication middleware
│   │   └── errorHandler.ts # Global error handler
│   │
│   ├── routes/              # API routes
│   │   ├── admin.routes.ts
│   │   ├── auth.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── category.routes.ts
│   │   ├── contact.routes.ts
│   │   ├── order.routes.ts
│   │   ├── product.routes.ts
│   │   ├── review.routes.ts
│   │   ├── user.routes.ts
│   │   └── wishlist.routes.ts
│   │
│   ├── services/
│   │   └── email.service.ts # Email templates & sending
│   │
│   ├── utils/
│   │   ├── jwt.ts           # JWT token functions
│   │   ├── password.ts      # Password hashing
│   │   └── tokens.ts        # Token generation
│   │
│   ├── validators/          # Zod validation schemas
│   │   ├── auth.validator.ts
│   │   ├── cart.validator.ts
│   │   ├── category.validator.ts
│   │   ├── contact.validator.ts
│   │   ├── order.validator.ts
│   │   ├── product.validator.ts
│   │   ├── review.validator.ts
│   │   ├── user.validator.ts
│   │   └── wishlist.validator.ts
│   │
│   ├── server.ts            # Express app setup
│   └── uploads/             # File uploads
│
├── .env                     # Environment variables
├── package.json
└── tsconfig.json
```

### Frontend Structure

```
frontend/
├── public/                  # Static assets
│
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── [locale]/        # Internationalized routes
│   │   │   ├── (admin)/     # Admin dashboard routes
│   │   │   ├── (auth)/      # Auth pages
│   │   │   ├── (client)/    # Client pages
│   │   │   └── layout.tsx
│   │   ├── globals.css
│   │   └── layout.tsx
│   │
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── admin/           # Admin components
│   │   ├── cart/            # Cart components
│   │   ├── products/        # Product components
│   │   └── ...
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   ├── useOrders.ts
│   │   └── ...
│   │
│   ├── lib/                 # Utility libraries
│   │   ├── api/             # API client
│   │   │   ├── client.ts    # Axios instance
│   │   │   ├── auth.api.ts
│   │   │   ├── products.api.ts
│   │   │   ├── cart.api.ts
│   │   │   └── ...
│   │   │
│   │   ├── react-query/
│   │   │   └── client.ts    # TanStack Query setup
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts        # Class name merger
│   │   │   ├── guestCart.ts # Guest cart manager
│   │   │   └── type-guards.ts
│   │   │
│   │   └── validations/     # Zod schemas
│   │       └── auth.validation.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── index.ts
│   │   └── admin.ts
│   │
│   ├── store/               # Redux store (if used)
│   │
│   ├── providers/           # React context providers
│   │   └── query-provider.tsx
│   │
│   ├── i18n/                # Internationalization
│   │   ├── routing.ts       # Route configuration
│   │   └── request.ts
│   │
│   └── messages/            # Translation files
│       ├── en.json
│       └── ar.json
│
├── .env.local               # Environment variables
├── next.config.ts
├── tailwind.config.ts
├── components.json          # shadcn/ui config
├── package.json
└── tsconfig.json
```

## 🔐 Environment Variables

### Backend Environment Variables

```env
# Database
DATABASE_URL=                 # PostgreSQL connection string

# JWT
JWT_SECRET=                   # Secret key for access tokens
JWT_REFRESH_SECRET=           # Secret key for refresh tokens
JWT_EXPIRE=                   # Access token expiry (e.g., "15m")
JWT_REFRESH_EXPIRE=           # Refresh token expiry (e.g., "7d")

# Server
PORT=                         # Server port (default: 5000)
NODE_ENV=                     # Environment (development/production)
FRONTEND_URL=                 # Frontend URL for CORS

# Email
EMAIL_HOST=                   # SMTP host
EMAIL_PORT=                   # SMTP port
EMAIL_USER=                   # Email username
EMAIL_PASS=                   # Email password
EMAIL_FROM=                   # Sender email address
```

### Frontend Environment Variables

```env
# API
NEXT_PUBLIC_API_URL=          # Backend API URL

# NextAuth
NEXTAUTH_URL=                 # App URL
NEXTAUTH_SECRET=              # NextAuth secret key

# App
NEXT_PUBLIC_APP_NAME=         # Application name
```

## 🚢 Deployment

### Backend Deployment

#### Option 1: Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
    - Build Command: `npm run build`
    - Start Command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy

#### Option 2: Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect GitHub repository
3. Add PostgreSQL database service
4. Configure environment variables
5. Deploy automatically on push

#### Option 3: VPS (DigitalOcean, AWS, etc.)

1. Set up Node.js environment
2. Install PM2 for process management
3. Configure Nginx as reverse proxy
4. Set up SSL certificate with Let's Encrypt
5. Deploy and monitor

### Frontend Deployment

#### Option 1: Vercel (Recommended)

1. Import project on [Vercel](https://vercel.com)
2. Configure:
    - Framework Preset: Next.js
    - Root Directory: `frontend`
    - Build Command: `npm run build`
    - Output Directory: `.next`
3. Add environment variables
4. Deploy

#### Option 2: Netlify

1. Connect repository to [Netlify](https://netlify.com)
2. Configure:
    - Base directory: `frontend`
    - Build command: `npm run build`
    - Publish directory: `.next`
3. Add environment variables
4. Deploy

### Database Deployment

#### Neon (Recommended)

1. Create account on [Neon](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in backend environment variables
5. Run migrations: `npm run prisma:migrate`

#### Supabase

1. Create project on [Supabase](https://supabase.com)
2. Get PostgreSQL connection string
3. Configure and deploy

## 🔧 Configuration

### Email Configuration (Gmail)

1. Enable 2-factor authentication on your Google account
2. Generate App Password:
    - Go to Google Account → Security
    - Select "App passwords"
    - Generate new password for "Mail"
3. Use generated password in `EMAIL_PASS` environment variable

### CORS Configuration

Update `FRONTEND_URL` in backend `.env` to match your deployed frontend URL:
```env
FRONTEND_URL=https://your-frontend-domain.com
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**Paginated Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

## 🎨 Design System

### Color Palette

- **Primary**: Blue shades (HSL-based)
- **Success**: Green shades
- **Warning**: Amber shades
- **Destructive**: Red shades

### Typography

- **Font Family**: Inter (sans-serif)
- **Font Sizes**: From 2xs (0.625rem) to 9xl (8rem)
- **Font Weights**: 100 to 900

### Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1400px /* Extra large */
```

## 🌐 Internationalization

### Supported Languages

- **English** (`en`) - Default
- **Arabic** (`ar`) - RTL support

### Adding New Languages

1. Create new translation file: `src/messages/{locale}.json`
2. Add locale to `src/i18n/routing.ts`:
   ```typescript
   locales: ['en', 'ar', 'your-locale']
   ```
3. Translate all keys from `en.json`

### Translation Structure

```json
{
  "common": { /* Common translations */ },
  "nav": { /* Navigation */ },
  "home": { /* Homepage */ },
  "products": { /* Products */ },
  "cart": { /* Shopping cart */ },
  // ... more sections
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Email Verification**: Required before login
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet.js**: Security headers
- **CORS**: Configured for specific origin
- **Input Validation**: Server-side validation with Zod
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **XSS Protection**: React's built-in escaping

## 📊 Key Features Explained

### Guest Cart System

Guests can shop without creating an account:
- Cart stored in `localStorage`
- Persists across browser sessions
- Automatically syncs when user logs in
- Admins also use guest cart (no server-side cart for admin users)

### Email Verification Flow

1. User registers → receives verification email
2. Cannot login until email is verified
3. Click link in email → account verified
4. Can now login successfully

### Multi-language Support

- Automatic language detection from browser
- Manual language switcher in navigation
- RTL layout for Arabic
- All UI text translated
- Date and number formatting localized

### Admin Dashboard Analytics

Real-time insights:
- **Orders**: Total, today, monthly, status breakdown
- **Revenue**: Total, daily, monthly, growth percentage
- **Products**: Total, low stock, out of stock
- **Users**: Total, new today, monthly, verified count
- **Charts**: Sales trends, revenue by category
- **Top Products**: Best sellers by quantity
- **Customer Stats**: Top spenders, new customers

## 🐛 Known Issues & Limitations

- **File Uploads**: Currently not implemented (use image URLs)
- **Payment Gateway**: Using "Cash on Delivery" only
- **Real-time Updates**: No WebSocket support (requires manual refresh)
- **Product Variants**: Not supported (size, color variations)
- **Coupon System**: Not implemented
- **Advanced Search**: No full-text search with PostgreSQL
- **Order Tracking**: Basic status only (no shipping integration)

## 🔮 Future Enhancements

- [ ] File upload support (Cloudinary integration)
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Real-time notifications with WebSockets
- [ ] Product variants system
- [ ] Coupon and discount codes
- [ ] Advanced search with Elasticsearch
- [ ] Shipping provider integration
- [ ] Mobile app (React Native)
- [ ] Social authentication (Google, Facebook)
- [ ] Product comparison feature
- [ ] Advanced analytics dashboard
- [ ] Multi-vendor marketplace
- [ ] Subscription products
- [ ] Gift cards

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- **Backend**: Follow Airbnb TypeScript style guide
- **Frontend**: Follow Next.js and React best practices
- **Commits**: Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [TanStack Query](https://tanstack.com/query) - Data fetching
- [Neon](https://neon.tech/) - PostgreSQL database
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

For support, email support@neonshop.com or open an issue in the repository.

---

**Made with ❤️ for the e-commerce community**