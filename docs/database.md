# DB設計

## users

| カラム | 型 |
|-------|----|
| id | UUID |
| name | TEXT |
| email | TEXT |
| password | TEXT |

## wordbooks

| カラム | 型 |
|-------|----|
| id | UUID |
| title | TEXT |
| description | TEXT |
| themeColor | TEXT |
| ownerId | UUID FK |
| createdAt | TIMESTAMP |
| updatedAt | TIMESTAMP |
| isPublic | BOOLEAN |

## words

| カラム | 型 |
|-------|----|
| id | UUID |
| english | TEXT |
| japanese | TEXT |
| user_id | UUID |