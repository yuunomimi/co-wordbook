# API仕様

## ログイン

POST /api/login

Request

```json
{
  "email": "test@example.com",
  "password": "password"
}
```

Response

```json
{
  "token": "xxxxx",
  "user": {
    "id": 1,
    "name": "Taro"
  }
}
```

---

## 単語一覧取得

GET /api/words

Response

```json
[
  {
    "id": 1,
    "english": "apple",
    "japanese": "りんご"
  }
]
```