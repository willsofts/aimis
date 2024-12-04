## AI DB Project

This is project using Google Gemini AI to generate query and then execute statement for result to answer

## Installation

With npm installed (comes with [node](https://nodejs.org/en/)), run the following commands into a terminal in the root directory of this project:

```shell
npm install
npm run build
npm run start
```

## How To Install
This project need [@willsofts](https://github.com/willsofts) libraries to run that is private access, then you have to gain access key and setting in your own environment before start installation \
ex. \
Window

    set NPM_TOKEN=your access token key here

Linux

    export NPM_TOKEN=your access token key here


The project will run at http://localhost:8080/

## Setup
Since this project required database setup before starting you have to create database schema by run sql file under folder `/database/aidb_mysql.sql` this sql snippet file come with MySQL.

## Configuration
After setup database you may change configuration setting to access your database by `/config/default.json`. see more detail [will-sql](https://www.npmjs.com/package/will-sql)

In case of setting http connection especially port (default at 8080) can be config by `/config/default.json` or environment setting in command prompt \
ex. \
Window 

    set HTTP_PORT=8888 

Linux 

    export HTTP_PORT=8888 

## Example

This project contains API that it can invoke by [curl](https://curl.se/download.html):

* curl -X POST http://localhost:8080/api/question/quest -d "query=List all product name and price"

## Inquiry

This project contains inquiry API that it can send query statement directly.

1. inquire 

| Request | Definition |
| -------- | ----------- |
| method | post |
| content-type | application/json |

| Parameter | Definition |
| -------- | ----------- |
| query | sql statement|

ex. 
    curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/inquiry/inquire -d "{\"query\":\"select * from cust_product\"}"

2. enquire

| Request | Definition |
| -------- | ----------- |
| method | post |
| content-type | application/json |

| Parameter | Definition |
| -------- | ----------- |
| query | sql statement|
| category | forum id from forum setting |

ex. 

    curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/inquiry/enquire -d "{\"category\":\"AIDB1\", \"query\":\"select * from cust_product\"}"

3. queries

| Request | Definition |
| -------- | ----------- |
| method | post |
| content-type | application/json |

| Parameter | Definition |
| -------- | ----------- |
| query | sql statement|
| type | `DB` |
| dialect | database dialect, this must be `MYSQL`, `MSSQL`, `ORACLE`, `POSTGRES`, `INFORMIX` |
| alias | database alias, this depend on dialect but if dialect is `MYSQL` alias must be `MYSQL2` and dialect is `INFORMIX` alias must be `ODBC` |
| user | user to connect database (for `MYSQL` & `ORACLE`) |
| password | user's password to connect database (for `MYSQL` & `ORACLE`)|
| host | database server (for `MYSQL`)|
| port | database port (for `MYSQL`)|
| database | database name (for `MYSQL`)|
| url | connection string for `MSSQL`, `ORACLE`, `POSTGRES`, `INFORMIX` |

ex. 

    curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/inquiry/queries -d "{\"query\":\"select * from cust_product\", \"type\":\"DB\", \"dialect\":\"MYSQL\", \"alias\":\"MYSQL2\", \"user\":\"root\", \"password\":\"root\",\"host\":\"localhost\", \"port\":3306, \"database\":\"aidb1\"}"


    curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/inquiry/queries -d "{\"query\":\"select * from testdbx\", \"type\":\"DB\", \"dialect\":\"MSSQL\", \"alias\":\"MSSQL\", \"url\":\"Server=localhost,1433;Database=refdb;User Id=sa;Password=sapassword;Encrypt=false;Trusted_Connection=Yes;\"}"


## Database Connection String

| Vendor | Example |
| -------- | ----------- |
| MSSQL | Server=localhost,1433;Database=refdb;User Id=sa;Password=sapassword;Encrypt=false;Trusted_Connection=Yes; |
| ORACLE | localhost:1521/ORCLCDB.localdomain |
| POSTGRES | postgresql://postgres:root@localhost:5432/testdb |
| ODBC | DRIVER={MySQL ODBC 8.0 Unicode Driver};SERVER=localhost;DATABASE=testdb;HOST=localhost;PORT=3306;UID=root;PWD=root; |


## Chat With Query
See [Chat Query](./CHAT_QUERY.md)

## Chat With Image
See [Chat Image](./CHAT_IMAGE.md)
