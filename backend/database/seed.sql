-- Seed Roles
INSERT IGNORE INTO roles (id, name) VALUES (1, 'Admin'), (2, 'Manager'), (3, 'Staff');

-- Seed Users (Password is 'password123' hashed with bcrypt)
-- You should use a script to insert users to ensure correct hashing, but this is a placeholder
-- $2a$10$X7... is a placeholder hash. In a real scenario, use the registration API.

-- Seed Categories
INSERT IGNORE INTO categories (name, description) VALUES 
('Electronics', 'Gadgets and devices'),
('Clothing', 'Apparel and fashion'),
('Home & Garden', 'Furniture and decor');

-- Seed Warehouses
INSERT IGNORE INTO warehouses (name, location) VALUES 
('Main Warehouse', '123 Main St, New York, NY'),
('West Coast Hub', '456 West Ave, Los Angeles, CA');

-- Seed Suppliers
INSERT IGNORE INTO suppliers (name, contact_person, email, phone) VALUES 
('TechSource Inc.', 'John Doe', 'john@techsource.com', '555-0101'),
('StyleFabric Co.', 'Jane Smith', 'jane@stylefabric.com', '555-0102');

-- Seed Products
INSERT IGNORE INTO products (name, sku, description, price, category_id, supplier_id) VALUES 
('Laptop Pro X', 'LPX-001', 'High performance laptop', 1200.00, 1, 1),
('Wireless Mouse', 'WM-002', 'Ergonomic wireless mouse', 25.00, 1, 1),
('Cotton T-Shirt', 'CTS-003', '100% Cotton basic tee', 15.00, 2, 2);

-- Seed Inventory Levels
INSERT IGNORE INTO inventory_levels (product_id, warehouse_id, quantity, low_stock_threshold) VALUES 
(1, 1, 50, 5),
(2, 1, 200, 20),
(3, 1, 100, 10),
(1, 2, 20, 5);
