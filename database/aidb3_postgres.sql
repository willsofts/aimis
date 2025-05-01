CREATE TABLE IF NOT EXISTS employee (
  employeeid varchar(50) NOT NULL,
  employeename varchar(50) DEFAULT NULL,
  employeesurname varchar(50) DEFAULT NULL,
  remarks varchar(250) DEFAULT NULL,
  PRIMARY KEY (employeeid)
);

INSERT INTO employee (employeeid, employeename, employeesurname, remarks) VALUES
	('BILL', 'Bill', 'Gates', NULL),
	('ELON', 'Elon', 'Musk', NULL),
	('JACK', 'Jack', 'Ma', NULL),
	('JEFF', 'Jeff', 'Bezos', NULL),
	('MARK', 'Mark', 'Zuckerberg', NULL),
	('STEVE', 'Steve', 'Jobs', NULL);

CREATE TABLE IF NOT EXISTS employee_leave_quota (
  employeeid varchar(50) NOT NULL ,
  leavetype varchar(50) NOT NULL ,
  leaveqouta int NOT NULL,
  leaveused int NOT NULL DEFAULT '0',
  PRIMARY KEY (employeeid,leavetype)
);

INSERT INTO employee_leave_quota (employeeid, leavetype, leaveqouta, leaveused) VALUES
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

CREATE TABLE IF NOT EXISTS employee_leave_type (
  leavetype varchar(50) NOT NULL,
  leavetypename varchar(50) NOT NULL,
  PRIMARY KEY (leavetype)
);

INSERT INTO employee_leave_type (leavetype, leavetypename) VALUES
	('BUSINESS', 'Business'),
	('GENERAL', 'General'),
	('SICK', 'Sick'),
	('VACATION', 'Vacation');
