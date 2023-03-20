### Crypto Currency Pair API Server

#### 1.HTTP API

- Used fetch package to get data from json format of data.
- Access path through an integer between 1 and 1000 of id.

```
http://loaclhost:3000/data?user=id
```

#### 2.Rate Limiting

- Limit the number of same IP requests up to 10 times every minute.
- Limit the number of same user requests up to 5 times every minute.
- Return status code 429 when the request over one of above limit.
- Implement it with Redis, one is call API method, the other is using sliding window algorithm.

#### 3. WebSocket API

- Connect the Bitstamp websocket server to get Live ticker data of Public channels and send latest price to subscribers.
- Calculate OHLC(open, high, low, close price) per minute through price and send it back to subscribers.

```
ws://localhost:3000/streaming
```

- Send latest price and OHLC according to the number of subscribers.
  ![This is postman test](https://colicontainer.s3.ap-northeast-1.amazonaws.com/firstFolder/Crypto_API_Server.gif)

---

Before you begin, make sure you have Node.js and Redis installed on your machine.

### Install

1. Store this project to local

```
git clone https://github.com/Coli-co/Crypto_API_Server.git
```

2. Switch to project folder

```
cd Crypto_API_Server
```

3. Install npm packages required

```
npm install
```

4. Load subscribers data

- Data structure of Set with Redis to prevent duplicate subscriber.

```
npm run seed
```

5. Start server or WebSocket Server

```
npm run dev
```
