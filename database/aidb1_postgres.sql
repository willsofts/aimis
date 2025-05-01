
CREATE TABLE IF NOT EXISTS cust_info (
  customer_id varchar(50) NOT NULL ,
  customer_name varchar(50) NOT NULL ,
  customer_surname varchar(50) NOT NULL ,
  PRIMARY KEY (customer_id)
);

INSERT INTO cust_info (customer_id, customer_name, customer_surname) VALUES
	('CUST-10001', 'John', 'Lennon'),
	('CUST-10002', 'Phil', 'Collins'),
	('CUST-10003', 'Rod', 'Stewart'),
	('CUST-10004', 'Eric', 'Clapton'),
	('CUST-10005', 'Richard', 'Marx'),
	('CUST-10006', 'Elton', 'John'),
	('CUST-10007', 'Lionel', 'Richie'),
	('CUST-10008', 'Diana', 'Ross'),
	('CUST-10009', 'Tina', 'Turner'),
	('CUST-10010', 'Celine', 'Dion'),
	('CUST-10011', 'Michael', 'Jackson'),
	('CUST-10012', 'Mariah', 'Carey');

CREATE TABLE IF NOT EXISTS cust_order (
  order_id varchar(50) NOT NULL ,
  customer_id varchar(50) NOT NULL ,
  order_date date NOT NULL ,
  order_time time NOT NULL ,
  order_status varchar(50) DEFAULT NULL,
  order_total_unit bigint NOT NULL DEFAULT (0) ,
  order_total_amount decimal(20,2) NOT NULL ,
  PRIMARY KEY (order_id,customer_id)
);

INSERT INTO cust_order (order_id, customer_id, order_date, order_time, order_status, order_total_unit, order_total_amount) VALUES
	('ORD-00001', 'CUST-10001', '2024-03-01', '08:43:45', 'CONFIRM', 2, 258.00),
	('ORD-00002', 'CUST-10002', '2024-03-02', '08:47:45', 'CONFIRM', 3, 417.00),
	('ORD-00003', 'CUST-10003', '2024-03-03', '08:50:58', 'CONFIRM', 5, 795.00),
	('ORD-00004', 'CUST-10004', '2024-03-04', '08:53:00', 'CONFIRM', 4, 476.00),
	('ORD-00005', 'CUST-10005', '2024-03-05', '08:55:16', 'CONFIRM', 2, 368.00),
	('ORD-00006', 'CUST-10006', '2024-03-06', '08:58:02', 'CONFIRM', 3, 447.00),
	('ORD-00007', 'CUST-10007', '2024-03-06', '09:00:41', 'CONFIRM', 6, 804.00),
	('ORD-00008', 'CUST-10008', '2024-03-07', '09:07:03', 'CONFIRM', 1, 199.00),
	('ORD-00009', 'CUST-10009', '2024-03-07', '09:09:05', 'CONFIRM', 2, 338.00),
	('ORD-00010', 'CUST-10010', '2024-03-07', '09:10:41', 'CONFIRM', 2, 238.00),
	('ORD-00011', 'CUST-10011', '2024-03-07', '09:12:46', 'CONFIRM', 1, 189.00),
	('ORD-00012', 'CUST-10012', '2024-03-07', '09:14:58', 'CONFIRM', 2, 318.00),
	('ORD-00013', 'CUST-10010', '2024-03-22', '14:44:53', 'CANCEL', 1, 189.00),
	('ORD-00014', 'CUST-10011', '2024-03-20', '14:46:50', 'CANCEL', 1, 189.00);

CREATE TABLE IF NOT EXISTS cust_order_detail (
  order_id varchar(50) NOT NULL ,
  product_id varchar(50) NOT NULL ,
  order_date date NOT NULL ,
  order_time time NOT NULL ,
  order_unit bigint NOT NULL ,
  order_price decimal(20,2) NOT NULL ,
  order_discount decimal(20,2) NOT NULL,
  order_amount decimal(20,2) NOT NULL ,
  PRIMARY KEY (order_id,product_id)
);

INSERT INTO cust_order_detail (order_id, product_id, order_date, order_time, order_unit, order_price, order_discount, order_amount) VALUES
	('ORD-00001', 'PR001', '2024-03-01', '08:43:45', 2, 129.00, 0.00, 258.00),
	('ORD-00002', 'PR001', '2024-03-02', '08:47:45', 2, 129.00, 0.00, 258.00),
	('ORD-00002', 'PR006', '2024-03-02', '08:47:45', 1, 159.00, 0.00, 159.00),
	('ORD-00003', 'PR002', '2024-03-03', '08:50:58', 5, 159.00, 0.00, 795.00),
	('ORD-00004', 'PR005', '2024-03-04', '08:53:00', 4, 119.00, 0.00, 476.00),
	('ORD-00005', 'PR008', '2024-03-05', '08:55:16', 1, 179.00, 0.00, 179.00),
	('ORD-00005', 'PR009', '2024-03-05', '08:55:16', 1, 189.00, 0.00, 189.00),
	('ORD-00006', 'PR004', '2024-03-06', '08:58:02', 3, 149.00, 0.00, 447.00),
	('ORD-00007', 'PR001', '2024-03-06', '09:00:41', 3, 129.00, 0.00, 387.00),
	('ORD-00007', 'PR003', '2024-03-06', '09:00:41', 3, 139.00, 0.00, 417.00),
	('ORD-00008', 'PR010', '2024-03-07', '09:07:03', 1, 199.00, 0.00, 199.00),
	('ORD-00009', 'PR007', '2024-03-07', '09:09:05', 2, 169.00, 0.00, 338.00),
	('ORD-00010', 'PR005', '2024-03-07', '09:10:41', 2, 119.00, 0.00, 238.00),
	('ORD-00011', 'PR009', '2024-03-07', '09:12:46', 1, 189.00, 0.00, 189.00),
	('ORD-00012', 'PR006', '2024-03-07', '09:14:58', 2, 159.00, 0.00, 318.00),
	('ORD-00013', 'PR009', '2024-03-22', '14:44:53', 1, 189.00, 0.00, 189.00),
	('ORD-00014', 'PR009', '2024-03-20', '14:46:50', 1, 189.00, 0.00, 189.00);

CREATE TABLE IF NOT EXISTS cust_product (
  product_id varchar(50) NOT NULL ,
  product_name varchar(50) DEFAULT NULL ,
  product_price decimal(16,2) DEFAULT NULL ,
  product_index int DEFAULT NULL,
  PRIMARY KEY (product_id)
);

INSERT INTO cust_product (product_id, product_name, product_price, product_index) VALUES
	('PR001', 'Casual Shirt', 129.00, 1),
	('PR002', 'Labour Shirt', 159.00, 2),
	('PR003', 'Side Seeing Shirt', 139.00, 3),
	('PR004', 'Working Shirt', 149.00, 4),
	('PR005', 'Street Shirt', 119.00, 5),
	('PR006', 'Art Pant', 159.00, 6),
	('PR007', 'Dancing Pant', 169.00, 7),
	('PR008', 'Working Pant', 179.00, 8),
	('PR009', 'Aerobic Pant', 189.00, 9),
	('PR010', 'Warming Pant', 199.00, 10);

