## Ask/Question With Document Note API

Let's talk about quest with document note API provided

### API CRUD

Ask/Question with document note using forum note API setting, then it need category setting up before use.

##### 1. upload file

In order to create note transaction you have to upload your document file first 

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/upload/file|
| method | post |

| Header | Description |
| -------- | ----------- |
| content-type | form-data post (multi-part) |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

| Parameter | Description |
| -------- | ----------- |
| type | `NOTE` |
| filename | file stream |

ex. \
request:
```
curl -X POST http://localhost:8080/upload/file -F type=NOTE -F filename=@D:\AI\docs\holiday_securities.txt
```
response:
```
{
    "head": {
        "model": "upload",
        "method": "file",
        "errorcode": "0",
        "errorflag": "N",
        "errordesc": ""
    },
    "body": {
        "records": 1,
        "rows": {
            "affectedRows": 1,
            "attachid": "fbac2d4e-7d9a-41e4-8fb9-4ba93915b50f",
            "attachno": "fbac2d4e-7d9a-41e4-8fb9-4ba93915b50f",
            "attachtype": "NOTE",
            "sourcefile": "holiday_securities.txt",
            "attachfile": "fbac2d4e-7d9a-41e4-8fb9-4ba93915b50f.txt",
            "attachsize": 5992,
            "mimetype": "text/plain",
            "attachgroup": "FILE"
        },
        "columns": null
    }
}
```

##### 2. insert

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/forumnote/insert|
| method | post |

| Header | Description |
| -------- | ----------- |
| Content-Type | application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

| Parameter | Description |
| -------- | ----------- |
| forumid | this is `ID` of forum, default blank |
| forumtitle | this is title of forum |
| forumtable | this is a user defined prompt info|
| fileid | this is the attachid from step `1` upload file |
| cleansing | this is flag `1` to cleansing document |
| summaryid | this is summary document id (this option can leave fileid if defined) |
| classifyprompt | this is classify prompt for this forum |
| shareflag | this is share flag `1` to share with other |
| hookflag | this is hook flag `1` to enable hook |
| webhook | this is url of web hook |
| question | this is array of example questions |
| ragflag | this is using RAG or not `'1'` = use RAG, default `'0'` |
| raglimit | this is number of records of RAG limit when out put from service, default 10 |
| ragchunksize | this is RAG chunk size, default 250 |
| ragchunkoverlap | this is RAG chunk overlap, default 10 |

ex. \
request:
```
{
    "forumid":"MY-NOTE",
    "forumtitle":"My Note Title",
    "forumtable" : "In case of Thai message, please answer in Thai message too.",
    "fileid":"fbac2d4e-7d9a-41e4-8fb9-4ba93915b50f",
    "classifyprompt": "เป็นหมวดหมู่สำหรับคำถามเกี่ยวกับประกาศวันหยุดตามประเพณีของทีมหลักทรัพย์ (Securities) ประจำปี 2567",
    "question" : ["Summarize text from info","ขอรายการสรุปจำนวนวันหยุดในแต่ละเดือน"]
}
```
response:
```
{
    "head": {
        "model": "api",
        "method": "forumnote.insert",
        "errorcode": "0",
        "errorflag": "N",
        "errordesc": ""
    },
    "body": {
        "action": "insert",
        "dataset": {
            "forumid": "MY-NOTE",
            "forumcode": "MY-NOTE",
            "forumtitle": "My Note Title",
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
            "forumtable": "In case of Thai message, please answer in Thai message too.",
            "classifyprompt": null,
            "inactive": "0",
            "hookflag": null,
            "webhook": null,
            "editflag": null,
            "shareflag": null,
            "summaryid": null,
            "createmillis": "1,743,998,349,787",
            "createdate": "07/04/2025",
            "createtime": "10:59:09",
            "dialectalias": null,
            "dialecttitle": null,
            "dialectoptions": null
        },
        "entity": {}
    }
}
```

##### 3. retrieve 

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/forumnote/retrieve |
| method | post |

| Header | Description |
| -------- | ----------- |
| content-type | query string or application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request
```
http://localhost:8080/api/forumnote/retrieve?forumid=MY-NOTE
```
or
```
{ "forumid":"MY-NOTE"}
```

reponse:
```
{
    "head": {
        "model": "api",
        "method": "forumnote.retrieve",
        "errorcode": "0",
        "errorflag": "N",
        "errordesc": ""
    },
    "body": {
        "action": "retrieve",
        "dataset": {
            "forumid": "MY-NOTE",
            "forumcode": "MY-NOTE",
            "forumtitle": "My Note Title",
            "forumgroup": "NOTE",
            "forumtype": "DB",
            "forumdialect": null,
            "forumapi": "holiday_securities.txt",
            "forumurl": "fbac2d4e-7d9a-41e4-8fb9-4ba93915b50f",
            "forumuser": null,
            "forumpassword": null,
            "forumdatabase": null,
            "forumdbversion": null,
            "forumhost": null,
            "forumport": "0",
            "forumselected": "0",
            "forumsetting": null,
            "forumtable": "In case of Thai message, please answer in Thai message too.",
            "forumremark": "",
            "classifyprompt": "เป็นหมวดหมู่สำหรับคำถามเกี่ยวกับประกาศวันหยุดตามประเพณีของทีมหลักทรัพย์ (Securities) ประจำปี 2567",
            "inactive": "0",
            "hookflag": "0",
            "webhook": null,
            "editflag": "1",
            "shareflag": "0",
            "summaryid": null,
            "createmillis": "1,743,998,349,787",
            "createdate": "07/04/2025",
            "createtime": "10:59:09",
            "dialectalias": null,
            "dialecttitle": null,
            "dialectoptions": null,
            "forumtable_claude": null,
            "forumprompt_claude": null,
            "forumremark_claude": null,
            "forumtable_gemini": "In case of Thai message, please answer in Thai message too.",
            "forumprompt_gemini": "",
            "forumtable_gemma": null,
            "forumprompt_gemma": null,
            "forumremark_gemma": null,
            "forumtable_llama": null,
            "forumprompt_llama": null,
            "forumremark_llama": null,
            "questions": ["Summarize text from info", "ขอรายการสรุปจำนวนวันหยุดในแต่ละเดือน"]
        },
        "entity": {}
    }
}
```

##### 4. update

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/forumnote/update |
| method | post |

| Header | Description |
| -------- | ----------- |
| Content-Type | application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request

```
{
    "forumid":"MY-Note",
    "forumtitle":"My Note Title Updated",
    "forumtable" : "If Thai message then answer in Thai message",
    "fileid":"fbac2d4e-7d9a-41e4-8fb9-4ba93915b50f",
    "classifyprompt": "เป็นหมวดหมู่สำหรับคำถามเกี่ยวกับประกาศวันหยุดตามประเพณีของทีมหลักทรัพย์ (Securities) ประจำปี 2567",
    "question" : ["Summarize text from info","ขอรายการสรุปจำนวนวันหยุดในแต่ละเดือน"]
}
```
response:
```
{
    "head": {
        "model": "api",
        "method": "forumnote.update",
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

##### 5. delete

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/forumnote/remove |
| method | post |

| Header | Description |
| -------- | ----------- |
| content-type | query string or application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request 
```
http://localhost:8080/api/forumnote/remove?forumid=MY-NOTE
```
or
```
{ "forumid":"MY-NOTE"}
```
response
```
{
    "head": {
        "model": "api",
        "method": "forumnote.remove",
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

In case of new setting, you can use gui to entry instead with url:\
ex. http://localhost:8080/gui/forumnote/entry

##### 6. example response in case of error user defined

```
{
    "head": {
        "model": "api",
        "method": "forumnote.insert",
        "errorcode": "-16061",
        "errorflag": "Y",
        "errordesc": "Parameter not found (fileid or summaryid)",
        "details": {
            "code": 406,
            "errno": -16061
        }
    },
    "body": {}
}
```

