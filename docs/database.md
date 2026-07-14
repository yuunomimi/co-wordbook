# DB設計

## users

| カラム | 型 | 制約・デフォルト |
| :--- | :--- | :--- |
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| username | VARCHAR(255) | NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

## wordbooks

| カラム | 型 | 制約・デフォルト |
| :--- | :--- | :--- |
| id | SERIAL | PRIMARY KEY |
| title | VARCHAR(255) | |
| description | TEXT | |
| theme_color | VARCHAR(50) | |
| owner_id | UUID | REFERENCES users(id) ON DELETE CASCADE |
| is_public | BOOLEAN | |
| created_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP |

## words

| カラム | 型 | 制約・デフォルト |
| :--- | :--- | :--- |
| id | SERIAL | PRIMARY KEY |
| wordbook_id | INTEGER | NOT NULL, REFERENCES wordbooks(id) ON DELETE CASCADE |
| word | VARCHAR(255) | NOT NULL |
| meaning | TEXT | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() |

## collaborators

| カラム | 型 | 制約・デフォルト |
| :--- | :--- | :--- |
| user_id | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE, PRIMARY KEY(1/2) |
| wordbook_id | INTEGER | NOT NULL, REFERENCES wordbooks(id) ON DELETE CASCADE, PRIMARY KEY(2/2) |