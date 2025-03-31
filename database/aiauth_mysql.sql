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


-- Dumping database structure for aiauth
CREATE DATABASE IF NOT EXISTS `aiauth` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aiauth`;

-- Dumping structure for table aiauth.tactivate
CREATE TABLE IF NOT EXISTS `tactivate` (
  `activatekey` varchar(100) NOT NULL,
  `activateuser` varchar(100) NOT NULL,
  `transtime` bigint DEFAULT NULL,
  `expiretime` bigint DEFAULT NULL,
  `senddate` date DEFAULT NULL,
  `sendtime` time DEFAULT NULL,
  `expiredate` date DEFAULT NULL,
  `activatedate` date DEFAULT NULL,
  `activatetime` time DEFAULT NULL,
  `activatecount` int DEFAULT NULL,
  `activatetimes` int DEFAULT NULL,
  `activatestatus` varchar(1) DEFAULT NULL,
  `activatecategory` varchar(50) DEFAULT NULL,
  `activatelink` varchar(200) DEFAULT NULL,
  `activatepage` varchar(200) DEFAULT NULL,
  `activateremark` varchar(200) DEFAULT NULL,
  `activateparameter` varchar(200) DEFAULT NULL,
  `activatemessage` varchar(200) DEFAULT NULL,
  `activatecontents` mediumtext,
  PRIMARY KEY (`activatekey`,`activateuser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep activate info';

-- Dumping data for table aiauth.tactivate: ~0 rows (approximately)

-- Dumping structure for table aiauth.tactivatehistory
CREATE TABLE IF NOT EXISTS `tactivatehistory` (
  `activatekey` varchar(100) NOT NULL,
  `activateuser` varchar(100) NOT NULL,
  `transtime` bigint DEFAULT NULL,
  `expiretime` bigint DEFAULT NULL,
  `senddate` date DEFAULT NULL,
  `sendtime` time DEFAULT NULL,
  `expiredate` date DEFAULT NULL,
  `activatedate` date DEFAULT NULL,
  `activatetime` time DEFAULT NULL,
  `activatecount` int DEFAULT NULL,
  `activatetimes` int DEFAULT NULL,
  `activatestatus` varchar(1) DEFAULT NULL,
  `activatecategory` varchar(50) DEFAULT NULL,
  `activatelink` varchar(200) DEFAULT NULL,
  `activatepage` varchar(200) DEFAULT NULL,
  `activateremark` varchar(200) DEFAULT NULL,
  `activateparameter` varchar(200) DEFAULT NULL,
  `activatemessage` varchar(200) DEFAULT NULL,
  `activatecontents` mediumtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep activate history';

-- Dumping data for table aiauth.tactivatehistory: ~0 rows (approximately)

-- Dumping structure for table aiauth.tcaptcha
CREATE TABLE IF NOT EXISTS `tcaptcha` (
  `capid` varchar(50) NOT NULL,
  `captext` varchar(50) NOT NULL,
  `capanswer` varchar(50) NOT NULL,
  `createdate` date NOT NULL,
  `createtime` time NOT NULL,
  `createmillis` bigint NOT NULL DEFAULT '0',
  `expiretimes` bigint NOT NULL DEFAULT '0',
  `expiredate` date DEFAULT NULL,
  `expiretime` time DEFAULT NULL,
  PRIMARY KEY (`capid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table aiauth.tcaptcha: ~0 rows (approximately)

-- Dumping structure for table aiauth.tconfig
CREATE TABLE IF NOT EXISTS `tconfig` (
  `category` varchar(50) NOT NULL,
  `colname` varchar(50) NOT NULL,
  `colvalue` varchar(250) DEFAULT NULL,
  `colflag` varchar(1) DEFAULT NULL COMMENT 'G=Global Config',
  `seqno` int DEFAULT '0',
  `remarks` text,
  PRIMARY KEY (`category`,`colname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='keep program custom configuration';

-- Dumping data for table aiauth.tconfig: ~17 rows (approximately)
INSERT INTO `tconfig` (`category`, `colname`, `colvalue`, `colflag`, `seqno`, `remarks`) VALUES
	('2FA', 'FACTORISSUER', 'AssureSystem', NULL, 0, NULL),
	('2FA', 'FACTORVERIFY', 'false', NULL, 0, NULL),
	('CONFIGMAIL', 'MAIL_FROM', 'ezprompt@gmail.com', NULL, 0, NULL),
	('CONFIGMAIL', 'MAIL_PASSWORD', 'nzazlorszucrhrbb', NULL, 0, NULL),
	('CONFIGMAIL', 'MAIL_PORT', '465', NULL, 0, NULL),
	('CONFIGMAIL', 'MAIL_SERVER', 'smtp.gmail.com', NULL, 0, NULL),
	('CONFIGMAIL', 'MAIL_TITLE', 'System Management', NULL, 0, NULL),
	('CONFIGMAIL', 'MAIL_TO', 'tassan_oro@freewillsolutions.com', NULL, 0, NULL),
	('CONFIGMAIL', 'MAIL_USER', 'ezprompt', NULL, 0, NULL),
	('CONFIGURATION', 'ACTIVATE_URL', 'http://localhost:8080/control', NULL, 0, NULL),
	('CONFIGURATION', 'APPROVE_URL', 'http://localhost:8080/control', NULL, 0, NULL),
	('ENVIRONMENT', 'EXPIRE_TIMES', '2880000', NULL, 0, 'values in milliseconds'),
	('FORGOTPASSWORDMAIL', 'MAIL_FROM', 'ezprompt@gmail.com', NULL, 0, NULL),
	('FORGOTPASSWORDMAIL', 'MAIL_PASSWORD', 'nzazlorszucrhrbb', NULL, 0, NULL),
	('FORGOTPASSWORDMAIL', 'MAIL_SERVER', 'smtp.gmail.com', NULL, 0, NULL),
	('FORGOTPASSWORDMAIL', 'MAIL_TITLE', 'System Management', NULL, 0, NULL),
	('FORGOTPASSWORDMAIL', 'MAIL_USER', 'ezprompt', NULL, 0, NULL);

-- Dumping structure for table aiauth.tconstant
CREATE TABLE IF NOT EXISTS `tconstant` (
  `typename` varchar(50) NOT NULL,
  `typeid` varchar(50) NOT NULL,
  `nameen` varchar(100) NOT NULL,
  `nameth` varchar(100) NOT NULL,
  `seqno` int DEFAULT NULL,
  `iconfile` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`typename`,`typeid`)
) ENGINE=InnoDB DEFAULT CHARSET=tis620 COMMENT='table keep constant/category description';

-- Dumping data for table aiauth.tconstant: ~68 rows (approximately)
INSERT INTO `tconstant` (`typename`, `typeid`, `nameen`, `nameth`, `seqno`, `iconfile`) VALUES
	('tactive', '0', 'Active', 'ใช้งาน', 1, NULL),
	('tactive', '1', 'Inactive', 'ไม่ใช้งาน', 2, NULL),
	('tappstype', 'M', 'Mobile', 'Mobile', 2, NULL),
	('tappstype', 'W', 'Web', 'Web', 1, NULL),
	('tbranchtype', 'HB', 'Head Branch', 'สำนักงานใหญ่', 1, NULL),
	('tbranchtype', 'SB', 'Sub Branch', 'สำนักงานสาขาย่อย', 2, NULL),
	('tbranchtype', 'VB', 'Service Branch', 'สำนักงานบริการ', 3, NULL),
	('tdomainappstype', 'S', 'Single Page Application', 'Single Page Application', 2, NULL),
	('tdomainappstype', 'W', 'WEB', 'WEB', 1, NULL),
	('tdomaintype', 'B', 'B2C', 'B2C', 2, NULL),
	('tdomaintype', 'D', 'Directory', 'Directory', 1, NULL),
	('tdomaintype', 'S', 'SAML', 'SAML', 3, NULL),
	('texpire', '0', 'Expired', 'หมดอายุ', 1, NULL),
	('texpire', '1', 'Never Expired', 'ไม่หมดอายุ', 2, NULL),
	('tgroupmobile', 'DASHBOARD', 'Dash Board', 'Dash Board', 1, 'dashboard.png'),
	('tgroupmobile', 'HISTORY', 'History', 'History', 2, 'history.png'),
	('tgroupmobile', 'REPORT', 'Report', 'Report', 3, 'report.png'),
	('tgroupmobile', 'WORKLIST', 'Work List', 'Work List', 4, 'worklist.png'),
	('tlanguage', 'EN', 'English', 'อังกฤษ', 1, 'EN.png'),
	('tlanguage', 'TH', 'Thai', 'ไทย', 2, 'TH.png'),
	('tpermit', 'all', 'Alls', 'ทั้งหมด', 7, NULL),
	('tpermit', 'delete', 'Delete', 'ลบ', 3, NULL),
	('tpermit', 'export', 'Export', 'นำออก', 6, NULL),
	('tpermit', 'import', 'Import', 'นำเข้า', 5, NULL),
	('tpermit', 'insert', 'Insert', 'เพิ่ม', 1, NULL),
	('tpermit', 'print', 'Print', 'พิมพ์', 8, NULL),
	('tpermit', 'retrieve', 'Retrieve', 'ค้นหา', 4, NULL),
	('tpermit', 'update', 'Update', 'แก้ไข', 2, NULL),
	('tprogsystem', 'A', 'Admin', 'Admin', 1, NULL),
	('tprogsystem', 'F', 'Reference', 'Reference', 2, NULL),
	('tprogtype', 'C', 'Script', 'สคริปส์', 11, NULL),
	('tprogtype', 'E', 'Entry', 'กรอกข้อมูล', 1, NULL),
	('tprogtype', 'F', 'Reference', 'ข้อมูลหลัก', 2, NULL),
	('tprogtype', 'G', 'Generate', 'สร้างหน้าจอ', 13, NULL),
	('tprogtype', 'I', 'Plugin', 'ปลั๊กอิน', 3, NULL),
	('tprogtype', 'M', 'Import', 'นำเข้าข้อมูล', 5, NULL),
	('tprogtype', 'N', 'Internal', 'ใช้ภายใน', 4, NULL),
	('tprogtype', 'O', 'Store Procedure', 'โปรซีเดอร์', 12, NULL),
	('tprogtype', 'P', 'Post', 'โพส', 7, NULL),
	('tprogtype', 'Q', 'Enquiry', 'ค้นหาข้อมูล', 8, NULL),
	('tprogtype', 'R', 'Report', 'รายงาน', 9, NULL),
	('tprogtype', 'U', 'Utility', 'เครื่องมือ', 10, NULL),
	('tprogtype', 'X', 'Export', 'นำออกข้อมูล', 6, NULL),
	('trxstatus', 'C', 'Completed', 'Completed', 1, NULL),
	('trxstatus', 'E', 'Error', 'Error', 3, NULL),
	('trxstatus', 'N', 'Not Complete', 'Not Complete', 2, NULL),
	('trxstatus', 'R', 'Response', 'Response', 4, NULL),
	('tsystemtype', 'A', 'Android', 'Android', 1, NULL),
	('tsystemtype', 'I', 'iOS', 'iOS', 2, NULL),
	('tsystemtype', 'W', 'Web', 'Web', 3, NULL),
	('tuserstatus', 'A', 'Activated', 'ใช้งาน', 1, NULL),
	('tuserstatus', 'C', 'Closed', 'ปิดการใช้งาน', 2, NULL),
	('tuserstatus', 'P', 'Pending', 'ระงับการใช้งาน', 3, NULL),
	('tusertype', 'A', 'Admin', 'เจ้าหน้าที่บริหาร', 30, NULL),
	('tusertype', 'C', 'Super Coach', 'เจ้าหน้าที่ระดับสูง', 50, NULL),
	('tusertype', 'D', 'Director', 'ผู้อำนวยการ', 70, NULL),
	('tusertype', 'E', 'Employee', 'พนักงาน', 10, NULL),
	('tusertype', 'M', 'Manager', 'ผู้จัดการ', 40, NULL),
	('tusertype', 'O', 'Operator', 'เจ้าหน้าที่ปฏิบัติการ', 15, NULL),
	('tusertype', 'P', 'President', 'ประธาน', 90, NULL),
	('tusertype', 'Q', 'Quality Assure', 'ผู้ตรวจสอบ', 25, NULL),
	('tusertype', 'S', 'Supervisor', 'ผู้ควบคุมดูแล', 20, NULL),
	('tusertype', 'T', 'Assistance Manager', 'ผู้ช่วยผู้จัดการ', 35, NULL),
	('tusertype', 'V', 'Vice President', 'รองประธาน', 80, NULL),
	('tusertype', 'X', 'Executive', 'ผู้บริหาร', 60, NULL),
	('tusertype', 'Z', 'Client', 'ลูกค้า', 5, NULL),
	('tvisible', '0', 'Visible', 'มองเห็น', 1, NULL),
	('tvisible', '1', 'Invisible', 'มองไม่เห็น', 2, NULL);

-- Dumping structure for table aiauth.tcpwd
CREATE TABLE IF NOT EXISTS `tcpwd` (
  `userid` varchar(60) NOT NULL,
  `category` varchar(50) NOT NULL,
  `contents` varchar(150) NOT NULL,
  PRIMARY KEY (`userid`,`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table category of password policy';

-- Dumping data for table aiauth.tcpwd: ~0 rows (approximately)

-- Dumping structure for table aiauth.tdirectory
CREATE TABLE IF NOT EXISTS `tdirectory` (
  `domainid` varchar(50) NOT NULL,
  `domainname` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `applicationid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `tenanturl` varchar(200) NOT NULL,
  `basedn` varchar(200) DEFAULT NULL,
  `secretkey` varchar(50) DEFAULT NULL,
  `systemtype` varchar(1) NOT NULL DEFAULT 'W' COMMENT 'W=Web,I=iOS,A=Android',
  `appstype` varchar(1) NOT NULL DEFAULT 'W' COMMENT 'W=Web,S=SPA',
  `domaintype` varchar(1) NOT NULL DEFAULT 'S' COMMENT 'S=SAML,B=B2C,D=DIRECTORY',
  `domainurl` varchar(200) DEFAULT NULL,
  `inactive` varchar(1) NOT NULL DEFAULT '0' COMMENT '1=Inactive',
  `invisible` varchar(1) NOT NULL DEFAULT '0' COMMENT '1=Invisible',
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`domainid`),
  KEY `domainname` (`domainname`),
  KEY `applicationid` (`applicationid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep active directory information';

-- Dumping data for table aiauth.tdirectory: ~0 rows (approximately)

-- Dumping structure for table aiauth.tfavor
CREATE TABLE IF NOT EXISTS `tfavor` (
  `userid` varchar(60) NOT NULL COMMENT 'tuser.userid',
  `programid` varchar(20) NOT NULL COMMENT 'tprog.programid',
  `seqno` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`userid`,`programid`,`seqno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user favorite menu';

-- Dumping data for table aiauth.tfavor: ~0 rows (approximately)

-- Dumping structure for table aiauth.tgroup
CREATE TABLE IF NOT EXISTS `tgroup` (
  `groupname` varchar(50) NOT NULL DEFAULT '',
  `supergroup` varchar(50) DEFAULT '',
  `nameen` varchar(100) DEFAULT NULL,
  `nameth` varchar(100) DEFAULT NULL,
  `seqno` int DEFAULT '0',
  `iconstyle` varchar(50) DEFAULT NULL,
  `privateflag` varchar(1) DEFAULT '0' COMMENT '1=Private Group(Center Usage)',
  `usertype` varchar(1) DEFAULT NULL COMMENT 'tkusertype.usertype',
  `mobilegroup` varchar(50) DEFAULT NULL,
  `xmltext` text,
  `menutext` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`groupname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table group info';

-- Dumping data for table aiauth.tgroup: ~12 rows (approximately)
INSERT INTO `tgroup` (`groupname`, `supergroup`, `nameen`, `nameth`, `seqno`, `iconstyle`, `privateflag`, `usertype`, `mobilegroup`, `xmltext`, `menutext`, `editdate`, `edittime`, `edituser`) VALUES
	('ADMIN', 'MD', 'Administrator', 'ผู้ดูแลระบบ', 1, 'fa fa-globe', '0', 'A', NULL, NULL, NULL, NULL, NULL, NULL),
	('CENTER', 'MD', 'Center Administrator', 'ผู้บริหารระบบส่วนกลาง', 5, 'fa fa-tasks', '1', 'A', NULL, NULL, NULL, NULL, NULL, NULL),
	('DIRECTOR', NULL, 'Director', 'ผู้อำนวยการ', 7, NULL, '0', 'D', NULL, NULL, NULL, NULL, NULL, NULL),
	('EMPLOYEE', NULL, 'Employee', 'พนักงาน', 8, NULL, '0', 'E', NULL, NULL, NULL, NULL, NULL, NULL),
	('EXECUTIVE', NULL, 'Executive', 'ผู้บริหาร', 9, NULL, '0', 'X', NULL, NULL, NULL, NULL, NULL, NULL),
	('MANAGER', NULL, 'Manager', 'ผู้จัดการ', 10, NULL, '0', 'M', NULL, NULL, NULL, NULL, NULL, NULL),
	('MENU', '', 'Menu', 'เมนู', 14, 'fa fa-tasks', '0', 'O', NULL, NULL, NULL, NULL, NULL, NULL),
	('OPERATOR', 'ADMIN', 'Operator', 'เจ้าหน้าที่ปฏิบัติการ', 11, 'fa fa-cogs', '0', 'O', NULL, NULL, NULL, NULL, NULL, NULL),
	('QA', '', 'QA', 'ผู้ตรวจสอบ', 14, NULL, '0', 'O', NULL, NULL, NULL, NULL, NULL, NULL),
	('SETTING', '', 'Setting', 'ตั้งค่า', 15, 'fa fa-cogs', '0', 'O', NULL, NULL, NULL, NULL, NULL, NULL),
	('SUPERVISOR', NULL, 'Supervisor', 'ผู้ควบคุม', 12, NULL, '0', 'S', NULL, NULL, NULL, NULL, NULL, NULL),
	('TESTER', 'ADMIN', 'Tester', 'ผู้ทดสอบ', 13, 'fa fa-desktop', '0', 'O', NULL, NULL, NULL, NULL, NULL, NULL);

-- Dumping structure for table aiauth.tnpwd
CREATE TABLE IF NOT EXISTS `tnpwd` (
  `reservenum` varchar(50) NOT NULL,
  `remarks` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`reservenum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep number restriction in password prohibition';

-- Dumping data for table aiauth.tnpwd: ~43 rows (approximately)
INSERT INTO `tnpwd` (`reservenum`, `remarks`) VALUES
	('060', 'TrueMove, TrueMoveH'),
	('061', 'AIS, DTAC, TrueMoveH'),
	('062', 'AIS, DTAC'),
	('068', 'TOT'),
	('0800', 'AIS'),
	('0801', 'AIS'),
	('0802', 'AIS'),
	('0803', 'TrueMove'),
	('0804', 'DTAC'),
	('0805', 'DTAC'),
	('0810', 'AIS'),
	('0811', 'AIS'),
	('0812', 'AIS'),
	('0813', 'DTAC'),
	('0814', 'DTAC'),
	('0815', 'DTAC'),
	('0816', 'DTAC'),
	('0817', 'AIS'),
	('0818', 'AIS'),
	('0819', 'AIS'),
	('082', 'AIS'),
	('083', 'TrueMove'),
	('084', 'AIS'),
	('085', 'DTAC'),
	('086', 'TrueMove'),
	('0871', 'AIS'),
	('0872', NULL),
	('0873', 'DTAC'),
	('0874', 'DTAC'),
	('0875', 'DTAC'),
	('0876', NULL),
	('088', 'my by CAT'),
	('089', 'AIS, DTAC'),
	('090', 'AIS, TrueMoveH'),
	('091', 'AIS, DTAC, TrueMoveH, TOT'),
	('092', 'AIS, DTAC'),
	('093', 'AIS, TrueMoveH'),
	('094', 'DTAC, TrueMoveH'),
	('095', 'AIS, DTAC, TrueMoveH'),
	('096', 'TrueMoveH'),
	('097', 'AIS, TrueMoveH'),
	('098', 'AIS'),
	('099', 'AIS, TrueMoveH');

-- Dumping structure for table aiauth.tpasskey
CREATE TABLE IF NOT EXISTS `tpasskey` (
  `keyid` varchar(50) NOT NULL COMMENT 'UUID',
  `keypass` varchar(350) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `site` varchar(50) NOT NULL,
  `userid` varchar(50) NOT NULL,
  `keyname` varchar(100) DEFAULT NULL,
  `createdate` date NOT NULL,
  `createtime` time NOT NULL,
  `createmillis` bigint NOT NULL DEFAULT '0',
  `createuser` varchar(50) DEFAULT NULL,
  `expireflag` varchar(1) DEFAULT '0' COMMENT '1=Never Expired',
  `expireday` int DEFAULT '0',
  `expiredate` date DEFAULT NULL,
  `expiretime` time DEFAULT NULL,
  `expiretimes` bigint DEFAULT '0',
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`keyid`),
  UNIQUE KEY `passkey` (`keypass`),
  KEY `site_userid` (`site`,`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep pass key';

-- Dumping data for table aiauth.tpasskey: ~0 rows (approximately)

-- Dumping structure for table aiauth.tppwd
CREATE TABLE IF NOT EXISTS `tppwd` (
  `userid` varchar(60) NOT NULL DEFAULT '',
  `checkreservepwd` varchar(1) DEFAULT '0',
  `checkpersonal` varchar(1) DEFAULT '0',
  `checkmatchpattern` varchar(1) DEFAULT '0',
  `checkmatchnumber` varchar(1) DEFAULT '0',
  `timenotusedoldpwd` smallint DEFAULT '0',
  `alertbeforeexpire` smallint DEFAULT '0',
  `pwdexpireday` smallint DEFAULT '0',
  `notloginafterday` smallint DEFAULT '0',
  `notchgpwduntilday` smallint DEFAULT '0',
  `minpwdlength` smallint DEFAULT '0',
  `alphainpwd` smallint DEFAULT '0',
  `otherinpwd` smallint DEFAULT '0',
  `maxsamechar` smallint DEFAULT '0',
  `mindiffchar` smallint DEFAULT '0',
  `maxarrangechar` smallint DEFAULT '0',
  `loginfailtime` int unsigned DEFAULT NULL,
  `fromip` varchar(15) DEFAULT NULL,
  `toip` varchar(15) DEFAULT NULL,
  `starttime` time DEFAULT NULL,
  `endtime` time DEFAULT NULL,
  `groupflag` varchar(50) DEFAULT NULL,
  `maxloginfailtime` smallint DEFAULT NULL,
  `checkdictpwd` smallint DEFAULT NULL,
  `maxpwdlength` smallint DEFAULT NULL,
  `digitinpwd` smallint DEFAULT NULL,
  `upperinpwd` smallint DEFAULT NULL,
  `lowerinpwd` smallint DEFAULT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table aiauth.tppwd: ~1 rows (approximately)
INSERT INTO `tppwd` (`userid`, `checkreservepwd`, `checkpersonal`, `checkmatchpattern`, `checkmatchnumber`, `timenotusedoldpwd`, `alertbeforeexpire`, `pwdexpireday`, `notloginafterday`, `notchgpwduntilday`, `minpwdlength`, `alphainpwd`, `otherinpwd`, `maxsamechar`, `mindiffchar`, `maxarrangechar`, `loginfailtime`, `fromip`, `toip`, `starttime`, `endtime`, `groupflag`, `maxloginfailtime`, `checkdictpwd`, `maxpwdlength`, `digitinpwd`, `upperinpwd`, `lowerinpwd`) VALUES
	('DEFAULT', '1', '1', '0', '1', 0, 0, 120, 0, 7, 8, 0, 1, 0, 0, 0, 0, NULL, NULL, NULL, NULL, '1', 0, 0, 0, 1, 1, 1);

-- Dumping structure for table aiauth.tprod
CREATE TABLE IF NOT EXISTS `tprod` (
  `product` varchar(50) NOT NULL DEFAULT '',
  `nameen` varchar(100) NOT NULL,
  `nameth` varchar(100) NOT NULL,
  `seqno` int DEFAULT '0',
  `serialid` varchar(100) DEFAULT NULL,
  `startdate` date DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  `capital` varchar(1) DEFAULT NULL,
  `verified` varchar(1) DEFAULT '1' COMMENT '1=Verify Product Access',
  `centerflag` varchar(1) DEFAULT '0',
  `iconfile` varchar(100) DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`product`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep product or module';

-- Dumping data for table aiauth.tprod: ~2 rows (approximately)
INSERT INTO `tprod` (`product`, `nameen`, `nameth`, `seqno`, `serialid`, `startdate`, `url`, `capital`, `verified`, `centerflag`, `iconfile`, `editdate`, `edittime`, `edituser`) VALUES
	('AI', 'AI Module', 'AI Module', 90, NULL, NULL, NULL, NULL, '0', '1', 'prompt.png', NULL, NULL, NULL),
	('PROMPT', 'Prompt Module', 'Prompt Module', 99, NULL, NULL, NULL, NULL, '0', '1', 'prompt.png', NULL, NULL, NULL);

-- Dumping structure for table aiauth.tprog
CREATE TABLE IF NOT EXISTS `tprog` (
  `product` varchar(30) NOT NULL DEFAULT '' COMMENT 'tprod.product',
  `programid` varchar(20) NOT NULL,
  `progname` varchar(100) DEFAULT NULL,
  `prognameth` varchar(100) DEFAULT NULL,
  `progtype` varchar(2) DEFAULT NULL,
  `appstype` varchar(2) DEFAULT 'W' COMMENT 'W=Web,M=Mobile',
  `description` varchar(100) DEFAULT NULL,
  `parameters` varchar(80) DEFAULT NULL,
  `progsystem` varchar(10) DEFAULT NULL,
  `iconfile` varchar(50) DEFAULT NULL,
  `iconstyle` varchar(50) DEFAULT NULL,
  `shortname` varchar(50) DEFAULT NULL,
  `shortnameth` varchar(50) DEFAULT NULL,
  `progpath` varchar(150) DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`programid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep program name';

-- Dumping data for table aiauth.tprog: ~15 rows (approximately)
INSERT INTO `tprog` (`product`, `programid`, `progname`, `prognameth`, `progtype`, `appstype`, `description`, `parameters`, `progsystem`, `iconfile`, `iconstyle`, `shortname`, `shortnameth`, `progpath`, `editdate`, `edittime`, `edituser`) VALUES
	('AI', 'ask', 'Ask Me', 'Ask Me', 'F', 'W', 'Ask Me', NULL, 'F', NULL, NULL, 'Ask', 'Ask', '/show/html/ask', NULL, NULL, NULL),
	('AI', 'chatclassify', 'Chat Classify', 'Chat Classify', 'F', 'W', 'Chat Classify', NULL, 'F', NULL, NULL, 'Chat Clasify', 'Chat Classify', '/show/html/chatclassify', NULL, NULL, NULL),
	('AI', 'chatdoc', 'Chat Doc', 'Chat Doc', 'F', 'W', 'Chat Doc', NULL, 'F', '', NULL, 'Chat Doc', 'Chat Doc', '/show/html/chatdoc', NULL, NULL, NULL),
	('AI', 'chatimage', 'Chat Image', 'Chat Image', 'F', 'W', 'Chat Image', NULL, 'F', '', NULL, 'Chat Image', 'Chat Image', '/show/html/chatimage', NULL, NULL, NULL),
	('AI', 'chatimageollama', 'Chat Image Vision', 'Chat Image Vision', 'F', 'W', 'Chat Image Vision', NULL, 'F', '', NULL, 'Image Vision', 'Image Vision', '/show/html/chatimageollama', NULL, NULL, NULL),
	('AI', 'chatnote', 'Chat Note', 'Chat Note', 'F', 'W', 'Chat Note', NULL, 'F', '', NULL, 'Chat Note', 'Chat Note', '/show/html/chatnote', NULL, NULL, NULL),
	('AI', 'chatpdf', 'Chat PDF', 'Chat PDF', 'F', 'W', 'Chat PDF', '', 'F', '', NULL, 'Chat PDF', 'Chat PDF', '/show/html/chatpdf', NULL, NULL, NULL),
	('AI', 'filterdoc', 'Classify Doc', 'Classify Doc', 'F', 'W', 'Classify Doc', NULL, 'F', '', NULL, 'Classify Doc', 'Classify Doc', NULL, NULL, NULL, NULL),
	('AI', 'filterquest', 'Classify Setting', 'Classify Setting', 'F', 'W', 'Classify Setting', NULL, 'F', NULL, NULL, 'Classify Setting', 'Classify Setting', NULL, NULL, NULL, NULL),
	('AI', 'ocr', 'OCR Me', 'OCR Me', 'F', 'W', 'OCR Me', NULL, 'F', NULL, NULL, 'OCR', 'OCR', '/show/html/ocr', NULL, NULL, NULL),
	('AI', 'quest', 'Question & Answer', 'Question & Answer', 'F', 'W', 'Question & Answer', NULL, 'F', NULL, 'fa fa-th', 'Q&A', 'Q&A', '/show/html/quest', NULL, NULL, NULL),
	('PROMPT', 'sftu004', 'Access Token', 'Access Token', 'F', 'W', 'Access Token', NULL, 'F', 'sftu004.png', NULL, 'Token', 'Token', NULL, NULL, NULL, NULL),
	('AI', 'sumdoc', 'Summary Doc Setting', 'Summary Doc Setting', 'F', 'W', 'Summary Doc Setting', NULL, 'F', NULL, NULL, 'Summary Doc', 'Summary Doc', '', NULL, NULL, NULL),
	('AI', 'tokenusage', 'Token Usage', 'Token Usage', 'F', 'W', 'Token Usage', NULL, 'F', NULL, NULL, 'Usage', 'Usage', NULL, NULL, NULL, NULL),
	('AI', 'vision', 'Vision Me', 'Vision Me', 'F', 'W', 'Vision Me', NULL, 'F', NULL, NULL, 'Vision', 'Vision', '/show/html/vision', NULL, NULL, NULL);

-- Dumping structure for table aiauth.tproggrp
CREATE TABLE IF NOT EXISTS `tproggrp` (
  `groupname` varchar(50) NOT NULL COMMENT 'tgroup.groupname',
  `programid` varchar(20) NOT NULL COMMENT 'tprog.programid',
  `parameters` varchar(100) DEFAULT NULL,
  `seqno` int DEFAULT '0',
  PRIMARY KEY (`groupname`,`programid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep program by group';

-- Dumping data for table aiauth.tproggrp: ~15 rows (approximately)
INSERT INTO `tproggrp` (`groupname`, `programid`, `parameters`, `seqno`) VALUES
	('MENU', 'ask', NULL, 2),
	('MENU', 'chatclassify', NULL, 12),
	('MENU', 'chatdoc', NULL, 6),
	('MENU', 'chatimage', NULL, 8),
	('MENU', 'chatimageollama', NULL, 9),
	('MENU', 'chatnote', NULL, 7),
	('MENU', 'chatpdf', NULL, 5),
	('MENU', 'filterdoc', NULL, 10),
	('MENU', 'filterquest', NULL, 11),
	('MENU', 'ocr', NULL, 4),
	('MENU', 'quest', NULL, 1),
	('MENU', 'sumdoc', NULL, 13),
	('MENU', 'vision', NULL, 3),
	('SETTING', 'sftu004', NULL, 1),
	('SETTING', 'tokenusage', NULL, 2);

-- Dumping structure for table aiauth.trpwd
CREATE TABLE IF NOT EXISTS `trpwd` (
  `reservepwd` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`reservepwd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table aiauth.trpwd: ~25 rows (approximately)
INSERT INTO `trpwd` (`reservepwd`) VALUES
	('P@ssw0rd'),
	('P@ssw1rd'),
	('P@ssw2rd'),
	('P@ssw3rd'),
	('P@ssw4rd'),
	('P@ssw5rd'),
	('P@ssw6rd'),
	('P@ssw7rd'),
	('P@ssw8rd'),
	('P@ssw9rd'),
	('P@ssword'),
	('Password'),
	('Password0'),
	('Password1'),
	('Password2'),
	('Password3'),
	('Password4'),
	('Password5'),
	('Password6'),
	('Password7'),
	('Password8'),
	('Password9'),
	('Qaz123wsx'),
	('Qaz12wsx'),
	('Qwerty123');

-- Dumping structure for table aiauth.trxlog
CREATE TABLE IF NOT EXISTS `trxlog` (
  `keyid` varchar(50) NOT NULL,
  `curtime` bigint unsigned DEFAULT NULL,
  `trxtime` bigint unsigned DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `transtime` datetime DEFAULT NULL,
  `caller` varchar(100) DEFAULT NULL,
  `sender` varchar(100) DEFAULT NULL,
  `owner` varchar(200) DEFAULT NULL,
  `processtype` varchar(15) DEFAULT NULL,
  `trxstatus` char(1) DEFAULT NULL,
  `attachs` varchar(250) DEFAULT NULL,
  `refer` varchar(50) DEFAULT NULL,
  `note` varchar(250) DEFAULT NULL,
  `package` varchar(50) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `quotable` varchar(150) DEFAULT NULL,
  `grouper` varchar(50) DEFAULT NULL,
  `remark` text,
  `contents` text,
  PRIMARY KEY (`keyid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table aiauth.trxlog: ~3 rows (approximately)
INSERT INTO `trxlog` (`keyid`, `curtime`, `trxtime`, `editdate`, `edittime`, `transtime`, `caller`, `sender`, `owner`, `processtype`, `trxstatus`, `attachs`, `refer`, `note`, `package`, `action`, `quotable`, `grouper`, `remark`, `contents`) VALUES
	('59f85ab9-b682-4ddc-8839-c2b50c73f0a3', 1733369271133, 1733369271117, '2024-12-05', '10:28:03', '2024-12-05 10:27:51', NULL, '"System Management" <ezprompt@gmail.com>', 'tassun_oro@hotmail.com', 'mail', 'C', NULL, NULL, NULL, NULL, NULL, 'Confirm New Account', '59f85ab9-b682-4ddc-8839-c2b50c73f0a3', '{"accepted":["tassun_oro@hotmail.com"],"rejected":[],"ehlo":["SIZE 35882577","8BITMIME","AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH","ENHANCEDSTATUSCODES","PIPELINING","CHUNKING","SMTPUTF8"],"envelopeTime":727,"messageTime":658,"messageSize":558,"response":"250 2.0.0 OK  1733369283 d2e1a72fcca58-725a29e8ef5sm243996b3a.48 - gsmtp","envelope":{"from":"ezprompt@gmail.com","to":["tassun_oro@hotmail.com"]},"messageId":"<1ca765bf-f93e-4006-1cdb-a7b71e1b7c96@gmail.com>"}', '<p>Dear, Toucher Oros.<br />New account was created for access system.<br />To confirm, please kindly use information below.<br />user = tassun_oro@hotmail.com<br />password = 12E216b3<br />yours sincerely,<br />Administrator</p>'),
	('5a05e665-1a48-4e04-b6e7-610818195a61', 1733371694651, 1733371694630, '2024-12-05', '11:08:17', '2024-12-05 11:08:15', NULL, '"System Management" <ezprompt@gmail.com>', 'tassun_oro@hotmail.com', 'mail', 'C', NULL, NULL, NULL, NULL, NULL, 'Confirm New Account', '5a05e665-1a48-4e04-b6e7-610818195a61', '{"accepted":["tassun_oro@hotmail.com"],"rejected":[],"ehlo":["SIZE 35882577","8BITMIME","AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH","ENHANCEDSTATUSCODES","PIPELINING","CHUNKING","SMTPUTF8"],"envelopeTime":749,"messageTime":648,"messageSize":558,"response":"250 2.0.0 OK  1733371696 d9443c01a7336-215f8f26c77sm3193965ad.230 - gsmtp","envelope":{"from":"ezprompt@gmail.com","to":["tassun_oro@hotmail.com"]},"messageId":"<6a706b5e-0ff8-f800-3b24-97c47c33ab88@gmail.com>"}', '<p>Dear, Toucher Oros.<br />New account was created for access system.<br />To confirm, please kindly use information below.<br />user = tassun_oro@hotmail.com<br />password = 0Db765a1<br />yours sincerely,<br />Administrator</p>'),
	('9e7df41c-b012-4b69-9715-a936ca5eae62', 1733306855587, 1733306855579, '2024-12-04', '17:07:39', '2024-12-04 17:07:36', NULL, '"System Management" <ezprompt@gmail.com>', 'tassun_oro@hotmail.com', 'mail', 'C', NULL, NULL, NULL, NULL, NULL, 'Confirm New Account', '9e7df41c-b012-4b69-9715-a936ca5eae62', '{"accepted":["tassun_oro@hotmail.com"],"rejected":[],"ehlo":["SIZE 35882577","8BITMIME","AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH","ENHANCEDSTATUSCODES","PIPELINING","CHUNKING","SMTPUTF8"],"envelopeTime":738,"messageTime":748,"messageSize":554,"response":"250 2.0.0 OK  1733306858 d2e1a72fcca58-7254176f634sm11976050b3a.59 - gsmtp","envelope":{"from":"ezprompt@gmail.com","to":["tassun_oro@hotmail.com"]},"messageId":"<83a01b29-028b-17c9-d0f5-93de19820a82@gmail.com>"}', '<p>Dear, Toucher .<br />New account was created for access system.<br />To confirm, please kindly use information below.<br />user = tassun_oro@hotmail.com<br />password = B03adcd2<br />yours sincerely,<br />Administrator</p>');

-- Dumping structure for table aiauth.trxres
CREATE TABLE IF NOT EXISTS `trxres` (
  `keyid` varchar(50) NOT NULL,
  `curtime` bigint DEFAULT NULL,
  `trxtime` bigint DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `transtime` datetime DEFAULT NULL,
  `caller` varchar(100) DEFAULT NULL,
  `sender` varchar(100) DEFAULT NULL,
  `owner` varchar(100) DEFAULT NULL,
  `processtype` varchar(15) DEFAULT NULL,
  `trxstatus` char(1) DEFAULT NULL,
  `remark` varchar(250) DEFAULT NULL,
  `attachs` varchar(250) DEFAULT NULL,
  `refer` varchar(50) DEFAULT NULL,
  `note` varchar(250) DEFAULT NULL,
  `package` varchar(50) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `quotable` varchar(50) DEFAULT NULL,
  `grouper` varchar(50) DEFAULT NULL,
  `contents` mediumtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='transaction response log';

-- Dumping data for table aiauth.trxres: ~0 rows (approximately)

-- Dumping structure for table aiauth.ttemplate
CREATE TABLE IF NOT EXISTS `ttemplate` (
  `template` varchar(50) NOT NULL,
  `templatetype` varchar(50) NOT NULL,
  `subjecttitle` varchar(100) DEFAULT NULL,
  `contents` text NOT NULL,
  `contexts` text,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`template`,`templatetype`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep template mail';

-- Dumping data for table aiauth.ttemplate: ~2 rows (approximately)
INSERT INTO `ttemplate` (`template`, `templatetype`, `subjecttitle`, `contents`, `contexts`, `editdate`, `edittime`, `edituser`) VALUES
	('USER_FORGOT', 'MAIL_NOTIFY', 'Confirm Password Changed', 'Dear, ${userfullname}.<br/>\r\nConfirm your password was changed.<br/>\r\nuser = ${username}<br>\r\npassword = ${userpassword}<br>\r\nyours sincerely,<br>		\r\nAdministrator<br/>', 'Dear, ${userfullname}.<br/>\r\nConfirm your password was changed.<br/>\r\nuser = ${username}<br>\r\npassword = ${userpassword}<br>\r\nyours sincerely,<br>		\r\nAdministrator<br/>', NULL, NULL, NULL),
	('USER_INFO', 'MAIL_NOTIFY', 'Confirm New Account', '<p>Dear, ${userfullname}.<br />New account was created for access system.<br />To confirm, please kindly use information below.<br />user = ${username}<br />password = ${userpassword}<br />yours sincerely,<br />Administrator</p>', '<p>Dear, ${userfullname}.<br />New account was created for access system.<br />To confirm, please kindly use information below.<br />user = ${username}<br />password = ${userpassword}<br />yours sincerely,<br />Administrator</p>', '2023-10-26', '10:41:22', 'tso');

-- Dumping structure for table aiauth.tupwd
CREATE TABLE IF NOT EXISTS `tupwd` (
  `serverdatetime` datetime DEFAULT NULL,
  `systemdate` date NOT NULL DEFAULT '0000-00-00',
  `userid` varchar(50) NOT NULL DEFAULT '',
  `userpassword` varchar(200) NOT NULL DEFAULT '',
  `edituserid` varchar(50) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table aiauth.tupwd: ~1 rows (approximately)
INSERT INTO `tupwd` (`serverdatetime`, `systemdate`, `userid`, `userpassword`, `edituserid`) VALUES
	('2025-03-24 14:15:34', '2025-03-24', 'tso', '$2b$10$sKjwx62KDjS3BcM9iVb65uaggVQ703y0QOBziICpFJ6MBrEPbcC4q', 'tso');

-- Dumping structure for table aiauth.tuser
CREATE TABLE IF NOT EXISTS `tuser` (
  `userid` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `site` varchar(50) NOT NULL COMMENT 'tcomp.site',
  `startdate` date DEFAULT NULL,
  `enddate` date DEFAULT NULL,
  `status` varchar(1) DEFAULT 'A' COMMENT 'A=Activate, P=Pending,C=Closed (tuserstatus.userstatus)',
  `userpassword` varchar(100) DEFAULT NULL,
  `passwordexpiredate` date DEFAULT NULL,
  `passwordchangedate` date DEFAULT NULL,
  `passwordchangetime` time DEFAULT NULL,
  `showphoto` varchar(1) DEFAULT NULL,
  `adminflag` varchar(1) DEFAULT '0',
  `groupflag` varchar(1) DEFAULT '0' COMMENT '0=Internal User,1=External User',
  `theme` varchar(20) DEFAULT NULL,
  `firstpage` varchar(100) DEFAULT NULL,
  `loginfailtimes` tinyint unsigned DEFAULT '0',
  `failtime` bigint DEFAULT NULL,
  `lockflag` varchar(1) DEFAULT '0' COMMENT '1=Lock',
  `usertype` varchar(1) DEFAULT NULL,
  `iconfile` varchar(100) DEFAULT NULL,
  `accessdate` date DEFAULT NULL,
  `accesstime` time DEFAULT NULL,
  `accesshits` bigint DEFAULT '0',
  `siteflag` varchar(1) DEFAULT '0' COMMENT '1=Access All Site',
  `branchflag` varchar(1) DEFAULT '0' COMMENT '1=Access All Branch',
  `approveflag` varchar(1) DEFAULT '0' COMMENT '1=Approver',
  `changeflag` varchar(1) DEFAULT '0' COMMENT '1=Force change password',
  `newflag` varchar(1) DEFAULT '0' COMMENT '1=Can new window',
  `activeflag` varchar(1) DEFAULT '0' COMMENT '1=Active Directory User',
  `mistakens` tinyint DEFAULT '0',
  `mistakentime` bigint DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user info';

-- Dumping data for table aiauth.tuser: ~14 rows (approximately)
INSERT INTO `tuser` (`userid`, `username`, `site`, `startdate`, `enddate`, `status`, `userpassword`, `passwordexpiredate`, `passwordchangedate`, `passwordchangetime`, `showphoto`, `adminflag`, `groupflag`, `theme`, `firstpage`, `loginfailtimes`, `failtime`, `lockflag`, `usertype`, `iconfile`, `accessdate`, `accesstime`, `accesshits`, `siteflag`, `branchflag`, `approveflag`, `changeflag`, `newflag`, `activeflag`, `mistakens`, `mistakentime`, `editdate`, `edittime`, `edituser`) VALUES
	('adminis', 'admin@freewill.com', 'FWS', NULL, NULL, 'A', '$2a$10$MhzJQISuqFZSES0k00LPx.iMWUMGgp4P4oR5xlAYdzc2ydaVQgMnG', NULL, NULL, NULL, NULL, '1', '0', NULL, NULL, 0, 0, '0', 'A', NULL, '2022-08-30', '09:22:06', 464, '0', '0', '0', '0', '0', '0', 0, 0, '2021-05-16', '10:27:01', 'tso'),
	('centre', 'center@freewill.com', 'FWS', NULL, NULL, 'A', '$2a$10$fCARfKVL/xYrnJC6QS7c/O.u1WEKq.xS.qmlRV4sZo6PA1sJPW78C', NULL, NULL, NULL, NULL, '1', '0', NULL, NULL, 0, 0, '0', 'A', NULL, '2021-05-25', '10:45:29', 46, '1', '1', '0', '0', '0', '0', 0, 0, NULL, NULL, NULL),
	('test1', 'test1@test.com', 'FWS', NULL, NULL, 'A', '$2a$10$g/5giEKKwQKm.9UNmL6CCOtSqN64tFi04QzCS/D.ECog88PsTAVC.', NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, 0, 0, '0', 'E', NULL, '2023-09-27', '16:18:12', 46, '0', '0', '0', '0', '0', '0', 0, 0, NULL, NULL, NULL),
	('test2', 'test2@test.com', 'FWS', NULL, NULL, 'A', '$2a$10$g/5giEKKwQKm.9UNmL6CCOtSqN64tFi04QzCS/D.ECog88PsTAVC.', NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, 0, NULL, '0', 'E', NULL, NULL, NULL, 0, '0', '0', '0', '0', '0', '0', 0, NULL, NULL, NULL, NULL),
	('test3', 'test3@test.com', 'FWS', NULL, NULL, 'A', '$2a$10$g/5giEKKwQKm.9UNmL6CCOtSqN64tFi04QzCS/D.ECog88PsTAVC.', NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, 0, NULL, '0', 'E', NULL, NULL, NULL, 0, '0', '0', '0', '0', '0', '0', 0, NULL, NULL, NULL, NULL),
	('test4', 'test4@test.com', 'FWS', NULL, NULL, 'A', '$2a$10$g/5giEKKwQKm.9UNmL6CCOtSqN64tFi04QzCS/D.ECog88PsTAVC.', NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, 0, NULL, '0', 'E', NULL, NULL, NULL, 0, '0', '0', '0', '0', '0', '0', 0, NULL, NULL, NULL, NULL),
	('test5', 'test5@test.com', 'FWS', NULL, NULL, 'A', '$2a$10$g/5giEKKwQKm.9UNmL6CCOtSqN64tFi04QzCS/D.ECog88PsTAVC.', NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, 0, NULL, '0', 'E', NULL, NULL, NULL, 0, '0', '0', '0', '0', '0', '0', 0, NULL, NULL, NULL, NULL),
	('test6', 'test6@test.com', 'FWS', NULL, NULL, 'A', '$2a$10$g/5giEKKwQKm.9UNmL6CCOtSqN64tFi04QzCS/D.ECog88PsTAVC.', NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, 0, NULL, '0', 'E', NULL, NULL, NULL, 0, '0', '0', '0', '0', '0', '0', 0, NULL, NULL, NULL, NULL),
	('test7', 'test7@test.com', 'FWS', NULL, NULL, 'A', '$2a$10$g/5giEKKwQKm.9UNmL6CCOtSqN64tFi04QzCS/D.ECog88PsTAVC.', NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, 0, NULL, '0', 'E', NULL, NULL, NULL, 0, '0', '0', '0', '0', '0', '0', 0, NULL, NULL, NULL, NULL),
	('test8', 'test8@test.com', 'FWS', NULL, NULL, 'A', '$2a$10$g/5giEKKwQKm.9UNmL6CCOtSqN64tFi04QzCS/D.ECog88PsTAVC.', NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, 0, NULL, '0', 'E', NULL, NULL, NULL, 0, '0', '0', '0', '0', '0', '0', 0, NULL, NULL, NULL, NULL),
	('test9', 'test9@testing.com', 'FWS', NULL, NULL, 'A', '$2a$10$g/5giEKKwQKm.9UNmL6CCOtSqN64tFi04QzCS/D.ECog88PsTAVC.', NULL, NULL, NULL, NULL, '0', '0', NULL, NULL, 0, NULL, '0', 'O', NULL, NULL, NULL, 0, '0', '1', '0', '0', '0', '0', 0, NULL, '2023-09-14', '16:35:54', 'tso'),
	('tester', 'tester@freewill.com', 'FWS', NULL, NULL, 'A', '$2a$10$lDY.QbMZp./3KLS3uGpu3OHypOk4itewChD2.2jrtsgQmGaJ2BayS', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, 0, 0, '0', 'O', NULL, '2025-02-07', '11:05:04', 26, '0', '0', '0', '0', '0', '0', 0, 0, '2021-05-16', '10:26:46', 'tso'),
	('tso', 'tso@freewill.com', 'FWS', NULL, NULL, 'A', '$2a$10$XxaiWYBcRIglzgJ9MF3toO6ZpUh6dv/XDEFlPsPtkpS583Hiuqz/y', '2025-07-22', '2025-03-24', '14:15:34', '1', '1', '0', '', '', 0, 0, '0', 'A', '', '2025-03-31', '15:23:41', 7295, '0', '1', '1', '0', '0', '0', 0, 0, '2023-09-14', '16:57:56', 'tso'),
	('ttso', 'ttso@freewill.com', 'FWS', NULL, NULL, 'A', '$2a$10$XxaiWYBcRIglzgJ9MF3toO6ZpUh6dv/XDEFlPsPtkpS583Hiuqz/y', '2025-07-28', '2022-03-30', '09:21:19', NULL, '0', '0', NULL, NULL, 0, 0, '0', 'E', NULL, '2024-12-04', '12:56:25', 339, '0', '0', '0', '0', '0', '0', 0, 0, NULL, NULL, NULL);

-- Dumping structure for table aiauth.tuserbranch
CREATE TABLE IF NOT EXISTS `tuserbranch` (
  `site` varchar(50) NOT NULL COMMENT 'tcomp.site',
  `branch` varchar(20) NOT NULL COMMENT 'tcompbranch.branch',
  `userid` varchar(50) NOT NULL COMMENT 'tuser.userid',
  PRIMARY KEY (`site`,`branch`,`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user access comp branchs';

-- Dumping data for table aiauth.tuserbranch: ~0 rows (approximately)

-- Dumping structure for table aiauth.tuserfactor
CREATE TABLE IF NOT EXISTS `tuserfactor` (
  `factorid` varchar(50) NOT NULL COMMENT 'UUID',
  `userid` varchar(50) NOT NULL,
  `factorkey` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `issuer` varchar(100) NOT NULL,
  `createdate` date NOT NULL,
  `createtime` time NOT NULL,
  `createtranstime` bigint NOT NULL,
  `factorflag` varchar(1) NOT NULL DEFAULT '0' COMMENT '1=Confirm',
  `factorurl` varchar(350) DEFAULT NULL,
  `confirmdate` date DEFAULT NULL,
  `confirmtime` time DEFAULT NULL,
  `confirmtranstime` bigint DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  `factorremark` varchar(350) DEFAULT NULL,
  PRIMARY KEY (`factorid`),
  UNIQUE KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user factor';

-- Dumping data for table aiauth.tuserfactor: ~0 rows (approximately)

-- Dumping structure for table aiauth.tuserfactorhistory
CREATE TABLE IF NOT EXISTS `tuserfactorhistory` (
  `factorid` varchar(50) NOT NULL COMMENT 'UUID',
  `userid` varchar(50) NOT NULL,
  `factorkey` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `issuer` varchar(100) NOT NULL,
  `createdate` date NOT NULL,
  `createtime` time NOT NULL,
  `createtranstime` bigint NOT NULL,
  `factorflag` varchar(1) NOT NULL DEFAULT '0' COMMENT '1=Confirm',
  `factorurl` varchar(350) DEFAULT NULL,
  `confirmdate` date DEFAULT NULL,
  `confirmtime` time DEFAULT NULL,
  `confirmtranstime` bigint DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  `factorremark` varchar(350) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user factor history';

-- Dumping data for table aiauth.tuserfactorhistory: ~0 rows (approximately)

-- Dumping structure for table aiauth.tusergrp
CREATE TABLE IF NOT EXISTS `tusergrp` (
  `userid` varchar(50) NOT NULL DEFAULT '' COMMENT 'tuser.userid',
  `groupname` varchar(50) NOT NULL DEFAULT '' COMMENT 'tgroup.groupname',
  `rolename` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`userid`,`groupname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user in group';

-- Dumping data for table aiauth.tusergrp: ~6 rows (approximately)
INSERT INTO `tusergrp` (`userid`, `groupname`, `rolename`) VALUES
	('325b1f73-6198-433a-a484-b67f6082d9a5', 'OPERATOR', NULL),
	('349c7852-4b13-476f-9d2a-03693358f205', 'OPERATOR', NULL),
	('ca113e9d-20b8-40e9-a7ae-3736c90ecd63', 'OPERATOR', NULL),
	('e56a3df1-11b2-44f4-820c-450eb2a24d77', 'OPERATOR', NULL),
	('tso', 'MENU', NULL),
	('tso', 'SETTING', NULL);

-- Dumping structure for table aiauth.tuserinfo
CREATE TABLE IF NOT EXISTS `tuserinfo` (
  `site` varchar(50) NOT NULL DEFAULT '' COMMENT 'tcomp.site',
  `employeeid` varchar(50) NOT NULL DEFAULT '',
  `userid` varchar(50) DEFAULT NULL COMMENT 'tuser.userid',
  `userbranch` varchar(20) DEFAULT NULL COMMENT 'tcompbranch.branch',
  `usertname` varchar(50) DEFAULT NULL,
  `usertsurname` varchar(50) DEFAULT NULL,
  `userename` varchar(50) DEFAULT NULL,
  `useresurname` varchar(50) DEFAULT NULL,
  `displayname` varchar(50) DEFAULT NULL,
  `activeflag` varchar(1) DEFAULT '0',
  `accessdate` date DEFAULT NULL,
  `accesstime` time DEFAULT NULL,
  `photoimage` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL COMMENT 'F=Female,M=Male(tkgender.genderid)',
  `lineid` varchar(50) DEFAULT NULL,
  `mobile` varchar(50) DEFAULT NULL,
  `langcode` varchar(10) DEFAULT NULL COMMENT 'tklanguage.langcode',
  `birthday` date DEFAULT NULL,
  `inactive` varchar(1) DEFAULT '0' COMMENT '1=Inactive',
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  `remarks` text,
  `usercontents` text,
  PRIMARY KEY (`site`,`employeeid`),
  UNIQUE KEY `userid` (`userid`),
  KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user info (employee info)';

-- Dumping data for table aiauth.tuserinfo: ~13 rows (approximately)
INSERT INTO `tuserinfo` (`site`, `employeeid`, `userid`, `userbranch`, `usertname`, `usertsurname`, `userename`, `useresurname`, `displayname`, `activeflag`, `accessdate`, `accesstime`, `photoimage`, `email`, `gender`, `lineid`, `mobile`, `langcode`, `birthday`, `inactive`, `editdate`, `edittime`, `edituser`, `remarks`, `usercontents`) VALUES
	('FWS', 'adminis', 'adminis', '00', 'FWS', 'Administrator', 'FWS', 'Administrator', 'FWS_Adm', '0', '2022-08-30', '09:22:06', 'photo_fwg_fwgadmin.jpg', 'admin@freewillsolutions.com', 'M', NULL, NULL, NULL, NULL, '0', '2021-05-16', '10:27:01', 'tso', 'sfte007', NULL),
	('FWS', 'test1', 'test1', NULL, 'Test1', 'Test', 'Test1', 'Test', 'Test1_Tes', '0', '2023-09-27', '16:18:12', NULL, 'test1@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test2', 'test2', NULL, 'Test2', 'Test', 'Test2', 'Test', 'Test2_Tes', '0', NULL, NULL, NULL, 'test2@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test3', 'test3', NULL, 'Test3', 'Test', 'Test3', 'Test', 'Test3_Tes', '0', NULL, NULL, NULL, 'test3@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test4', 'test4', NULL, 'Test4', 'Test', 'Test4', 'Test', 'Test4_Tes', '0', NULL, NULL, NULL, 'test4@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test5', 'test5', NULL, 'Test5', 'Test', 'Test5', 'Test', 'Test5_Tes', '0', NULL, NULL, NULL, 'test5@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test6', 'test6', NULL, 'Test6', 'Test', 'Test6', 'Test', 'Test6_Tes', '0', NULL, NULL, NULL, 'test6@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test7', 'test7', NULL, 'Test7', 'Test', 'Test7', 'Test', 'Test7_Tes', '0', NULL, NULL, NULL, 'test7@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test8', 'test8', NULL, 'Test8', 'Test', 'Test8', 'Test', 'Test8_Tes', '0', NULL, NULL, NULL, 'test8@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test9', 'test9', NULL, 'Test9', 'Test', 'Test9', 'Test', 'Test9_Tes', '0', NULL, NULL, NULL, 'test9@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', '2023-09-14', '16:35:54', 'tso', 'sfte007', NULL),
	('FWS', 'tester', 'tester', NULL, 'Tester', 'Test', 'Tester', 'Test', 'Tester_Tes', '0', '2025-02-07', '11:05:04', NULL, 'tester@gmail.com', 'M', NULL, NULL, NULL, NULL, '0', '2021-05-16', '10:26:46', 'tso', 'sfte007', NULL),
	('FWS', 'tso', 'tso', '00', 'Tassan', 'Oros', 'Tassan', 'Oros', 'Tassan_oro', '0', '2025-03-31', '15:23:41', 'photo_fwg_tso.png', 'tassun_oro@hotmail.com', 'M', 'tassun_oro', '0955941678', 'EN', NULL, '0', '2024-10-02', '15:15:39', 'tso', 'sfte007', '{"companion":"qby1"}'),
	('FWS', 'ttso', 'ttso', '00', 'Tassun', 'Oros', 'Tassun', 'Oros', 'Tassun_Oro', '0', '2024-12-04', '12:56:25', NULL, 'tassunoros@gmail.com', 'M', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, '{"companion":"tama1"}');

-- Dumping structure for table aiauth.tuserinfohistory
CREATE TABLE IF NOT EXISTS `tuserinfohistory` (
  `site` varchar(50) NOT NULL DEFAULT '' COMMENT 'tcomp.site',
  `employeeid` varchar(50) NOT NULL DEFAULT '',
  `userid` varchar(50) DEFAULT NULL COMMENT 'tuser.userid',
  `userbranch` varchar(20) DEFAULT NULL,
  `usertname` varchar(50) DEFAULT NULL,
  `usertsurname` varchar(50) DEFAULT NULL,
  `userename` varchar(50) DEFAULT NULL,
  `useresurname` varchar(50) DEFAULT NULL,
  `displayname` varchar(50) DEFAULT NULL,
  `activeflag` varchar(1) DEFAULT '0',
  `accessdate` date DEFAULT NULL,
  `accesstime` time DEFAULT NULL,
  `photoimage` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL COMMENT 'F=Female,M=Male(tgender.genderid)',
  `lineid` varchar(50) DEFAULT NULL,
  `mobile` varchar(50) DEFAULT NULL,
  `langcode` varchar(10) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `inactive` varchar(1) DEFAULT '0' COMMENT '1=Inactive',
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  `remarks` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `usercontents` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user info (employee info)';

-- Dumping data for table aiauth.tuserinfohistory: ~0 rows (approximately)

-- Dumping structure for table aiauth.tuserlog
CREATE TABLE IF NOT EXISTS `tuserlog` (
  `seqno` bigint NOT NULL DEFAULT '0',
  `curtime` datetime NOT NULL,
  `useralias` varchar(50) DEFAULT NULL,
  `userid` varchar(50) DEFAULT NULL,
  `site` varchar(50) DEFAULT NULL,
  `progid` varchar(25) DEFAULT NULL,
  `handler` varchar(50) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `remark` text,
  `token` varchar(350) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `paths` varchar(500) DEFAULT NULL,
  `headers` text,
  `requests` text,
  `contents` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user logging';

-- Dumping data for table aiauth.tuserlog: ~0 rows (approximately)

-- Dumping structure for table aiauth.tuserpwd
CREATE TABLE IF NOT EXISTS `tuserpwd` (
  `trxid` varchar(50) NOT NULL,
  `userid` varchar(50) NOT NULL,
  `userpassword` varchar(100) NOT NULL,
  `expiredate` datetime NOT NULL,
  `transtime` bigint NOT NULL,
  `passwordexpiredate` date NOT NULL,
  `passwordchangedate` date NOT NULL,
  `passwordchangetime` time NOT NULL,
  `expireflag` varchar(1) DEFAULT '0' COMMENT '1=Expired',
  `confirmdate` date DEFAULT NULL,
  `confirmtime` time DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  PRIMARY KEY (`trxid`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user temporary password change';

-- Dumping data for table aiauth.tuserpwd: ~0 rows (approximately)

-- Dumping structure for table aiauth.tuserpwdhistory
CREATE TABLE IF NOT EXISTS `tuserpwdhistory` (
  `trxid` varchar(50) NOT NULL,
  `userid` varchar(50) NOT NULL,
  `userpassword` varchar(100) NOT NULL,
  `expiredate` datetime NOT NULL,
  `transtime` bigint NOT NULL,
  `passwordexpiredate` date NOT NULL,
  `passwordchangedate` date NOT NULL,
  `passwordchangetime` time NOT NULL,
  `expireflag` varchar(1) DEFAULT '0' COMMENT '1=Expired',
  `confirmdate` date DEFAULT NULL,
  `confirmtime` time DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `hisid` varchar(50) DEFAULT NULL,
  `hisno` bigint DEFAULT NULL,
  `hisflag` varchar(1) DEFAULT '0' COMMENT '1=Confirm'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user temporary password change history';

-- Dumping data for table aiauth.tuserpwdhistory: ~0 rows (approximately)

-- Dumping structure for table aiauth.tuserrole
CREATE TABLE IF NOT EXISTS `tuserrole` (
  `userid` varchar(50) NOT NULL COMMENT 'tuser.userid',
  `roleid` varchar(50) NOT NULL COMMENT 'trole.roleid',
  PRIMARY KEY (`userid`,`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user in roles';

-- Dumping data for table aiauth.tuserrole: ~0 rows (approximately)

-- Dumping structure for table aiauth.tusertoken
CREATE TABLE IF NOT EXISTS `tusertoken` (
  `useruuid` varchar(50) NOT NULL,
  `userid` varchar(50) NOT NULL,
  `createdate` date NOT NULL,
  `createtime` time NOT NULL,
  `createmillis` bigint NOT NULL,
  `expiredate` date NOT NULL,
  `expiretime` time NOT NULL,
  `expiretimes` bigint NOT NULL,
  `site` varchar(50) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `nonce` varchar(50) DEFAULT NULL,
  `authtoken` varchar(350) DEFAULT NULL,
  `prime` varchar(250) DEFAULT NULL,
  `generator` varchar(250) DEFAULT NULL,
  `privatekey` varchar(250) DEFAULT NULL,
  `publickey` varchar(250) DEFAULT NULL,
  `sharedkey` varchar(250) DEFAULT NULL,
  `otherkey` varchar(250) DEFAULT NULL,
  `tokentype` varchar(50) DEFAULT NULL COMMENT 'A=Anonymous,S=System',
  `tokenstatus` varchar(50) DEFAULT NULL COMMENT 'C=Computed',
  `factorcode` varchar(50) DEFAULT NULL,
  `outdate` date DEFAULT NULL,
  `outtime` time DEFAULT NULL,
  `accesscontents` text,
  PRIMARY KEY (`useruuid`),
  UNIQUE KEY `authtoken` (`authtoken`),
  KEY `nonce` (`nonce`,`code`,`state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep access token';

-- Dumping data for table aiauth.tusertoken: ~24 rows (approximately)
INSERT INTO `tusertoken` (`useruuid`, `userid`, `createdate`, `createtime`, `createmillis`, `expiredate`, `expiretime`, `expiretimes`, `site`, `code`, `state`, `nonce`, `authtoken`, `prime`, `generator`, `privatekey`, `publickey`, `sharedkey`, `otherkey`, `tokentype`, `tokenstatus`, `factorcode`, `outdate`, `outtime`, `accesscontents`) VALUES
	('08b52371-a540-463b-be78-b8b4bb130817', 'tso', '2024-12-19', '17:17:48', 1734603468117, '2024-12-20', '11:17:48', 1734668268117, 'FWS', 'a275bbcd-1334-4bfd-9f9e-4de704c85b53', '20e7cca1-0d1a-4d96-a6f6-5973e3431451', 'a80b4826-36bc-4b06-8370-6b2571bcc958', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiMDhiNTIzNzEtYTU0MC00NjNiLWJlNzgtYjhiNGJiMTMwODE3Iiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzQ2MDM0NjgsImV4cCI6MTczNDY2ODI2OH0.rxHRvfXBoeNTZ6sok9TvxSseBviKl0nUsFkXCBh8hPQ', '94117317457546795180388484640271955838768512475517553242966126615248432268239', '7499', '23888773693935961818149345116992725598244320184132075825718664480246705371021', '93168970601651897886517551979905193162997573106835521516641248318855016574894', '2909', '7841', 'S', NULL, NULL, NULL, NULL, NULL),
	('3fd025d6-db57-4529-9ab7-a535ad6a1691', 'tso', '2025-02-01', '11:26:33', 1738383992784, '2025-02-02', '05:26:33', 1738448792784, 'FWS', 'e1ba4675-6ad5-4304-bcd2-cfb64a30fa9f', 'cb9fd499-32d2-45b9-8bb7-461dadf2d503', '90326ac6-aa11-4023-870f-c2a4319c9628', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiM2ZkMDI1ZDYtZGI1Ny00NTI5LTlhYjctYTUzNWFkNmExNjkxIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzgzODM5OTIsImV4cCI6MTczODQ0ODc5Mn0.tS8MzG0zDkNunHIxwH2VJf7F8aL71B4BhiLIdva9VVo', '103048041394806072008681123474459663502752677222521229412476377252139427709641', '5381', '19447560756469900443692372375870900998860261357023739044842130764447754121059', '24322453438851876150200509226143516821282350198686825328945424956555135196809', '7691', '1471', 'S', NULL, NULL, NULL, NULL, NULL),
	('41dbe444-e5e4-44b9-b30b-777e6edaf24c', 'tso', '2024-12-08', '10:41:10', 1733629269518, '2024-12-09', '04:41:10', 1733694069518, 'FWS', '68dfec5d-f7f7-4502-96fd-4873f3d54064', 'a801bdc6-1fdb-422d-9107-5a2d28604bcd', 'a1885c78-8938-4354-8b63-f2268b49c592', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiNDFkYmU0NDQtZTVlNC00NGI5LWIzMGItNzc3ZTZlZGFmMjRjIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzM2MjkyNjksImV4cCI6MTczMzY5NDA2OX0.oRfflp8yO53wkRfZhwV0p94ujnjO30OZIYplJSOM9Bk', '97759034047840245231412065486357416042566922454149315913502585280837294877787', '4567', '25473159691578761571114818683974782418962935358723553248996383658390135941589', '30744552411944231186786355426978478366394472622932447894665970271600055198193', '1301', '7907', 'S', NULL, NULL, NULL, NULL, NULL),
	('4f3a109b-2301-4151-bedc-9f9419ace428', 'tso', '2025-01-31', '16:00:49', 1738314049033, '2025-02-01', '10:00:49', 1738378849033, 'FWS', 'a8636b6e-1339-41de-a870-0fc9b3fe2061', 'bac41ba3-f2a2-4bea-a3f9-b7f5e60f7858', 'b23f482c-aa34-40a0-89f9-47dbe611777c', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiNGYzYTEwOWItMjMwMS00MTUxLWJlZGMtOWY5NDE5YWNlNDI4Iiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzgzMTQwNDksImV4cCI6MTczODM3ODg0OX0.D1eM1zUIv7H5WwefnDlACyBWAX6OywCx-cuOXNGHyz0', '91087486494545835045171941567930835005089116912891048250978079223390013120747', '1787', '24417188281387088854939853099841300903152720573597508254710569666360136840429', '86036529946013386931483791085544245274767057087484868792395536707160433682964', '8761', '7561', 'S', NULL, NULL, NULL, NULL, NULL),
	('56732ddf-9208-467e-b306-3b898f9f59c7', 'tso', '2024-12-18', '18:21:15', 1734520874778, '2024-12-19', '12:21:15', 1734585674778, 'FWS', '942039cd-07b4-41f4-ac5d-ef85e42f756e', '270f74b2-2dc3-4d4b-89e4-0e0b3a8caf2e', '7e1cf67f-3436-4738-bc56-2f7000d24713', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiNTY3MzJkZGYtOTIwOC00NjdlLWIzMDYtM2I4OThmOWY1OWM3Iiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzQ1MjA4NzQsImV4cCI6MTczNDU4NTY3NH0.ECvZUTlh7t95Djrjf-qZ-YRTQzOpOFlaqrZW2uDMgyY', '69216572670890087113625804689597338249046873587566464501511651204002616374033', '1721', '19080786871002481178558263674360044647946766790160201739123618044477178863101', '17038661142773409144303102953812449740637711352953872901951574348135016346869', '3617', '2063', 'S', NULL, NULL, NULL, NULL, NULL),
	('624a9da2-ef29-44e8-a198-f3f5d0d4885f', 'tso', '2025-01-28', '15:47:29', 1738054049148, '2025-02-27', '15:47:29', 1740646049148, 'FWS', '0d39e31a-c133-4bcb-8dce-a10476c15776', '10b440f7-52b8-4957-9295-f232c7d8e9e4', 'ed7cddfd-9796-4331-9bbd-8922246e0a1e', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiNjI0YTlkYTItZWYyOS00NGU4LWExOTgtZjNmNWQwZDQ4ODVmIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IkciLCJpYXQiOjE3MzgwNTQwNDksImV4cCI6MTc0MDY0NjA0OX0.vqQfSLie-3NuI33v13BzCGhDAqlf9L6Qanu74uoPwj8', NULL, NULL, NULL, NULL, NULL, NULL, 'G', NULL, NULL, NULL, NULL, NULL),
	('635a941c-3d68-4b7d-8962-7e04d71d4cbf', 'tester', '2025-02-07', '11:05:04', 1738901104087, '2025-02-08', '05:05:04', 1738965904087, 'FWS', 'b86462b2-8cc3-4117-8309-263fc1bc4137', 'a8a6f5f2-bf50-4e58-92a3-59b108a37a41', '3a1e82c9-53be-4aa3-b179-4e871a5c7fc8', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiNjM1YTk0MWMtM2Q2OC00YjdkLTg5NjItN2UwNGQ3MWQ0Y2JmIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidGVzdGVyIiwidHlwZSI6IlMiLCJpYXQiOjE3Mzg5MDExMDQsImV4cCI6MTczODk2NTkwNH0.Qroe3W2-5IdOSVdKXtYNvDmOu-hJBPpU9GidNDV5xik', '93117970626819213673833139449398911132850721458615219130532790346669509883223', '7823', '27579071248447486008251201185304065546221098276401684532923117342687529219261', '5484286412751350999870961258706558608717822554042899659512997890812644031245', '9721', '2549', 'S', NULL, NULL, NULL, NULL, NULL),
	('64ca80a5-c07a-4210-9e84-6061bc6e3d04', 'tso', '2025-03-31', '15:11:19', 1743408678593, '2025-04-01', '09:11:19', 1743473478593, 'FWS', '94286806-7b04-4612-9e6f-c0a8601e7b9a', 'f8742f00-3dbb-44f2-afeb-5507de488716', '0d081004-d928-4134-a0fc-84bec9085a18', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiNjRjYTgwYTUtYzA3YS00MjEwLTllODQtNjA2MWJjNmUzZDA0Iiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3NDM0MDg2NzgsImV4cCI6MTc0MzQ3MzQ3OH0.4LXRN_qAIEOIMlY3xOLAC0i2bVUxs5AuNz4irEDWyBs', '78106255644169950786305026899433024599328347054691637899591057392894160101617', '4241', '19874765607952864708961388022331497181035770494335041142631439509390319420157', '58655987214749437985036269947255542658884256847952270875146688361679849787761', '1627', '2069', 'S', NULL, NULL, NULL, NULL, NULL),
	('7ee83440-73e9-42a5-8824-16598eb399bc', 'tso', '2025-03-25', '14:25:39', 1742887539412, '2025-03-26', '08:25:39', 1742952339412, 'FWS', 'de681244-fcac-4ae0-8251-418c7ce416bd', 'a2a9c184-aac2-4265-a9d0-8de94578e28a', 'c9dab1c4-a9fd-4166-b6d4-62cf54a53639', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiN2VlODM0NDAtNzNlOS00MmE1LTg4MjQtMTY1OThlYjM5OWJjIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3NDI4ODc1MzksImV4cCI6MTc0Mjk1MjMzOX0.XuaPPL1jDicRAfcA85Mvw7U_Yfi77p2kZ30UPtgF7RA', '89371953488003600258411602082148023133663918402654642899113294529921577942451', '3719', '19125071331222720608825636225100803970586345068858765494894293275117586139141', '1428651189708017443863124314945142826769477188088529258918659214084644894246', '1381', '2161', 'S', NULL, NULL, NULL, NULL, NULL),
	('81c0b389-64ab-4e3e-b735-f0afc095e77d', 'tso', '2024-12-17', '10:32:49', 1734406368774, '2024-12-18', '04:32:49', 1734471168774, 'FWS', 'bf98f465-4e71-4384-a7bf-57342538fc77', 'e884ec10-66e3-4e1e-90d5-416cdfb4a8af', 'ad0c6f8e-1cf8-412b-8f6f-d887e9c666ca', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiODFjMGIzODktNjRhYi00ZTNlLWI3MzUtZjBhZmMwOTVlNzdkIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzQ0MDYzNjgsImV4cCI6MTczNDQ3MTE2OH0.j6Cm9lu6RzN2z4O8gEOpRQOf20uwycKxZAKOGgZZ9dE', '81631619881694819892966848758718013985810034519526222785388174994561710182287', '1481', '25910565752195105668074305417506075531088398692004713015352078309027392824701', '5405824611617974924158254313288091293043652881528431739018786471618317378464', '6229', '8941', 'S', NULL, NULL, NULL, NULL, NULL),
	('8421c835-1fae-44eb-b98f-528453d1f934', 'tso', '2024-12-18', '18:24:10', 1734521050483, '2024-12-19', '12:24:10', 1734585850483, 'FWS', 'c2066adc-da25-4953-b26c-d23cfc7d4e74', '99e30ad8-f969-48d8-81d9-5c8203530348', '274de7eb-bcb5-4eac-b961-870f8e7323e6', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiODQyMWM4MzUtMWZhZS00NGViLWI5OGYtNTI4NDUzZDFmOTM0Iiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzQ1MjEwNTAsImV4cCI6MTczNDU4NTg1MH0.1dU5JgKt3SUwb8lWet2BLaveHUqdBhGklvUWG-g_Vb8', '102347505786143084621077055332593919890447934102441818685092635132498460783673', '4651', '23860379976806401451789444532964945838487724136247051563015732162820358416403', '52602875171211719103455371566958576775390982749936649654607513490067368767832', '9749', '8623', 'S', NULL, NULL, NULL, NULL, NULL),
	('8ba5c7c8-42c9-490e-b8e3-80ca94dd26ba', 'tso', '2025-02-07', '10:54:41', 1738900480868, '2025-02-08', '04:54:41', 1738965280868, 'FWS', '253a0000-41ce-42db-ac27-7eadd5a937f2', '9f8b5d52-1f00-4a7c-8486-d4b52a8fea09', '155e159f-5ec2-4bfe-b6ff-10123596a8cb', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiOGJhNWM3YzgtNDJjOS00OTBlLWI4ZTMtODBjYTk0ZGQyNmJhIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3Mzg5MDA0ODAsImV4cCI6MTczODk2NTI4MH0.x0-zfhxtlfOHuyyx5FQKTuaU_wMirSgrgo0wyhuj2SI', '112505457378627939015542604209098655398641287689244810119094007992296702101907', '9719', '15143300256405583550151253254226249516372809181782406176138129083416409451127', '47472631391088909850948219335398654234803736472494586616503040678659534334914', '7109', '5347', 'S', NULL, NULL, NULL, NULL, NULL),
	('9cb36d7c-fdd9-4cd3-8836-d5aff19dfc8d', 'tso', '2025-01-30', '08:31:56', 1738200715684, '2025-01-31', '02:31:56', 1738265515684, 'FWS', '553a185e-505c-4f4f-90f9-5f388fbab5f6', '467fc70d-71f3-4c31-8fe7-7f8ac17aaee3', '414a12e7-279f-4ad6-ae70-1495fd1bf3f1', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiOWNiMzZkN2MtZmRkOS00Y2QzLTg4MzYtZDVhZmYxOWRmYzhkIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzgyMDA3MTUsImV4cCI6MTczODI2NTUxNX0.h-iC7rkisn7C3nkHnfpTe1ui5bNXTVbCeCR29g3J_o8', '93904722379952133269290719005472287754775473044131155796150045256848630234247', '4783', '20096313187788525540027839541322204535119165895053636343613733065603732487031', '17034536116845165651628926881258478654685482394253151383639029277313619885735', '4231', '2351', 'S', NULL, NULL, NULL, NULL, NULL),
	('9f4c9488-d059-4ec6-b98f-b0d3caddce5f', 'tso', '2025-03-25', '08:36:04', 1742866563582, '2025-03-26', '02:36:04', 1742931363582, 'FWS', 'd38c601f-5700-4264-a89d-df0aad21ab2f', '0d357d7f-72ec-4e26-9e55-e2a0bd71c30b', '4514b062-b14f-440d-8921-874ef63f0afb', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiOWY0Yzk0ODgtZDA1OS00ZWM2LWI5OGYtYjBkM2NhZGRjZTVmIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3NDI4NjY1NjMsImV4cCI6MTc0MjkzMTM2M30.uBMZ4cMXCXT2f3e2750YGowkRGupthP3_amtKeW6YuE', '103164240612084737758129510443726314331304933041803619785240373435939449169481', '5279', '20804884432302820010157647763219876879546189259315423708342001394672505815239', '50614156597598490149764244256963807412040573091844508526669149417616017579814', '4969', '6823', 'S', NULL, NULL, NULL, NULL, NULL),
	('a16299c0-1356-43ae-a58c-7f1b82216e92', 'tso', '2025-02-14', '08:46:07', 1739497566638, '2025-02-15', '02:46:07', 1739562366638, 'FWS', '9160100b-2f4f-46d9-a65f-81c72d81e2b8', 'd8db91a2-837d-4c6b-9931-077e26fae035', '5f25ae39-8ab8-4c14-b67d-ce750b1a3578', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiYTE2Mjk5YzAtMTM1Ni00M2FlLWE1OGMtN2YxYjgyMjE2ZTkyIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3Mzk0OTc1NjYsImV4cCI6MTczOTU2MjM2Nn0.AU5euz8zBpkitxSGH8MJLGRvIEoJvSrEmG2NPkKmbyQ', '61227500592746332678718218424060069580812892439700882027433211506572379567151', '3461', '16489163048941836639263105507204137562394424520666479769446744702712520400111', '28220094218241256598581009931479827913216846638994150154011707213517248492786', '9733', '9281', 'S', NULL, NULL, NULL, NULL, NULL),
	('aa082e4e-49fe-4b35-b68c-3c2e1bf0a38b', 'tso', '2025-02-11', '14:09:58', 1739257797659, '2025-02-12', '08:09:58', 1739322597659, 'FWS', '155ad7ac-9440-4d3b-8a34-126cf5161668', 'b8a8c43d-0dbf-4803-b672-349786a64b96', '298524a3-1c00-4815-98cd-4c1ebc33bf23', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiYWEwODJlNGUtNDlmZS00YjM1LWI2OGMtM2MyZTFiZjBhMzhiIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzkyNTc3OTcsImV4cCI6MTczOTMyMjU5N30.biDNNqNJ9HEump15ZLlIqnbGXoqJE4s0EvTVCJxFO4I', '86428922064663913527661465261636335635780783268002074804928948775012953487853', '9203', '24693397844610017415017381617420588960973806039244559225307624890329444571191', '77555305828008893993853795886419048957539505718222278175770480382229173141060', '6827', '4517', 'S', NULL, NULL, NULL, NULL, NULL),
	('c7710b7c-000b-466c-8540-c4a62bbf7478', 'tso', '2024-12-18', '19:50:48', 1734526248097, '2024-12-19', '13:50:48', 1734591048097, 'FWS', 'e8fdecd3-4135-45d5-9c23-fd5306ed010c', 'e0eac1da-93fb-4163-aa67-107f3db76f1e', 'c0e06ff7-02db-4c35-8a53-25e80ff9e770', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiYzc3MTBiN2MtMDAwYi00NjZjLTg1NDAtYzRhNjJiYmY3NDc4Iiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzQ1MjYyNDgsImV4cCI6MTczNDU5MTA0OH0.dhC_tUDUWdL8QKd6ranaekcyDb_z6-gelfrx--av0A0', '105395456246617525357734916807469394070826524897444267172222699749434705502613', '7537', '16942432080634941155616676933749709735248880233180846510285557457815378419007', '74657643148509834544814445572383434293279682660779594209011261284430942351771', '4177', '8243', 'S', NULL, NULL, NULL, NULL, NULL),
	('d793c764-3744-4122-bb94-a9689ede79ee', 'tso', '2025-01-28', '15:46:58', 1738054017986, '2025-01-29', '09:46:58', 1738118817986, 'FWS', 'dbf6aae4-7e09-4a11-94d7-10176e49f2d1', '47126746-ecd0-45fd-a147-dca2c4de0a43', 'ee8688f6-c586-45ea-8d6b-ca9ae56ec55c', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiZDc5M2M3NjQtMzc0NC00MTIyLWJiOTQtYTk2ODllZGU3OWVlIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzgwNTQwMTcsImV4cCI6MTczODExODgxN30.2PIzHKZwbSqnprYeE2wuxGt9zdWBlJMOq4tOsQjBEa0', '90736206173241343638316269775984726854860817385510448297580314042075915489113', '9221', '22344266909378856157571958123198127305580244157552913347444749317605012502927', '72540860504490242933851448481349143099987334130451737973853339826092862182610', '5869', '5171', 'S', NULL, NULL, NULL, NULL, NULL),
	('dd453b2a-a5d9-4963-bf51-fd4e539ce9e7', 'tso', '2025-03-03', '14:04:40', 1740985480046, '2025-03-04', '08:04:40', 1741050280046, 'FWS', 'a8febad8-9868-48c8-a236-2b244b4e32ed', 'bc773360-bded-4e95-baa6-66a214303769', '879bde8e-ecf0-4fe9-8ce2-09e7e9fba4d9', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiZGQ0NTNiMmEtYTVkOS00OTYzLWJmNTEtZmQ0ZTUzOWNlOWU3Iiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3NDA5ODU0ODAsImV4cCI6MTc0MTA1MDI4MH0.nOd0oRkgDgHsnPmA7Zw_k3Edhk3V0fyATkorhZJOnGU', '101307180453304945831569954314900039906217074260779682127966437035145186111237', '8713', '15637479817056788643776080954149403607661935634636612026295693177814995092431', '60976751176949026910161379766579761290057522532143838321256106271991815743147', '5011', '2143', 'S', NULL, NULL, NULL, NULL, NULL),
	('e534e08b-9d3a-4198-9166-87eb8f1a5089', 'tso', '2024-12-04', '16:09:12', 1733303351875, '2024-12-05', '10:09:12', 1733368151875, 'FWS', 'a65f9ffe-9c9b-4a34-86af-f6033fd27a20', '7efb88ca-de83-4182-a5b7-ba7791ac697a', '31444aef-7e87-4ab1-8ba8-bbb59ad03f2a', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiZTUzNGUwOGItOWQzYS00MTk4LTkxNjYtODdlYjhmMWE1MDg5Iiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzMzMDMzNTEsImV4cCI6MTczMzM2ODE1MX0.fs7gAKCd5fMUZ_-6pQdRczJC45tE_rPF7k0vhhF4HP0', '86390174775697662216420500282596682946926953707016416108235158662088069278173', '3359', '25099279612724672686563569566823059162055186362291897888188328616119802569471', '11711915955666405875364349457758743413553752039267217252126022895261339930316', '5237', '8461', 'S', NULL, NULL, NULL, NULL, NULL),
	('eab5156a-6d32-44be-aeae-882ba4cbbe04', 'tso', '2024-12-08', '10:32:34', 1733628753814, '2024-12-09', '04:32:34', 1733693553814, 'FWS', '999ea704-9fb2-44e8-adc2-b7b82c07f2ca', '682fb4fe-c86c-468f-9f08-9d418aa6cd60', 'c27773a3-8682-4b46-8a8c-9ab86d108e4f', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiZWFiNTE1NmEtNmQzMi00NGJlLWFlYWUtODgyYmE0Y2JiZTA0Iiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3MzM2Mjg3NTMsImV4cCI6MTczMzY5MzU1M30.dN0wfDQSw73XvSUQCCGwYKPWWkk2nEFXIfEL-zPfZbU', '113872964488443582964502780559838224766227845172712093326867084860077762003867', '1451', '27141275627417418917442099825062759451198514523623381926587916050975185031189', '2149797091295044016386272359872533114718663515313875297701396229803139677018', '4441', '3529', 'S', NULL, NULL, NULL, NULL, NULL),
	('ee9eb1d7-4353-4189-abc8-7b3e7942a236', 'tso', '2025-03-05', '09:27:22', 1741141642108, '2025-03-06', '03:27:22', 1741206442108, 'FWS', 'b4263a0a-f176-4ac8-9fe9-960adec03b90', '6166cdf3-3a3a-4a43-a983-8f9a87e28536', '18f9ea44-0fa4-4e02-801b-164fa10d280e', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiZWU5ZWIxZDctNDM1My00MTg5LWFiYzgtN2IzZTc5NDJhMjM2Iiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3NDExNDE2NDIsImV4cCI6MTc0MTIwNjQ0Mn0.V5-6NSZceqksKXSHNnphjKuiiVqFSnA7Re_60U4iSsY', '110601608814856154191299320301771814866395701467034421826156401446228866308623', '7297', '21807830009895495113580136525580911932952742911508984492795731697172607175213', '39043548056829702402026950396047656459523514457310948151255665870426721597626', '1117', '1933', 'S', NULL, NULL, NULL, NULL, NULL),
	('f24fbfa4-ab96-4bd4-88d5-e0e28dcad96c', 'tso', '2025-02-02', '10:14:12', 1738466051980, '2025-02-03', '04:14:12', 1738530851980, 'FWS', '73908f57-e186-4dd2-9520-c957eaae7d0f', '42381924-5257-42ad-bfee-b9fbce33f559', '3f8d108f-937d-4192-b158-8eb63f2ec8c0', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiZjI0ZmJmYTQtYWI5Ni00YmQ0LTg4ZDUtZTBlMjhkY2FkOTZjIiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3Mzg0NjYwNTEsImV4cCI6MTczODUzMDg1MX0.dq3O04S3gp-J3sZEXl-1hjnU6SYVrmipPGBCqaNxSXE', '67937178175074977206811607822880650090576103291234738820166605115837800458667', '3299', '23200069134871182431111134864588634956240584126921437213474498235668157955981', '26670354118828735328920635784810636693343129909693830509978974929299381735874', '5843', '8431', 'S', NULL, NULL, NULL, NULL, NULL),
	('f47fb787-6d68-4698-8b61-222fc9e98ff6', 'tso', '2025-02-07', '11:35:18', 1738902917547, '2025-02-08', '05:35:18', 1738967717547, 'FWS', '140f08a8-f9f2-4aac-8835-e3cb868e8c57', 'b0427e66-2213-4e2a-841a-38ab1350ef2b', 'a70da8f7-2d6b-43ab-8376-a6861e9ab090', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjoiZjQ3ZmI3ODctNmQ2OC00Njk4LThiNjEtMjIyZmM5ZTk4ZmY2Iiwic2l0ZSI6IkZXUyIsImFjY2Vzc29yIjoidHNvIiwidHlwZSI6IlMiLCJpYXQiOjE3Mzg5MDI5MTcsImV4cCI6MTczODk2NzcxN30.kJbXwHGEUL62HmxD14aQT-7NNDUBUrKMaqLHzCGXTOY', '58136811654538456259294579141587450299687851377297836660181572149814882802481', '2713', '21849729962754964460877817834398079411487946126552226596356429685757326035543', '48470912770810935530100009117073523174243073771949425942145507393840770461061', '2111', '2273', 'S', NULL, NULL, NULL, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
