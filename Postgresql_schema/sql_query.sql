DROP DATABASE IF EXISTS db_baemin;

CREATE DATABASE db_baemin;

\c db_baemin;

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
    kind INTEGER NOT NULL REFERENCES food_types(id) ON DELETE CASCADE,
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
    name VARCHAR(255) NOT NULL
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
    brand_id INTEGER NOT NULL REFERENCES brands(id) ON DELETE CASCADE
);

CREATE TABLE branch_foods (
    id SERIAL PRIMARY KEY,
    branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    food_id INTEGER NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL
);

-- Insert into food_types
INSERT INTO food_types (name, image, description) VALUES
('Bánh mì', 'banhmi.jpg', 'Bánh mì truyền thống của Việt Nam'),
('Phở', 'pho.jpg', 'Món phở bò hoặc gà đặc trưng'),
('Bún chả', 'buncha.jpg', 'Món bún chả nổi tiếng Hà Nội'),
('Cơm tấm', 'comtam.jpg', 'Cơm tấm sườn bì chả'),
('Chè', 'che.jpg', 'Các loại chè tráng miệng ngọt ngào');

-- Insert into foods
INSERT INTO foods (name, description, image, kind) VALUES
('Bánh mì thịt nguội', 'Bánh mì với thịt nguội và rau', 'banhmi_thitnguoi.jpg', 1),
('Phở bò', 'Phở với thịt bò tái, chín', 'pho_bo.jpg', 2),
('Bún chả Hà Nội', 'Bún chả với thịt nướng và nước mắm', 'buncha_hanoi.jpg', 3),
('Cơm tấm sườn', 'Cơm tấm với sườn nướng', 'comtam_suon.jpg', 4),
('Chè ba màu', 'Chè đậu đỏ, xanh và vàng', 'che_ba_mau.jpg', 5),
('Bánh xèo', 'Bánh xèo giòn rụm với tôm và thịt', 'banhxeo.jpg', 1),
('Phở gà', 'Phở gà với nước dùng thanh ngọt', 'pho_ga.jpg', 2),
('Bún bò Huế', 'Bún bò Huế cay nồng đậm đà', 'bunbo_hue.jpg', 3),
('Cơm gà Hội An', 'Cơm gà đặc sản Hội An', 'comga_hoian.jpg', 4),
('Chè khúc bạch', 'Chè khúc bạch thơm ngon', 'che_khuc_bach.jpg', 5),
('Bánh cuốn', 'Bánh cuốn nhân thịt hấp dẫn', 'banhcuon.jpg', 1),
('Phở tái lăn', 'Phở với thịt bò tái lăn', 'pho_tai_lan.jpg', 2),
('Bún riêu cua', 'Bún riêu cua thanh mát', 'bun_rieu_cua.jpg', 3),
('Cơm hến', 'Cơm hến Huế đặc trưng', 'com_hen.jpg', 4),
('Chè đậu xanh', 'Chè đậu xanh thanh mát', 'che_dau_xanh.jpg', 5),
('Bánh đúc nóng', 'Bánh đúc nóng thơm ngon', 'banh_duc.jpg', 1),
('Phở trộn', 'Phở trộn vị đậm đà', 'pho_tron.jpg', 2),
('Bún mắm', 'Bún mắm miền Tây', 'bun_mam.jpg', 3),
('Cơm chiên dương châu', 'Cơm chiên Dương Châu', 'com_chien_duong_chau.jpg', 4),
('Chè bắp', 'Chè bắp ngọt bùi', 'che_bap.jpg', 5);

-- Insert into banners
INSERT INTO banners (name, url) VALUES
('Khuyến mãi Tết', 'khuyen_mai_tet.jpg'),
('Giảm 50% Bánh mì', 'giam_banh_mi.jpg'),
('Ưu đãi Phở đặc biệt', 'uu_dai_pho.jpg'),
('Bún chả ngon tuyệt', 'bun_cha_ngon.jpg'),
('Tráng miệng miễn phí', 'trang_mieng_free.jpg');

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

-- Insert into branch_foods
INSERT INTO branch_foods (branch_id, food_id, price) VALUES
(1, 1, 25.000),
(1, 6, 30.000),
(2, 2, 40.000),
(2, 7, 45.000),
(3, 3, 35.000),
(3, 8, 50.000),
(4, 4, 38.000),
(4, 9, 42.000),
(5, 5, 20.000),
(5, 10, 22.000);
