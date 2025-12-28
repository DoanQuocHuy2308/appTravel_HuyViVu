-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: apphuyvivu
-- ------------------------------------------------------
-- Server version	8.4.4

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
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'Ha Long Promotion','https://images.unsplash.com/photo-1507525428034-b723cf961d3e','active','2025-10-01 23:50:53'),(2,'Sapa Tour','https://images.unsplash.com/photo-1501785888041-af3ef285b470','active','2025-10-01 23:50:53'),(3,'Summer Promotion','https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef','active','2025-10-01 23:50:53'),(4,'Winter Travel','https://images.unsplash.com/photo-1549887534-3db1bd59dcca','inactive','2025-10-01 23:50:53'),(5,'Explore Vietnam','https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1','active','2025-10-01 23:50:53');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_services`
--

DROP TABLE IF EXISTS `booking_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `service_id` int DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `price` decimal(10,2) DEFAULT NULL,
  `location` text,
  `booking_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `booking_services_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `booking_services_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_services`
--

LOCK TABLES `booking_services` WRITE;
/*!40000 ALTER TABLE `booking_services` DISABLE KEYS */;
INSERT INTO `booking_services` VALUES (1,1,1,2,100.00,'Ha Long','2025-10-01 23:50:53'),(2,2,2,1,30.00,'Sapa','2025-10-01 23:50:53'),(3,3,3,1,40.00,'Da Nang','2025-10-01 23:50:53'),(4,4,4,2,240.00,'Ha Noi','2025-10-01 23:50:53'),(5,5,5,1,80.00,'Ho Chi Minh','2025-10-01 23:50:53');
/*!40000 ALTER TABLE `booking_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `tour_id` int DEFAULT NULL,
  `adults` int NOT NULL DEFAULT '1',
  `children` int NOT NULL DEFAULT '0',
  `infants` int NOT NULL DEFAULT '0',
  `notes` text,
  `booking_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','confirmed','canceled') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,2,3,1,'hehee','2025-10-01 23:50:53','2025-10-01','2025-10-03',1700000.00,'confirmed'),(3,3,3,3,1,0,'Công ty du lịch','2025-10-01 23:50:53','2025-11-10','2025-11-13',800.00,'confirmed'),(4,4,4,1,1,0,'Khách VIP','2025-10-01 23:50:53','2025-10-15','2025-10-15',150.00,'confirmed'),(6,1,1,2,2,1,'okokk','2025-10-06 19:55:00','2025-10-20','2025-10-22',1800000.00,'confirmed'),(7,1,1,2,1,1,'okokok','2025-10-07 23:24:59','2025-10-20','2025-10-22',1800000.00,'confirmed'),(8,24,1,1,1,2,'ok','2025-10-18 18:43:37','2025-09-18','2025-09-23',900000.00,'confirmed'),(10,16,2,1,1,1,'okokok','2025-10-19 09:13:24','2025-09-18','2025-10-20',4000000.00,'confirmed'),(11,24,2,1,0,0,'địa điểm đón:','2025-10-19 10:04:55','2025-09-18','2025-10-20',1200000.00,'confirmed'),(14,15,1,2,1,1,'okkkkkk okk okkk','2025-10-19 23:30:41','2025-09-30','2025-10-20',2300000.00,'confirmed'),(16,15,2,1,1,1,'','2025-10-20 09:13:55','2025-09-18','2025-10-21',1200000.00,'confirmed'),(19,15,10,1,0,0,'','2025-10-20 09:47:43','2025-10-14','2025-10-18',1800000.00,'canceled'),(20,15,3,1,1,0,'','2025-10-20 10:00:09','2025-11-09','2025-10-21',3000.00,'pending'),(25,15,5,1,0,0,'','2025-10-20 10:53:34','2025-12-04','2025-10-21',1800000.00,'pending'),(26,15,5,1,0,0,'','2025-10-20 10:54:46','2025-12-04','2025-10-21',1800000.00,'canceled'),(33,15,5,1,1,0,'','2025-10-20 18:08:54','2025-12-04','2025-10-21',2400000.00,'pending');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_service`
--

DROP TABLE IF EXISTS `category_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_service`
--

LOCK TABLES `category_service` WRITE;
/*!40000 ALTER TABLE `category_service` DISABLE KEYS */;
INSERT INTO `category_service` VALUES (1,'Hotel','Các loại khách sạn, resort'),(2,'Flight','Vé máy bay, vé khứ hồi'),(3,'Car','Dịch vụ thuê xe'),(4,'Other','Các dịch vụ khác'),(5,'Cruise','Du thuyền');
/*!40000 ALTER TABLE `category_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combo_items`
--

DROP TABLE IF EXISTS `combo_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combo_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `combo_id` int NOT NULL,
  `service_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `combo_id` (`combo_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `combo_items_ibfk_1` FOREIGN KEY (`combo_id`) REFERENCES `combos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `combo_items_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo_items`
--

LOCK TABLES `combo_items` WRITE;
/*!40000 ALTER TABLE `combo_items` DISABLE KEYS */;
INSERT INTO `combo_items` VALUES (1,1,1),(2,1,2),(3,2,3),(4,2,5),(5,3,4),(6,3,5);
/*!40000 ALTER TABLE `combo_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combos`
--

DROP TABLE IF EXISTS `combos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `tour_id` int NOT NULL,
  `description` text,
  `total_price` decimal(10,2) DEFAULT '0.00',
  `discount` decimal(5,2) DEFAULT '0.00',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `combos_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combos`
--

LOCK TABLES `combos` WRITE;
/*!40000 ALTER TABLE `combos` DISABLE KEYS */;
INSERT INTO `combos` VALUES (1,'Combo Hạ Long Bay 3N2Đ',1,'Combo Hạ Long Bay 3 ngày 2 đêm, bao gồm khách sạn 4 sao và vé khứ hồi.',180.00,10.00,'2025-10-10','2025-12-31','active','2025-10-13 17:35:50'),(2,'Combo Đà Nẵng 4N3Đ',3,'Combo Đà Nẵng 4N3Đ, gồm tour + thuê xe 7 chỗ + vé máy bay khứ hồi.',250.00,15.00,'2025-10-15','2026-01-01','active','2025-10-13 17:35:50'),(3,'Combo Nha Trang 3N2Đ',6,'Combo Nha Trang 3N2Đ, gồm tour + resort cao cấp.',300.00,20.00,'2025-11-01','2026-02-01','active','2025-10-13 17:35:50');
/*!40000 ALTER TABLE `combos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text,
  `status` enum('pending','answered','closed') DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` VALUES (1,1,'Hỏi về tour','Xin cho tôi biết chi tiết về tour Hạ Long','pending','2025-10-01 23:50:53'),(2,2,'Phản hồi','Khách hàng cần tư vấn về Sapa','answered','2025-10-01 23:50:53'),(3,3,'Thanh toán','Có thể thanh toán qua thẻ?','pending','2025-10-01 23:50:53'),(4,4,'Khuyến mãi','Tôi có thể dùng code không?','answered','2025-10-01 23:50:53'),(5,5,'Đánh giá','Dịch vụ rất tốt','closed','2025-10-01 23:50:53');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite_tours`
--

DROP TABLE IF EXISTS `favorite_tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorite_tours` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tour_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`tour_id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `favorite_tours_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorite_tours_ibfk_2` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite_tours`
--

LOCK TABLES `favorite_tours` WRITE;
/*!40000 ALTER TABLE `favorite_tours` DISABLE KEYS */;
INSERT INTO `favorite_tours` VALUES (1,1,2,'2025-10-01 23:50:53'),(2,2,1,'2025-10-01 23:50:53'),(3,3,3,'2025-10-01 23:50:53'),(4,4,4,'2025-10-01 23:50:53'),(5,5,5,'2025-10-01 23:50:53'),(7,15,1,'2025-10-20 16:09:56');
/*!40000 ALTER TABLE `favorite_tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image_service`
--

DROP TABLE IF EXISTS `image_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image_service` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_id` int NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `image_service_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image_service`
--

LOCK TABLES `image_service` WRITE;
/*!40000 ALTER TABLE `image_service` DISABLE KEYS */;
INSERT INTO `image_service` VALUES (1,1,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-10-07 14:47:49'),(2,2,'https://images.unsplash.com/photo-1509233725247-49e657c5b525','2025-10-07 14:47:49'),(3,3,'https://images.unsplash.com/photo-1492681290082-e932832941e6','2025-10-07 14:47:49'),(4,4,'https://images.unsplash.com/photo-1544550581-1e0991912fc2','2025-10-07 14:47:49'),(5,5,'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b9f','2025-10-07 14:47:49');
/*!40000 ALTER TABLE `image_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `image_tour`
--

DROP TABLE IF EXISTS `image_tour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `image_tour` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tour_id` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `image_tour_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image_tour`
--

LOCK TABLES `image_tour` WRITE;
/*!40000 ALTER TABLE `image_tour` DISABLE KEYS */;
INSERT INTO `image_tour` VALUES (38,3,'/public/images/1760774223225-744969273.jpg','2025-10-18 14:57:03'),(39,3,'/public/images/1760774223228-813898996.jpg','2025-10-18 14:57:03'),(40,1,'/public/images/1760775131239-978966393.jpg','2025-10-18 15:12:11'),(41,1,'/public/images/1760775131242-8676878.jpg','2025-10-18 15:12:11'),(42,1,'/public/images/1760775131242-631150645.jpg','2025-10-18 15:12:11'),(43,1,'/public/images/1760775131245-620160012.jpg','2025-10-18 15:12:11'),(44,1,'/public/images/1760775131248-241827370.jpg','2025-10-18 15:12:11'),(45,1,'/public/images/1760775131253-321132772.jpg','2025-10-18 15:12:11'),(46,1,'/public/images/1760775131254-488044152.jpg','2025-10-18 15:12:11'),(47,1,'/public/images/1760775131255-247045406.jpg','2025-10-18 15:12:11'),(48,1,'/public/images/1760775131259-668916811.jpg','2025-10-18 15:12:11'),(49,1,'/public/images/1760775131261-181073276.jpg','2025-10-18 15:12:11'),(50,1,'/public/images/1760775131264-278787823.jpg','2025-10-18 15:12:11'),(51,3,'/public/images/1760775264008-610282893.jpg','2025-10-18 15:14:24'),(52,3,'/public/images/1760775264011-669685893.jpg','2025-10-18 15:14:24'),(53,3,'/public/images/1760775264012-114820262.jpg','2025-10-18 15:14:24'),(54,3,'/public/images/1760775264014-437266570.jpg','2025-10-18 15:14:24'),(55,3,'/public/images/1760775264014-716383073.jpg','2025-10-18 15:14:24'),(56,3,'/public/images/1760775264016-538032450.jpg','2025-10-18 15:14:24'),(57,3,'/public/images/1760775264016-956625079.jpg','2025-10-18 15:14:24'),(58,3,'/public/images/1760775264019-752609580.jpg','2025-10-18 15:14:24'),(59,10,'/public/images/1760790567875-983005779.jpg','2025-10-18 19:29:27'),(60,10,'/public/images/1760790567878-627958195.jpg','2025-10-18 19:29:27'),(61,10,'/public/images/1760790567878-413631701.jpg','2025-10-18 19:29:27'),(62,10,'/public/images/1760790567895-380348165.jpg','2025-10-18 19:29:27'),(63,10,'/public/images/1760790567903-183862585.jpg','2025-10-18 19:29:27'),(64,10,'/public/images/1760790567910-650754560.jpg','2025-10-18 19:29:27'),(65,10,'/public/images/1760790567918-282087059.jpg','2025-10-18 19:29:27'),(66,10,'/public/images/1760790567934-347647513.jpg','2025-10-18 19:29:27'),(67,10,'/public/images/1760790567946-417083082.jpg','2025-10-18 19:29:27'),(68,2,'/public/images/1760851238121-175841526.jpg','2025-10-19 12:20:38'),(69,2,'/public/images/1760851238146-147895158.jpg','2025-10-19 12:20:38'),(70,2,'/public/images/1760851238159-839232667.jpg','2025-10-19 12:20:38'),(71,2,'/public/images/1760851238160-838899511.jpg','2025-10-19 12:20:38'),(72,2,'/public/images/1760851238161-466378029.jpg','2025-10-19 12:20:38'),(73,2,'/public/images/1760851238162-68153941.jpg','2025-10-19 12:20:38'),(74,5,'/public/images/1760851380622-654780240.jpg','2025-10-19 12:23:00'),(75,5,'/public/images/1760851380639-34678786.jpg','2025-10-19 12:23:00'),(76,5,'/public/images/1760851380654-915586027.jpg','2025-10-19 12:23:00'),(77,5,'/public/images/1760851380655-56897750.jpg','2025-10-19 12:23:00'),(78,5,'/public/images/1760851380655-639872584.jpg','2025-10-19 12:23:00'),(79,5,'/public/images/1760851380656-11186324.jpg','2025-10-19 12:23:00');
/*!40000 ALTER TABLE `image_tour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `region_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `region_id` (`region_id`),
  CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `regions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Ha Long Bay','Vịnh Hạ Long nổi tiếng với đảo đá vôi','Ha Long','Vietnam','/public/images/1760594315829-535797466.png','2025-10-01 23:50:53',1),(2,'Sapa','Thị trấn núi cao với ruộng bậc thang','Sapa','Vietnam','/public/images/1760594328995-323778528.jpg','2025-10-01 23:50:53',1),(3,'Da Nang Beach','Bãi biển đẹp','Da Nang','Vietnam','https://images.unsplash.com/photo-1507525428034-b723cf961d3e','2025-10-01 23:50:53',2),(4,'Hà Nội','Thủ đô ngàn năm văn hiến','Ha Noi','Vietnam','https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1','2025-10-01 23:50:53',1),(5,'TP. Hồ Chí Minh','Thành phố sôi động','Ho Chi Minh','Vietnam','https://images.unsplash.com/photo-1544005313-94ddf0286df2','2025-10-01 23:50:53',3),(8,'Đình cao','ok','Hưng Yên','VN','/public/images/1760592608296-992771257.jpg','2025-10-16 12:30:08',1);
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) DEFAULT NULL,
  `description` text,
  `discount` decimal(5,2) DEFAULT NULL,
  `max_count` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (1,'PROMO10','Giảm 10% cho tour đầu tiên',10.00,9,'2025-09-01','2025-12-31','active'),(2,'PROMO20','Giảm 20% cho khách VIP',20.00,1,'2025-09-01','2025-12-31','active'),(3,'PROMO15','Giảm 15% mùa hè',15.00,4,'2025-06-01','2025-09-01','inactive'),(4,'PROMO30','Khuyến mãi 30% cuối năm',30.00,0,'2025-12-01','2025-12-31','active'),(5,'PROMO5','Giảm 5% cho khách mới',5.00,30,'2025-10-01','2025-11-30','active');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `regions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regions`
--

LOCK TABLES `regions` WRITE;
/*!40000 ALTER TABLE `regions` DISABLE KEYS */;
INSERT INTO `regions` VALUES (1,'Miền Bắc','Khu vực phía Bắc Việt Nam','2025-10-01 23:50:53'),(2,'Miền Trung','Khu vực miền Trung Việt Nam','2025-10-01 23:50:53'),(3,'Miền Nam','Khu vực miền Nam Việt Nam','2025-10-01 23:50:53'),(4,'Quốc tế','Các tour quốc tế','2025-10-01 23:50:53'),(5,'Đặc biệt','Tour VIP','2025-10-01 23:50:53'),(7,'Miền Tây','miền tay sông nước hữu tình','2025-10-16 11:22:57');
/*!40000 ALTER TABLE `regions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `tour_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`),
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,5,'Tour rất tuyệt vời!','https://images.unsplash.com/photo-1517841905240-472988babdf9','2025-10-01 23:50:53'),(2,2,2,4,'Hướng dẫn viên rất nhiệt tình','https://images.unsplash.com/photo-1524504388940-b1c1722653e1','2025-10-01 23:50:53'),(3,3,3,3,'Khá ổn nhưng dịch vụ ăn uống cần cải thiện','https://images.unsplash.com/photo-1544005313-94ddf0286df2','2025-10-01 23:50:53'),(4,4,4,5,'Tour văn hóa bổ ích','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d','2025-10-01 23:50:53'),(5,5,5,4,'Thành phố sôi động, tôi thích!','https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e','2025-10-01 23:50:53'),(6,1,6,5,'Rất vui và đáng nhớ!','https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e','2025-10-06 08:48:25'),(7,2,7,4,'Lịch trình hợp lý, hướng dẫn viên nhiệt tình.','https://images.unsplash.com/photo-1502685104226-ee32379fefbe','2025-10-06 08:48:25'),(8,3,8,5,'Phú Quốc quá đẹp, ăn uống tuyệt vời!','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d','2025-10-06 08:48:25');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category_service` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,1,'Hotel 4-star','Khách sạn tiêu chuẩn 4 sao',50.00,'2025-10-01 23:50:53'),(2,2,'Flight Hanoi-HaLong','Vé máy bay khứ hồi Hà Nội - Hạ Long',30.00,'2025-10-01 23:50:53'),(3,3,'Car Rental','Thuê xe 7 chỗ',40.00,'2025-10-01 23:50:53'),(4,1,'Resort 5-star','Resort cao cấp',120.00,'2025-10-01 23:50:53'),(5,2,'Flight HCM-DaNang','Vé khứ hồi HCM - Đà Nẵng',80.00,'2025-10-01 23:50:53');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_guides`
--

DROP TABLE IF EXISTS `tour_guides`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_guides` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `experience_years` int DEFAULT '0',
  `language` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tour_guides_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_guides`
--

LOCK TABLES `tour_guides` WRITE;
/*!40000 ALTER TABLE `tour_guides` DISABLE KEYS */;
INSERT INTO `tour_guides` VALUES (1,2,5,'English, Vietnamese','2025-10-01 23:50:53'),(2,3,3,'English','2025-10-01 23:50:53'),(3,4,7,'Chinese, Vietnamese','2025-10-01 23:50:53'),(4,1,2,'Japanese','2025-10-01 23:50:53'),(5,5,1,'Korean','2025-10-01 23:50:53');
/*!40000 ALTER TABLE `tour_guides` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_notes`
--

DROP TABLE IF EXISTS `tour_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tour_id` int NOT NULL,
  `title` text NOT NULL,
  `note` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `tour_notes_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_notes`
--

LOCK TABLES `tour_notes` WRITE;
/*!40000 ALTER TABLE `tour_notes` DISABLE KEYS */;
INSERT INTO `tour_notes` VALUES (1,1,'Chuẩn bị hành lý','Mang theo áo mưa, mũ nón và thuốc cá nhân.','2025-10-05 03:23:03'),(2,1,'Điểm tham quan','Tham quan bãi biển, chụp ảnh tại ngọn hải đăng.','2025-10-05 03:23:03'),(3,2,'Ăn uống','Thử các món đặc sản địa phương tại chợ đêm.','2025-10-05 03:23:03'),(4,2,'Lịch trình buổi sáng','Tham quan bảo tàng và vườn quốc gia.','2025-10-05 03:23:03'),(5,3,'Giao thông','Thuê xe máy để tiện đi lại.','2025-10-05 03:23:03'),(6,3,'Lưu ý','Không quên mang theo giấy tờ tùy thân và tiền mặt.','2025-10-05 03:23:03'),(7,6,'Mang đồ bơi','Chuẩn bị áo tắm, kem chống nắng.','2025-10-06 08:48:25'),(8,6,'Giấy tờ','Mang theo CMND/CCCD để nhận phòng.','2025-10-06 08:48:25'),(9,7,'Trang phục lịch sự','Khi tham quan đền chùa.','2025-10-06 08:48:25'),(10,7,'Mang dù','Thời tiết Huế dễ mưa.','2025-10-06 08:48:25'),(11,8,'Kem chống muỗi','Mang theo khi đi rừng.','2025-10-06 08:48:25'),(12,8,'Giữ vệ sinh','Không xả rác tại bãi biển.','2025-10-06 08:48:25');
/*!40000 ALTER TABLE `tour_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_schedule`
--

DROP TABLE IF EXISTS `tour_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_schedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tour_id` int DEFAULT NULL,
  `day_number` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `tour_schedule_ibfk_1` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_schedule`
--

LOCK TABLES `tour_schedule` WRITE;
/*!40000 ALTER TABLE `tour_schedule` DISABLE KEYS */;
INSERT INTO `tour_schedule` VALUES (1,1,1,'Arrival and Check-in','Đến Hạ Long, nhận phòng khách sạn','2025-10-17 20:40:55','2025-10-17 20:40:55'),(2,1,2,'Boat Trip','Tham quan các đảo và hang động','2025-10-17 20:40:55','2025-10-17 20:40:55'),(3,1,3,'Return','Trở về điểm xuất phát','2025-10-17 20:40:55','2025-10-17 20:40:55'),(4,2,1,'Khởi hành','Xuất phát từ Hà Nội','2025-10-17 20:40:55','2025-10-17 20:40:55'),(5,2,2,'Khám phá bản làng','Tham quan bản Cát Cát','2025-10-17 20:40:55','2025-10-17 20:40:55'),(6,6,1,'Check-in khách sạn','Đến Nha Trang, nhận phòng và nghỉ ngơi.','2025-10-17 20:40:55','2025-10-17 20:40:55'),(7,6,2,'Tham quan đảo Hòn Mun','Lặn ngắm san hô và thưởng thức hải sản.','2025-10-17 20:40:55','2025-10-17 20:40:55'),(8,6,3,'Tự do mua sắm','Tham quan Chợ Đầm và trở về.','2025-10-17 20:40:55','2025-10-17 20:40:55'),(9,7,1,'Tham quan Đại Nội','Khám phá Hoàng Thành và Cung điện Huế.','2025-10-17 20:40:55','2025-10-17 20:40:55'),(10,7,2,'Chùa Thiên Mụ','Nghe ca Huế trên Sông Hương.','2025-10-17 20:40:55','2025-10-17 20:40:55'),(11,8,1,'Đến Phú Quốc','Đón khách tại sân bay, nhận phòng khách sạn.','2025-10-17 20:40:55','2025-10-17 20:40:55'),(12,8,2,'Khám phá Vinpearl Safari','Tham quan khu bảo tồn động vật hoang dã.','2025-10-17 20:40:55','2025-10-17 20:40:55'),(13,8,3,'Cáp treo Hòn Thơm','Trải nghiệm cáp treo dài nhất thế giới.','2025-10-17 20:40:55','2025-10-17 20:40:55'),(14,8,4,'Tự do tắm biển','Tắm biển Bãi Sao và kết thúc hành trình.','2025-10-17 20:40:55','2025-10-17 20:40:55');
/*!40000 ALTER TABLE `tour_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_ticket_prices`
--

DROP TABLE IF EXISTS `tour_ticket_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_ticket_prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tour_id` int NOT NULL,
  `customer_type` enum('adult','child','infant') DEFAULT 'adult',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tour_id` (`tour_id`),
  CONSTRAINT `fk_tour_ticket_prices_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_ticket_prices`
--

LOCK TABLES `tour_ticket_prices` WRITE;
/*!40000 ALTER TABLE `tour_ticket_prices` DISABLE KEYS */;
INSERT INTO `tour_ticket_prices` VALUES (1,1,'child','2025-10-20','2025-10-30',1000000.00,500000.00),(2,1,'infant',NULL,NULL,NULL,200000.00),(3,2,'child','2025-09-19','2025-11-29',NULL,800000.00),(5,2,'infant','2025-09-18','2025-11-28',NULL,500000.00),(6,8,'adult',NULL,NULL,NULL,2000000.00),(7,10,'adult',NULL,NULL,NULL,1000000.00),(9,10,'infant',NULL,NULL,NULL,200000.00),(17,2,'adult','2025-09-19','2025-11-29',1500000.00,1200000.00),(19,4,'adult','2025-10-14','2025-12-14',200.00,100.00),(21,6,'adult','2025-10-01','2025-12-31',200.00,150.00),(22,7,'adult','2025-10-01','2025-12-31',120.00,102.00),(23,8,'adult','2025-11-01','2026-01-31',300.00,210.00),(24,1,'adult','2025-10-15','2025-10-29',1000000.00,900000.00),(25,10,'adult','2025-09-30','2025-10-30',2000000.00,1800000.00),(31,10,'infant','2025-10-19','2025-10-29',NULL,160000.00),(32,10,'child','2025-10-20','2025-10-30',1000000.00,800000.00),(33,5,'adult','2025-10-20','2025-10-30',2000000.00,1800000.00),(34,3,'adult','2025-10-20','2025-10-30',2000.00,2000.00),(35,3,'child','2025-10-20','2025-10-30',1000.00,1000.00),(36,5,'child','2025-10-20','2025-10-30',1500000.00,1200000.00),(37,5,'infant','2025-10-20','2025-10-30',130000.00,1000000.00);
/*!40000 ALTER TABLE `tour_ticket_prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tour_types`
--

DROP TABLE IF EXISTS `tour_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tour_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tour_types`
--

LOCK TABLES `tour_types` WRITE;
/*!40000 ALTER TABLE `tour_types` DISABLE KEYS */;
INSERT INTO `tour_types` VALUES (1,'Adventure','Các tour phiêu lưu mạo hiểm cùng huy vi vu'),(2,'Cultural','Tour khám phá văn hóa nè'),(3,'Relax','Tour nghỉ dưỡng thư giãn'),(4,'Food','Tour ẩm thực'),(5,'History','Tour lịch sử'),(7,'nghỉ dưỡng','chỉ được nghỉ dưỡng thôi');
/*!40000 ALTER TABLE `tour_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tours`
--

DROP TABLE IF EXISTS `tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tours` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `tour_type_id` int DEFAULT NULL,
  `start_location_id` int DEFAULT NULL,
  `end_location_id` int DEFAULT NULL,
  `location_id` int DEFAULT NULL,
  `description` text,
  `locations` text,
  `max_customers` int DEFAULT '0',
  `duration_days` varchar(50) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `guide_id` int DEFAULT NULL,
  `ideal_time` varchar(50) DEFAULT NULL,
  `transportation` varchar(255) DEFAULT NULL,
  `suitable_for` text,
  `point` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tour_type_id` (`tour_type_id`),
  KEY `start_location_id` (`start_location_id`),
  KEY `end_location_id` (`end_location_id`),
  KEY `guide_id` (`guide_id`),
  KEY `fk_tours_main_location` (`location_id`),
  CONSTRAINT `fk_tours_main_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tours_ibfk_1` FOREIGN KEY (`tour_type_id`) REFERENCES `tour_types` (`id`),
  CONSTRAINT `tours_ibfk_2` FOREIGN KEY (`start_location_id`) REFERENCES `locations` (`id`),
  CONSTRAINT `tours_ibfk_3` FOREIGN KEY (`end_location_id`) REFERENCES `locations` (`id`),
  CONSTRAINT `tours_ibfk_4` FOREIGN KEY (`guide_id`) REFERENCES `tour_guides` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours`
--

LOCK TABLES `tours` WRITE;
/*!40000 ALTER TABLE `tours` DISABLE KEYS */;
INSERT INTO `tours` VALUES (1,'Tour Ha Long Bay 3 Days',1,1,1,1,'Khám phá Hạ Long Bay trong 3 ngày','Vịnh Hạ Long, Vịnh Bái Tử Long , Hang Sửng Sốt',9,'3 days','2025-10-01',NULL,1,'Oct-Dec','Bus, Boat','Family, Friends',1000,'2025-10-01 23:50:53','2025-10-20 01:06:01'),(2,'Sapa Cultural Tour',2,4,2,2,'Khám phá văn hóa Sapa','Bản Cát Cát – Bản Lao Chải – Bản Tả Van, Bản Tả Phìn – Bản Sín Chải – Bản Y Linh Hồ ',14,'2 days','2025-09-19',NULL,1,'Sep-Nov','Bus','Family, Solo',1000,'2025-10-01 23:50:53','2025-10-20 14:18:11'),(3,'Da Nang Beach Holiday',3,3,3,3,'Tour nghỉ dưỡng biển Đà Nẵng 4 ngày 3 đêm','Mỹ Khê, Bãi Bụt, Bãi Yên Ngựa, Ghềnh Bàng, Bãi Đá Đen, Bán đảo Sơn Trà, Đỉnh Bàn Cờ, Ngũ Hành Sơn, Đèo Hải Vân, Suối Mơ, Suối Hoa, Suối Lương, Hồ Đồng Xanh – Đồng Nghệ, Khu sinh thái Hòa Bắc, Chùa Linh Ứng (Sơn Trà), Chùa Linh Ứng (Ngũ Hành Sơn), Cầu Rồng, Cầu sông Hàn',23,'4 days','2025-11-10',NULL,2,'Jun-Aug','Plane, Bus','Family, Couple',1500,'2025-10-01 23:50:53','2025-10-20 10:17:28'),(4,'Hanoi City Tour',2,4,4,4,'Khám phá phố cổ và di tích Hà Nội',NULL,30,'1 day','2025-10-15',NULL,3,'All year','Bus, Walking','Solo, Family',1200,'2025-10-01 23:50:53','2025-10-06 09:02:44'),(5,'Ho Chi Minh Discovery',1,5,5,5,'Khám phá Sài Gòn nhộn nhịp trong 2 ngày 1 đêm',NULL,18,'2 days','2025-12-05',NULL,4,'Nov-Mar','Bus, Motorbike','Friends, Couple',0,'2025-10-01 23:50:53','2025-10-20 18:08:54'),(6,'Nha Trang Summer Trip',3,3,3,3,'Tham quan bãi biển Nha Trang và đảo Hòn Mun tuyệt đẹp','Hòn Mun, Hòn Tằm, Bãi Dài, Chợ Đầm, Vinpearl Land',25,'3 days','2025-10-11',NULL,2,'Jun-Aug','Plane, Bus','Family, Couple',1600,'2025-10-06 08:44:50','2025-10-06 09:03:07'),(7,'Hue Ancient Discovery',2,4,4,4,'Khám phá cố đô Huế và các di tích nổi tiếng','Đại Nội, Lăng Khải Định, Chùa Thiên Mụ, Sông Hương',20,'2 days','2025-10-16',NULL,3,'All year','Bus','Couple, Family',0,'2025-10-06 08:44:50','2025-10-06 08:44:50'),(8,'Phu Quoc Island Paradise',1,5,5,5,'Khám phá đảo Phú Quốc – Thiên đường nghỉ dưỡng','Bãi Sao, Vinpearl Safari, Chợ đêm Dinh Cậu, Cáp treo Hòn Thơm',30,'4 days','2025-10-30',NULL,2,'Nov-Mar','Tàu hỏa','Cặp đôi',100,'2025-10-06 08:44:50','2025-10-18 14:50:57'),(10,'Loanh Quanh Hà Nội',1,4,4,4,'lượn lờ khắp phố phường','toàn hà nội',0,'1','2025-10-15','2025-10-19',3,'all day','Ô tô riêng','Nhóm bạn',10,'2025-10-18 19:28:17','2025-10-20 09:47:43');
/*!40000 ALTER TABLE `tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_points`
--

DROP TABLE IF EXISTS `user_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `booking_id` int DEFAULT NULL,
  `points_change` int NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `user_points_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_points_ibfk_2` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_points`
--

LOCK TABLES `user_points` WRITE;
/*!40000 ALTER TABLE `user_points` DISABLE KEYS */;
INSERT INTO `user_points` VALUES (1,1,1,50,'Đặt tour Hạ Long','2025-10-01 23:50:53'),(3,3,3,20,'Đặt tour Đà Nẵng','2025-10-01 23:50:53'),(4,4,4,40,'Hoàn thành tour Hà Nội','2025-10-01 23:50:53'),(6,1,7,12,'Đặt tour ID 1','2025-10-07 23:24:59'),(7,24,8,45000,'Đặt tour ID 1','2025-10-18 18:43:37'),(9,16,10,200000,'Đặt tour ID 2','2025-10-19 09:13:24'),(10,24,11,60000,'Đặt tour ID 2','2025-10-19 10:04:55'),(13,15,14,90000,'Đặt tour ID 1','2025-10-19 23:30:41'),(15,15,16,60000,'Đặt tour ID 2','2025-10-20 09:13:55'),(18,15,19,90000,'Đặt tour ID 10','2025-10-20 09:47:43'),(19,15,20,150,'Đặt tour ID 3','2025-10-20 10:00:09'),(24,15,25,90000,'Đặt tour ID 5','2025-10-20 10:53:34'),(25,15,26,90000,'Đặt tour ID 5','2025-10-20 10:54:46'),(32,15,33,24000,'Đặt tour ID 5','2025-10-20 18:08:54');
/*!40000 ALTER TABLE `user_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_promotions`
--

DROP TABLE IF EXISTS `user_promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `promotion_id` int DEFAULT NULL,
  `used` tinyint DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `promotion_id` (`promotion_id`),
  CONSTRAINT `user_promotions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_promotions_ibfk_2` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_promotions`
--

LOCK TABLES `user_promotions` WRITE;
/*!40000 ALTER TABLE `user_promotions` DISABLE KEYS */;
INSERT INTO `user_promotions` VALUES (1,1,1,1,'2025-10-05 17:33:58'),(2,2,2,1,'2025-10-05 17:33:58'),(3,3,3,0,'2025-10-05 17:33:58'),(4,4,4,0,'2025-10-05 17:33:58'),(5,5,5,1,'2025-10-05 17:33:58'),(6,10,1,0,'2025-10-05 17:33:58'),(7,10,1,0,'2025-10-05 17:33:58'),(8,10,1,0,'2025-10-05 17:33:58'),(9,10,2,0,'2025-10-05 17:50:08'),(10,24,1,0,'2025-10-19 11:07:30'),(11,24,2,0,'2025-10-19 11:38:55'),(12,24,5,0,'2025-10-19 11:41:05'),(13,15,1,0,'2025-10-19 13:52:51'),(14,15,2,1,'2025-10-19 13:52:54'),(15,15,5,0,'2025-10-20 14:27:44');
/*!40000 ALTER TABLE `user_promotions` ENABLE KEYS */;
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
  `phone` varchar(20) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `address` text NOT NULL,
  `role` enum('customer','admin','staff','guide') DEFAULT 'customer',
  `points` int DEFAULT '0',
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Nguyen Van A','doanhuypc2308@gmail.com','$2b$10$6FrdgPdroogzw.JYUvgg/OIB2Z1vTYI/aawNcOkk.cXanF2am89.G','0901234567','1990-05-12','okok, Phường Trần Phú, Thành phố Hà Giang, Tỉnh Hà Giang','staff',112,'/public/images/1760725529567-123763328.png','2025-10-01 23:50:52','2025-10-19 23:53:53'),(2,'Tran Thi B','b@example.com','123456','0907654321','1988-09-23','Hướng dẫn viên chuyên nghiệp','staff',170,'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e','2025-10-01 23:50:52','2025-10-19 19:41:49'),(3,'Le Van C','c@example.com','123456','0912345678','1992-03-15','Nhân viên quản lý','guide',150,'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d','2025-10-01 23:50:52','2025-10-17 12:25:41'),(4,'Pham Thi D','d@example.com','123456','0918765432','1985-12-01','Quản trị viên hệ thống','customer',300,'https://images.unsplash.com/photo-1544005313-94ddf0286df2','2025-10-01 23:50:52','2025-10-17 12:25:42'),(5,'Doãn Huy','huy@gmail.com','$2b$10$oyyBu72j3YuSjTDAoV7soePBs6FJ5CXFpocdhW4FigCPZ0WVkMa7W','0978320093','2001-07-28','ngõ 39, Phường Nhật Tân, Quận Tây Hồ, Thành phố Hà Nội','customer',90,'/public/images/1760795123430-28230884.jpg','2025-10-01 23:50:52','2025-10-18 20:45:23'),(6,'doãn huy','huy1@gmail.com','$2b$10$CDOSvNuEJNssthJ9bishCeQ6q31eaiKLJ/ciM1Uy0sc1MdRGDD446','0978320093','2004-08-21','okokok, Phường Phúc Xá, Quận Ba Đình, Thành phố Hà Nội','guide',200,'/public/images/1760853490437-770947961.jpg','2025-10-02 00:43:05','2025-10-19 12:58:10'),(10,'huy','huy2@gmail.com','$2b$10$FidmC5CZA9VyykTrONVL9O.1EWhGAV/ahzkCj/9JVEujAVM05QFiK','0978320099','2004-08-23','Hưng Yên','admin',150,'/public/images/1759342753596-718150539.JPG','2025-10-02 01:19:13','2025-10-18 00:49:00'),(12,'trần quang minh đức','duc@gmail.com','$2b$10$oSJh0g1ezTCVsIY8xzYzEOHVL.i3Qafi6Im1XigMcIiYSvtqhPb7m','098783283372','2004-06-29','Hưng Yên','staff',200,'/public/images/1760725198347-600509948.jpg','2025-10-18 01:19:58','2025-10-18 01:19:58'),(13,'huy nè','huyne@gmail.com','$2b$10$ltFck51y1yTpfMjstSbiJOjmP16Z/wnJgxNf45CxLf.uWYEmax.bW','0987788876','2025-10-01','thôn đình cao, Phường Phúc Xá, Quận Ba Đình, Thành phố Hà Nội','guide',123,'/public/images/1760726148346-521164438.jpg','2025-10-18 01:35:48','2025-10-18 01:35:48'),(14,'doãn quốc huy','huy3@gmail.com','$2b$10$2rLuEK5fIOQY6Jr/xyn9cesruUqUj6a15437.C0H1tR2U3gUqRCnG','09783282893',NULL,'xóm 1 đình cao, Phường Trúc Bạch, Quận Ba Đình, Thành phố Hà Nội','customer',0,'/public/images/avatar.jpg','2025-10-18 12:29:37','2025-10-18 12:29:37'),(15,'doãn quốc huy','doanquochuy23082004@gmail.com','$2b$10$t1mo9fEzWwTGk9MY6Q4dd.GOCCG0I2OsszbCff2SctcTgZ0Y./tf6','0978320098','2004-08-23','Xã Đình Cao, Huyện Phù Cừ, Tỉnh Hưng Yên','customer',444150,'/public/images/avatar.jpg','2025-10-18 12:33:24','2025-10-20 18:08:54'),(16,'doãn huy nè','doanhuypc2004@gmail.com','$2b$10$mcDAuXLa/D60Y//kWCDLO.qVEgYc2S67wAEFtW1Dxk5jhWcY6282y','0978329932',NULL,'số 12, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Thành phố Hà Nội','customer',200000,'/public/images/avatar.jpg','2025-10-18 13:34:54','2025-10-19 09:13:24'),(17,'tobi','huyne1@gmail.com','$2b$10$wJt.1s.UVFJ7novNEGJvO.T0rGmqjFlyHPIw.02ED6El5JrbccN2C','09876544678',NULL,'12, Phường Hàng Buồm, Quận Hoàn Kiếm, Thành phố Hà Nội','customer',0,'/public/images/avatar.jpg','2025-10-18 13:49:50','2025-10-18 13:49:50'),(24,'lương thanh binh','thanhbinh@gmail.com','$2b$10$PO2Td1PHP2F9JnzkRaMCp.QRRcUiVu11Tc0mIP/Ac0HvuueYOR78q','0978329999',NULL,'123, Xã Cương Chính, Huyện Tiên Lữ, Tỉnh Hưng Yên','customer',105000,'/public/images/avatar.jpg','2025-10-18 14:27:07','2025-10-19 10:04:55');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'apphuyvivu'
--
/*!50003 DROP PROCEDURE IF EXISTS `BookTour` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `BookTour`(
    IN p_user_id INT,
    IN p_tour_id INT,
    IN p_adults INT,
    IN p_children INT,
    IN p_infants INT,
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_notes TEXT,
    IN p_promotion_code VARCHAR(50)
)
BEGIN
    DECLARE v_max_customers INT DEFAULT 0;
    DECLARE v_total_people INT DEFAULT 0;
    DECLARE v_total_price DECIMAL(10,2) DEFAULT 0;
    DECLARE v_discount DECIMAL(5,2) DEFAULT 0;
    DECLARE v_final_price DECIMAL(10,2) DEFAULT 0;
    DECLARE v_promotion_id INT DEFAULT NULL;
    DECLARE v_booking_id INT DEFAULT 0;
    DECLARE v_points INT DEFAULT 0;

    -- Xử lý lỗi SQL
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT '❌ Có lỗi xảy ra trong quá trình đặt tour. Vui lòng thử lại.' AS message;
    END;

    START TRANSACTION;

    -- ✅ Kiểm tra đầu vào
    IF p_adults < 0 OR p_children < 0 OR p_infants < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng người không hợp lệ.';
    END IF;

    IF (p_adults + p_children + p_infants) = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Phải có ít nhất một người tham gia tour.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_user_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Người dùng không tồn tại.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM tours WHERE id = p_tour_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tour không tồn tại.';
    END IF;

    -- ✅ Tính tổng người
    SET v_total_people = p_adults + p_children;

    -- ✅ Kiểm tra chỗ trống
    SELECT max_customers INTO v_max_customers
    FROM tours
    WHERE id = p_tour_id
    FOR UPDATE;

    IF v_max_customers < v_total_people THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không đủ chỗ trống cho tour này.';
    END IF;

    -- ✅ Tính tổng giá vé (theo thời gian hiện tại)
    SET v_total_price =
        (p_adults * IFNULL((
            SELECT price FROM tour_ticket_prices
            WHERE tour_id = p_tour_id AND customer_type = 'adult'
              AND CURDATE() BETWEEN start_date AND end_date
            ORDER BY start_date DESC LIMIT 1
        ), 0))
      + (p_children * IFNULL((
            SELECT price FROM tour_ticket_prices
            WHERE tour_id = p_tour_id AND customer_type = 'child'
              AND CURDATE() BETWEEN start_date AND end_date
            ORDER BY start_date DESC LIMIT 1
        ), 0))
      + (p_infants * IFNULL((
            SELECT price FROM tour_ticket_prices
            WHERE tour_id = p_tour_id AND customer_type = 'infant'
              AND CURDATE() BETWEEN start_date AND end_date
            ORDER BY start_date DESC LIMIT 1
        ), 0));

    IF v_total_price <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không tìm thấy giá vé hợp lệ cho tour này.';
    END IF;

    SET v_final_price = v_total_price;

    -- ✅ Áp dụng mã giảm giá nếu có
    IF p_promotion_code IS NOT NULL AND p_promotion_code <> '' THEN
        SELECT id, discount INTO v_promotion_id, v_discount
        FROM promotions
        WHERE code = p_promotion_code
          AND status = 'active'
          AND CURDATE() BETWEEN start_date AND end_date
        LIMIT 1;

        IF v_promotion_id IS NULL THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mã giảm giá không hợp lệ hoặc đã hết hạn.';
        END IF;

        IF EXISTS (
            SELECT 1 FROM user_promotions 
            WHERE user_id = p_user_id 
              AND promotion_id = v_promotion_id 
              AND used = 0
        ) THEN
            SET v_final_price = v_total_price - (v_total_price * v_discount / 100);
            
            UPDATE user_promotions 
            SET used = 1
            WHERE user_id = p_user_id AND promotion_id = v_promotion_id;
        ELSE
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mã giảm giá đã được sử dụng hoặc không áp dụng cho bạn.';
        END IF;
    END IF;

    -- ✅ Tạo bản ghi đặt tour
    INSERT INTO bookings (
        user_id, tour_id, adults, children, infants, notes,
        start_date, end_date, total_price, status, booking_date
    )
    VALUES (
        p_user_id, p_tour_id, p_adults, p_children, p_infants,
        p_notes, p_start_date, p_end_date, v_final_price, 'pending', NOW()
    );

    SET v_booking_id = LAST_INSERT_ID();

    -- ✅ Giảm chỗ trống
    UPDATE tours
    SET max_customers = max_customers - v_total_people
    WHERE id = p_tour_id;

    -- ✅ Cộng điểm thưởng
    SET v_points = ROUND(v_final_price * 0.01);

    INSERT INTO user_points (user_id, booking_id, points_change, reason, created_at)
    VALUES (p_user_id, v_booking_id, v_points, CONCAT('Đặt tour ID ', p_tour_id), NOW());

    UPDATE users
    SET points = points + v_points
    WHERE id = p_user_id;

    -- ✅ Trả kết quả đặt tour (kèm mã giảm giá nếu có)
    SELECT 
        b.id AS booking_id,
        b.user_id,
        u.name AS user_name,
        t.name AS tour_name,
        b.start_date,
        b.end_date,
        b.total_price,
        b.status,
        v_points AS points_earned,
        p_promotion_code AS promotion_code,
        v_discount AS discount_percent,
        (SELECT JSON_ARRAYAGG(image) FROM image_tour WHERE tour_id = b.tour_id) AS tour_images
    FROM bookings b
    JOIN users u ON u.id = b.user_id
    JOIN tours t ON t.id = b.tour_id
    WHERE b.id = v_booking_id;

    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `DeleteBooking` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `DeleteBooking`(IN p_booking_id INT)
BEGIN
    DECLARE v_tour_id INT;
    DECLARE v_total_people INT;
    DECLARE v_user_id INT;
    DECLARE v_points INT;
    DECLARE v_status VARCHAR(20);

    -- 1. Lấy thông tin booking
    SELECT 
        tour_id, 
        (adults + children) AS total_people, 
        user_id, 
        status
    INTO 
        v_tour_id, 
        v_total_people, 
        v_user_id, 
        v_status
    FROM bookings
    WHERE id = p_booking_id
    LIMIT 1;

    -- 2. Kiểm tra tồn tại
    IF v_tour_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Booking không tồn tại.';
    END IF;

    -- 3. Kiểm tra trạng thái
    IF v_status = 'confirmed' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không thể xóa booking đã được xác nhận.';
    END IF;

    -- 4. Hoàn lại chỗ trống trong tour
    UPDATE tours
    SET max_customers = max_customers + v_total_people
    WHERE id = v_tour_id;

    -- 5. Lấy điểm thưởng (nếu có)
    SELECT points_change INTO v_points
    FROM user_points
    WHERE booking_id = p_booking_id
    LIMIT 1;

    -- 6. Nếu có điểm thưởng thì hoàn lại
    IF v_points IS NOT NULL AND v_points > 0 THEN
        UPDATE users 
        SET points = points - v_points
        WHERE id = v_user_id;

        DELETE FROM user_points 
        WHERE booking_id = p_booking_id;
    END IF;

    -- 7. Xóa booking
    DELETE FROM bookings WHERE id = p_booking_id;

    -- 8. Trả về kết quả
    SELECT 
        p_booking_id AS deleted_booking_id,
        v_user_id AS user_id,
        v_tour_id AS tour_id,
        v_total_people AS restored_customers,
        'Booking đã được xóa thành công.' AS message;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllBookings` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllBookings`()
BEGIN
    SELECT 
        b.id AS booking_id,
        b.user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.phone as user_phone,
        b.tour_id,
        t.name AS tour_name,
        t.description AS tour_description,
        b.adults,
        b.children,
        b.infants,
        b.notes,
        b.booking_date,
        b.start_date,
        b.end_date,
        b.total_price,
        b.status,

        -- ✅ Giá vé chi tiết theo loại khách (trong khoảng thời gian hiệu lực)
        JSON_OBJECT(
            'adult_price', (
                SELECT tp.price 
                FROM tour_ticket_prices tp 
                WHERE tp.tour_id = b.tour_id 
                  AND tp.customer_type = 'adult'
                ORDER BY tp.start_date DESC 
                LIMIT 1
            ),
            'child_price', (
                SELECT tp.price 
                FROM tour_ticket_prices tp 
                WHERE tp.tour_id = b.tour_id 
                  AND tp.customer_type = 'child'
                ORDER BY tp.start_date DESC 
                LIMIT 1
            ),
            'infant_price', (
                SELECT tp.price 
                FROM tour_ticket_prices tp 
                WHERE tp.tour_id = b.tour_id 
                  AND tp.customer_type = 'infant'
                ORDER BY tp.start_date DESC 
                LIMIT 1
            )
        ) AS ticket_prices,

        -- ✅ Ảnh tour
        (
            SELECT JSON_ARRAYAGG(image)
            FROM image_tour 
            WHERE tour_id = b.tour_id
        ) AS tour_images,

        -- ✅ Điểm thưởng từ booking
        (
            SELECT points_change
            FROM user_points
            WHERE booking_id = b.id
            LIMIT 1
        ) AS points_earned,

        -- ✅ Mã giảm giá đã sử dụng (nếu có)
        (
            SELECT p.code
            FROM promotions p
            INNER JOIN user_promotions up ON up.promotion_id = p.id
            WHERE up.user_id = b.user_id
              AND up.used = 1
              AND up.created_at <= b.booking_date
            ORDER BY up.created_at DESC
            LIMIT 1
        ) AS promotion_code,

        -- ✅ Phần trăm giảm (nếu có)
        (
            SELECT p.discount
            FROM promotions p
            INNER JOIN user_promotions up ON up.promotion_id = p.id
            WHERE up.user_id = b.user_id
              AND up.used = 1
              AND up.created_at <= b.booking_date
            ORDER BY up.created_at DESC
            LIMIT 1
        ) AS discount_percent

    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN tours t ON b.tour_id = t.id
    ORDER BY b.booking_date DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllCombos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllCombos`()
BEGIN
    SELECT 
        c.id AS combo_id,
        c.name AS combo_name,
        c.description,
        c.total_price AS base_price,
        c.discount,
        ROUND(c.total_price - (c.total_price * c.discount / 100), 2) AS final_price,
        c.start_date,
        c.end_date,
        c.status,
        c.created_at,

        -- Thông tin tour chính
        t.id AS tour_id,
        t.name AS tour_name,
        t.duration_days,
        t.transportation,
        t.ideal_time,
        t.suitable_for,
        t.start_date AS tour_start_date,
        t.point,
        t.locations AS tour_locations,
        t.description AS tour_description,

        -- Điểm đi và điểm đến (đã thêm)
        ls.name AS start_location_name,
        ls.city AS start_city,
        le.name AS end_location_name,
        le.city AS end_city,

        -- Ảnh tour
        (
            SELECT JSON_ARRAYAGG(image)
            FROM image_tour it
            WHERE it.tour_id = t.id
        ) AS tour_images,

        -- Danh sách dịch vụ trong combo
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'id', s.id,
        'name', s.name,
        'price', s.price
            )
        ) AS services

    FROM combos c
    JOIN tours t ON c.tour_id = t.id
    LEFT JOIN combo_items ci ON ci.combo_id = c.id
    LEFT JOIN services s ON s.id = ci.service_id
    LEFT JOIN locations ls ON t.start_location_id = ls.id
    LEFT JOIN locations le ON t.end_location_id = le.id

    GROUP BY c.id
    ORDER BY c.created_at DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getAllPromotionByUserID` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getAllPromotionByUserID`(IN id INT)
BEGIN
    SELECT 
        p.id AS promotion_id,
        p.code,
        p.description,
        p.start_date,
        p.end_date,
        p.discount,
        p.status,
        up.user_id,
        up.used,
        up.created_at AS saved_at
    FROM user_promotions AS up
    INNER JOIN promotions AS p ON p.id = up.promotion_id
    WHERE up.user_id = id
    GROUP BY p.id, p.code, p.description, p.start_date, p.end_date, p.discount, p.status, up.user_id, up.used,up.created_at
    ORDER BY up.created_at DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getAllTourByTime` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getAllTourByTime`()
BEGIN
    SELECT 
        t.*,
        tt.name AS name_type,
        sl.name AS start_location,
        el.name AS end_location,
        el.city AS city,
        g.language AS guide_languages,
        u.name AS guide_name,
        JSON_ARRAYAGG(i.image) AS images,
        ROUND(AVG(r.rating), 1) AS rating,
        (
            SELECT tp.price
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.customer_type = 'adult'
              AND CURDATE() BETWEEN tp.start_date AND tp.end_date
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS price,

        -- ✅ Giá cũ (nếu có) dành cho người lớn
        (
            SELECT tp.old_price
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.customer_type = 'adult'
              AND CURDATE() BETWEEN tp.start_date AND tp.end_date
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS oldPrice,

        (
            SELECT ROUND(((tp.old_price - tp.price) / tp.old_price) * 100, 1)
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.old_price IS NOT NULL
              AND tp.old_price > tp.price
              AND CURDATE() BETWEEN tp.start_date AND tp.end_date
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS discount,

        COUNT(r.id) AS review_count

    FROM tours t
    LEFT JOIN tour_types tt ON t.tour_type_id = tt.id
    LEFT JOIN locations sl ON t.start_location_id = sl.id
    LEFT JOIN locations el ON t.end_location_id = el.id
    LEFT JOIN tour_guides g ON t.guide_id = g.id
    LEFT JOIN users u ON g.user_id = u.id
    LEFT JOIN image_tour i ON i.tour_id = t.id
    LEFT JOIN reviews r ON r.tour_id = t.id

    -- ✅ Chỉ lấy tour sắp diễn ra và có giảm giá hiện hành
    WHERE 
        t.start_date > CURDATE()
        AND EXISTS (
            SELECT 1
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.old_price IS NOT NULL
              AND tp.old_price > tp.price
              AND CURDATE() BETWEEN tp.start_date AND tp.end_date
        )

    GROUP BY t.id
    ORDER BY t.start_date ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getAllTourFavorite` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getAllTourFavorite`(IN p_user_id INT)
BEGIN
    SELECT 
        t.*,
        tt.name AS name_type,
        sl.name AS start_location,
        el.name AS end_location,
        el.city AS city,
        g.language AS guide_languages,
        u.name AS guide_name,
        JSON_ARRAYAGG(i.image) AS images,
        ROUND(AVG(r.rating), 1) AS rating,

        (
            SELECT tp.price
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.customer_type = 'adult'
              AND CURDATE() BETWEEN tp.start_date AND tp.end_date
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS price,

        (
            SELECT tp.old_price
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.customer_type = 'adult'
              AND CURDATE() BETWEEN tp.start_date AND tp.end_date
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS oldPrice,

        (
            SELECT ROUND(((tp.old_price - tp.price) / tp.old_price) * 100, 1)
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.old_price IS NOT NULL
              AND tp.old_price > tp.price
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS discount,

        COUNT(r.id) AS review_count,
        MAX(f.created_at) AS favorite_date,
        f.id AS id_favorite

    FROM favorite_tours f
    INNER JOIN tours t ON f.tour_id = t.id
    LEFT JOIN tour_types tt ON t.tour_type_id = tt.id
    LEFT JOIN locations sl ON t.start_location_id = sl.id
    LEFT JOIN locations el ON t.end_location_id = el.id
    LEFT JOIN tour_guides g ON t.guide_id = g.id
    LEFT JOIN users u ON g.user_id = u.id
    LEFT JOIN image_tour i ON i.tour_id = t.id
    LEFT JOIN reviews r ON r.tour_id = t.id
    WHERE f.user_id = p_user_id
    GROUP BY t.id, f.id
    ORDER BY favorite_date DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetAllTours` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetAllTours`()
BEGIN
    SELECT 
        t.*,
        tt.name AS name_type,
        sl.name AS start_location,
        el.name AS end_location,
        el.city AS city,
        g.language AS guide_languages,
        u.name AS guide_name,
        JSON_ARRAYAGG(i.image) AS images,
        ROUND(AVG(r.rating), 1) AS rating,
        (
            SELECT tp.price
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.customer_type = 'adult'
              AND CURDATE() BETWEEN tp.start_date AND tp.end_date
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS price,

        -- ✅ Giá cũ (nếu có) dành cho người lớn
        (
            SELECT tp.old_price
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.customer_type = 'adult'
              AND CURDATE() BETWEEN tp.start_date AND tp.end_date
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS oldPrice,

        (
            SELECT ROUND(((tp.old_price - tp.price) / tp.old_price) * 100, 1)
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.old_price IS NOT NULL
              AND tp.old_price > tp.price
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS discount,

        COUNT(r.id) AS review_count

    FROM tours t
    LEFT JOIN tour_types tt ON t.tour_type_id = tt.id
    LEFT JOIN locations sl ON t.start_location_id = sl.id
    LEFT JOIN locations el ON t.end_location_id = el.id
    LEFT JOIN tour_guides g ON t.guide_id = g.id
    LEFT JOIN users u ON g.user_id = u.id
    LEFT JOIN image_tour i ON i.tour_id = t.id
    LEFT JOIN reviews r ON r.tour_id = t.id

    GROUP BY t.id
    ORDER BY t.start_date ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBookingsByDateRange` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBookingsByDateRange`(IN p_start_date DATE, IN p_end_date DATE)
BEGIN
    SELECT 
        b.id AS booking_id,
        b.user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.phone as user_phone,
        b.tour_id,
        t.name AS tour_name,
        t.description AS tour_description,
        b.adults,
        b.children,
        b.infants,
        b.notes,
        b.booking_date,
        b.start_date,
        b.end_date,
        b.total_price,
        b.status,
        JSON_OBJECT(
            'adult_price', (SELECT price FROM ticket_prices WHERE tour_id = b.tour_id AND customer_type = 'adult' LIMIT 1),
            'child_price', (SELECT price FROM ticket_prices WHERE tour_id = b.tour_id AND customer_type = 'child' LIMIT 1),
            'infant_price', (SELECT price FROM ticket_prices WHERE tour_id = b.tour_id AND customer_type = 'infant' LIMIT 1)
        ) AS ticket_prices,
        (SELECT JSON_ARRAYAGG(image) FROM image_tour WHERE tour_id = b.tour_id) AS tour_images,
        (SELECT points_change FROM user_points WHERE booking_id = b.id LIMIT 1) AS points_earned
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN tours t ON b.tour_id = t.id
    WHERE b.booking_date BETWEEN p_start_date AND p_end_date
    ORDER BY b.booking_date DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBookingsByTourId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBookingsByTourId`(IN p_tour_id INT)
BEGIN
    SELECT 
        b.id AS booking_id,
        b.user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.phone as user_phone,
        b.tour_id,
        t.name AS tour_name,
        t.description AS tour_description,
        b.adults,
        b.children,
        b.infants,
        b.notes,
        b.booking_date,
        b.start_date,
        b.end_date,
        b.total_price,
        b.status,
        JSON_OBJECT(
            'adult_price', (SELECT price FROM ticket_prices WHERE tour_id = b.tour_id AND customer_type = 'adult' LIMIT 1),
            'child_price', (SELECT price FROM ticket_prices WHERE tour_id = b.tour_id AND customer_type = 'child' LIMIT 1),
            'infant_price', (SELECT price FROM ticket_prices WHERE tour_id = b.tour_id AND customer_type = 'infant' LIMIT 1)
        ) AS ticket_prices,
        (SELECT JSON_ARRAYAGG(image) FROM image_tour WHERE tour_id = b.tour_id) AS tour_images,
        (SELECT points_change FROM user_points WHERE booking_id = b.id LIMIT 1) AS points_earned
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN tours t ON b.tour_id = t.id
    WHERE b.tour_id = p_tour_id
    ORDER BY b.booking_date DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `GetBookingsByUserId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetBookingsByUserId`(IN p_user_id INT)
BEGIN
    SELECT 
        b.id AS booking_id,
        b.user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.phone as user_phone,
        b.tour_id,
        t.name AS tour_name,
        t.description AS tour_description,
        b.adults,
        b.children,
        b.infants,
        b.notes,
        b.booking_date,
        b.start_date,
        b.end_date,
        b.total_price,
        b.status,

        -- ✅ Giá vé theo loại khách, tính theo ngày bắt đầu tour
        JSON_OBJECT(
            'adult_price', (
                SELECT tp.price 
                FROM tour_ticket_prices tp 
                WHERE tp.tour_id = b.tour_id 
                  AND tp.customer_type = 'adult'
                  AND (b.start_date BETWEEN tp.start_date AND tp.end_date)
                ORDER BY tp.start_date DESC 
                LIMIT 1
            ),
            'child_price', (
                SELECT tp.price 
                FROM tour_ticket_prices tp 
                WHERE tp.tour_id = b.tour_id 
                  AND tp.customer_type = 'child'
                  AND (b.start_date BETWEEN tp.start_date AND tp.end_date)
                ORDER BY tp.start_date DESC 
                LIMIT 1
            ),
            'infant_price', (
                SELECT tp.price 
                FROM tour_ticket_prices tp 
                WHERE tp.tour_id = b.tour_id 
                  AND tp.customer_type = 'infant'
                  AND (b.start_date BETWEEN tp.start_date AND tp.end_date)
                ORDER BY tp.start_date DESC 
                LIMIT 1
            )
        ) AS ticket_prices,

        -- ✅ Ảnh tour
        (
            SELECT JSON_ARRAYAGG(image) 
            FROM image_tour 
            WHERE tour_id = b.tour_id
        ) AS tour_images,

        -- ✅ Điểm thưởng của booking
        (
            SELECT points_change 
            FROM user_points 
            WHERE booking_id = b.id 
            LIMIT 1
        ) AS points_earned,

        -- ✅ Mã giảm giá đã sử dụng (nếu có)
        (
            SELECT p.code 
            FROM promotions p
            INNER JOIN user_promotions up ON up.promotion_id = p.id
            WHERE up.user_id = b.user_id
              AND up.used = 1
              AND up.created_at <= b.booking_date
            ORDER BY up.created_at DESC
            LIMIT 1
        ) AS promotion_code,

        -- ✅ Phần trăm giảm (nếu có)
        (
            SELECT p.discount 
            FROM promotions p
            INNER JOIN user_promotions up ON up.promotion_id = p.id
            WHERE up.user_id = b.user_id
              AND up.used = 1
              AND up.created_at <= b.booking_date
            ORDER BY up.created_at DESC
            LIMIT 1
        ) AS discount_percent

    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN tours t ON b.tour_id = t.id
    WHERE b.user_id = p_user_id
    ORDER BY b.booking_date DESC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getTourById` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getTourById`(IN id INT)
BEGIN
    SELECT 
        t.*,
        tt.name AS name_type,
        sl.name AS start_location,
        el.name AS end_location,
        el.city AS city,
        g.language AS guide_languages,
        u.name AS guide_name,
        JSON_ARRAYAGG(i.image) AS images,
        ROUND(AVG(r.rating), 1) AS rating,
        (
            SELECT tp.price
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.customer_type = 'adult'
              AND CURDATE() BETWEEN tp.start_date AND tp.end_date
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS price,

        -- ✅ Giá cũ (nếu có) dành cho người lớn
        (
            SELECT tp.old_price
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.customer_type = 'adult'
              AND CURDATE() BETWEEN tp.start_date AND tp.end_date
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS oldPrice,

        (
            SELECT ROUND(((tp.old_price - tp.price) / tp.old_price) * 100, 1)
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.old_price IS NOT NULL
              AND tp.old_price > tp.price
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS discount,

        COUNT(r.id) AS review_count

    FROM tours t
    LEFT JOIN tour_types tt ON t.tour_type_id = tt.id
    LEFT JOIN locations sl ON t.start_location_id = sl.id
    LEFT JOIN locations el ON t.end_location_id = el.id
    LEFT JOIN tour_guides g ON t.guide_id = g.id
    LEFT JOIN users u ON g.user_id = u.id
    LEFT JOIN image_tour i ON i.tour_id = t.id
    LEFT JOIN reviews r ON r.tour_id = t.id
    WHERE t.id = id
    GROUP BY t.id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getToursByTransportation` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getToursByTransportation`(IN keyWords VARCHAR(255))
BEGIN
    SELECT
        t.*,
        tt.name AS name_type,
        sl.name AS start_location,
        el.name AS end_location,
        el.city AS city,
        g.language AS guide_languages,
        u.name AS guide_name,
        JSON_ARRAYAGG(i.image) AS images,
        ROUND(AVG(r.rating), 1) AS rating,
        (
            SELECT tp.price
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.customer_type = 'adult'
              AND CURDATE() BETWEEN tp.start_date AND tp.end_date
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS price,

        -- ✅ Giá cũ (nếu có) dành cho người lớn
        (
            SELECT tp.old_price
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.customer_type = 'adult'
              AND CURDATE() BETWEEN tp.start_date AND tp.end_date
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS oldPrice,

        (
            SELECT (tp.old_price - tp.price)
            FROM tour_ticket_prices tp
            WHERE tp.tour_id = t.id
              AND tp.old_price IS NOT NULL
              AND tp.old_price > tp.price
              AND (CURDATE() BETWEEN tp.start_date AND tp.end_date)
            ORDER BY tp.start_date DESC
            LIMIT 1
        ) AS discount_amount,

        COUNT(r.id) AS review_count

    FROM tours t
    LEFT JOIN tour_types tt ON t.tour_type_id = tt.id
    LEFT JOIN locations sl ON t.start_location_id = sl.id
    LEFT JOIN locations el ON t.end_location_id = el.id
    LEFT JOIN tour_guides g ON t.guide_id = g.id
    LEFT JOIN users u ON g.user_id = u.id
    LEFT JOIN image_tour i ON i.tour_id = t.id
    LEFT JOIN reviews r ON r.tour_id = t.id

    WHERE t.transportation LIKE CONCAT('%', keyWords, '%')

    GROUP BY t.id
    ORDER BY t.start_date ASC;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `UpdateBooking` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `UpdateBooking`(
    IN p_booking_id INT,
    IN p_adults INT,
    IN p_children INT,
    IN p_infants INT,
    IN p_notes TEXT,
    IN p_status VARCHAR(20), -- ✅ Sửa ENUM -> VARCHAR
    IN p_promotion_code VARCHAR(50)
)
BEGIN
    DECLARE v_tour_id INT;
    DECLARE v_user_id INT;
    DECLARE v_current_adults INT;
    DECLARE v_current_children INT;
    DECLARE v_current_status VARCHAR(20); -- ✅ Sửa ENUM -> VARCHAR
    DECLARE v_total_people INT;
    DECLARE v_old_total_people INT;
    DECLARE v_max_customers INT;
    DECLARE v_total_price DECIMAL(10,2);
    DECLARE v_old_total_price DECIMAL(10,2);
    DECLARE v_discount DECIMAL(5,2);
    DECLARE v_final_price DECIMAL(10,2);
    DECLARE v_promotion_id INT;
    DECLARE v_points INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT '❌ Có lỗi xảy ra trong quá trình cập nhật booking. Vui lòng thử lại.' AS message;
    END;

    START TRANSACTION;

    -- ✅ Lấy thông tin booking (thêm LIMIT 1)
    SELECT tour_id, user_id, adults, children, status, total_price 
    INTO v_tour_id, v_user_id, v_current_adults, v_current_children, v_current_status, v_old_total_price
    FROM bookings 
    WHERE id = p_booking_id
    LIMIT 1;

    IF v_tour_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Booking không tồn tại.';
    END IF;

    IF v_current_status = 'canceled' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không thể cập nhật booking đã bị hủy.';
    END IF;

    -- ✅ Tổng số người
    SET v_total_people = p_adults + p_children;
    SET v_old_total_people = v_current_adults + v_current_children;

    -- ✅ Kiểm tra chỗ trống
    SELECT max_customers INTO v_max_customers
    FROM tours
    WHERE id = v_tour_id
    FOR UPDATE;

    IF v_max_customers < (v_total_people - v_old_total_people) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không đủ chỗ trống để cập nhật số lượng khách.';
    END IF;

    -- ✅ Tính giá mới
    SET v_total_price =
        (p_adults * IFNULL((
            SELECT price FROM tour_ticket_prices 
            WHERE tour_id = v_tour_id AND customer_type = 'adult'
              AND CURDATE() BETWEEN start_date AND end_date
            ORDER BY start_date DESC LIMIT 1
        ), 0))
      + (p_children * IFNULL((
            SELECT price FROM tour_ticket_prices 
            WHERE tour_id = v_tour_id AND customer_type = 'child'
              AND CURDATE() BETWEEN start_date AND end_date
            ORDER BY start_date DESC LIMIT 1
        ), 0))
      + (p_infants * IFNULL((
            SELECT price FROM tour_ticket_prices 
            WHERE tour_id = v_tour_id AND customer_type = 'infant'
              AND CURDATE() BETWEEN start_date AND end_date
            ORDER BY start_date DESC LIMIT 1
        ), 0));

    IF v_total_price <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Không tìm thấy giá vé hợp lệ cho tour này.';
    END IF;

    SET v_final_price = v_total_price;

    -- ✅ Áp dụng mã khuyến mãi
    IF p_promotion_code IS NOT NULL AND p_promotion_code <> '' THEN
        SELECT id, discount INTO v_promotion_id, v_discount
        FROM promotions
        WHERE code = p_promotion_code 
          AND status = 'active'
          AND CURDATE() BETWEEN start_date AND end_date
        LIMIT 1;

        IF v_promotion_id IS NOT NULL AND 
           EXISTS (SELECT 1 FROM user_promotions WHERE user_id = v_user_id AND promotion_id = v_promotion_id AND used = 0) THEN
            SET v_final_price = v_total_price - (v_total_price * v_discount / 100);
            UPDATE user_promotions 
            SET used = 1 
            WHERE user_id = v_user_id AND promotion_id = v_promotion_id;
        ELSE
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Mã giảm giá không hợp lệ hoặc đã sử dụng.';
        END IF;
    END IF;

    -- ✅ Cập nhật booking
    UPDATE bookings
    SET 
        adults = p_adults,
        children = p_children,
        infants = p_infants,
        notes = p_notes,
        total_price = v_final_price,
        status = p_status
    WHERE id = p_booking_id;

    COMMIT;

    -- ✅ Trả về booking
    SELECT 
        b.id AS booking_id,
        b.user_id,
        u.name AS user_name,
        b.total_price,
        b.status,
        (SELECT points_change FROM user_points WHERE booking_id = b.id LIMIT 1) AS points_earned
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    WHERE b.id = p_booking_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-20 23:19:07
