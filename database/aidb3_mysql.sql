-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.3.0 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for aidb3
CREATE DATABASE IF NOT EXISTS `aidb3` /*!40100 DEFAULT CHARACTER SET armscii8 COLLATE armscii8_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aidb3`;

-- Dumping structure for table aidb3.employee
CREATE TABLE IF NOT EXISTS `employee` (
  `employeeid` varchar(50) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  `employeename` varchar(50) CHARACTER SET armscii8 COLLATE armscii8_bin DEFAULT NULL,
  `employeesurname` varchar(50) CHARACTER SET armscii8 COLLATE armscii8_bin DEFAULT NULL,
  `remarks` varchar(250) CHARACTER SET armscii8 COLLATE armscii8_bin DEFAULT NULL,
  PRIMARY KEY (`employeeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep employee information';

-- Dumping data for table aidb3.employee: ~6 rows (approximately)
INSERT INTO `employee` (`employeeid`, `employeename`, `employeesurname`, `remarks`) VALUES
	('BILL', 'Bill', 'Gates', NULL),
	('ELON', 'Elon', 'Musk', NULL),
	('JACK', 'Jack', 'Ma', NULL),
	('JEFF', 'Jeff', 'Bezos', NULL),
	('MARK', 'Mark', 'Zuckerberg', NULL),
	('STEVE', 'Steve', 'Jobs', NULL);

-- Dumping structure for table aidb3.employee_leave_quota
CREATE TABLE IF NOT EXISTS `employee_leave_quota` (
  `employeeid` varchar(50) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL COMMENT 'employee.employeeid',
  `leavetype` varchar(50) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL COMMENT 'employee_leave_type.leavetype',
  `leaveqouta` int NOT NULL,
  `leaveused` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`employeeid`,`leavetype`),
  CONSTRAINT `FK_employee_leave_quota_employee` FOREIGN KEY (`employeeid`) REFERENCES `employee` (`employeeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep employee leave qouta';

-- Dumping data for table aidb3.employee_leave_quota: ~24 rows (approximately)
INSERT INTO `employee_leave_quota` (`employeeid`, `leavetype`, `leaveqouta`, `leaveused`) VALUES
	('BILL', 'BUSINESS', 30, 10),
	('BILL', 'GENERAL', 30, 15),
	('BILL', 'SICK', 30, 5),
	('BILL', 'VACATION', 30, 0),
	('ELON', 'BUSINESS', 35, 15),
	('ELON', 'GENERAL', 35, 0),
	('ELON', 'SICK', 35, 0),
	('ELON', 'VACATION', 35, 5),
	('JACK', 'BUSINESS', 30, 0),
	('JACK', 'GENERAL', 30, 5),
	('JACK', 'SICK', 30, 5),
	('JACK', 'VACATION', 30, 0),
	('JEFF', 'BUSINESS', 35, 0),
	('JEFF', 'GENERAL', 35, 0),
	('JEFF', 'SICK', 35, 0),
	('JEFF', 'VACATION', 35, 0),
	('MARK', 'BUSINESS', 30, 0),
	('MARK', 'GENERAL', 30, 0),
	('MARK', 'SICK', 30, 0),
	('MARK', 'VACATION', 30, 0),
	('STEVE', 'BUSINESS', 35, 0),
	('STEVE', 'GENERAL', 35, 0),
	('STEVE', 'SICK', 35, 0),
	('STEVE', 'VACATION', 35, 0);

-- Dumping structure for table aidb3.employee_leave_type
CREATE TABLE IF NOT EXISTS `employee_leave_type` (
  `leavetype` varchar(50) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  `leavetypename` varchar(50) CHARACTER SET armscii8 COLLATE armscii8_bin NOT NULL,
  PRIMARY KEY (`leavetype`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep employee leave type information';

-- Dumping data for table aidb3.employee_leave_type: ~4 rows (approximately)
INSERT INTO `employee_leave_type` (`leavetype`, `leavetypename`) VALUES
	('BUSINESS', 'Business'),
	('GENERAL', 'General'),
	('SICK', 'Sick'),
	('VACATION', 'Vacation');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
