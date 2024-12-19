## Ask/Question With Query API

About question with query API provided

### Quest API 

Ask/Question with query using forum API setting, then it need category setting up before use. \

1. setting

In case of new setting, you can use gui to entry with url:\
ex. http://localhost:8080/gui/forum/entry

After setting, try to obtain forum `ID` from entry in order to use in next step

2. quest

| Classification | Description |
| -------- | ----------- |
| url | http://localhost:8080/api/chat/quest |
| content-type | application/json |

| Parameter | Description |
| -------- | ----------- |
| correlation | this is correlation id default is session id|
| category | this is your key from forum insert |
| query | this is your question to ask |
| agent | this is AI agent usage default is `GEMINI` |
| model | this is AI model usage default is `gemini-1.5-flash` |

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
curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/chat/quest -d "{\"category\":\"AIDB1\", \"query\":\"List all product\"}"
```

reponse:
```
{
    "error": false,
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
