## Ask/Question With Query API

About question with query API provided

### Quest API 

Ask/Question with query using forum API setting, then it need category setting up before use. \

##### 1. setting

In case of new setting, you can use gui to entry with url:\
ex. http://localhost:8080/gui/forum/entry

After setting, try to obtain forum `ID` from entry in order to use in next step

##### 2. quest

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/chat/quest |
| method | post |

| Header | Description |
| -------- | ----------- |
| Content-Type | application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

| Parameter | Description |
| -------- | ----------- |
| questionid | this is question id default blank |
| correlation | this is correlation id default is session id|
| category | this is your key from forum insert or setting |
| query | this is your question to ask |
| agent | this is AI agent usage default is `GEMINI` |
| model | this is AI model usage default is `gemini-1.5-flash` |
| property | this is private properties or specific info. |
| async | `true`/`false` if `true` it take as background process |

ex. \
request

```
{
    "category":"AIDB1",
    "query":"List all product",
}
```

using curl:

```
curl -X POST -H "AuthToken: ?" -H "Content-Type: application/json" http://localhost:8080/api/chat/quest -d "{\"category\":\"AIDB1\", \"query\":\"List all product\"}"
```

reponse:
```
{
    "questionid": "",
    "correlation": "gm9-jFwd6mpi7GwJsK9OHywtcvBXux7K",
    "category": "AIDB1",
    "error": false,
    "statuscode": "",
    "question": "List all product",
    "query": "SELECT cust_product.product_id, cust_product.product_name, cust_product.product_price, cust_product.product_index FROM cust_product",
    "answer": "Casual Shirt, Labour Shirt, Side Seeing Shirt, Working Shirt, Street Shirt, Art Pant, Dancing Pant, Working Pant, Aerobic Pant, Warming Pant",
    "dataset": [{
            "product_id": "PR001",
            "product_name": "Casual Shirt",
            "product_price": 129,
            "product_index": 1
        }, {
            "product_id": "PR002",
            "product_name": "Labour Shirt",
            "product_price": 159,
            "product_index": 2
        }, {
            "product_id": "PR003",
            "product_name": "Side Seeing Shirt",
            "product_price": 139,
            "product_index": 3
        }, {
            "product_id": "PR004",
            "product_name": "Working Shirt",
            "product_price": 149,
            "product_index": 4
        }, {
            "product_id": "PR005",
            "product_name": "Street Shirt",
            "product_price": 119,
            "product_index": 5
        }, {
            "product_id": "PR006",
            "product_name": "Art Pant",
            "product_price": 159,
            "product_index": 6
        }, {
            "product_id": "PR007",
            "product_name": "Dancing Pant",
            "product_price": 169,
            "product_index": 7
        }, {
            "product_id": "PR008",
            "product_name": "Working Pant",
            "product_price": 179,
            "product_index": 8
        }, {
            "product_id": "PR009",
            "product_name": "Aerobic Pant",
            "product_price": 189,
            "product_index": 9
        }, {
            "product_id": "PR010",
            "product_name": "Warming Pant",
            "product_price": 199,
            "product_index": 10
        }
    ]
}
```

(url depending on your host deployment)


##### 3. quest classify

This api support classification of question into categories setting by Classify Setting screen

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/chatter/quest |
| method | post |

| Header | Description |
| -------- | ----------- |
| Content-Type | application/json |
| AuthToken | API token (This can obtain from administrator or setting by Access Token)|

| Parameter | Description |
| -------- | ----------- |
| questionid | this is question id default blank |
| correlation | this is correlation id default is session id|
| category | this is your key from classfiy quest setting |
| query | this is your question to ask |
| property | this is private properties or specific info. |
| async | `true`/`false` if `true` it take as background process |

ex. \
1. request

```
{
    "category":"QUESTCLASSIFY",
    "query":"List all employee leave quota",
}
```

using curl:

```
curl -X POST -H "Content-Type: application/json" -H "AuthToken: ?" http://localhost:8080/api/chatter/quest -d "{\"category\": \"QUESTCLASSIFY\", \"query\": \"List all employee leave quota\" }"
```

reponse:
```
{
  "questionid": "",
  "correlation": "4P9L54a3ul10zW8a-fHSb9p3ETnZ905q",
  "category": "AIDB3",
  "error": false,
  "statuscode": "",
  "question": "List all employee leave quota",
  "query": "SELECT employee_leave_quota.employeeid, employee_leave_quota.leavetype, employee_leave_quota.leaveqouta, employee_leave_quota.leaveused FROM employee_leave_quota",
  "answer": "BILL: BUSINESS-30, GENERAL-30, SICK-30, VACATION-30; ELON: BUSINESS-35, GENERAL-35, SICK-35, VACATION-35; JACK: BUSINESS-30, GENERAL-30, SICK-30, VACATION-30; JEFF: BUSINESS-35, GENERAL-35, SICK-35, VACATION-35; MARK: BUSINESS-30, GENERAL-30, SICK-30, VACATION-30; STEVE: BUSINESS-35, GENERAL-35, SICK-35, VACATION-35",
  "dataset": [
    {
      "employeeid": "BILL",
      "leavetype": "BUSINESS",
      "leaveqouta": 30,
      "leaveused": 10
    },
    {
      "employeeid": "BILL",
      "leavetype": "GENERAL",
      "leaveqouta": 30,
      "leaveused": 15
    },
    {
      "employeeid": "BILL",
      "leavetype": "SICK",
      "leaveqouta": 30,
      "leaveused": 5
    },
    {
      "employeeid": "BILL",
      "leavetype": "VACATION",
      "leaveqouta": 30,
      "leaveused": 0
    },
    {
      "employeeid": "ELON",
      "leavetype": "BUSINESS",
      "leaveqouta": 35,
      "leaveused": 15
    },
    {
      "employeeid": "ELON",
      "leavetype": "GENERAL",
      "leaveqouta": 35,
      "leaveused": 0
    },
    {
      "employeeid": "ELON",
      "leavetype": "SICK",
      "leaveqouta": 35,
      "leaveused": 0
    },
    {
      "employeeid": "ELON",
      "leavetype": "VACATION",
      "leaveqouta": 35,
      "leaveused": 5
    },
    {
      "employeeid": "JACK",
      "leavetype": "BUSINESS",
      "leaveqouta": 30,
      "leaveused": 0
    },
    {
      "employeeid": "JACK",
      "leavetype": "GENERAL",
      "leaveqouta": 30,
      "leaveused": 5
    },
    {
      "employeeid": "JACK",
      "leavetype": "SICK",
      "leaveqouta": 30,
      "leaveused": 5
    },
    {
      "employeeid": "JACK",
      "leavetype": "VACATION",
      "leaveqouta": 30,
      "leaveused": 0
    },
    {
      "employeeid": "JEFF",
      "leavetype": "BUSINESS",
      "leaveqouta": 35,
      "leaveused": 0
    },
    {
      "employeeid": "JEFF",
      "leavetype": "GENERAL",
      "leaveqouta": 35,
      "leaveused": 0
    },
    {
      "employeeid": "JEFF",
      "leavetype": "SICK",
      "leaveqouta": 35,
      "leaveused": 0
    },
    {
      "employeeid": "JEFF",
      "leavetype": "VACATION",
      "leaveqouta": 35,
      "leaveused": 0
    },
    {
      "employeeid": "MARK",
      "leavetype": "BUSINESS",
      "leaveqouta": 30,
      "leaveused": 0
    },
    {
      "employeeid": "MARK",
      "leavetype": "GENERAL",
      "leaveqouta": 30,
      "leaveused": 0
    },
    {
      "employeeid": "MARK",
      "leavetype": "SICK",
      "leaveqouta": 30,
      "leaveused": 0
    },
    {
      "employeeid": "MARK",
      "leavetype": "VACATION",
      "leaveqouta": 30,
      "leaveused": 0
    },
    {
      "employeeid": "STEVE",
      "leavetype": "BUSINESS",
      "leaveqouta": 35,
      "leaveused": 0
    },
    {
      "employeeid": "STEVE",
      "leavetype": "GENERAL",
      "leaveqouta": 35,
      "leaveused": 0
    },
    {
      "employeeid": "STEVE",
      "leavetype": "SICK",
      "leaveqouta": 35,
      "leaveused": 0
    },
    {
      "employeeid": "STEVE",
      "leavetype": "VACATION",
      "leaveqouta": 35,
      "leaveused": 0
    }
  ]
}
```

2. request with specific properties

```
{
    "category":"QUESTCLASSIFY",
    "query":"How many vacation days do I have left?",
    "property": "json data"
}
```

using curl:

```
curl -X POST -H "Content-Type: application/json" -H "AuthToken: ?" http://localhost:8080/api/chatter/quest -d "{\"category\": \"QUESTCLASSIFY\", \"query\": \"How many vacation days do I have left?\", \"property\": { \"employeeid\": \"BILL\", \"employeename\": \"Bill\", \"employeesurname\": \"Rush\"} }"
```

reponse:
```
{
  "questionid": "",
  "correlation": "gm9-jFwd6mpi7GwJsK9OHywtcvBXux7K",
  "category": "AIDB3",
  "error": false,
  "statuscode": "",
  "question": "How many vacation days do I have left?",
  "query": "SELECT \n    elq.leaveqouta - elq.leaveused\nFROM\n    employee_leave_quota elq\nINNER JOIN\n\temployee e ON elq.employeeid = e.employeeid\nINNER JOIN\n\temployee_leave_type elt ON elq.leavetype = elt.leavetype\nWHERE\n\te.employeeid = \"BILL\" AND elt.leavetypename = \"Vacation\";",
  "answer": "You have 30 vacation days left.",
  "dataset": [
    {
      "elq.leaveqouta - elq.leaveused": 30
    }
  ]
}
```

(url depending on your host deployment)
