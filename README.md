### API Server Implementation by Express

#### 1.HTTP API

- Used fetch package to get data from specific [URL](https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty).

#### 2.Rate Limiting

- Assumed User ID is an integer between 1 and 1000.
- Limit the number of same IP requests up to 10 times.
- Limit the number of same user requests up to 5 times.
- Return status code 429 when the request over one of limit.
- Implement it with redis, one is call API, the other is using sliding window algorithm.

#### 3. WebSocket API

- Connect the Bitstamp webSocket server to get Live ticker data of Public channels and send latest price to subscribers.
- Calculate OHLC(open, high, low, close price) per minute through price and send it back to subscribers.

---

Before you begin, make sure you have Node.js and Redis installed on your machine.

### Install

1. Store this project to local

```
git clone https://github.com/Coli-co/Node.js_pretest.git
```

2. Switch to project folder

```
cd Node.js_pretest
```

3. Install npm packages required

```
npm install
```

4. Load user data

```
npm run seed
```

5. Start server or WebSocket Server

```
npm run dev
node WebSocketAPI/websocketServer.js
```
