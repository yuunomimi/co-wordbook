import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // 環境変数

// TODO: モックからDB
const mockUsers = [
    {
        id: 1,
        email: 'user@example.com',
        passwordHash: '$2b$10$abcdef...（ハッシュ化されたパスワード）'
    }
];

// サインイン(POST)
export const signin = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    // 1. 重複ユーザーの存在チェック
    const mockUser = mockUsers.find(user => user.email === email);
    if (mockUser) {
        return res.status(401).json({ message: 'このメールアドレスは既に使用されています' });
    }

    // 2. パスワードのハッシュ化
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // 3. 新しいユーザーを作成（モックDBに追加）
    const newUser = {
        id: mockUsers.length + 1,
        email,
        passwordHash
    };
    mockUsers.push(newUser);
    console.log('新しいユーザーが作成されました:', mockUsers);

    // 4. JWT（トークン）の生成
    if (!JWT_SECRET) {
        throw new Error('FATAL: JWT_SECRET が環境変数に設定されていません。');
    }
    const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '1d' } // 有効期限：1日
    );

    // 5. HttpOnlyクッキーにセットしてレスポンス
    res.cookie('auth_token', token, {
        httpOnly: true, // JavaScriptからのアクセスを禁止（XSS対策）
        secure: process.env.NODE_ENV === 'production', // 本番環境(HTTPS)でのみ送信
        sameSite: 'strict', // CSRF対策
        maxAge: 24 * 60 * 60 * 1000 // 1日
    });

    return res.json({ message: 'サインインに成功しました', user: { id: newUser.id, email: newUser.email } });
}

// ログイン (POST)
export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    // 1. ユーザーの存在チェック
    const mockUser = mockUsers.find(user => user.email === email);
    if (!mockUser) {
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

export const logout = async (req: Request, res: Response): Promise<any> => {
    // クッキーをクリア
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });
    return res.json({ message: 'ログアウトしました' });
};