# API仕様

  ## サインイン
POST /api/signin

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
  ## ログアウト
  
POST /api/logout

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

## 単語帳一覧取得

GET /api/wordbooks

Response

```json
[
  {
    "id": 1,
    "title": "Japanese-English",
    "description": "和英単語帳",
    "themeColor": "#DDDD55",
    "ownerId": 3,
    "createdAt": "2026-06-27T11:35:42.123Z",
    "updatedAt": "2026-06-27T11:35:42.123Z",
    "isPublic": false,
    "isShared": false
  }
]
//isSharedはwordbooksDBに格納しない
```

## 単語帳作成

POST /api/wordbooks

Request

```json
{
  "title": "TOEIC",
  "description": "トーイック",
  "themeColor": "#00AAAA",
}
```

Response

```json
{
  "id": 2,
  "title": "TOEIC",
  "description": "トーイック",
  "themeColor": "#00AAAA",
  "ownerId": 1,
  "createdAt": "2026-06-27T11:40:00.000Z",
  "updatedAt": "2026-06-27T11:40:00.000Z"
}
```

## 単語帳更新

PATCH /api/wordbooks/:id

Request

```json
{
  "title": "TOEIC IP",
  "themeColor": "#FFFFFF"
}
```

Response

```json
{
  "id": 2,
  "title": "TOEIC IP",
  "description": "トーイック",
  "themeColor": "#FFFFFF",
  "ownerId": 1,
  "createdAt": "2026-06-27T11:40:00.000Z",
  "updatedAt": "2026-06-27T11:40:00.000Z"
}
```

## 単語帳削除

DELETE /api/wordbooks/:id

Response

```json
{
  "id": 10,
  "title": "TOEIC"
}
```

## 単語一覧取得

GET /api/wordbooks/:id/words

Response

```json
[
  {
    "id": 1,
    "title": "happy",
    "discription": "幸せ"
  },
  {
    "id": 2,
    "title": "guilty",
    "discription": "罪悪、有罪\n対義語はinocent"
  }
]
```