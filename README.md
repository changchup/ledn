## Run Instructions

Rename .env.sample => .env then start the database then the server

```
docker-compose up
npm run start
```

To run the end-to-end tests

```
npm run test-e2e
```

## API

Get account
```
GET /accounts/:userEmail
```
Get balance
```
GET /accounts/:userEmail/balance
```
Add transaction
```
POST /transactions - body = {"userEmail": "me@me.com", "type": "send", "amount":"5"  }
```
Update account status
```
PATCH /accounts - body = {"status": "locked"}
```

## Some Design Explanations

I chose to use singletons rather than DI as it was simpler.  DI would enable unit testing, but there was not much unit level work to test.

The locking mechanism is simple with no expiration.  I was trying to create my own utility as requested in the instructions.  I would have preferred to use something like Redis.
