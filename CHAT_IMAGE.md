## Ask/Question With Image API

Let's talk about quest with image API provided

### API CRUD

Ask/Question With Image using forum docucment API setting, then it need category setting up before use.

##### 1. insert

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/forumdoc/insert|
| method | post |

| Header | Description |
| -------- | ----------- |
| Content-Type | application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request:
```
{
    "forumid":"MY-KEY",
    "forumtitle":"My Title",
    "forumtable" : "If Thai message then answer in Thai message"
}
```
response:
```
{
    "head": {
        "model": "api",
        "method": "forumdoc.insert",
        "errorcode": "0",
        "errorflag": "N",
        "errordesc": ""
    },
    "body": {
        "action": "insert",
        "dataset": {
            "forumid": "MY-KEY",
            "forumcode": "MY-KEY",
            "forumtitle": "My Title",
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
            "forumtable": null,
            "forumremark": null,
            "forumprompt": null,
            "inactive": "0",
            "editflag": null,
            "createmillis": "1,726,470,482,456",
            "createdate": "16/09/2024",
            "createtime": "14:08:02",
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
| url | http://localhost:8080/api/forumdoc/retrieve |
| method | post |

| Header | Description |
| -------- | ----------- |
| content-type | query string or application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request
```
http://localhost:8080/api/forumdoc/retrieve?forumid=MY-KEY
```
or
```
{ "forumid":"MY-KEY"}
```

reponse:
```
{
    "head": {
        "model": "api",
        "method": "forumdoc.retrieve",
        "errorcode": "0",
        "errorflag": "N",
        "errordesc": ""
    },
    "body": {
        "action": "retrieve",
        "dataset": {
            "forumid": "MY-KEY",
            "forumcode": "MY-KEY",
            "forumtitle": "My Title",
            "forumgroup": "DOC",
            "forumtype": "DB",
            "forumdialect": null,
            "forumapi": null,
            "forumurl": null,
            "forumuser": null,
            "forumpassword": null,
            "forumdatabase": null,
            "forumdbversion": null,
            "forumhost": null,
            "forumport": "0",
            "forumselected": "0",
            "forumsetting": null,
            "forumtable": "If Thai message then answer in Thai message",
            "forumremark": null,
            "forumprompt": null,
            "inactive": "0",
            "editflag": "1",
            "createmillis": "1,726,471,098,960",
            "createdate": "16/09/2024",
            "createtime": "14:18:18",
            "dialectalias": null,
            "dialecttitle": null,
            "dialectoptions": null,
            "forumtable_claude": null,
            "forumprompt_claude": null,
            "forumremark_claude": null,
            "forumtable_gemini": "If Thai message then answer in Thai message",
            "forumprompt_gemini": null,
            "forumremark_gemini": null,
            "forumtable_gemma": null,
            "forumprompt_gemma": null,
            "forumremark_gemma": null,
            "forumtable_llama": null,
            "forumprompt_llama": null,
            "forumremark_llama": null,
            "questions": []
        },
        "entity": {}
    }
}
```

##### 3. update

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/forumdoc/update |
| method | post |

| Header | Description |
| -------- | ----------- |
| Content-Type | application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request

```
{
    "forumid":"MY-KEY",
    "forumtitle":"My Title Updated",
    "forumtable" : "If Thai message then answer in Thai message"
}
```
response:
```
{
    "head": {
        "model": "api",
        "method": "forumdoc.update",
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
| url | http://localhost:8080/api/forumdoc/remove |
| method | post |

| Header | Description |
| -------- | ----------- |
| content-type | query string or application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

ex. \
request 
```
http://localhost:8080/api/forumdoc/remove?forumid=MY-KEY
```
or
```
{ "forumid":"MY-KEY"}
```
response
```
{
    "head": {
        "model": "api",
        "method": "forumdoc.remove",
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

##### 5. ask

- 5.1 direct upload file and ask

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/file/image/ask |
| method | post |

| Header | Description |
| -------- | ----------- |
| content-type | form-data post (multi-part) |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

| Parameter | Description |
| -------- | ----------- |
| correlation | this is correlation id default is session id|
| category | this is your key from forum insert |
| query | this is your question to ask |
| type | fixed type must define IMG |
| filename | this is your image file on client |

ex.

```
category=MY-KEY
query=this is your image file on client
type=IMG
filename=D:\AI\aidb\images\po.jpg
```

```
curl -X POST http://localhost:8080/file/image/ask -F filename=@D:\AI\aidb\images\po.jpg -F type=IMG -F category=MY-KEY -F query="Summarize text from information"
```

reponse:
```
{
    "error": false,
    "question": "Summarize text from information",
    "query": "",
    "answer": "This is a policy document for policy number T17824152 with a policy amount of 200,000.00. The policy date is 15/03/2024 and the payment type is Credit Card.",
    "dataset": ""
}
```

- 5.2 read/convert file as base64 and ask

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/chatimage/ask |
| method | post |

| Header | Description |
| -------- | ----------- |
| Content-Type | application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

| Parameter | Description |
| -------- | ----------- |
| category | this is your key from forum insert |
| query | this is your question to ask |
| image | image base64 stream |
| mime | image type depending on original image file ex. image/jpeg |

ex.

```
curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/chatimage/ask -d "{\"category\":\"MY-KEY\", \"query\":\"Summarize text from information\", \"mime\": \"image/jpeg\", \"image\":\"XXXX\"}"
```
or see [test/test.ask.image.ts](./src/test/test.ask.image.ts)

reponse:
```
{
    "error": false,
    "question": "Summarize text from information",
    "query": "",
    "answer": "This is a policy document for policy number T17824152 with a policy amount of 200,000.00. The policy date is 15/03/2024 and the payment type is Credit Card.",
    "dataset": ""
}
```

(url depending on your host deployment)
