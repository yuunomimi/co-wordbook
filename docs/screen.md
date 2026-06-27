# 画面一覧

- ログイン
- 新規登録
- ホーム
- 単語一覧
- 単語追加
- 単語編集

## 画面遷移図

```mermaid
flowchart TD

Login[ログイン]
Register[新規登録]
Home[ホーム]
WordList[単語一覧]
AddWord[単語追加]
EditWord[単語編集]

Login --> Home
Register --> Home
Home --> WordList
WordList --> AddWord
WordList --> EditWord
```