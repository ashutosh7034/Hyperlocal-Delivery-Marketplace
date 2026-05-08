-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: hyperlocal_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_cart_id` (`cart_id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_25` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_items_ibfk_26` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `vendor_id` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_id` (`customer_id`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_vendor_id` (`vendor_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carts_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_addresses`
--

DROP TABLE IF EXISTS `customer_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `label` varchar(50) DEFAULT NULL,
  `full_address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `pin_code` varchar(6) NOT NULL,
  `lat` decimal(10,8) DEFAULT NULL,
  `lng` decimal(11,8) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_coordinates` (`lat`,`lng`),
  KEY `idx_is_default` (`is_default`),
  CONSTRAINT `customer_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_addresses`
--

LOCK TABLES `customer_addresses` WRITE;
/*!40000 ALTER TABLE `customer_addresses` DISABLE KEYS */;
INSERT INTO `customer_addresses` VALUES (1,1,'Home','24 Brigade Road','Bengaluru','560001',12.97160000,77.59460000,1,'2026-05-01 10:28:56','2026-05-01 10:28:56');
/*!40000 ALTER TABLE `customer_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_profiles`
--

DROP TABLE IF EXISTS `customer_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `customer_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_profiles`
--

LOCK TABLES `customer_profiles` WRITE;
/*!40000 ALTER TABLE `customer_profiles` DISABLE KEYS */;
INSERT INTO `customer_profiles` VALUES (1,1,NULL,NULL,'2026-05-01 10:28:56','2026-05-01 10:28:56'),(2,5,NULL,NULL,'2026-05-07 10:55:04','2026-05-07 10:55:04');
/*!40000 ALTER TABLE `customer_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `invoice_number` varchar(40) NOT NULL,
  `data` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_id` (`order_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1,4,'INV-20260507-4','{\"invoice_number\":\"INV-20260507-4\",\"order_number\":\"ORD-79284433\",\"date\":\"2026-05-07T18:41:24.466Z\",\"customer\":{\"id\":1},\"vendor\":{\"id\":1,\"shop_name\":\"Demo Fresh Mart\",\"address\":\"123 Linking Road, Bandra\"},\"items\":[{\"name\":\"Banana Bunch\",\"qty\":1,\"price\":36,\"subtotal\":36}],\"subtotal\":36,\"delivery_charge\":25,\"discount_amount\":0,\"total_amount\":61}','2026-05-07 18:41:24','2026-05-07 18:41:24');
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_25` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_ibfk_26` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,2,58.00,116.00,'2026-05-01 10:29:41','2026-05-01 10:29:41'),(2,2,1,1,58.00,58.00,'2026-05-07 15:23:46','2026-05-07 15:23:46'),(3,2,2,1,42.00,42.00,'2026-05-07 15:23:46','2026-05-07 15:23:46'),(4,3,4,1,58.00,58.00,'2026-05-07 15:37:36','2026-05-07 15:37:36'),(5,3,5,1,42.00,42.00,'2026-05-07 15:37:36','2026-05-07 15:37:36'),(6,4,3,1,36.00,36.00,'2026-05-07 18:41:24','2026-05-07 18:41:24');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(20) NOT NULL,
  `customer_id` int NOT NULL,
  `vendor_id` int NOT NULL,
  `delivery_address_id` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `delivery_charge` decimal(10,2) DEFAULT '0.00',
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cod','upi','card') DEFAULT 'cod',
  `payment_status` enum('pending','completed','failed') DEFAULT 'pending',
  `order_status` enum('pending','accepted','preparing','out_for_delivery','delivered','cancelled') DEFAULT 'pending',
  `notes` text,
  `estimated_delivery_time` time DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  UNIQUE KEY `order_number_2` (`order_number`),
  UNIQUE KEY `order_number_3` (`order_number`),
  UNIQUE KEY `order_number_4` (`order_number`),
  UNIQUE KEY `order_number_5` (`order_number`),
  UNIQUE KEY `order_number_6` (`order_number`),
  UNIQUE KEY `order_number_7` (`order_number`),
  UNIQUE KEY `order_number_8` (`order_number`),
  UNIQUE KEY `order_number_9` (`order_number`),
  UNIQUE KEY `order_number_10` (`order_number`),
  UNIQUE KEY `order_number_11` (`order_number`),
  UNIQUE KEY `order_number_12` (`order_number`),
  UNIQUE KEY `order_number_13` (`order_number`),
  KEY `idx_order_number` (`order_number`),
  KEY `idx_customer_id` (`customer_id`),
  KEY `idx_vendor_id` (`vendor_id`),
  KEY `idx_order_status` (`order_status`),
  KEY `idx_created_at` (`created_at`),
  KEY `delivery_address_id` (`delivery_address_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer_profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_37` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_38` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_39` FOREIGN KEY (`delivery_address_id`) REFERENCES `customer_addresses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'ORD-1001',1,1,1,116.00,25.00,10.00,131.00,'cod','completed','delivered','Leave at the door','00:30:00','2026-05-01 10:28:56','2026-05-01 10:28:56'),(2,'ORD-2024',1,1,1,250.00,25.00,10.00,265.00,'cod','completed','delivered','Please ring doorbell','00:30:00','2026-05-07 15:23:46','2026-05-07 15:23:46'),(3,'ORD-2026',1,3,1,350.00,25.00,10.00,365.00,'cod','completed','out_for_delivery','Please ring doorbell','00:30:00','2026-05-07 15:37:36','2026-05-07 15:37:36'),(4,'ORD-79284433',1,1,1,36.00,25.00,0.00,61.00,'cod','pending','pending','',NULL,'2026-05-07 18:41:24','2026-05-07 18:41:24');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vendor_id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `mrp` decimal(10,2) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `category` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_vendor_id` (`vendor_id`),
  KEY `idx_category` (`category`),
  KEY `idx_is_available` (`is_available`),
  FULLTEXT KEY `ft_search` (`name`,`description`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `vendor_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Fresh Milk 1L','Daily fresh dairy milk',58.00,60.00,'1 L',40,'Dairy','https://loremflickr.com/800/600/milk%2Cbottle%2Cdairy?lock=965334948',1,'2026-05-01 10:28:56','2026-05-07 18:39:45'),(2,1,'Brown Bread','Soft whole wheat bread loaf',42.00,45.00,'1 pack',25,'Bakery','https://loremflickr.com/800/600/brownbread%2Cbread%2Cloaf?lock=1109918185',1,'2026-05-01 10:28:56','2026-05-07 18:39:45'),(3,1,'Banana Bunch','Farm-fresh bananas',36.00,40.00,'6 pcs',30,'Fruits','https://loremflickr.com/800/600/banana%2Cfruit%2Cbunch?lock=1849410921',1,'2026-05-01 10:28:56','2026-05-07 18:39:45'),(4,3,'Fresh Milk 1L','Daily fresh dairy milk',58.00,60.00,'1 L',50,'Dairy','https://loremflickr.com/800/600/milk%2Cbottle%2Cdairy?lock=965334948',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(5,3,'Brown Bread','Whole wheat bread loaf',42.00,45.00,'1 pack',35,'Bakery','https://loremflickr.com/800/600/brownbread%2Cbread%2Cloaf?lock=1109918185',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(6,3,'Banana Bunch','Farm-fresh bananas',36.00,40.00,'6 pcs',40,'Fruits','https://loremflickr.com/800/600/banana%2Cfruit%2Cbunch?lock=1849410921',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(7,3,'Tomatoes','Fresh red tomatoes',45.00,50.00,'1 kg',60,'Vegetables','https://loremflickr.com/800/600/tomato%2Cvegetable%2Cred?lock=1147186153',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(8,3,'Onions','Regular cooking onions',25.00,30.00,'1 kg',80,'Vegetables','https://loremflickr.com/800/600/onion%2Cvegetable?lock=588197975',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(9,4,'Vitamin C 500mg','Immune booster tablets',120.00,150.00,'10 tabs',100,'Supplements','https://loremflickr.com/800/600/vitamin%2Ctablet%2Cmedicine?lock=124663015',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(10,4,'Pain Relief Gel','Quick relief pain gel',89.00,100.00,'30g',45,'Pain Relief','https://loremflickr.com/800/600/gel%2Cmedicine%2Ctube?lock=1699234881',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(11,4,'Cough Syrup','Relief from cough and cold',95.00,110.00,'100ml',60,'Cough Syrup','https://loremflickr.com/800/600/syrup%2Cmedicine%2Cbottle?lock=1844855261',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(12,4,'First Aid Kit','Complete first aid kit',299.00,350.00,'1 set',20,'First Aid','https://loremflickr.com/800/600/firstaid%2Cbandage%2Cmedicine?lock=432617303',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(13,5,'Plain Dosa','Crispy dosa with sambar',50.00,60.00,'1 piece',100,'South Indian','https://loremflickr.com/800/600/dosa%2Csouthindian%2Cfood?lock=1797019434',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(14,5,'Samosa Pack','5 pieces of hot samosa',40.00,50.00,'5 pcs',80,'Snacks','https://loremflickr.com/800/600/samosa%2Csnack%2Cindian?lock=1461939343',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(15,5,'Masala Chai','Strong masala chai',20.00,25.00,'1 cup',150,'Beverages','https://loremflickr.com/800/600/chai%2Ctea%2Cindian?lock=1535701275',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(16,5,'Idli Pack','4 pieces soft idli',35.00,40.00,'4 pcs',70,'South Indian','https://loremflickr.com/800/600/idli%2Csouthindian%2Cfood?lock=2007084142',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(17,5,'Garlic Chutney','Homemade garlic chutney',30.00,35.00,'100g',50,'Condiments','https://loremflickr.com/800/600/chutney%2Csauce%2Cgreen?lock=1649610927',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(18,6,'Croissant','Butter croissant',60.00,75.00,'1 piece',40,'Pastry','https://loremflickr.com/800/600/croissant%2Cpastry%2Cbakery?lock=1371807136',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(19,6,'Chocolate Cake','Fresh chocolate cake slice',80.00,100.00,'1 slice',30,'Cake','https://loremflickr.com/800/600/chocolatecake%2Ccake%2Cdessert?lock=57986603',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(20,6,'Multigrain Bread','Healthy multigrain loaf',55.00,65.00,'1 loaf',25,'Bread','https://loremflickr.com/800/600/multigrain%2Cbread%2Cloaf?lock=1500843651',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(21,6,'Cookies Pack','Assorted cookies',100.00,120.00,'250g',50,'Cookies','https://loremflickr.com/800/600/cookies%2Cbiscuit%2Csnack?lock=1691927018',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(22,6,'Doughnut','Glazed doughnut',45.00,55.00,'1 piece',60,'Pastry','https://loremflickr.com/800/600/doughnut%2Cdonut%2Cpastry?lock=1243163706',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(23,7,'Organic Rice 1kg','Premium organic basmati rice',180.00,200.00,'1 kg',45,'Grains','https://loremflickr.com/800/600/rice%2Cgrain%2Cbasmati?lock=1414765844',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(24,7,'Organic Dal','Moong dal organically grown',150.00,175.00,'1 kg',40,'Pulses','https://loremflickr.com/800/600/dal%2Clentil%2Cindian?lock=510163813',1,'2026-05-07 15:22:08','2026-05-07 18:39:45'),(25,7,'Honey Raw','Pure raw honey',250.00,300.00,'500g',25,'Honey','https://loremflickr.com/800/600/honey%2Cjar%2Cgolden?lock=1980315097',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(26,7,'Almonds','Dry roasted almonds',350.00,400.00,'250g',30,'Dry Fruits','https://loremflickr.com/800/600/almonds%2Cnuts%2Cdryfruit?lock=1308959273',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(27,7,'Coconut Oil','Cold pressed coconut oil',280.00,320.00,'500ml',35,'Oils','https://loremflickr.com/800/600/coconutoil%2Coil%2Cbottle?lock=487868959',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(28,8,'Margherita Pizza','Classic cheese pizza',199.00,250.00,'1 medium',50,'Pizza','https://loremflickr.com/800/600/margherita%2Cpizza%2Ccheese?lock=1726868437',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(29,8,'Pepperoni Pizza','Loaded with pepperoni',249.00,300.00,'1 medium',45,'Pizza','https://loremflickr.com/800/600/pepperoni%2Cpizza?lock=1858563245',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(30,8,'Garlic Bread','Crispy garlic bread',99.00,120.00,'1 order',60,'Sides','https://loremflickr.com/800/600/garlicbread%2Cbread%2Cbaked?lock=883928275',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(31,8,'Coke','Cold carbonated drink',50.00,60.00,'250ml',100,'Beverages','https://loremflickr.com/800/600/cocacola%2Ccola%2Cdrink?lock=152633845',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(32,8,'Chocolate Brownie','Rich chocolate brownie',129.00,150.00,'1 piece',40,'Dessert','https://loremflickr.com/800/600/brownie%2Cchocolate%2Cdessert?lock=2126538607',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(33,9,'Biryani','Fragrant basmati biryani with meat',180.00,220.00,'1 plate',60,'Main Course','https://loremflickr.com/800/600/biryani%2Crice%2Cindian?lock=2117211637',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(34,9,'Butter Chicken','Creamy butter chicken curry',220.00,280.00,'1 plate',50,'Main Course','https://loremflickr.com/800/600/butterchicken%2Ccurry%2Cindian?lock=2136204952',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(35,9,'Naan Bread','Butter naan bread',30.00,40.00,'1 piece',100,'Bread','https://loremflickr.com/800/600/naan%2Cbread%2Cindian?lock=785233921',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(36,9,'Raita','Yogurt side dish',40.00,50.00,'1 bowl',80,'Side Dish','https://loremflickr.com/800/600/raita%2Cyogurt%2Cindian?lock=1890134629',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(37,9,'Gulab Jamun','Sweet gulab jamun dessert',60.00,75.00,'2 pieces',70,'Dessert','https://loremflickr.com/800/600/gulabjamun%2Csweet%2Cindian?lock=1370265105',1,'2026-05-07 15:22:08','2026-05-07 18:39:46'),(38,10,'Instant Noodles','Quick instant noodles pack',15.00,20.00,'1 pack',200,'Noodles','https://loremflickr.com/800/600/noodles%2Cinstant%2Casian?lock=4165020',1,'2026-05-07 15:23:46','2026-05-07 18:39:46'),(39,10,'Biscuits Pack','Assorted biscuits',80.00,100.00,'500g',100,'Snacks','https://loremflickr.com/800/600/biscuit%2Ccookie%2Csnack?lock=1606421115',1,'2026-05-07 15:23:46','2026-05-07 18:39:46'),(40,10,'Chips','Spicy potato chips',40.00,50.00,'50g',150,'Snacks','https://loremflickr.com/800/600/chips%2Cpotato%2Csnack?lock=1365129213',1,'2026-05-07 15:23:46','2026-05-07 18:39:46'),(41,10,'Chocolate Bar','Premium chocolate bar',50.00,65.00,'1 piece',120,'Confectionery','https://loremflickr.com/800/600/chocolatebar%2Cchocolate%2Csweet?lock=644879264',1,'2026-05-07 15:23:46','2026-05-07 18:39:46'),(42,10,'Ice Cream','Vanilla ice cream cup',60.00,80.00,'100ml',80,'Frozen','https://loremflickr.com/800/600/icecream%2Cdessert%2Ccone?lock=579146856',1,'2026-05-07 15:23:46','2026-05-07 18:39:46');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','vendor','customer') NOT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `verified` tinyint(1) DEFAULT '0',
  `verification_token` varchar(255) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `provider` enum('local','google','facebook','github') NOT NULL DEFAULT 'local',
  `provider_id` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `email_28` (`email`),
  UNIQUE KEY `email_29` (`email`),
  UNIQUE KEY `email_30` (`email`),
  UNIQUE KEY `email_31` (`email`),
  UNIQUE KEY `email_32` (`email`),
  UNIQUE KEY `email_33` (`email`),
  UNIQUE KEY `email_34` (`email`),
  UNIQUE KEY `email_35` (`email`),
  UNIQUE KEY `email_36` (`email`),
  UNIQUE KEY `email_37` (`email`),
  UNIQUE KEY `email_38` (`email`),
  UNIQUE KEY `email_39` (`email`),
  UNIQUE KEY `email_40` (`email`),
  UNIQUE KEY `email_41` (`email`),
  UNIQUE KEY `email_42` (`email`),
  UNIQUE KEY `email_43` (`email`),
  UNIQUE KEY `email_44` (`email`),
  UNIQUE KEY `email_45` (`email`),
  UNIQUE KEY `email_46` (`email`),
  UNIQUE KEY `email_47` (`email`),
  UNIQUE KEY `email_48` (`email`),
  UNIQUE KEY `email_49` (`email`),
  UNIQUE KEY `email_50` (`email`),
  UNIQUE KEY `email_51` (`email`),
  UNIQUE KEY `email_52` (`email`),
  UNIQUE KEY `email_53` (`email`),
  UNIQUE KEY `email_54` (`email`),
  UNIQUE KEY `email_55` (`email`),
  UNIQUE KEY `email_56` (`email`),
  UNIQUE KEY `email_57` (`email`),
  UNIQUE KEY `email_58` (`email`),
  UNIQUE KEY `email_59` (`email`),
  UNIQUE KEY `email_60` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Demo Customer','customer@demo.com','$2a$10$oNviYG39cRdCTnXhBqhGFegbRsZhFNR6gdLFLi9LdLpuZ354Vbcrq','customer','active',1,NULL,NULL,'2026-05-01 10:28:56','2026-05-01 10:28:56','local',NULL,NULL),(2,'Demo Vendor','vendor@demo.com','$2a$10$Uh2XvzbSUv4kpzBd71EJOeoFkmTPufCtZzvaQge/J9daemFCrFpCC','vendor','active',1,NULL,NULL,'2026-05-01 10:28:56','2026-05-01 10:28:56','local',NULL,NULL),(3,'Demo Admin','admin@demo.com','$2a$10$XVNshxYhtnwvWPugyZHQBOphJOocFqvvpFIMKn1QQbA.oG3aTGK/W','admin','active',1,NULL,NULL,'2026-05-01 10:28:56','2026-05-01 10:28:56','local',NULL,NULL),(4,'Ashutosh Pandey','ashutosh3276s16@gmail.com','$2a$10$yGrgv1CQqyVXQ0MMcNrOku1V/F7JyeC/ipAHa0WYhVfFyonZd1AzC','vendor','active',1,NULL,NULL,'2026-05-07 10:53:16','2026-05-07 10:53:16','local',NULL,NULL),(5,'Ashutosh Pandey','ashutosh@gmail.com','$2a$10$EjYUSRxY3yUrpg1rRQ8vgO1rCrmfUP6LMUOocUjHr1vkj7i.VHTLW','customer','active',1,NULL,NULL,'2026-05-07 10:55:04','2026-05-07 10:55:04','local',NULL,NULL),(6,'Ashutosh Pandey','ashutosh1234@gmail.com','$2a$10$7saulEijcYDBpW1NlJMmhOOwg0w5Q6xsKetPhAbZnxN6/k6UvbkOi','vendor','active',1,NULL,NULL,'2026-05-07 14:00:50','2026-05-07 14:00:50','local',NULL,NULL),(7,'amit','amit1234@gmail.com','$2a$10$BBc4BLfswPspjfwjaCB44.0Rkyk5e4vAT2C8Yq4rFJi4oSkFGsK3u','vendor','active',1,NULL,NULL,'2026-05-07 14:06:18','2026-05-07 14:06:18','local',NULL,NULL),(8,'Fresh Daily Mart','freshdailymart@vendor.com','$2a$10$JK3jkXA8.edaut9kQdbIzOhnA4mriniqv1/xjZI3bq6WAj1RKU9dK','vendor','active',1,NULL,NULL,'2026-05-07 15:22:08','2026-05-07 15:22:08','local',NULL,NULL),(10,'Supreme Pharmacy','supremepharmacy@vendor.com','$2a$10$Jlz28P8k/LUtT1OZRbhv6Osk2xDLU3dMvjJRhsq1f8f3I8mCzUo0O','vendor','active',1,NULL,NULL,'2026-05-07 15:22:08','2026-05-07 15:22:08','local',NULL,NULL),(11,'Chai & Samosa Corner','chai&samosacorner@vendor.com','$2a$10$RvtORO9eLPB1xo9xJ4E2ouw6HFovK8hH9cMQjHWcz3aMrIPpZP7WG','vendor','active',1,NULL,NULL,'2026-05-07 15:22:08','2026-05-07 15:22:08','local',NULL,NULL),(12,'Happy Bakery','happybakery@vendor.com','$2a$10$/FunyFDM4O3MHuJD0TtIIevcSkSSS8kYedsrRNpPGjW3yoXB/MU92','vendor','active',1,NULL,NULL,'2026-05-07 15:22:08','2026-05-07 15:22:08','local',NULL,NULL),(13,'Green Valley Organic','greenvalleyorganic@vendor.com','$2a$10$k.A.G9/32cx6tQwdqNnfUuralqQ4hBlHemNlbdILuqILu6WHFJMcq','vendor','active',1,NULL,NULL,'2026-05-07 15:22:08','2026-05-07 15:22:08','local',NULL,NULL),(14,'Quick Pizza Palace','quickpizzapalace@vendor.com','$2a$10$SK/P7Te7I11IJKw5qQlDV.jkJ34hWRgEzRsIxl.CdsfZUHxWnD34S','vendor','active',1,NULL,NULL,'2026-05-07 15:22:08','2026-05-07 15:22:08','local',NULL,NULL),(15,'Spice Kitchen Restaurant','spicekitchenrestaurant@vendor.com','$2a$10$wwhkatPQ/6UDzUC7CnrdF..JX380M6HEwjJs1ZYXNCvbBQbTNDEZ6','vendor','active',1,NULL,NULL,'2026-05-07 15:22:08','2026-05-07 15:22:08','local',NULL,NULL),(16,'Sweet Tooth Confectionery','sweettoothconfectionery@vendor.com','$2a$10$G8whpnmGBKAUlqF5ozxffO9VUlswPgYRA1bHdW4SvGvrfUpiSg0IO','vendor','active',1,NULL,NULL,'2026-05-07 15:22:08','2026-05-07 15:22:08','local',NULL,NULL),(21,'Fitness & Wellness Hub','fitness&wellnesshub@vendor.com','$2a$10$n3IegjmjPwPELUSra.zD1OQm5jXi2cHzhsJOK0b0k1CqWfxNrEl3q','vendor','active',1,NULL,NULL,'2026-05-07 15:23:16','2026-05-07 15:23:16','local',NULL,NULL),(23,'Metro Convenience Store','metroconveniencestore@vendor.com','$2a$10$6fY3QZgaWjfhnK4naGwy2.j7KywFLYR6fc3SzzyGB4cLpHAov16IS','vendor','active',1,NULL,NULL,'2026-05-07 15:23:46','2026-05-07 15:23:46','local',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_profiles`
--

DROP TABLE IF EXISTS `vendor_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `shop_name` varchar(150) NOT NULL,
  `gstin` varchar(15) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `pin_code` varchar(6) NOT NULL,
  `lat` decimal(10,8) DEFAULT NULL,
  `lng` decimal(11,8) DEFAULT NULL,
  `delivery_radius_km` decimal(5,2) DEFAULT '5.00',
  `delivery_charge` decimal(10,2) DEFAULT '30.00',
  `min_order_amount` decimal(10,2) DEFAULT '200.00',
  `category` varchar(100) DEFAULT NULL,
  `approval_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `logo_url` varchar(255) DEFAULT NULL,
  `description` text,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_approval_status` (`approval_status`),
  KEY `idx_city` (`city`),
  KEY `idx_coordinates` (`lat`,`lng`),
  KEY `idx_delivery_radius` (`delivery_radius_km`),
  CONSTRAINT `vendor_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_profiles`
--

LOCK TABLES `vendor_profiles` WRITE;
/*!40000 ALTER TABLE `vendor_profiles` DISABLE KEYS */;
INSERT INTO `vendor_profiles` VALUES (1,2,'Demo Fresh Mart',NULL,'9000000001','123 Linking Road, Bandra','Mumbai','Maharashtra','400050',19.05960000,72.82950000,5.00,25.00,150.00,'Groceries','approved','https://loremflickr.com/1600/900/grocery%2Csupermarket%2Cstore?lock=129013148','Fresh local essentials for the neighborhood.',NULL,NULL,'2026-05-01 10:28:56','2026-05-07 18:39:45'),(2,7,'amit',NULL,NULL,'Setup pending','Setup pending','Setup pending','000000',NULL,NULL,5.00,30.00,200.00,NULL,'pending','https://loremflickr.com/1600/900/amit?lock=772976657',NULL,NULL,NULL,'2026-05-07 14:06:18','2026-05-07 18:39:45'),(3,8,'Fresh Daily Mart','27AABCP5055K1Z1','9876543210','123 Linking Road, Bandra','Mumbai','Maharashtra','400050',19.05960000,72.82950000,5.00,25.00,50.00,'Grocery','approved','https://loremflickr.com/1600/900/grocery%2Cvegetable%2Cmarket?lock=1300456820','Fresh groceries and daily essentials delivered fast','06:00:00','23:00:00','2026-05-07 15:22:08','2026-05-07 18:40:39'),(4,10,'Supreme Pharmacy','27AABCT1234K1Z5','9876543211','456 Linking Road, Fort','Mumbai','Maharashtra','400001',18.92710000,72.82640000,3.00,25.00,50.00,'Pharmacy','approved','https://loremflickr.com/1600/900/pharmacy%2Cdrugstore%2Cmedicine?lock=1213221439','All medicines and health products available','08:00:00','22:00:00','2026-05-07 15:22:08','2026-05-07 18:40:39'),(5,11,'Chai & Samosa Corner','27AABCR5678K1Z2','9876543212','789 Phoenix Mills, Andheri','Mumbai','Maharashtra','400069',19.11360000,72.86970000,4.00,25.00,50.00,'Food & Beverage','approved','https://loremflickr.com/1600/900/chai%2Csamosa%2Ccorner?lock=1128465283','Traditional Indian snacks and chai','07:00:00','21:00:00','2026-05-07 15:22:08','2026-05-07 18:40:39'),(6,12,'Happy Bakery','27AABCB9101K1Z3','9876543213','321 Dadar East Market','Mumbai','Maharashtra','400014',19.01760000,72.84790000,3.00,25.00,50.00,'Bakery','approved','https://loremflickr.com/1600/900/bakery%2Cbread%2Cpastry?lock=1219377704','Fresh baked items daily','06:00:00','21:00:00','2026-05-07 15:22:08','2026-05-07 18:40:39'),(7,13,'Green Valley Organic','27AABCG1121K1Z4','9876543214','654 Powai, Lake Road','Mumbai','Maharashtra','400076',19.11360000,72.90270000,4.00,25.00,50.00,'Organic Store','approved','https://loremflickr.com/1600/900/organic%2Cvegetable%2Cfarm?lock=291135893','100% organic and pesticide-free products','07:00:00','22:00:00','2026-05-07 15:22:08','2026-05-07 18:40:39'),(8,14,'Quick Pizza Palace','27AABCP1314K1Z6','9876543215','987 Malad West, Highway','Mumbai','Maharashtra','400064',19.18490000,72.84490000,5.00,25.00,50.00,'Restaurant','approved','https://loremflickr.com/1600/900/pizza%2Crestaurant%2Citalian?lock=1381970382','Hot and fresh pizzas delivered in 30 mins','11:00:00','23:00:00','2026-05-07 15:22:08','2026-05-07 18:40:39'),(9,15,'Spice Kitchen Restaurant','27AABCS1516K1Z7','9876543216','147 Thane West, Station Road','Mumbai','Maharashtra','400602',19.21830000,72.97810000,3.00,25.00,50.00,'Restaurant','approved','https://loremflickr.com/1600/900/indianfood%2Crestaurant%2Ccurry?lock=451764506','Authentic Indian cuisine with North and South specialties','10:00:00','23:30:00','2026-05-07 15:22:08','2026-05-07 18:40:39'),(10,23,'Metro Convenience Store','27AABCM2122K1Z0','9876543219','741 Santacruz East, Airport Road','Mumbai','Maharashtra','400055',19.07350000,72.85600000,4.00,25.00,50.00,'General Store','approved','https://loremflickr.com/1600/900/store%2Cconvenience%2Cshop?lock=1745898290','Everything you need in one place','06:00:00','23:30:00','2026-05-07 15:23:46','2026-05-07 18:40:39');
/*!40000 ALTER TABLE `vendor_profiles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-08  8:52:17
