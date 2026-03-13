# Inventory Management SaaS Implementation Plan

This plan outlines the architecture for a production-ready Inventory Management System using React, Node.js, and MySQL.

## 1. Project Structure

The project will be organized into a monorepo-style structure:

```
inventory-saas/
├── backend/         # Node.js Express API
└── frontend/        # React Vite Application
```

## 2. Database Schema (MySQL)

We will use `mysql2` to connect. The schema includes role-based access control and inventory tracking.

### Tables
1.  **`roles`**: Defines user permissions (Admin, Manager, Staff).
2.  **`users`**: System users with encrypted passwords and role association.
3.  **`warehouses`**: Physical storage locations.
4.  **`categories`**: Product categorization.
5.  **`suppliers`**: Vendor information.
6.  **`products`**: Core product data (SKU, price, global attributes).
7.  **`inventory_levels`**: Stock quantity per product per warehouse.
8.  **`stock_movements`**: Audit log for all stock changes (Purchase, Sale, Adjustment, Transfer).
9.  **`orders`**: Sales orders.
10. **`order_items`**: Line items for orders.

## 3. Backend Architecture (Node.js/Express)

### Dependencies
-   `express`: Web framework.
-   `mysql2`: Database driver.
-   `dotenv`: Environment variables.
-   `cors`: Cross-Origin Resource Sharing.
-   `jsonwebtoken`: JWT for stateless authentication.
-   `bcryptjs`: Password hashing.
-   `morgan`: HTTP request logger.

### Directory Structure
-   `config/`: Database connection.
-   `controllers/`: Request logic.
-   `middleware/`: Auth (JWT verification), RBAC (Role checks), Error handling.
-   `routes/`: API route definitions.
-   `utils/`: Helper functions (JWT generation).
-   `server.js`: App entry point.

### API Endpoints
-   **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
-   **Products**: `/api/products` (CRUD)
-   **Inventory**: `/api/inventory` (Levels, Adjustments)
-   **Suppliers**: `/api/suppliers` (CRUD)
-   **Orders**: `/api/orders` (CRUD, Status updates)
-   **Reports**: `/api/reports/dashboard` (Stats)
-   **Users**: `/api/users` (Admin only)

## 4. Frontend Architecture (React/Vite)

### Dependencies
-   `react-router-dom`: Routing.
-   `axios`: API requests.
-   `tailwindcss`: Styling.
-   `recharts`: Data visualization.
-   `react-icons`: UI icons.
-   `@tanstack/react-table`: Advanced data tables.

### Directory Structure
-   `src/components/`: Reusable UI (Button, Input, Card, Modal, Table).
-   `src/layout/`: Sidebar, Navbar, MainLayout.
-   `src/pages/`: Dashboard, Products, Inventory, Orders, Suppliers, Users, Login.
-   `src/context/`: AuthContext (User state).
-   `src/services/`: API configuration and endpoints.
-   `src/hooks/`: Custom hooks (useAuth, useFetch).

## 5. Implementation Steps

### Phase 1: Backend Setup
1.  Initialize `backend/package.json`.
2.  Create `database/schema.sql` and `database/seed.sql`.
3.  Implement database connection module.
4.  Implement Authentication (Register/Login/JWT).
5.  Implement Product & Inventory APIs.
6.  Implement Order & Report APIs.

### Phase 2: Frontend Setup
1.  Initialize `frontend` with Vite.
2.  Configure Tailwind CSS.
3.  Implement Authentication Context & Login Page.
4.  Build Layout (Sidebar/Navbar).
5.  Develop Dashboard with Charts.
6.  Develop Product & Inventory Management Pages (Tables, Forms).

### Phase 3: Integration & Final Polish
1.  Connect Frontend to Backend.
2.  Verify RBAC (Role-Based Access Control).
3.  Final testing of stock movements.

