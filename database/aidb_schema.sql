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


-- Dumping database structure for aidb
CREATE DATABASE IF NOT EXISTS `aidb` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `aidb`;

-- Dumping structure for table aidb.tagent
CREATE TABLE IF NOT EXISTS `tagent` (
  `agentid` varchar(10) NOT NULL,
  `nameen` varchar(50) NOT NULL,
  `nameth` varchar(50) NOT NULL,
  `seqno` int NOT NULL,
  PRIMARY KEY (`agentid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep ai agent';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tattachfile
CREATE TABLE IF NOT EXISTS `tattachfile` (
  `attachid` varchar(50) NOT NULL,
  `attachno` varchar(50) NOT NULL,
  `attachtype` varchar(10) NOT NULL,
  `attachfile` varchar(150) NOT NULL,
  `sourcefile` varchar(150) NOT NULL,
  `attachdate` date NOT NULL,
  `attachtime` time NOT NULL,
  `attachmillis` bigint NOT NULL,
  `attachuser` varchar(50) DEFAULT NULL,
  `attachremark` varchar(250) DEFAULT NULL,
  `mimetype` varchar(50) DEFAULT NULL,
  `attachgroup` varchar(50) DEFAULT NULL,
  `attachpath` varchar(350) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `attachurl` varchar(250) DEFAULT NULL,
  `attachsize` bigint DEFAULT NULL,
  `attachstream` longtext,
  PRIMARY KEY (`attachid`),
  KEY `attachno` (`attachno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep attach file';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tdialect
CREATE TABLE IF NOT EXISTS `tdialect` (
  `dialectid` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `dialectalias` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `dialecttitle` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `dialectname` varchar(50) NOT NULL,
  `providedflag` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '0',
  `urlflag` varchar(1) NOT NULL DEFAULT '1',
  `seqno` int NOT NULL DEFAULT (0),
  `dialectoptions` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  PRIMARY KEY (`dialectid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep database dialect info';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tfiltercategory
CREATE TABLE IF NOT EXISTS `tfiltercategory` (
  `categoryid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `categorycode` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `categoryname` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `categoryprompt` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `categoryremark` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `createdate` date DEFAULT NULL,
  `createtime` time DEFAULT NULL,
  `createmillis` bigint DEFAULT NULL,
  `createuser` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `editmillis` bigint DEFAULT NULL,
  `edituser` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`categoryid`) USING BTREE,
  UNIQUE KEY `categorycode` (`categorycode`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep category of filtering';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tfiltercategorygroup
CREATE TABLE IF NOT EXISTS `tfiltercategorygroup` (
  `categoryid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'tfiltercategory.categoryid',
  `groupid` varchar(50) NOT NULL COMMENT 'tfiltergroup.groupid',
  PRIMARY KEY (`categoryid`,`groupid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep filter category in group';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tfilterdocument
CREATE TABLE IF NOT EXISTS `tfilterdocument` (
  `filterid` varchar(50) NOT NULL,
  `attachid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'tattachfile.attachid',
  `groupid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'tfiltergroup.groupid',
  `filtertitle` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `filtername` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `filterplace` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `filterprofile` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `filterskill` text,
  `filtercategory` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `filterremark` text,
  `filterprompt` text,
  `filterdate` date DEFAULT NULL,
  `filterfile` varchar(250) DEFAULT NULL,
  `createdate` date DEFAULT NULL,
  `createtime` time DEFAULT NULL,
  `createmillis` bigint DEFAULT NULL,
  `createuser` varchar(50) DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `editmillis` bigint DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`filterid`),
  KEY `attachid` (`attachid`),
  KEY `filtertype` (`groupid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep filter documents';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tfiltergroup
CREATE TABLE IF NOT EXISTS `tfiltergroup` (
  `groupid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `groupname` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `prefixprompt` text,
  `suffixprompt` text,
  `jsonprompt` text,
  `skillprompt` text,
  `createdate` date DEFAULT NULL,
  `createtime` time DEFAULT NULL,
  `createmillis` bigint DEFAULT NULL,
  `createuser` varchar(50) DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `editmillis` bigint DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`groupid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep filter group';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tfilterincategory
CREATE TABLE IF NOT EXISTS `tfilterincategory` (
  `filterid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'tfilterdocument.filterid',
  `categoryid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'tfiltercategory.categoryid',
  PRIMARY KEY (`filterid`,`categoryid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep filter in categories';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tfilterquest
CREATE TABLE IF NOT EXISTS `tfilterquest` (
  `filterid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `filtername` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `agentid` varchar(50) NOT NULL COMMENT 'tagent.agentid',
  `prefixprompt` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `suffixprompt` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `jsonprompt` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `skillprompt` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `hookflag` varchar(1) DEFAULT '0' COMMENT '1=Hook',
  `webhook` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `shareflag` varchar(1) DEFAULT '0' COMMENT '1=Sharing',
  `createdate` date DEFAULT NULL,
  `createtime` time DEFAULT NULL,
  `createmillis` bigint DEFAULT NULL,
  `createuser` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `editmillis` bigint DEFAULT NULL,
  `edituser` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`filterid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep filter quest';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tfilterquestforum
CREATE TABLE IF NOT EXISTS `tfilterquestforum` (
  `filterid` varchar(50) NOT NULL COMMENT 'tfilterquest.filterid',
  `forumid` varchar(50) NOT NULL COMMENT 'tforum.forumid',
  PRIMARY KEY (`filterid`,`forumid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep forum setting in quest';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tforum
CREATE TABLE IF NOT EXISTS `tforum` (
  `forumid` varchar(50) NOT NULL,
  `forumcode` varchar(50) NOT NULL,
  `forumtitle` varchar(50) NOT NULL,
  `forumgroup` enum('DB','DOC','NOTE') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'DB' COMMENT 'DB=Database,DOC=Document',
  `forumtype` enum('DB','API') NOT NULL DEFAULT 'DB' COMMENT 'DB=Direct Access Database, API=API Service',
  `forumagent` varchar(50) DEFAULT NULL,
  `forummodel` varchar(50) DEFAULT NULL,
  `forumdialect` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT 'tdialect.dialectid',
  `forumapi` varchar(200) DEFAULT NULL,
  `forumurl` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `forumuser` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `forumpassword` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `forumdatabase` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `forumdbversion` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `forumhost` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `forumport` int DEFAULT '0',
  `forumselected` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '0',
  `forumsetting` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `forumtable` text,
  `forumremark` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `forumprompt` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `classifyprompt` text,
  `inactive` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '0' COMMENT '1=Inactive',
  `hookflag` varchar(1) DEFAULT '0' COMMENT '1=Hook',
  `webhook` varchar(250) DEFAULT NULL,
  `summaryid` varchar(50) DEFAULT NULL COMMENT 'tsummarydocument.summaryid',
  `ragflag` varchar(1) DEFAULT '0' COMMENT '1=RAG',
  `ragactive` varchar(1) DEFAULT '0' COMMENT '1=Active',
  `raglimit` int DEFAULT NULL,
  `ragchunksize` int DEFAULT NULL,
  `ragchunkoverlap` int DEFAULT NULL,
  `ragnote` text,
  `createdate` date DEFAULT NULL,
  `createtime` time DEFAULT NULL,
  `createmillis` bigint DEFAULT NULL,
  `createuser` varchar(50) DEFAULT NULL,
  `editflag` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '1' COMMENT '1=Can Edit',
  `shareflag` varchar(1) NOT NULL DEFAULT '0' COMMENT '1=Sharing',
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `editmillis` bigint DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`forumid`),
  KEY `forumcode` (`forumcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep forum information';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tforumagent
CREATE TABLE IF NOT EXISTS `tforumagent` (
  `forumid` varchar(50) NOT NULL,
  `agentid` varchar(10) NOT NULL,
  `forumtable` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `forumprompt` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `forumremark` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `createdate` date DEFAULT NULL,
  `createtime` time DEFAULT NULL,
  `createmillis` bigint DEFAULT NULL,
  `createuser` varchar(50) DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `editmillis` bigint DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`forumid`,`agentid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep forum setting by agent';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tforumlog
CREATE TABLE IF NOT EXISTS `tforumlog` (
  `logid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `categoryid` varchar(50) DEFAULT NULL,
  `correlationid` varchar(50) DEFAULT NULL,
  `questionid` varchar(50) DEFAULT NULL,
  `classifyid` varchar(50) DEFAULT NULL,
  `textcontents` text,
  `createdate` date DEFAULT NULL,
  `createtime` time DEFAULT NULL,
  `createmillis` bigint DEFAULT NULL,
  `createuser` varchar(50) DEFAULT NULL,
  `authtoken` varchar(350) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `remarkcontents` text,
  PRIMARY KEY (`logid`) USING BTREE,
  KEY `correlationid` (`correlationid`),
  KEY `authtoken` (`authtoken`),
  KEY `createuser` (`createuser`),
  KEY `categoryid` (`categoryid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep history log';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tforumquest
CREATE TABLE IF NOT EXISTS `tforumquest` (
  `forumid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT 'tforum.forumid',
  `questid` varchar(50) NOT NULL,
  `question` varchar(200) NOT NULL,
  `seqno` int NOT NULL DEFAULT (0),
  PRIMARY KEY (`questid`),
  KEY `forumid` (`forumid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep example question';

-- Data exporting was unselected.

-- Dumping structure for table aidb.tsummarydocument
CREATE TABLE IF NOT EXISTS `tsummarydocument` (
  `summaryid` varchar(50) NOT NULL,
  `summarytitle` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `summaryagent` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `summarymodel` varchar(50) DEFAULT NULL,
  `summaryfile` varchar(200) DEFAULT NULL,
  `summaryflag` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT '0' COMMENT '1=Processed',
  `summaryprompt` text,
  `summarydocument` longtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `shareflag` varchar(1) DEFAULT '0' COMMENT '1=Sharing',
  `inactive` varchar(1) DEFAULT '0' COMMENT '1=Inactive',
  `ragflag` varchar(1) DEFAULT '0' COMMENT '1=RAG',
  `ragactive` varchar(1) DEFAULT '0' COMMENT '1=Active',
  `raglimit` int DEFAULT NULL,
  `ragchunksize` int DEFAULT NULL,
  `ragchunkoverlap` int DEFAULT NULL,
  `ragnote` text,
  `createdate` date DEFAULT NULL,
  `createtime` time DEFAULT NULL,
  `createmillis` bigint DEFAULT NULL,
  `createuser` varchar(50) DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `editmillis` bigint DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`summaryid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep summary document';

-- Data exporting was unselected.

-- Dumping structure for table aidb.ttextconfig
CREATE TABLE IF NOT EXISTS `ttextconfig` (
  `docid` varchar(50) NOT NULL,
  `doctitle` varchar(100) NOT NULL,
  `docfile` varchar(50) DEFAULT NULL,
  `inactive` varchar(1) DEFAULT '0' COMMENT '1=Inactive',
  `captions` text,
  `createdate` date DEFAULT NULL,
  `createtime` time DEFAULT NULL,
  `createmillis` bigint DEFAULT NULL,
  `createuser` varchar(50) DEFAULT NULL,
  `editdate` date DEFAULT NULL,
  `edittime` time DEFAULT NULL,
  `editmillis` bigint DEFAULT NULL,
  `edituser` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`docid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table text document configuration';

-- Data exporting was unselected.

-- Dumping structure for table aidb.ttokenusage
CREATE TABLE IF NOT EXISTS `ttokenusage` (
  `site` varchar(50) DEFAULT NULL,
  `userid` varchar(50) DEFAULT NULL,
  `useruuid` varchar(50) DEFAULT NULL,
  `authtoken` varchar(350) DEFAULT NULL,
  `tokentype` varchar(10) DEFAULT NULL,
  `createdate` date DEFAULT NULL,
  `createtime` time DEFAULT NULL,
  `createmillis` bigint DEFAULT NULL,
  `createuser` varchar(50) DEFAULT NULL,
  `usagetype` varchar(10) DEFAULT NULL,
  `agentid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `modelid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `categoryid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `classifyid` varchar(50) DEFAULT NULL,
  `tokencount` bigint DEFAULT NULL,
  `questionid` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `correlation` varchar(350) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  KEY `authtoken` (`authtoken`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='table keep token usage';

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
