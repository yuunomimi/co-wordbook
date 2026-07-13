# API仕様

  ## ログイン

POST /api/auth/login

Request

```json
{
  "username": "username",
  "password": "password"
}
```

Response

```json
{
  "id": "mojiretsu",
  "username": "Taro"
}
```
  ## ログアウト
  
POST /api/auth/logout

Response

```json
{
  "id": "mojiretsu",
  "username": "Taro"
}
```

## getMe

GET /api/auth/me

```json
{
  "id": "mojiretsu",
  "username": "Taro"
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

## 単語帳取得

GET /api/wordbooks/:id

Response

```json
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
//isSharedはwordbooksDBに格納しない
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
    "word": "happy",
    "meaning": "幸せ"
  },
  {
    "id": 2,
    "word": "guilty",
    "meaning": "罪悪、有罪\n対義語はinocent"
  }
]
```

## 単語の作成

POST /api/wordbooks/:id/words

Request

```json
{
  "id": 1,
  "word": "happy",
  "meaning": "幸せ"
}
```

Response

```json
{
  "id": 1,
  "word": "happy",
  "meaning": "幸せ"
}
```

## 単語取得

GET /api/wordbooks/:id/words/:id

Response

```json
{
  "id": 1,
  "word": "happy",
  "meaning": "幸せ"
}
```

## 単語の編集

PATCH /api/wordbooks/:id/words/:id

Request

```json
{
  "id": 1,
  "word": "happy",
  "meaning": "幸せ"
}
```

Response

```json
{
  "id": 1,
  "word": "happy",
  "meaning": "幸せ"
}
```

## 単語の削除

DELETE /api/wordbooks/:id/words/:id

Response

```json
{
  "id": 1,
  "word": "happy",
  "meaning": "幸せ"
}
```

