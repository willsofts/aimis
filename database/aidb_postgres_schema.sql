
CREATE TABLE IF NOT EXISTS tagent (
  agentid varchar(10) NOT NULL,
  nameen varchar(50) NOT NULL,
  nameth varchar(50) NOT NULL,
  seqno int NOT NULL,
  PRIMARY KEY (agentid)
); 

CREATE TABLE IF NOT EXISTS tattachfile (
  attachid varchar(50) NOT NULL,
  attachno varchar(50) NOT NULL,
  attachtype varchar(10) NOT NULL,
  attachfile varchar(150) NOT NULL,
  sourcefile varchar(150) NOT NULL,
  attachdate date NOT NULL,
  attachtime time NOT NULL,
  attachmillis bigint NOT NULL,
  attachuser varchar(50) ,
  attachremark varchar(250) ,
  mimetype varchar(50) ,
  attachgroup varchar(50) ,
  attachpath varchar(350) ,
  attachurl varchar(250) ,
  attachsize bigint ,
  attachstream text,
  PRIMARY KEY (attachid)
);

CREATE INDEX idx_tattachfile_attachno ON tattachfile (attachno);


CREATE TABLE IF NOT EXISTS tdialect (
  dialectid varchar(10) NOT NULL,
  dialectalias varchar(10) NOT NULL,
  dialecttitle varchar(50) NOT NULL,
  dialectname varchar(50) NOT NULL,
  providedflag varchar(1) NOT NULL DEFAULT '0',
  urlflag varchar(1) NOT NULL DEFAULT '1',
  seqno int NOT NULL DEFAULT (0),
  dialectoptions text ,
  PRIMARY KEY (dialectid)
);

CREATE TABLE IF NOT EXISTS tfiltercategory (
  categoryid varchar(50) NOT NULL,
  categorycode varchar(50) NOT NULL,
  categoryname varchar(100) NOT NULL,
  categoryprompt text NOT NULL,
  categoryremark text ,
  createdate date ,
  createtime time ,
  createmillis bigint ,
  createuser varchar(50) ,
  editdate date ,
  edittime time ,
  editmillis bigint ,
  edituser varchar(50) ,
  PRIMARY KEY (categoryid)  
);

CREATE INDEX idx_tfiltercategory_categorycode ON tfiltercategory (categorycode);


CREATE TABLE IF NOT EXISTS tfiltercategorygroup (
  categoryid varchar(50) NOT NULL,
  groupid varchar(50) NOT NULL,
  PRIMARY KEY (categoryid,groupid) 
);

CREATE TABLE IF NOT EXISTS tfilterdocument (
  filterid varchar(50) NOT NULL,
  attachid varchar(50) NOT NULL ,
  groupid varchar(50) NOT NULL ,
  filtertitle varchar(250) ,
  filtername varchar(250) ,
  filterplace varchar(250) ,
  filterprofile text ,
  filterskill text,
  filtercategory text ,
  filterremark text,
  filterprompt text,
  filterdate date ,
  filterfile varchar(250) ,
  createdate date ,
  createtime time ,
  createmillis bigint ,
  createuser varchar(50) ,
  editdate date ,
  edittime time ,
  editmillis bigint ,
  edituser varchar(50) ,
  PRIMARY KEY (filterid) 
);

CREATE INDEX idx_tfilterdocument_attachid ON tfilterdocument (attachid);
CREATE INDEX idx_tfilterdocument_groupid ON tfilterdocument (groupid);

CREATE TABLE IF NOT EXISTS tfiltergroup (
  groupid varchar(50) NOT NULL,
  groupname varchar(100) NOT NULL,
  prefixprompt text,
  suffixprompt text,
  jsonprompt text,
  skillprompt text,
  createdate date ,
  createtime time ,
  createmillis bigint ,
  createuser varchar(50) ,
  editdate date ,
  edittime time ,
  editmillis bigint ,
  edituser varchar(50) ,
  PRIMARY KEY (groupid) 
);

CREATE TABLE IF NOT EXISTS tfilterincategory (
  filterid varchar(50) NOT NULL ,
  categoryid varchar(50) NOT NULL ,
  PRIMARY KEY (filterid,categoryid) 
);

CREATE TABLE IF NOT EXISTS tfilterquest (
  filterid varchar(50) NOT NULL,
  filtername varchar(100) NOT NULL,
  agentid varchar(50) NOT NULL,
  prefixprompt text ,
  suffixprompt text ,
  jsonprompt text ,
  skillprompt text ,
  hookflag varchar(1) DEFAULT '0',
  webhook varchar(250) ,
  shareflag varchar(1) DEFAULT '0',
  createdate date ,
  createtime time ,
  createmillis bigint ,
  createuser varchar(50) ,
  editdate date ,
  edittime time ,
  editmillis bigint ,
  edituser varchar(50) ,
  PRIMARY KEY (filterid) 
);

CREATE TABLE IF NOT EXISTS tfilterquestforum (
  filterid varchar(50) NOT NULL,
  forumid varchar(50) NOT NULL,
  PRIMARY KEY (filterid,forumid)
);

CREATE TABLE IF NOT EXISTS tforum (
  forumid varchar(50) NOT NULL,
  forumcode varchar(50) NOT NULL,
  forumtitle varchar(50) NOT NULL,
  forumgroup varchar(10) NOT NULL DEFAULT 'DB' ,
  forumtype varchar(10) NOT NULL DEFAULT 'DB' ,
  forumagent varchar(50) ,
  forummodel varchar(50) ,
  forumdialect varchar(10) ,
  forumapi varchar(200) ,
  forumurl varchar(250) ,
  forumuser varchar(50) ,
  forumpassword varchar(50) ,
  forumdatabase varchar(50) ,
  forumdbversion varchar(250) ,
  forumhost varchar(50) ,
  forumport int DEFAULT '0',
  forumselected varchar(1) DEFAULT '0',
  forumsetting text ,
  forumtable text,
  forumremark text ,
  forumprompt text ,
  classifyprompt text,
  inactive varchar(1) DEFAULT '0' ,
  hookflag varchar(1) DEFAULT '0' ,
  webhook varchar(250) ,
  summaryid varchar(50)  ,
  ragflag varchar(1) DEFAULT '0' ,
  ragactive varchar(1) DEFAULT '0' ,
  raglimit int ,
  ragchunksize int ,
  ragchunkoverlap int ,
  ragnote text,
  createdate date ,
  createtime time ,
  createmillis bigint ,
  createuser varchar(50) ,
  editflag varchar(1) NOT NULL DEFAULT '1' ,
  shareflag varchar(1) NOT NULL DEFAULT '0' ,
  editdate date ,
  edittime time ,
  editmillis bigint ,
  edituser varchar(50) ,
  PRIMARY KEY (forumid)
);

CREATE INDEX idx_tforum_forumcode ON tforum (forumcode);

CREATE TABLE IF NOT EXISTS tforumagent (
  forumid varchar(50) NOT NULL,
  agentid varchar(10) NOT NULL,
  forumtable text ,
  forumprompt text ,
  forumremark text ,
  createdate date ,
  createtime time ,
  createmillis bigint ,
  createuser varchar(50) ,
  editdate date ,
  edittime time ,
  editmillis bigint ,
  edituser varchar(50) ,
  PRIMARY KEY (forumid,agentid)
);

CREATE TABLE IF NOT EXISTS tforumlog (
  logid varchar(50) NOT NULL,
  categoryid varchar(50) ,
  correlationid varchar(50) ,
  questionid varchar(50) ,
  classifyid varchar(50) ,
  textcontents text,
  createdate date ,
  createtime time ,
  createmillis bigint ,
  createuser varchar(50) ,
  authtoken varchar(350) ,
  remarkcontents text,
  PRIMARY KEY (logid)
);
CREATE INDEX idx_tforumlog_correlationid ON tforumlog (correlationid);
CREATE INDEX idx_tforumlog_authtoken ON tforumlog (authtoken);
CREATE INDEX idx_tforumlog_createuser ON tforumlog (createuser);
CREATE INDEX idx_tforumlog_categoryid ON tforumlog (categoryid);

CREATE TABLE IF NOT EXISTS tforumquest (
  forumid varchar(50) NOT NULL,
  questid varchar(50) NOT NULL,
  question varchar(200) NOT NULL,
  seqno int NOT NULL DEFAULT (0),
  PRIMARY KEY (questid)
);
CREATE INDEX idx_tforumquest_forumid ON tforumquest (forumid);

CREATE TABLE IF NOT EXISTS tsummarydocument (
  summaryid varchar(50) NOT NULL,
  summarytitle varchar(200) NOT NULL,
  summaryagent varchar(50) ,
  summarymodel varchar(50) ,
  summaryfile varchar(200) ,
  summaryflag varchar(1) DEFAULT '0',
  summaryprompt text,
  summarydocument text ,
  shareflag varchar(1) DEFAULT '0',
  inactive varchar(1) DEFAULT '0',
  ragflag varchar(1) DEFAULT '0',
  ragactive varchar(1) DEFAULT '0',
  raglimit int ,
  ragchunksize int ,
  ragchunkoverlap int ,
  ragnote text,
  createdate date ,
  createtime time ,
  createmillis bigint ,
  createuser varchar(50) ,
  editdate date ,
  edittime time ,
  editmillis bigint ,
  edituser varchar(50) ,
  PRIMARY KEY (summaryid)
);

CREATE TABLE IF NOT EXISTS ttextconfig (
  docid varchar(50) NOT NULL,
  doctitle varchar(100) NOT NULL,
  docfile varchar(50) ,
  inactive varchar(1) DEFAULT '0',
  captions text,
  createdate date ,
  createtime time ,
  createmillis bigint ,
  createuser varchar(50) ,
  editdate date ,
  edittime time ,
  editmillis bigint ,
  edituser varchar(50) ,
  PRIMARY KEY (docid)
);

CREATE TABLE IF NOT EXISTS ttokenusage (
  site varchar(50) ,
  userid varchar(50) ,
  useruuid varchar(50) ,
  authtoken varchar(350) ,
  tokentype varchar(10) ,
  createdate date ,
  createtime time ,
  createmillis bigint ,
  createuser varchar(50) ,
  usagetype varchar(10) ,
  agentid varchar(50) ,
  modelid varchar(50) ,
  categoryid varchar(50) ,
  classifyid varchar(50) ,
  tokencount bigint ,
  questionid varchar(50) ,
  correlation varchar(350) 
);
CREATE INDEX idx_ttokenusage_authtoken ON ttokenusage (authtoken);

