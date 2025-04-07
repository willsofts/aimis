## Ask/Question Forum Setting API

Let's talk about quest with forum setting API provided

### API CRUD

Ask/Question using forum API setting, then it need category setting up before use.

##### 1. insert

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/forum/insert|
| method | post |

| Header | Description |
| -------- | ----------- |
| Content-Type | application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

| Parameter | Description |
| -------- | ----------- |
| forumid | this is `ID` of forum, default blank |
| forumtitle | this is title of forum |
| forumtype | this is type of forum `DB` or `API` |
| forumdialect | this is dialect of forum |
| forumdbversion | this is database version |
| forumprompt | this is a forum prompt |
| forumtable | this is a forum table schema info|
| classifyprompt | this is classify prompt for this forum |
| shareflag | this is share flag `1` to share with other |
| hookflag | this is hook flag `1` to enable hook |
| webhook | this is url of web hook |
| question | this is array of example questions |

| DB Parameter | Description |
| -------- | ----------- |
| forumurl | this is connection string setting \nin case of MySQL using forumdatabase, forumhost & forumport declaration|
| forumuser | this is database user's name access |
| forumpassword | this is database user's password access |
| forumdatabase | this is database name |
| forumhost | this is database server |
| forumport | this is database server's port |

| API Parameter | Description |
| -------- | ----------- |
| forumapi | this is API url |
| forumsetting | this is API headers setting |

ex. \
request: specify by type DB
```
{
    "forumid":"MY-FORUM",
    "forumtitle":"My Forum Title",
    "forumpropmt": "If result not found then return No result.",
    "forumtable" : "CREATE TABLE IF NOT EXISTS `cust_info` ( `customer_id` varchar(50) NOT NULL COMMENT 'customer id', `customer_name` varchar(50) NOT NULL COMMENT 'customer name', `customer_surname` varchar(50) NOT NULL COMMENT 'customer surname', PRIMARY KEY (`customer_id`) ) ",
    "classifyprompt": "This category the question asks about customer info.",
    "forumtype": "DB",
    "forumdialect": "MYSQL",
    "forumuser": "root",
    "forumpassword": "root",
    "forumatdatabase": "aidb",
    "forumdbversion": "8",
    "forumhost": "localhost",
    "forumport": "3306",
    "question" : ["How many customer?","List all customer"]
}
```
request: specify by type API
```
{
    "forumid":"MY-FORUM-API",
    "forumtitle":"My Forum API Title",
    "forumpropmt": "If result not found then return No result.",
    "forumtable" : "CREATE TABLE IF NOT EXISTS `cust_info` ( `customer_id` varchar(50) NOT NULL COMMENT 'customer id', `customer_name` varchar(50) NOT NULL COMMENT 'customer name', `customer_surname` varchar(50) NOT NULL COMMENT 'customer surname', PRIMARY KEY (`customer_id`) ) ",
    "classifyprompt": "This category the question asks about customer info.",
    "forumtype": "API",
    "forumdialect": "MYSQL",
    "forumapi": "http://localhost:8080/api/inquiry/inquire",
    "forumsetting": "{\"Fs-Key\":\"12456\"}",
    "question" : ["How many customer?","List all customer"]
}
```
response:
```
{
    "head": {
        "model": "api",
        "method": "forum.insert",
        "errorcode": "0",
        "errorflag": "N",
        "errordesc": ""
    },
    "body": {
        "action": "insert",
        "dataset": {
            "forumid": "MY-FORUM",
            "forumcode": "MY-FORUM",
            "forumtitle": "My Forum Title",
            "forumgroup": null,
            "forumtype": null,
            "forumdialect": null,
            "forumapi": null,
            "forumurl": null,
            "forumuser": null,
            "forumpassword": null,
            "forumdatabase": null,
            "forumdbversion": null,
            "forumhost": null,
            "forumport": null,
            "forumselected": null,
            "forumsetting": null,
            "forumtable": "CREATE TABLE IF NOT EXISTS `cust_info` ( `customer_id` varchar(50) NOT NULL COMMENT 'customer id', `customer_name` varchar(50) NOT NULL COMMENT 'customer name', `customer_surname` varchar(50) NOT NULL COMMENT 'customer surname', PRIMARY KEY (`customer_id`) ) ",
            "forumprompt": "If result not found then return No result.",
            "classifyprompt": null,
            "inactive": "0",
            "hookflag": null,
            "webhook": null,
            "editflag": null,
            "shareflag": null,
            "summaryid": null,
            "createmillis": "1,743,995,684,817",
            "createdate": "07/04/2025",
            "createtime": "10:14:44",
            "dialectalias": null,
            "dialecttitle": null,
            "dialectoptions": null
        },
        "entity": {}
    }
}
```

##### 2. retrieve 

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/forum/retrieve |
| method | post |

| Header | Description |
| -------- | ----------- |
| content-type | query string or application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request
```
http://localhost:8080/api/forum/retrieve?forumid=MY-FORUM
```
or
```
{ "forumid":"MY-FORUM"}
```

reponse:
```
{
    "head": {
        "model": "api",
        "method": "forum.retrieve",
        "errorcode": "0",
        "errorflag": "N",
        "errordesc": ""
    },
    "body": {
        "action": "retrieve",
        "dataset": {
            "forumid": "MY-FORUM",
            "forumcode": "MY-FORUM",
            "forumtitle": "My Forum Title",
            "forumgroup": "DB",
            "forumtype": "DB",
            "forumdialect": "MYSQL",
            "forumapi": null,
            "forumurl": null,
            "forumuser": "root",
            "forumpassword": "root",
            "forumdatabase": null,
            "forumdbversion": "8",
            "forumhost": "localhost",
            "forumport": "3306",
            "forumselected": "0",
            "forumsetting": null,
            "forumtable": "CREATE TABLE IF NOT EXISTS `cust_info` ( `customer_id` varchar(50) NOT NULL COMMENT 'customer id', `customer_name` varchar(50) NOT NULL COMMENT 'customer name', `customer_surname` varchar(50) NOT NULL COMMENT 'customer surname', PRIMARY KEY (`customer_id`) ) ",
            "forumremark": null,
            "forumprompt": "If result not found then return No result.",
            "classifyprompt": "This category the question asks about customer info.",
            "inactive": "0",
            "hookflag": "0",
            "webhook": null,
            "editflag": "1",
            "shareflag": "0",
            "summaryid": null,
            "createmillis": "1,743,995,684,817",
            "createdate": "07/04/2025",
            "createtime": "10:14:44",
            "dialectalias": "MYSQL2",
            "dialecttitle": "MySQL",
            "dialectoptions": "{ \"charset\": \"utf8\", \"connectionLimit\": 100, \"dateStrings\": true }",
            "forumtable_claude": null,
            "forumprompt_claude": null,
            "forumremark_claude": null,
            "forumtable_gemini": "CREATE TABLE IF NOT EXISTS `cust_info` ( `customer_id` varchar(50) NOT NULL COMMENT 'customer id', `customer_name` varchar(50) NOT NULL COMMENT 'customer name', `customer_surname` varchar(50) NOT NULL COMMENT 'customer surname', PRIMARY KEY (`customer_id`) ) ",
            "forumprompt_gemini": "If result not found then return No result.",
            "forumremark_gemini": null,
            "forumtable_gemma": null,
            "forumprompt_gemma": null,
            "forumremark_gemma": null,
            "forumtable_llama": null,
            "forumprompt_llama": null,
            "forumremark_llama": null,
            "questions": ["How many customer?", "List all customer"]
        },
        "entity": {}
    }
}
```

##### 3. update

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/forum/update |
| method | post |

| Header | Description |
| -------- | ----------- |
| Content-Type | application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request

```
{
    "forumid":"MY-FORUM",
    "forumtitle":"My Forum Title Updated",
    "forumprompt" : "If Thai message then answer in Thai message",
    "forumtable" : "CREATE TABLE IF NOT EXISTS `cust_info` ( `customer_id` varchar(50) NOT NULL COMMENT 'customer id', `customer_name` varchar(50) NOT NULL COMMENT 'customer name', `customer_surname` varchar(50) NOT NULL COMMENT 'customer surname', PRIMARY KEY (`customer_id`) ) ",
    "classifyprompt": "This category the question asks about customer info.",
    "forumtype": "DB",
    "forumdialect": "MYSQL",
    "forumuser": "root",
    "forumpassword": "root",
    "forumatdatabase": "aidb",
    "forumdbversion": "8",
    "forumhost": "localhost",
    "forumport": "3306",
    "question" : ["How many customer?","List all customer"]
}
```
response:
```
{
    "head": {
        "model": "api",
        "method": "forum.update",
        "errorcode": "0",
        "errorflag": "N",
        "errordesc": ""
    },
    "body": {
        "rows": {
            "affectedRows": 1
        }
    }
}
```

##### 4. delete

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/forum/remove |
| method | post |

| Header | Description |
| -------- | ----------- |
| content-type | query string or application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request 
```
http://localhost:8080/api/forum/remove?forumid=MY-FORUM
```
or
```
{ "forumid":"MY-FORUM"}
```
response
```
{
    "head":{
        "model":"api",
        "method":"forum.remove",
        "errorcode":"0",
        "errorflag":"N",
        "errordesc":""
    },
    "body":{
        "rows":{
            "affectedRows":1
        }
    }
}
```

In case of new setting, you can use gui to entry instead with url:\
ex. http://localhost:8080/gui/forum/entry


##### 5. example response in case of error user defined

```
{
    "head":{
        "model":"api",
        "method":"forum.insert",
        "errorcode":"-16061",
        "errorflag":"Y",
        "errordesc":"Parameter not found (forumtitle)",
        "details":{"code":406,"errno":-16061}
    },
    "body":{}
}
```
