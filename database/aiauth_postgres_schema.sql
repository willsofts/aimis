
CREATE TABLE IF NOT EXISTS tactivate (
  activatekey varchar(100) NOT NULL,
  activateuser varchar(100) NOT NULL,
  transtime bigint ,
  expiretime bigint ,
  senddate date ,
  sendtime time ,
  expiredate date ,
  activatedate date ,
  activatetime time ,
  activatecount int ,
  activatetimes int ,
  activatestatus varchar(1) ,
  activatecategory varchar(50) ,
  activatelink varchar(200) ,
  activatepage varchar(200) ,
  activateremark varchar(200) ,
  activateparameter varchar(200) ,
  activatemessage varchar(200) ,
  activatecontents text,
  PRIMARY KEY (activatekey,activateuser)
);

CREATE TABLE IF NOT EXISTS tactivatehistory (
  activatekey varchar(100) NOT NULL,
  activateuser varchar(100) NOT NULL,
  transtime bigint ,
  expiretime bigint ,
  senddate date ,
  sendtime time ,
  expiredate date ,
  activatedate date ,
  activatetime time ,
  activatecount int ,
  activatetimes int ,
  activatestatus varchar(1) ,
  activatecategory varchar(50) ,
  activatelink varchar(200) ,
  activatepage varchar(200) ,
  activateremark varchar(200) ,
  activateparameter varchar(200) ,
  activatemessage varchar(200) ,
  activatecontents text
);

CREATE TABLE IF NOT EXISTS tcaptcha (
  capid varchar(50) NOT NULL,
  captext varchar(50) NOT NULL,
  capanswer varchar(50) NOT NULL,
  createdate date NOT NULL,
  createtime time NOT NULL,
  createmillis bigint NOT NULL DEFAULT '0',
  expiretimes bigint NOT NULL DEFAULT '0',
  expiredate date ,
  expiretime time ,
  PRIMARY KEY (capid)
);

CREATE TABLE IF NOT EXISTS tconfig (
  category varchar(50) NOT NULL,
  colname varchar(50) NOT NULL,
  colvalue varchar(250) ,
  colflag varchar(1) ,
  seqno int DEFAULT '0',
  remarks text,
  PRIMARY KEY (category,colname)
);

CREATE TABLE IF NOT EXISTS tconstant (
  typename varchar(50) NOT NULL,
  typeid varchar(50) NOT NULL,
  nameen varchar(100) NOT NULL,
  nameth varchar(100) NOT NULL,
  seqno int ,
  iconfile varchar(100) ,
  PRIMARY KEY (typename,typeid)
);

CREATE TABLE IF NOT EXISTS tcpwd (
  userid varchar(60) NOT NULL,
  category varchar(50) NOT NULL,
  contents varchar(150) NOT NULL,
  PRIMARY KEY (userid,category)
);

CREATE TABLE IF NOT EXISTS tdirectory (
  domainid varchar(50) NOT NULL,
  domainname varchar(50) NOT NULL,
  description varchar(100) NOT NULL,
  applicationid varchar(50) NOT NULL,
  tenanturl varchar(200) NOT NULL,
  basedn varchar(200) ,
  secretkey varchar(50) ,
  systemtype varchar(1) NOT NULL DEFAULT 'W',
  appstype varchar(1) NOT NULL DEFAULT 'W',
  domaintype varchar(1) NOT NULL DEFAULT 'S',
  domainurl varchar(200) ,
  inactive varchar(1) NOT NULL DEFAULT '0' ,
  invisible varchar(1) NOT NULL DEFAULT '0' ,
  editdate date ,
  edittime time ,
  edituser varchar(50) ,
  PRIMARY KEY (domainid)
);
CREATE INDEX idx_tdirectory_domainname ON tdirectory (domainname);
CREATE INDEX idx_tdirectory_applicationid ON tdirectory (applicationid);

CREATE TABLE IF NOT EXISTS tfavor (
  userid varchar(60) NOT NULL,
  programid varchar(20) NOT NULL,
  seqno int NOT NULL DEFAULT '0',
  PRIMARY KEY (userid,programid,seqno)
);

CREATE TABLE IF NOT EXISTS tgroup (
  groupname varchar(50) NOT NULL DEFAULT '',
  supergroup varchar(50) DEFAULT '',
  nameen varchar(100) ,
  nameth varchar(100) ,
  seqno int DEFAULT '0',
  iconstyle varchar(50) ,
  privateflag varchar(1) DEFAULT '0',
  usertype varchar(1),
  mobilegroup varchar(50) ,
  xmltext text,
  menutext text ,
  editdate date ,
  edittime time ,
  edituser varchar(50) ,
  PRIMARY KEY (groupname)
);

CREATE TABLE IF NOT EXISTS tnpwd (
  reservenum varchar(50) NOT NULL,
  remarks varchar(150) ,
  PRIMARY KEY (reservenum)
);

CREATE TABLE IF NOT EXISTS tpasskey (
  keyid varchar(50) NOT NULL,
  keypass varchar(350)  NOT NULL,
  site varchar(50) NOT NULL,
  userid varchar(50) NOT NULL,
  keyname varchar(100) ,
  createdate date NOT NULL,
  createtime time NOT NULL,
  createmillis bigint NOT NULL DEFAULT '0',
  createuser varchar(50) ,
  expireflag varchar(1) DEFAULT '0',
  expireday int DEFAULT '0',
  expiredate date ,
  expiretime time ,
  expiretimes bigint DEFAULT '0',
  editdate date ,
  edittime time ,
  edituser varchar(50) ,
  PRIMARY KEY (keyid),
  UNIQUE (keypass)
);
CREATE INDEX idx_tpasskey_site_userid ON tpasskey (site,userid);

CREATE TABLE IF NOT EXISTS tppwd (
  userid varchar(60) NOT NULL DEFAULT '',
  checkreservepwd varchar(1) DEFAULT '0',
  checkpersonal varchar(1) DEFAULT '0',
  checkmatchpattern varchar(1) DEFAULT '0',
  checkmatchnumber varchar(1) DEFAULT '0',
  timenotusedoldpwd smallint DEFAULT '0',
  alertbeforeexpire smallint DEFAULT '0',
  pwdexpireday smallint DEFAULT '0',
  notloginafterday smallint DEFAULT '0',
  notchgpwduntilday smallint DEFAULT '0',
  minpwdlength smallint DEFAULT '0',
  alphainpwd smallint DEFAULT '0',
  otherinpwd smallint DEFAULT '0',
  maxsamechar smallint DEFAULT '0',
  mindiffchar smallint DEFAULT '0',
  maxarrangechar smallint DEFAULT '0',
  loginfailtime int ,
  fromip varchar(15) ,
  toip varchar(15) ,
  starttime time ,
  endtime time ,
  groupflag varchar(50) ,
  maxloginfailtime smallint ,
  checkdictpwd smallint ,
  maxpwdlength smallint ,
  digitinpwd smallint ,
  upperinpwd smallint ,
  lowerinpwd smallint ,
  PRIMARY KEY (userid)
);

CREATE TABLE IF NOT EXISTS tprod (
  product varchar(50) NOT NULL DEFAULT '',
  nameen varchar(100) NOT NULL,
  nameth varchar(100) NOT NULL,
  seqno int DEFAULT '0',
  serialid varchar(100) ,
  startdate date ,
  url varchar(100) ,
  capital varchar(1) ,
  verified varchar(1) DEFAULT '1',
  centerflag varchar(1) DEFAULT '0',
  iconfile varchar(100) ,
  editdate date ,
  edittime time ,
  edituser varchar(50) ,
  PRIMARY KEY (product)
);

CREATE TABLE IF NOT EXISTS tprog (
  product varchar(30) NOT NULL,
  programid varchar(20) NOT NULL,
  progname varchar(100) ,
  prognameth varchar(100) ,
  progtype varchar(2) ,
  appstype varchar(2) DEFAULT 'W',
  description varchar(100) ,
  parameters varchar(80) ,
  progsystem varchar(10) ,
  iconfile varchar(50) ,
  iconstyle varchar(50) ,
  shortname varchar(50) ,
  shortnameth varchar(50) ,
  progpath varchar(150) ,
  newflag varchar(1) ,
  editdate date ,
  edittime time ,
  edituser varchar(50) ,
  PRIMARY KEY (programid)
);

CREATE TABLE IF NOT EXISTS tproggrp (
  groupname varchar(50) NOT NULL,
  programid varchar(20) NOT NULL,
  parameters varchar(100) ,
  seqno int DEFAULT '0',
  PRIMARY KEY (groupname,programid)
);

CREATE TABLE IF NOT EXISTS trpwd (
  reservepwd varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (reservepwd)
);

CREATE TABLE IF NOT EXISTS trxlog (
  keyid varchar(50) NOT NULL,
  curtime bigint ,
  trxtime bigint ,
  editdate date ,
  edittime time ,
  transtime timestamp ,
  caller varchar(100) ,
  sender varchar(100) ,
  owner varchar(200) ,
  processtype varchar(15) ,
  trxstatus char(1) ,
  attachs varchar(250) ,
  refer varchar(50) ,
  note varchar(250) ,
  package varchar(50) ,
  action varchar(50) ,
  quotable varchar(150) ,
  grouper varchar(50) ,
  remark text,
  contents text,
  PRIMARY KEY (keyid)
);

CREATE TABLE IF NOT EXISTS trxres (
  keyid varchar(50) NOT NULL,
  curtime bigint ,
  trxtime bigint ,
  editdate date ,
  edittime time ,
  transtime timestamp ,
  caller varchar(100) ,
  sender varchar(100) ,
  owner varchar(100) ,
  processtype varchar(15) ,
  trxstatus char(1) ,
  remark varchar(250) ,
  attachs varchar(250) ,
  refer varchar(50) ,
  note varchar(250) ,
  package varchar(50) ,
  action varchar(50) ,
  quotable varchar(50) ,
  grouper varchar(50) ,
  contents text
);

CREATE TABLE IF NOT EXISTS ttemplate (
  template varchar(50) NOT NULL,
  templatetype varchar(50) NOT NULL,
  subjecttitle varchar(100) ,
  contents text NOT NULL,
  contexts text,
  editdate date ,
  edittime time ,
  edituser varchar(50) ,
  PRIMARY KEY (template,templatetype)
);

CREATE TABLE IF NOT EXISTS tupwd (
  servertimestamp timestamp ,
  systemdate date NOT NULL,
  userid varchar(50) NOT NULL DEFAULT '',
  userpassword varchar(200) NOT NULL DEFAULT '',
  edituserid varchar(50) NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS tuser (
  userid varchar(50) NOT NULL,
  username varchar(50) NOT NULL,
  site varchar(50) NOT NULL,
  startdate date ,
  enddate date ,
  status varchar(1) DEFAULT 'A',
  userpassword varchar(100) ,
  passwordexpiredate date ,
  passwordchangedate date ,
  passwordchangetime time ,
  showphoto varchar(1) ,
  adminflag varchar(1) DEFAULT '0',
  groupflag varchar(1) DEFAULT '0',
  theme varchar(20) ,
  firstpage varchar(100) ,
  loginfailtimes smallint DEFAULT '0',
  failtime bigint ,
  lockflag varchar(1) DEFAULT '0',
  usertype varchar(1) ,
  iconfile varchar(100) ,
  accessdate date ,
  accesstime time ,
  accesshits bigint DEFAULT '0',
  siteflag varchar(1) DEFAULT '0',
  branchflag varchar(1) DEFAULT '0',
  approveflag varchar(1) DEFAULT '0',
  changeflag varchar(1) DEFAULT '0',
  newflag varchar(1) DEFAULT '0',
  activeflag varchar(1) DEFAULT '0',
  mistakens smallint DEFAULT '0',
  mistakentime bigint ,
  editdate date ,
  edittime time ,
  edituser varchar(50) ,
  PRIMARY KEY (userid),
  UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS tuserbranch (
  site varchar(50) NOT NULL,
  branch varchar(20) NOT NULL,
  userid varchar(50) NOT NULL,
  PRIMARY KEY (site,branch,userid)
);

CREATE TABLE IF NOT EXISTS tuserfactor (
  factorid varchar(50) NOT NULL,
  userid varchar(50) NOT NULL,
  factorkey varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  issuer varchar(100) NOT NULL,
  createdate date NOT NULL,
  createtime time NOT NULL,
  createtranstime bigint NOT NULL,
  factorflag varchar(1) NOT NULL DEFAULT '0',
  factorurl varchar(350) ,
  confirmdate date ,
  confirmtime time ,
  confirmtranstime bigint ,
  editdate date ,
  edittime time ,
  edituser varchar(50) ,
  factorremark varchar(350) ,
  PRIMARY KEY (factorid),
  UNIQUE (userid)
);

CREATE TABLE IF NOT EXISTS tuserfactorhistory (
  factorid varchar(50) NOT NULL,
  userid varchar(50) NOT NULL,
  factorkey varchar(50) NOT NULL,
  email varchar(100) NOT NULL,
  issuer varchar(100) NOT NULL,
  createdate date NOT NULL,
  createtime time NOT NULL,
  createtranstime bigint NOT NULL,
  factorflag varchar(1) NOT NULL DEFAULT '0',
  factorurl varchar(350) ,
  confirmdate date ,
  confirmtime time ,
  confirmtranstime bigint ,
  editdate date ,
  edittime time ,
  edituser varchar(50) ,
  factorremark varchar(350) 
);

CREATE TABLE IF NOT EXISTS tusergrp (
  userid varchar(50) NOT NULL,
  groupname varchar(50) NOT NULL,
  rolename varchar(50) ,
  PRIMARY KEY (userid,groupname)
);

CREATE TABLE IF NOT EXISTS tuserinfo (
  site varchar(50) NOT NULL,
  employeeid varchar(50) NOT NULL DEFAULT '',
  userid varchar(50),
  userbranch varchar(20),
  usertname varchar(50) ,
  usertsurname varchar(50) ,
  userename varchar(50) ,
  useresurname varchar(50) ,
  displayname varchar(50) ,
  activeflag varchar(1) DEFAULT '0',
  accessdate date ,
  accesstime time ,
  photoimage varchar(100) ,
  email varchar(100) ,
  gender varchar(1),
  lineid varchar(50) ,
  mobile varchar(50) ,
  langcode varchar(10),
  birthday date ,
  inactive varchar(1) DEFAULT '0',
  editdate date ,
  edittime time ,
  edituser varchar(50) ,
  remarks text,
  usercontents text,
  PRIMARY KEY (site,employeeid),
  UNIQUE (userid)
);
CREATE INDEX idx_tuserinfo_email ON tuserinfo (email);

CREATE TABLE IF NOT EXISTS tuserinfohistory (
  site varchar(50) NOT NULL,
  employeeid varchar(50) NOT NULL DEFAULT '',
  userid varchar(50),
  userbranch varchar(20) ,
  usertname varchar(50) ,
  usertsurname varchar(50) ,
  userename varchar(50) ,
  useresurname varchar(50) ,
  displayname varchar(50) ,
  activeflag varchar(1) DEFAULT '0',
  accessdate date ,
  accesstime time ,
  photoimage varchar(100) ,
  email varchar(100) ,
  gender varchar(1),
  lineid varchar(50) ,
  mobile varchar(50) ,
  langcode varchar(10) ,
  birthday date ,
  inactive varchar(1) DEFAULT '0',
  editdate date ,
  edittime time ,
  edituser varchar(50) ,
  remarks text ,
  usercontents text
);

CREATE TABLE IF NOT EXISTS tuserlog (
  seqno bigint NOT NULL DEFAULT '0',
  curtime timestamp NOT NULL,
  useralias varchar(50) ,
  userid varchar(50) ,
  site varchar(50) ,
  progid varchar(25) ,
  handler varchar(50) ,
  action varchar(50) ,
  remark text,
  token varchar(350) ,
  address varchar(200) ,
  paths varchar(500) ,
  headers text,
  requests text,
  contents text
);

CREATE TABLE IF NOT EXISTS tuserpwd (
  trxid varchar(50) NOT NULL,
  userid varchar(50) NOT NULL,
  userpassword varchar(100) NOT NULL,
  expiredate timestamp NOT NULL,
  transtime bigint NOT NULL,
  passwordexpiredate date NOT NULL,
  passwordchangedate date NOT NULL,
  passwordchangetime time NOT NULL,
  expireflag varchar(1) DEFAULT '0',
  confirmdate date ,
  confirmtime time ,
  editdate date ,
  edittime time ,
  PRIMARY KEY (trxid)
);
CREATE INDEX idx_tuserpwd_userid ON tuserpwd (userid);

CREATE TABLE IF NOT EXISTS tuserpwdhistory (
  trxid varchar(50) NOT NULL,
  userid varchar(50) NOT NULL,
  userpassword varchar(100) NOT NULL,
  expiredate timestamp NOT NULL,
  transtime bigint NOT NULL,
  passwordexpiredate date NOT NULL,
  passwordchangedate date NOT NULL,
  passwordchangetime time NOT NULL,
  expireflag varchar(1) DEFAULT '0',
  confirmdate date ,
  confirmtime time ,
  editdate date ,
  edittime time ,
  hisid varchar(50) ,
  hisno bigint ,
  hisflag varchar(1) DEFAULT '0'
);

CREATE TABLE IF NOT EXISTS tuserrole (
  userid varchar(50) NOT NULL,
  roleid varchar(50) NOT NULL,
  PRIMARY KEY (userid,roleid)
);

CREATE TABLE IF NOT EXISTS tusertoken (
  useruuid varchar(50) NOT NULL,
  userid varchar(50) NOT NULL,
  createdate date NOT NULL,
  createtime time NOT NULL,
  createmillis bigint NOT NULL,
  expiredate date NOT NULL,
  expiretime time NOT NULL,
  expiretimes bigint NOT NULL,
  site varchar(50) ,
  code varchar(50) ,
  state varchar(50) ,
  nonce varchar(50) ,
  authtoken varchar(350) ,
  prime varchar(250) ,
  generator varchar(250) ,
  privatekey varchar(250) ,
  publickey varchar(250) ,
  sharedkey varchar(250) ,
  otherkey varchar(250) ,
  tokentype varchar(50) ,
  tokenstatus varchar(50) ,
  factorcode varchar(50) ,
  outdate date ,
  outtime time ,
  accesscontents text,
  PRIMARY KEY (useruuid),
  UNIQUE (authtoken)
);
CREATE INDEX idx_tusertoken_nonce_code_state ON tusertoken (nonce,code,state);

