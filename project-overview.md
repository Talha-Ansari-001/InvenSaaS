# Inventory SaaS Project Overview

This document provides a high-level overview of the Inventory Management SaaS application, its architecture, features, and current state.

## 🚀 Project Status
The project is **fully functional** and has completed Phase 3 (Integration and Deployment). Both backend and frontend are integrated, the database is initialized and seeded, and role-based access control is implemented.

---

## 🛠️ Technical Stack

### Backend
- **Framework:** Node.js with Express.js
- **Database:** MySQL (using `mysql2` with connection pooling)
- **Authentication:** JWT (JSON Web Tokens) and `bcryptjs` for password hashing
- **Middleware:** `cors` (Cross-Origin Resource Sharing), `morgan` (logging), `multer` (file uploads)
- **Environment Management:** `dotenv`

### Frontend
- **Framework:** React 19 with Vite and TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router 7
- **State Management:** React Context API (AuthContext)
- **Data Tables:** TanStack Table v8
- **Charts/Visualization:** Recharts
- **Icons:** React Icons
- **API Client:** Axios (with interceptors for JWT)

---

## 📂 Core Features

### 1. User & Access Management
- **Authentication:** Secure login with JWT.
- **RBAC (Role-Based Access Control):** Support for `Admin`, `Manager`, and `Staff` roles.
- **User Management:** Admin-only interface to manage system users.

### 2. Inventory & Product Management
- **Product Catalog:** Manage products with SKU, categories, suppliers, and pricing.
- **Multi-Warehouse Support:** Track stock levels across different physical locations.
- **Stock Movements:** Complete audit log for all stock changes (IN, OUT, ADJUSTMENT, TRANSFER).
- **Low Stock Alerts:** Threshold-based monitoring for inventory replenishment.

### 3. Order Processing
- **Sales Orders:** Create and track customer orders.
- **Order Items:** Detailed line items for each order with real-time stock impact.

### 4. Supplier & Warehouse Management
- **Supplier Directory:** Maintain vendor contact details and history.
- **Warehouse Tracking:** Manage storage locations and their respective inventory.

### 5. Analytics & Reporting
- **Dashboard:** Visual overview of key performance indicators (KPIs) like total products, low stock items, and recent orders.
- **Data Visualization:** Interactive charts for sales and inventory trends.

---

## 🏗️ Project Structure

```text
inventory-saas/
├── backend/                # Express API
│   ├── config/             # DB connection settings
│   ├── controllers/        # Business logic for each resource
│   ├── database/           # SQL schema and seed files
│   ├── middleware/         # Auth, Role, and Error handling
│   ├── routes/             # API endpoint definitions
│   ├── scripts/            # DB initialization and utility scripts
│   └── uploads/            # Stored media (product images, etc.)
└── frontend/               # React Application
    ├── src/
    │   ├── components/     # Shared UI components (Modals, Tables)
    │   ├── context/        # Auth state management
    │   ├── layout/         # Persistent UI (Sidebar, Navbar)
    │   ├── pages/          # View components for each route
    │   └── services/       # API interaction logic
```

---

## 🔑 Development Credentials (Local)
- **Admin User:** `admin@example.com`
- **Password:** `password123`

---

## 📜 Database Schema Summary
The system relies on a relational MySQL schema including:
- `users` & `roles`
- `products`, `categories`, `suppliers`, & `warehouses`
- `inventory_levels` & `stock_movements`
- `orders` & `order_items`
