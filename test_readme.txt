For Gemini: set API_KEY=AIzaSyDB3AjxSvK54EbngBB95_3xAIQucGctAGc
For Claude: setx ANTHROPIC_API_KEY "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"
For more info about Claude, please visit: https://docs.anthropic.com/en/docs/quickstart

curl -X POST http://localhost:8080/api/question/quest -d "query=Find out best seller of 5 products in March,2024 ?"
curl -X POST http://localhost:8080/api/inquiry/inquire -d "query=select * from cust_product"
curl -X POST http://localhost:8080/api/question/ask -d "query=List best 10 actors in 2021 ?"

Product Selling: 
List all product name and price order by price descending
List product with name and price then order by price descending
What is the cheapest product name
What is the most expensive product name
Find out best seller 5 product's name of unit in March,2024
Find out top 5 customer's name of order amount in March,2024

Course Training:
What is the cheapest course name from training schedule
What is the most expensive course name from training schedule
List all course name and cost from training schedule
Find out registered trainee's name in March,2024
Find out top most training days from training schedule

Vision:
curl -X POST http://localhost:8080/api/vision/ask -d "image=3ed56d2c-ff93-4b41-a9ee-548db3a31b70&query=Extract text from image"
curl -X POST http://localhost:8080/api/vision/quest -d "query=Extract text from image&image=image-data-base64"

Google Vision API:
1. Create a service account with the roles your application needs, and a key for that service account, 
by following the instructions in Creating a service account key.
2. Set the environment variable GOOGLE_APPLICATION_CREDENTIALS to the path of the JSON file that contains your credentials
set GOOGLE_APPLICATION_CREDENTIALS=KEY_PATH_TO_JSON_FILE
ex.
set GOOGLE_APPLICATION_CREDENTIALS=D:\AI\key\service_account_key.json

test: chat query
curl -X POST -H "AuthToken: ?" http://localhost:8080/api/chat/quest -d "category=AIDB1&query=List all products"
curl -X POST -H "AuthToken: ?" http://localhost:8080/api/chat/quest -d "category=AIDB2&query=List all courses training"
curl -X POST -H "AuthToken: ?" http://localhost:8080/api/chat/quest -d "category=AIDB3&query=List all employee leave quota"
curl -X POST -H "Content-Type: application/json" -H "AuthToken: ?" http://localhost:8080/api/chat/quest -d "{\"category\": \"AIDB3\", \"query\": \"List all employee leave quota\"}"
curl -X POST -H "Content-Type: application/json" -H "AuthToken: ?" http://localhost:8080/api/chat/quest -d "{\"category\": \"AIDB3\", \"query\": \"How many vacation days do I have in total?\", \"property\": { \"employeeid\": \"BILL\", \"employeename\": \"Bill\", \"employeesurname\": \"Rush\"} }"
curl -X POST -H "Content-Type: application/json" -H "AuthToken: ?" http://localhost:8080/api/chat/quest -d "{\"category\": \"AIDB3\", \"query\": \"How many vacation days do I have left?\", \"property\": { \"employeeid\": \"BILL\", \"employeename\": \"Bill\", \"employeesurname\": \"Rush\"} }"

test: classify quest
1. product selling
curl -X POST -H "AuthToken: ?" http://localhost:8080/api/chatter/quest -d "category=QUESTCLASSIFY&query=List all products"

2. course training
curl -X POST -H "AuthToken: ?" http://localhost:8080/api/chatter/quest -d "category=QUESTCLASSIFY&query=List all courses training"

3. employee leave
curl -X POST -H "AuthToken: ?" http://localhost:8080/api/chatter/quest -d "category=QUESTCLASSIFY&query=List all employee leave quota"

4. not found category
curl -X POST -H "AuthToken: ?" http://localhost:8080/api/chatter/quest -d "category=QUESTCLASSIFY&query=List all employee family services"

5. chat note : holiday sec.
curl -X POST -H "AuthToken: ?" http://localhost:8080/api/chatter/quest -d "category=QUESTCLASSIFY&query=How many holidays of total?"


test: summary documents
+ upload file 
curl -X POST http://localhost:8080/upload/file -F filename=@D:\node\willsofts\aimis\pdf\Holiday_2568_GROUP.pdf -F type=SUM -F group=SUM -F no=8d593f62-0b9f-11f0-9a18-00155d8f9de9
curl -X POST http://localhost:8080/upload/file -F filename=@D:\node\willsofts\aimis\pdf\Holiday_2568_SEC.pdf -F type=SUM -F group=SUM -F no=8d593f62-0b9f-11f0-9a18-00155d8f9de9

{"head":{"model":"upload","method":"file","errorcode":"0","errorflag":"N","errordesc":""},"body":{"records":1,"rows":{"affectedRows":1,"attachid":"ff348d1b-0859-42d3-9cd8-f8d172530054","attachno":"8d593f62-0b9f-11f0-9a18-00155d8f9de9","attachtype":"SUM","sourcefile":"Holiday_2568_GROUP.pdf","attachfile":"ff348d1b-0859-42d3-9cd8-f8d172530054.pdf","attachsize":235507,"mimetype":"application/pdf","attachgroup":"SUM"},"columns":null}}
{"head":{"model":"upload","method":"file","errorcode":"0","errorflag":"N","errordesc":""},"body":{"records":1,"rows":{"affectedRows":1,"attachid":"13a772f6-7272-429e-a2ae-f9ea0116f452","attachno":"8d593f62-0b9f-11f0-9a18-00155d8f9de9","attachtype":"SUM","sourcefile":"Holiday_2568_SEC.pdf","attachfile":"13a772f6-7272-429e-a2ae-f9ea0116f452.pdf","attachsize":186560,"mimetype":"application/pdf","attachgroup":"SUM"},"columns":null}}

curl -X POST http://localhost:8080/api/sumdoc/retrieve?summaryid=8d593f62-0b9f-11f0-9a18-00155d8f9de9


test: forum
curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/forum/insert -d @chat_forum_api.json
curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/forum/insert -d @chat_forum_db.json
curl -X POST http://localhost:8080/api/forum/retrieve?forumid=MY-FORUM 
curl -X POST http://localhost:8080/api/forum/remove?forumid=MY-FORUM

test: forum note
curl -X POST http://localhost:8080/upload/file -F type=NOTE -F filename=@D:\AI\docs\holiday_securities.txt
curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/forumnote/insert -d @chat_note.json
curl -X POST http://localhost:8080/api/forumnote/retrieve?forumid=MY-NOTE
curl -X POST http://localhost:8080/api/forumnote/remove?forumid=MY-NOTE

test: summary document
1. insert
curl -X POST -H "Content-Type: application/json" http://localhost:8080/api/sumdoc/insert -d @sum_doc.json
2. upload file
curl -X POST http://localhost:8080/upload/file -F no=MY-SUMKEY -F type=SUM -F filename=@D:\AI\docs\holiday_securities.txt
3. retrieve
curl -X POST http://localhost:8080/api/sumdoc/retrieve?summaryid=MY-SUMKEY
4. generate summary document
curl -X POST http://localhost:8080/api/sumdoc/summary?summaryid=MY-SUMKEY

test: rag async
set RAG_API_URL_UPLOAD_ASYNC_WEBHOOK=https://webhook.site/9ae655ea-8ee3-4712-8457-efcfd1c2fef0
set RAG_API_URL_UPLOAD_ASYNC_WEBHOOK=https://aiinterface.freewillgroup.com/api/rag/sync
set RAG_API_URL_UPLOAD_ASYNC_WEBHOOK=https://172.31.199.217:8077/api/rag/sync

