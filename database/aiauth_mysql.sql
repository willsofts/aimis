/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `aiauth` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aiauth`;

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


CREATE TABLE IF NOT EXISTS `tconfig` (
  `category` varchar(50) NOT NULL,
  `colname` varchar(50) NOT NULL,
  `colvalue` varchar(250) DEFAULT NULL,
  `colflag` varchar(1) DEFAULT NULL COMMENT 'G=Global Config',
  `seqno` int DEFAULT '0',
  `remarks` text,
  PRIMARY KEY (`category`,`colname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='keep program custom configuration';

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

CREATE TABLE IF NOT EXISTS `tconstant` (
  `typename` varchar(50) NOT NULL,
  `typeid` varchar(50) NOT NULL,
  `nameen` varchar(100) NOT NULL,
  `nameth` varchar(100) NOT NULL,
  `seqno` int DEFAULT NULL,
  `iconfile` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`typename`,`typeid`)
) ENGINE=InnoDB DEFAULT CHARSET=tis620 COMMENT='table keep constant/category description';

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

CREATE TABLE IF NOT EXISTS `tcpwd` (
  `userid` varchar(60) NOT NULL,
  `category` varchar(50) NOT NULL,
  `contents` varchar(150) NOT NULL,
  PRIMARY KEY (`userid`,`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table category of password policy';


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

CREATE TABLE IF NOT EXISTS `tnpwd` (
  `reservenum` varchar(50) NOT NULL,
  `remarks` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`reservenum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep number restriction in password prohibition';

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

INSERT INTO `tppwd` (`userid`, `checkreservepwd`, `checkpersonal`, `checkmatchpattern`, `checkmatchnumber`, `timenotusedoldpwd`, `alertbeforeexpire`, `pwdexpireday`, `notloginafterday`, `notchgpwduntilday`, `minpwdlength`, `alphainpwd`, `otherinpwd`, `maxsamechar`, `mindiffchar`, `maxarrangechar`, `loginfailtime`, `fromip`, `toip`, `starttime`, `endtime`, `groupflag`, `maxloginfailtime`, `checkdictpwd`, `maxpwdlength`, `digitinpwd`, `upperinpwd`, `lowerinpwd`) VALUES
	('DEFAULT', '1', '1', '0', '1', 0, 0, 120, 0, 7, 3, 0, 1, 0, 0, 0, 0, NULL, NULL, NULL, NULL, '1', 0, 0, 0, 1, 1, 1);

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

INSERT INTO `tprod` (`product`, `nameen`, `nameth`, `seqno`, `serialid`, `startdate`, `url`, `capital`, `verified`, `centerflag`, `iconfile`, `editdate`, `edittime`, `edituser`) VALUES
	('AI', 'AI Module', 'AI Module', 90, NULL, NULL, NULL, NULL, '0', '1', 'prompt.png', NULL, NULL, NULL),
	('PROMPT', 'Prompt Module', 'Prompt Module', 99, NULL, NULL, NULL, NULL, '0', '1', 'prompt.png', NULL, NULL, NULL);

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

INSERT INTO `tprog` (`product`, `programid`, `progname`, `prognameth`, `progtype`, `appstype`, `description`, `parameters`, `progsystem`, `iconfile`, `iconstyle`, `shortname`, `shortnameth`, `progpath`, `editdate`, `edittime`, `edituser`) VALUES
	('AI', 'ask', 'Ask Me', 'Ask Me', 'F', 'W', 'Ask Me', NULL, 'F', NULL, NULL, 'Ask', 'Ask', '/show/html/ask', NULL, NULL, NULL),
	('AI', 'chatdoc', 'Chat Doc', 'Chat Doc', 'F', 'W', 'Chat Doc', NULL, 'F', '', NULL, 'Chat Doc', 'Chat Doc', '/show/html/chatdoc', NULL, NULL, NULL),
	('AI', 'chatimage', 'Chat Image', 'Chat Image', 'F', 'W', 'Chat Image', NULL, 'F', '', NULL, 'Chat Image', 'Chat Image', '/show/html/chatimage', NULL, NULL, NULL),
	('AI', 'chatimageollama', 'Chat Image Vision', 'Chat Image Vision', 'F', 'W', 'Chat Image Vision', NULL, 'F', '', NULL, 'Image Vision', 'Image Vision', '/show/html/chatimageollama', NULL, NULL, NULL),
	('AI', 'chatnote', 'Chat Note', 'Chat Note', 'F', 'W', 'Chat Note', NULL, 'F', '', NULL, 'Chat Note', 'Chat Note', '/show/html/chatnote', NULL, NULL, NULL),
	('AI', 'chatpdf', 'Chat PDF', 'Chat PDF', 'F', 'W', 'Chat PDF', '', 'F', '', NULL, 'Chat PDF', 'Chat PDF', '/show/html/chatpdf', NULL, NULL, NULL),
	('AI', 'filterdoc', 'Classify Doc', 'Classify Doc', 'F', 'W', 'Classify Doc', NULL, 'F', '', NULL, 'Classify Doc', 'Classify Doc', NULL, NULL, NULL, NULL),
	('AI', 'ocr', 'OCR Me', 'OCR Me', 'F', 'W', 'OCR Me', NULL, 'F', NULL, NULL, 'OCR', 'OCR', '/show/html/ocr', NULL, NULL, NULL),
	('AI', 'quest', 'Question & Answer', 'Question & Answer', 'F', 'W', 'Question & Answer', NULL, 'F', NULL, 'fa fa-th', 'Q&A', 'Q&A', '/show/html/quest', NULL, NULL, NULL),
	('PROMPT', 'sftu004', 'Access Token', 'Access Token', 'F', 'W', 'Access Token', NULL, 'F', 'sftu004.png', NULL, 'Token', 'Token', NULL, NULL, NULL, NULL),
	('AI', 'vision', 'Vision Me', 'Vision Me', 'F', 'W', 'Vision Me', NULL, 'F', NULL, NULL, 'Vision', 'Vision', '/show/html/vision', NULL, NULL, NULL);

CREATE TABLE IF NOT EXISTS `tproggrp` (
  `groupname` varchar(50) NOT NULL COMMENT 'tgroup.groupname',
  `programid` varchar(20) NOT NULL COMMENT 'tprog.programid',
  `parameters` varchar(100) DEFAULT NULL,
  `seqno` int DEFAULT '0',
  PRIMARY KEY (`groupname`,`programid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep program by group';

INSERT INTO `tproggrp` (`groupname`, `programid`, `parameters`, `seqno`) VALUES
	('MENU', 'ask', NULL, 2),
	('MENU', 'chatdoc', NULL, 6),
	('MENU', 'chatimage', NULL, 8),
	('MENU', 'chatimageollama', NULL, 9),
	('MENU', 'chatnote', NULL, 7),
	('MENU', 'chatpdf', NULL, 5),
	('MENU', 'filterdoc', NULL, 10),
	('MENU', 'ocr', NULL, 4),
	('MENU', 'quest', NULL, 1),
	('MENU', 'vision', NULL, 3),
	('SETTING', 'sftu004', NULL, 1);

CREATE TABLE IF NOT EXISTS `trpwd` (
  `reservepwd` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`reservepwd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

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

INSERT INTO `ttemplate` (`template`, `templatetype`, `subjecttitle`, `contents`, `contexts`, `editdate`, `edittime`, `edituser`) VALUES
	('USER_FORGOT', 'MAIL_NOTIFY', 'Confirm Password Changed', 'Dear, ${userfullname}.<br/>\r\nConfirm your password was changed.<br/>\r\nuser = ${username}<br>\r\npassword = ${userpassword}<br>\r\nyours sincerely,<br>		\r\nAdministrator<br/>', 'Dear, ${userfullname}.<br/>\r\nConfirm your password was changed.<br/>\r\nuser = ${username}<br>\r\npassword = ${userpassword}<br>\r\nyours sincerely,<br>		\r\nAdministrator<br/>', NULL, NULL, NULL),
	('USER_INFO', 'MAIL_NOTIFY', 'Confirm New Account', '<p>Dear, ${userfullname}.<br />New account was created for access system.<br />To confirm, please kindly use information below.<br />user = ${username}<br />password = ${userpassword}<br />yours sincerely,<br />Administrator</p>', '<p>Dear, ${userfullname}.<br />New account was created for access system.<br />To confirm, please kindly use information below.<br />user = ${username}<br />password = ${userpassword}<br />yours sincerely,<br />Administrator</p>', '2023-10-26', '10:41:22', 'tso');

CREATE TABLE IF NOT EXISTS `tupwd` (
  `serverdatetime` datetime DEFAULT NULL,
  `systemdate` date NOT NULL DEFAULT '0000-00-00',
  `userid` varchar(50) NOT NULL DEFAULT '',
  `userpassword` varchar(200) NOT NULL DEFAULT '',
  `edituserid` varchar(50) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


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
	('tester', 'tester@freewill.com', 'FWS', NULL, NULL, 'A', '$2a$10$lDY.QbMZp./3KLS3uGpu3OHypOk4itewChD2.2jrtsgQmGaJ2BayS', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, 0, 0, '0', 'O', NULL, '2024-09-17', '13:47:15', 12, '0', '0', '0', '0', '0', '0', 0, 0, '2021-05-16', '10:26:46', 'tso'),
	('tso', 'tso@freewill.com', 'FWS', NULL, NULL, 'A', '$2a$10$XxaiWYBcRIglzgJ9MF3toO6ZpUh6dv/XDEFlPsPtkpS583Hiuqz/y', '2025-03-11', '2024-11-11', '10:16:03', '1', '1', '0', '', '', 0, 0, '0', 'A', '', '2024-12-04', '13:23:06', 7223, '0', '1', '1', '0', '0', '0', 0, 0, '2023-09-14', '16:57:56', 'tso'),
	('ttso', 'ttso@freewill.com', 'FWS', NULL, NULL, 'A', '$2a$10$XxaiWYBcRIglzgJ9MF3toO6ZpUh6dv/XDEFlPsPtkpS583Hiuqz/y', '2025-07-28', '2022-03-30', '09:21:19', NULL, '0', '0', NULL, NULL, 0, 0, '0', 'E', NULL, '2024-12-04', '12:56:25', 339, '0', '0', '0', '0', '0', '0', 0, 0, NULL, NULL, NULL);

CREATE TABLE IF NOT EXISTS `tuserbranch` (
  `site` varchar(50) NOT NULL COMMENT 'tcomp.site',
  `branch` varchar(20) NOT NULL COMMENT 'tcompbranch.branch',
  `userid` varchar(50) NOT NULL COMMENT 'tuser.userid',
  PRIMARY KEY (`site`,`branch`,`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user access comp branchs';


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


CREATE TABLE IF NOT EXISTS `tusergrp` (
  `userid` varchar(50) NOT NULL DEFAULT '' COMMENT 'tuser.userid',
  `groupname` varchar(50) NOT NULL DEFAULT '' COMMENT 'tgroup.groupname',
  `rolename` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`userid`,`groupname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user in group';

INSERT INTO `tusergrp` (`userid`, `groupname`, `rolename`) VALUES
	('tso', 'MENU', NULL),
	('tso', 'SETTING', NULL);

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

INSERT INTO `tuserinfo` (`site`, `employeeid`, `userid`, `userbranch`, `usertname`, `usertsurname`, `userename`, `useresurname`, `displayname`, `accessdate`, `accesstime`, `photoimage`, `email`, `gender`, `lineid`, `mobile`, `langcode`, `birthday`, `inactive`, `editdate`, `edittime`, `edituser`, `remarks`, `usercontents`) VALUES
	('FWS', 'adminis', 'adminis', '00', 'FWS', 'Administrator', 'FWS', 'Administrator', 'FWS_Adm', '2022-08-30', '09:22:06', 'photo_fwg_fwgadmin.jpg', 'admin@freewillsolutions.com', 'M', NULL, NULL, NULL, NULL, '0', '2021-05-16', '10:27:01', 'tso', 'sfte007', NULL),
	('FWS', 'test1', 'test1', NULL, 'Test1', 'Test', 'Test1', 'Test', 'Test1_Tes', '2023-09-27', '16:18:12', NULL, 'test1@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test2', 'test2', NULL, 'Test2', 'Test', 'Test2', 'Test', 'Test2_Tes', NULL, NULL, NULL, 'test2@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test3', 'test3', NULL, 'Test3', 'Test', 'Test3', 'Test', 'Test3_Tes', NULL, NULL, NULL, 'test3@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test4', 'test4', NULL, 'Test4', 'Test', 'Test4', 'Test', 'Test4_Tes', NULL, NULL, NULL, 'test4@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test5', 'test5', NULL, 'Test5', 'Test', 'Test5', 'Test', 'Test5_Tes', NULL, NULL, NULL, 'test5@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test6', 'test6', NULL, 'Test6', 'Test', 'Test6', 'Test', 'Test6_Tes', NULL, NULL, NULL, 'test6@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test7', 'test7', NULL, 'Test7', 'Test', 'Test7', 'Test', 'Test7_Tes', NULL, NULL, NULL, 'test7@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test8', 'test8', NULL, 'Test8', 'Test', 'Test8', 'Test', 'Test8_Tes', NULL, NULL, NULL, 'test8@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, NULL),
	('FWS', 'test9', 'test9', NULL, 'Test9', 'Test', 'Test9', 'Test', 'Test9_Tes', NULL, NULL, NULL, 'test9@gmail.com', NULL, NULL, NULL, NULL, NULL, '0', '2023-09-14', '16:35:54', 'tso', 'sfte007', NULL),
	('FWS', 'tester', 'tester', NULL, 'Tester', 'Test', 'Tester', 'Test', 'Tester_Tes', '2024-09-17', '13:47:15', NULL, 'tester@gmail.com', 'M', NULL, NULL, NULL, NULL, '0', '2021-05-16', '10:26:46', 'tso', 'sfte007', NULL),
	('FWS', 'tso', 'tso', '00', 'Tassan', 'Oros', 'Tassan', 'Oros', 'Tassan_oro', '2024-12-04', '13:23:06', 'photo_fwg_tso.png', 'tassun_oro1@hotmail.com', 'M', 'tassun_oro', '0955941678', 'EN', NULL, '0', '2024-10-02', '15:15:39', 'tso', 'sfte007', '{"companion":"qby1"}'),
	('FWS', 'ttso', 'ttso', '00', 'Tassun', 'Oros', 'Tassun', 'Oros', 'Tassun_Oro', '2024-12-04', '12:56:25', NULL, 'tassunoros@gmail.com', 'M', NULL, NULL, NULL, NULL, '0', NULL, NULL, NULL, NULL, '{"companion":"tama1"}');

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
  `remarks` text,
  `usercontents` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user info (employee info)';


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


CREATE TABLE IF NOT EXISTS `tuserrole` (
  `userid` varchar(50) NOT NULL COMMENT 'tuser.userid',
  `roleid` varchar(50) NOT NULL COMMENT 'trole.roleid',
  PRIMARY KEY (`userid`,`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep user in roles';


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


/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
