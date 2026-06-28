// データベースのユーザーテーブル（コレクション）の構造を定義
export interface UserModel {
    id: number;
    name: string;
    email: string;
    password: string; // ハッシュ化されたパスワード
}

// ※実際にはここにORM（PrismaやMongooseなど）のスキーマ定義が入ります
/*


{
  "token": "xxxxx", // JWTトークンはDBには保存しないのが一般的
    "user": {
    "id": 1,
    "name": "Taro"
    }
}
*/