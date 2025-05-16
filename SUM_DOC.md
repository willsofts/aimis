## Ask/Question With Summary Document Setting API

Let's talk about summary document setting API provided

### API CRUD

Ask/Question with document note can customize using summary document API setting to categorized before use.

##### 1. insert

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/sumdoc/insert|
| method | post |

| Header | Description |
| -------- | ----------- |
| Content-Type | application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

| Parameter | Description |
| -------- | ----------- |
| summaryid | this is `ID` of record, default blank |
| summarytitle | this is title of record |
| summaryprompt | this is summary prompt |
| summarymodel | this is agent model |
| ragflag | this is using RAG or not `'1'` = use RAG, default `'0'` |
| raglimit | this is number of records of RAG limit when out put from service, default 10 |
| ragchunksize | this is RAG chunk size, default 250 |
| ragchunkoverlap | this is RAG chunk overlap, default 10 |

ex. \
request:
```
{
    "summaryid":"MY-SUMKEY",
    "summarytitle":"My Summary Title",
    "summaryprompt":"Summarize into plain text answer only from given info"
}
```
response:
```
{
    "head": {
        "model": "api",
        "method": "sumdoc.insert",
        "errorcode": "0",
        "errorflag": "N",
        "errordesc": ""
    },
    "body": {
        "action": "insert",
        "dataset": {
            "summaryid": "MY-SUMKEY",
            "summarytitle": "My Summary Title",
            "summaryagent": null,
            "summarymodel": null,
            "summaryfile": null,
            "summaryprompt": null,
            "summaryflag": "0",
            "shareflag": "0",
            "inactive": "0",
            "createmillis": "1,744,000,455,031",
            "createdate": "07/04/2025",
            "createtime": "11:34:15",
            "summaryfilename": null
        },
        "entity": {}
    }
}
```

##### 2. upload document files

In order to create summary document you need to provide document files.

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
| no | obtain from step `1` with summaryid |
| type | `SUM` |
| filename | file stream |

ex. \
request:
```
curl -X POST http://localhost:8080/upload/file -F no=MY-SUMKEY -F type=SUM -F filename=@D:\AI\docs\holiday_securities.txt
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
            "attachid": "52c3ec22-5707-415e-9420-67459a2faf4a",
            "attachno": "MY-SUMKEY",
            "attachtype": "SUM",
            "sourcefile": "holiday_securities.txt",
            "attachfile": "52c3ec22-5707-415e-9420-67459a2faf4a.txt",
            "attachsize": 5992,
            "mimetype": "text/plain",
            "attachgroup": "FILE"
        },
        "columns": null
    }
}
```

##### 3. retrieve 

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/sumdoc/retrieve |
| method | post |

| Header | Description |
| -------- | ----------- |
| content-type | query string or application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request
```
http://localhost:8080/api/sumdoc/retrieve?forumid=MY-SUMKEY
```
or
```
{ "forumid":"MY-SUMKEY"}
```

reponse:
```
{
    "head": {
        "model": "api",
        "method": "sumdoc.retrieve",
        "errorcode": "0",
        "errorflag": "N",
        "errordesc": ""
    },
    "body": {
        "action": "retrieve",
        "dataset": {
            "summaryid": "MY-SUMKEY",
            "summarytitle": "My Summary Title",
            "summaryagent": "GEMINI",
            "summarymodel": "gemini-2.0-flash",
            "summaryfile": null,
            "summaryprompt": "Summarize into plain text answer only from given info",
            "summaryflag": "0",
            "shareflag": "0",
            "inactive": "0",
            "createmillis": "1,744,000,455,031",
            "createdate": "07/04/2025",
            "createtime": "11:34:15",
            "summaryfilename": null
        },
        "entity": {
            "tmodels": {
                "gemini-2.0-flash": "Gemini 2.0 Flash",
                "gemini-1.5-flash": "Gemini 1.5 Flash",
                "llama3.1": "Llama 3.1 8B",
                "gemma2": "Gemma 2 9B"
            },
            "attachfiles": [{
                    "attachid": "52c3ec22-5707-415e-9420-67459a2faf4a",
                    "attachfile": "52c3ec22-5707-415e-9420-67459a2faf4a.txt",
                    "sourcefile": "holiday_securities.txt",
                    "attachdate": "2025-04-06T17:00:00.000Z",
                    "attachtime": "11:50:42",
                    "attachmillis": 1744001441769
                }
            ]
        }
    }
}
```

##### 4. update

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/sumdoc/update |
| method | post |

| Header | Description |
| -------- | ----------- |
| Content-Type | application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request

```
{
    "summaryid":"MY-SUMKEY",
    "summarytitle":"My Summary Title Updated",
    "summaryprompt":"Summarize into plain text answer only from given info"
}
```
response:
```
{
    "head": {
        "model": "api",
        "method": "sumdoc.update",
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
| url | http://localhost:8080/api/sumdoc/remove |
| method | post |

| Header | Description |
| -------- | ----------- |
| content-type | query string or application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request 
```
http://localhost:8080/api/sumdoc/remove?forumid=MY-SUMKEY
```
or
```
{ "forumid":"MY-SUMKEY"}
```
response
```
{
    "head": {
        "model": "api",
        "method": "sumdoc.remove",
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
ex. http://localhost:8080/gui/forumdoc/entry

##### 6. generate summary document

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/sumdoc/summary |
| method | post |

| Header | Description |
| -------- | ----------- |
| content-type | query string or application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

| Parameter | Description |
| -------- | ----------- |
| summaryid | this is the `ID` from step `1` |

ex. \
request 
```
http://localhost:8080/api/sumdoc/summary?summaryid=MY-SUMKEY
```
or
```
{ "summaryid":"MY-SUMKEY"}
```
response
```
{
    "head": {
        "model": "api",
        "method": "sumdoc.summary",
        "errorcode": "0",
        "errorflag": "N",
        "errordesc": ""
    },
    "body": {
        "records": 1,
        "rows": [{
                "summaryid": "MY-SUMKEY",
                "summarytitle": "My Summary Title",
                "summaryflag": "1"
            }
        ],
        "columns": null
    }
}
```

##### 7. example response in case of error user defined

```
{
    "head": {
        "model": "api",
        "method": "sumdoc.retrieve",
        "errorcode": "-16061",
        "errorflag": "Y",
        "errordesc": "Parameter not found (summaryid)",
        "details": {
            "code": 406,
            "errno": -16061
        }
    },
    "body": {}
}
```
