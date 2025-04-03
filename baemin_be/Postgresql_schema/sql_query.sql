DROP DATABASE IF EXISTS db_baemin;

DROP TABLE IF EXISTS branch_foods CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS food_types CASCADE;
DROP TABLE IF EXISTS banners CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE DATABASE db_baemin;

CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE food_types (	
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image TEXT,
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    type_id INTEGER NOT NULL REFERENCES food_types(id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE banners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE,
    account VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_open BOOLEAN DEFAULT TRUE,
    service_fee NUMERIC(10, 2) DEFAULT 0.00,
    rating NUMERIC(3, 2) CHECK (rating >= 0 AND rating <= 5),
    rating_count INTEGER DEFAULT 0,
    min_price NUMERIC(10, 2),
    max_price NUMERIC(10, 2),
    brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branch_foods (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    food_id INTEGER NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
     
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	branch_food_id INTEGER NOT NULL REFERENCES branch_foods(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Pending',
    total_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE;   

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    branch_food_id INTEGER NOT NULL REFERENCES branch_foods(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shippings (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address TEXT NOT NULL,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert into food_types
INSERT INTO food_types (name, image, description) VALUES
('Bánh mì', 'banhmi.png', 'Bánh mì truyền thống của Việt Nam'),
('Phở', 'pho.png', 'Món phở bò hoặc gà đặc trưng'),
('Bún chả', 'buncha.png', 'Món bún chả nổi tiếng Hà Nội'),
('Cơm tấm', 'comtam.png', 'Cơm tấm sườn bì chả'),
('Chè', 'che.png', 'Các loại chè tráng miệng ngọt ngào');

INSERT INTO foods (name, description, image, type_id) VALUES
('Bánh mì thịt nguội', 'Bánh mì với thịt nguội và rau', 'banhmi.jpg', 1),
('Phở bò', 'Phở với thịt bò tái, chín', 'pho.jpg', 2),
('Bún chả Hà Nội', 'Bún chả với thịt nướng và nước mắm', 'buncha.jpg', 3),
('Cơm tấm sườn', 'Cơm tấm với sườn nướng', 'comtam.jpg', 4),
('Chè ba màu', 'Chè đậu đỏ, xanh và vàng', 'che.jpg', 5),
('Bánh xèo', 'Bánh xèo giòn rụm với tôm và thịt', 'banhxeo.jpg', 1),
('Bánh cuốn', 'Bánh cuốn nhân thịt hấp dẫn', 'banhcuon.jpg', 1),
('Phở tái lăn', 'Phở với thịt bò tái lăn', 'pho.jpg', 2),
('Bún bò Huế', 'Bún bò Huế cay nồng đậm đà', 'bunbo.jpg', 3),
('Cơm gà Hội An', 'Cơm gà đặc sản Hội An', 'comtam.jpg', 4);


-- Insert into banners
INSERT INTO banners (name, url) VALUES
('Khuyến mãi Tết', 'banner1.jpg'),
('Giảm 50% Bánh mì', 'banner2.jpg'),
('Ưu đãi Phở đặc biệt', 'banner3.jpg'),
('Bún chả ngon tuyệt', 'banner4.jpg'),
('Tráng miệng miễn phí', 'banner5.jpg');

-- Insert into users
INSERT INTO users (email, phone_number, account, password, first_name, last_name) VALUES
('nguyen.an@example.com', '0909123456', 'nguyen_an', 'matkhau123', 'Nguyễn', 'An'),
('tran.binh@example.com', '0912233445', 'tran_binh', 'matkhau456', 'Trần', 'Bình'),
('le.hoa@example.com', '0923344556', 'le_hoa', 'matkhau789', 'Lê', 'Hoa'),
('pham.minh@example.com', '0934455667', 'pham_minh', 'matkhauabc', 'Phạm', 'Minh'),
('vo.quang@example.com', '0945566778', 'vo_quang', 'matkhauxyz', 'Võ', 'Quang');

-- Insert into brands
INSERT INTO brands (name) VALUES
('Bánh Mì Sài Gòn'),
('Phở 24'),
('Bún Chả Hương Liên'),
('Cơm Tấm Cali'),
('Chè Ngon Sài Gòn');

-- Insert into branches
INSERT INTO branches (address, open_time, close_time, is_open, service_fee, rating, rating_count, min_price, max_price, brand_id) VALUES
('123 Đường Nguyễn Trãi, Quận 1', '06:00:00', '22:00:00', TRUE, 5.00, 4.7, 120, 20.000, 50.000, 1),
('456 Đường Lê Lợi, Quận 3', '07:00:00', '23:00:00', TRUE, 6.00, 4.8, 150, 25.000, 60.000, 2),
('789 Đường Cầu Giấy, Hà Nội', '08:00:00', '21:00:00', TRUE, 4.50, 4.6, 100, 30.000, 70.000, 3),
('101 Đường Hai Bà Trưng, Đà Nẵng', '09:00:00', '20:00:00', TRUE, 5.50, 4.9, 180, 35.000, 80.000, 4),
('202 Đường Lý Tự Trọng, Quận 5', '10:00:00', '19:00:00', TRUE, 3.50, 4.7, 130, 15.000, 40.000, 5);

INSERT INTO branch_foods (branch_id, food_id, price, stock) VALUES
(1, 1, 25000, 50),
(1, 2, 30000, 40),
(1, 3, 35000, 30),
(1, 4, 40000, 20),
(1, 5, 22000, 10),
(2, 1, 26000, 45),
(2, 6, 28000, 35),
(2, 7, 33000, 25),
(2, 8, 37000, 18),
(2, 9, 24000, 12),
(3, 2, 31000, 48),
(3, 3, 36000, 38),
(3, 4, 42000, 28),
(3, 5, 23000, 15),
(3, 10, 45000, 5),
(4, 6, 27000, 50),
(4, 7, 32000, 40),
(4, 8, 38000, 30),
(4, 9, 25000, 20),
(4, 10, 46000, 10);

-- INSERT INTO cart_items (user_id, branch_food_id, quantity) VALUES
-- (1, 1, 2),
-- (1, 2, 1),
-- (2, 3, 1),
-- (3, 4, 3),
-- (4, 5, 1);

-- #INSERT INTO orders (user_id, status, total_price) VALUES

-- #INSERT INTO order_items (order_id, branch_food_id, quantity, price) VALUES

-- #INSERT INTO payments (order_id, user_id, amount, status) VALUES
