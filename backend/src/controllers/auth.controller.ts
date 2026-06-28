import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // 本番では環境変数から
// 擬似的なユーザーDB（実際はデータベースから検索してください）
const mockUser = {
    id: 1,
    email: 'user@example.com',
    passwordHash: '$2b$10$abcdef...（ハッシュ化されたパスワード）'
};

// ログイン (POST)
export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    // 1. ユーザーの存在チェック
    if (email !== mockUser.email) {
        return res.status(401).json({ message: 'メールアドレスまたはパスワードが違います' });
    }

    // 2. パスワードの検証（bcryptで比較）
    const isMatch = await bcrypt.compare(password, mockUser.passwordHash);
    if (!isMatch) {
        return res.status(401).json({ message: 'メールアドレスまたはパスワードが違います' });
    }
    if (!JWT_SECRET) {
        throw new Error('FATAL: JWT_SECRET が環境変数に設定されていません。');
    }
    // 3. JWT（トークン）の生成
    const token = jwt.sign(
        { id: mockUser.id, email: mockUser.email },
        JWT_SECRET,
        { expiresIn: '1d' } // 有効期限：1日
    );

    // 4. HttpOnlyクッキーにセットしてレスポンス
    res.cookie('auth_token', token, {
        httpOnly: true, // JavaScriptからのアクセスを禁止（XSS対策）
        secure: process.env.NODE_ENV === 'production', // 本番環境(HTTPS)でのみ送信
        sameSite: 'strict', // CSRF対策
        maxAge: 24 * 60 * 60 * 1000 // 1日
    });

    return res.json({ message: 'ログインに成功しました', user: { id: mockUser.id, email: mockUser.email } });
};
