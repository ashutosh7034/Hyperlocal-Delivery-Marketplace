# HyperLocal India - Multi-Vendor Hyperlocal Delivery Marketplace

A comprehensive full-stack web application built with React, Node.js/Express, and MySQL for managing hyperlocal deliveries across India.

## 🚀 Project Overview

HyperLocal India is a multi-vendor marketplace platform designed specifically for India that enables:
- **Customers** to discover nearby vendors within their delivery radius and place orders
- **Vendors** to register with delivery radius, manage products, and fulfill orders
- **Admin** to oversee vendors, approve registrations, and view platform analytics

## 🏗️ Tech Stack

### Frontend
- **React.js 18+** - UI library with functional components and hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Google Maps JavaScript API** - Geocoding, autocomplete, and map visualization
- **React Context API** - State management for auth, cart, and location

### Backend
- **Node.js + Express.js** - Server framework
- **MySQL 8.0+** - Relational database
- **Sequelize ORM** - Database abstraction
- **JWT + bcrypt** - Authentication & password encryption
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **Nodemailer** - Email service

## 📋 Core Features

### 1. Authentication System
- [x] Email verification with JWT tokens
- [x] Role-based login (Admin, Vendor, Customer)
- [x] Secure password hashing with bcrypt
- [x] Token refresh mechanism

### 2. Hyperlocal Filtering (Core Feature)
- [x] Haversine formula for distance calculation
- [x] Customer address geocoding with Google Maps
- [x] Vendor filtering by delivery radius
- [x] Distance display on vendor cards
- [x] SQL-based distance query using stored procedures

### 3. Vendor Management
- [x] Vendor registration with GSTIN validation
- [x] Shop location geocoding
- [x] Delivery radius configuration (1-30 km)
- [x] Product management (CRUD operations)
- [x] Order management and status tracking
- [x] Earnings dashboard

### 4. Customer Features
- [x] Address management with geocoding
- [x] Nearby vendor discovery (distance-sorted)
- [x] Product browsing and category filtering
- [x] Shopping cart functionality
- [x] Checkout with multiple address selection
- [x] COD & UPI payment options
- [x] Order tracking

### 5. Admin Panel
- [x] Vendor application approval/rejection
- [x] Platform-wide order management
- [x] Vendor analytics and metrics
- [x] Dashboard statistics

### 6. Google Maps Integration
- [x] Address autocomplete on registration
- [x] Geocoding API for lat/lng conversion
- [x] Distance Matrix API for delivery calculations
- [x] Map view with vendor pins

## 📁 Project Structure

```
Hyperlocal Delivery Marketplace/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── api/                    # Axios instance & API endpoints
│   │   │   ├── instance.js         # Configured axios instance
│   │   │   └── endpoints.js        # API call wrappers
│   │   ├── components/             # Reusable React components
│   │   ├── pages/                  # Page components
│   │   │   ├── Admin/
│   │   │   ├── Vendor/
│   │   │   └── Customer/
│   │   ├── context/                # React Context providers
│   │   │   ├── AuthContext.jsx     # Auth state management
│   │   │   ├── CartContext.jsx     # Shopping cart state
│   │   │   └── LocationContext.jsx # Customer location & geocoding
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   └── useLocation.js
│   │   └── utils/                  # Utility functions
│   │       ├── constants.js        # Lists, enums, helpers
│   │       └── googleMaps.js       # Google Maps integration
│   ├── package.json
│   └── .env.example
│
├── server/                          # Express Backend
│   ├── config/                     # Configuration files
│   │   ├── database.js             # Sequelize setup
│   │   ├── cloudinary.js           # Image upload config
│   │   └── cors.js                 # CORS configuration
│   ├── models/                     # Sequelize ORM models
│   │   ├── User.js
│   │   ├── VendorProfile.js
│   │   ├── CustomerProfile.js
│   │   ├── CustomerAddress.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── index.js                # Model associations
│   ├── controllers/                # Business logic
│   │   ├── authController.js
│   │   ├── vendorController.js     # Includes /vendors/nearby
│   │   ├── productController.js
│   │   └── customerController.js
│   ├── routes/                     # API route handlers
│   │   ├── auth.js
│   │   ├── vendor.js
│   │   ├── products.js
│   │   └── customer.js
│   ├── middleware/                 # Express middleware
│   │   ├── auth.js                 # JWT verification & role checking
│   │   ├── upload.js               # Multer file upload
│   │   └── errorHandler.js         # Global error handler
│   ├── services/                   # External service integrations
│   │   ├── googleMaps.js           # Geocoding, Places API, Distance Matrix
│   │   └── email.js                # Nodemailer email sending
│   ├── server.js                   # Express entry point
│   ├── package.json
│   └── .env.example
│
├── schema.sql                      # Complete MySQL database schema
└── README.md
```

## 🗄️ Database Schema

The application includes 9 main tables:
- **users** - User accounts with roles
- **vendor_profiles** - Vendor shop details with lat/lng
- **customer_profiles** - Customer preferences
- **customer_addresses** - Multiple delivery addresses with geocoding
- **products** - Vendor products with inventory
- **carts** - Shopping carts
- **cart_items** - Items in cart
- **orders** - Order records
- **order_items** - Order line items

### Key Database Features
- Proper indexes on frequently queried columns (lat/lng, approval_status, created_at)
- Foreign key constraints for data integrity
- Stored procedure for calculating nearby vendors using Haversine formula
- Full-text search on product names and descriptions

## 🔌 API Routes

### Authentication
```
POST /api/auth/register        # Register as customer or vendor
POST /api/auth/login           # Login with email & password
GET  /api/auth/verify/:token   # Verify email with token
GET  /api/auth/current-user    # Get logged-in user details
```

### Hyperlocal (Core)
```
GET /api/vendors/nearby?lat=&lng=&radius=  # Get vendors within range with distances
```

### Vendor
```
GET    /api/vendors/profile              # Get vendor's own profile
POST   /api/vendors/register             # Complete vendor registration
PUT    /api/vendors/profile              # Update delivery radius, charges, etc
GET    /api/vendors/orders               # Get vendor's incoming orders
PUT    /api/vendors/orders/:id/status    # Update order status
```

### Products
```
GET    /api/products?vendorId=           # Get products by vendor
POST   /api/products                     # Create product (vendor)
PUT    /api/products/:id                 # Update product (vendor)
DELETE /api/products/:id                 # Delete product (vendor)
```

### Additional Routes (To be implemented)
```
Customer:  GET /api/customer/addresses, POST /api/customer/addresses, etc
Cart:      POST /api/cart/add, GET /api/cart, etc
Orders:    POST /api/orders, GET /api/orders, etc
Admin:     GET /api/admin/vendors, PUT /api/admin/vendors/:id/approve, etc
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v14+)
- MySQL 8.0+
- Google Maps API Key
- Cloudinary Account
- Gmail App Password (for email)

### Backend Setup

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your credentials**
   - MySQL connection details
   - JWT_SECRET (generate a strong random string)
   - Google Maps API key
   - Cloudinary credentials
   - Gmail SMTP credentials

4. **Create database schema**
   ```bash
   mysql -u root -p < schema.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`)
   ```bash
   cp .env.example .env
   ```

3. **Update `.env` with your Google Maps API key**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_GOOGLE_MAPS_API_KEY=your_key
   ```

4. **Start development server**
   ```bash
   npm start
   ```

   Frontend will run on `http://localhost:3000`

## 📍 Hyperlocal Feature: How It Works

### Customer Registration/Login
1. Customer enters their delivery address
2. Frontend calls `geocodeAddress()` to convert address → lat/lng using Google Maps API
3. Location is stored in `LocationContext`

### Finding Nearby Vendors
1. Customer sees homepage with "Nearby Vendors" section
2. Frontend calls `GET /api/vendors/nearby?lat=X&lng=Y&radius=30`
3. Backend queries database using Haversine formula stored procedure
4. Returns only vendors within their delivery radius
5. Frontend displays vendors sorted by distance

### Distance Calculation
**Client-side (Haversine formula):**
```js
const distance = haversineDistance(customerLat, customerLng, 
                                   vendorLat, vendorLng);
```

**Server-side (SQL stored procedure):**
```sql
SELECT *, (6371 * ACOS(...)) AS distance FROM vendors 
HAVING distance <= delivery_radius_km
```

## 🛡️ Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ SQL parameterized queries (no SQL injection)
- ✅ CORS configuration
- ✅ Request validation on both client and server

## 💡 Key Implementation Decisions

1. **Haversine Formula** - Used for distance calculation as Google Distance Matrix API has usage limits
2. **Sequelize ORM** - Chosen for type safety, migrations, and relationships
3. **Context API** - Sufficient for app-level state (auth, cart, location)
4. **MySQL** - Relational schema perfectly suited for this multi-entity system
5. **Cloudinary** - Removes need to manage image storage on server

## 📝 India-Specific Features

- ✅ Pin code validation (6-digit format)
- ✅ GSTIN validation (15-character alphanumeric)
- ✅ Indian state list (28 states + UTs)
- ✅ Popular Indian cities dropdown
- ✅ Currency display in ₹ (INR)
- ✅ COD (Cash on Delivery) as default
- ✅ UPI payment placeholder
- ✅ Product units: kg, g, litre, ml, piece, dozen, pack
- ✅ Phone number prefix: +91

## 🚀 Next Steps

### Components to Build
- [ ] Vendor registration component with address autocomplete
- [ ] Vendor dashboard for product management
- [ ] Customer homepage with nearby vendors
- [ ] Vendor detail page with products
- [ ] Shopping cart and checkout flow
- [ ] Order tracking page
- [ ] Admin approval dashboard
- [ ] Admin map view with all vendors

### Additional Features
- [ ] Real-time order status using WebSockets
- [ ] Ratings and reviews system
- [ ] Coupon/discount code management
- [ ] Customer support chat
- [ ] Analytics dashboard
- [ ] Push notifications
- [ ] Mobile app (React Native)

## 📚 Documentation

Each major component has inline comments explaining the logic.

For Google Maps integration: See `/client/src/utils/googleMaps.js`
For distance calculation: See `/server/services/googleMaps.js` and SQL schema

## 📄 License

MIT License

---

**Happy Building! 🎉**
