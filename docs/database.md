# DB設計

## users

| カラム | 型 |
|-------|----|
| id | UUID |
| name | TEXT |
| email | TEXT |
| password | TEXT |

## words

| カラム | 型 |
|-------|----|
| id | UUID |
| english | TEXT |
| japanese | TEXT |
| user_id | UUID |