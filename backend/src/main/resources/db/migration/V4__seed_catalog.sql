INSERT INTO categories (name, slug) VALUES
    ('Electronics', 'electronics'),
    ('Clothing', 'clothing'),
    ('Home', 'home');

INSERT INTO products (category_id, name, slug, description, price, stock_quantity, image_url, active, created_at) VALUES
    ((SELECT id FROM categories WHERE slug = 'electronics'), 'Wireless Headphones', 'wireless-headphones', 'Over-ear Bluetooth headphones with noise cancelling and 30 hours of battery life.', 79.99, 25, 'https://picsum.photos/seed/headphones/600/400', TRUE, NOW(6)),
    ((SELECT id FROM categories WHERE slug = 'electronics'), 'Mechanical Keyboard', 'mechanical-keyboard', 'Compact 75% keyboard with hot-swappable switches and RGB backlight.', 109.00, 12, 'https://picsum.photos/seed/keyboard/600/400', TRUE, NOW(6)),
    ((SELECT id FROM categories WHERE slug = 'electronics'), 'USB-C Hub', 'usb-c-hub', '7-in-1 hub with HDMI, SD card reader and 100W power delivery.', 39.90, 40, 'https://picsum.photos/seed/usbhub/600/400', TRUE, NOW(6)),
    ((SELECT id FROM categories WHERE slug = 'electronics'), 'Portable Speaker', 'portable-speaker', 'Waterproof Bluetooth speaker with deep bass and 12 hours of playtime.', 59.50, 0, 'https://picsum.photos/seed/speaker/600/400', TRUE, NOW(6)),
    ((SELECT id FROM categories WHERE slug = 'clothing'), 'Cotton T-Shirt', 'cotton-t-shirt', 'Soft everyday t-shirt made from 100% organic cotton.', 19.99, 100, 'https://picsum.photos/seed/tshirt/600/400', TRUE, NOW(6)),
    ((SELECT id FROM categories WHERE slug = 'clothing'), 'Denim Jacket', 'denim-jacket', 'Classic fit denim jacket with a washed finish.', 89.00, 18, 'https://picsum.photos/seed/jacket/600/400', TRUE, NOW(6)),
    ((SELECT id FROM categories WHERE slug = 'clothing'), 'Running Shoes', 'running-shoes', 'Lightweight running shoes with breathable mesh and cushioned sole.', 119.00, 30, 'https://picsum.photos/seed/shoes/600/400', TRUE, NOW(6)),
    ((SELECT id FROM categories WHERE slug = 'clothing'), 'Wool Beanie', 'wool-beanie', 'Warm knitted beanie made from merino wool.', 14.50, 60, 'https://picsum.photos/seed/beanie/600/400', TRUE, NOW(6)),
    ((SELECT id FROM categories WHERE slug = 'home'), 'Ceramic Mug Set', 'ceramic-mug-set', 'Set of four handmade ceramic mugs, dishwasher safe.', 24.90, 35, 'https://picsum.photos/seed/mugs/600/400', TRUE, NOW(6)),
    ((SELECT id FROM categories WHERE slug = 'home'), 'Desk Lamp', 'desk-lamp', 'Adjustable LED desk lamp with three brightness levels and a USB port.', 34.00, 22, 'https://picsum.photos/seed/lamp/600/400', TRUE, NOW(6)),
    ((SELECT id FROM categories WHERE slug = 'home'), 'Throw Blanket', 'throw-blanket', 'Cozy fleece throw blanket, 130 x 170 cm.', 45.00, 15, 'https://picsum.photos/seed/blanket/600/400', TRUE, NOW(6)),
    ((SELECT id FROM categories WHERE slug = 'home'), 'Scented Candle', 'scented-candle', 'Soy wax candle with a vanilla and sandalwood scent, 40 hours burn time.', 12.99, 80, 'https://picsum.photos/seed/candle/600/400', TRUE, NOW(6));