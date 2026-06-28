// データベースのユーザーテーブル（コレクション）の構造を定義
export interface UserModel {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

// ※実際にはここにORM（PrismaやMongooseなど）のスキーマ定義が入ります
/*
ユーザー情報のデータ構造を定義します。例えば「メールアドレスは必須かつ一意（Unique）であること」
「パスワードは特定の文字数以上であること」などの制約を設けます。

コントローラーからの指示を受け、実際にデータベースへユーザー情報を保存したり、
メールアドレスを条件にユーザーを検索して情報を引き出したりします。
*/