import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // 環境変数

// モックDB (emailからusernameに変更)
const mockUsers = [
    {
        id: 1,
        username: 'testuser',
        passwordHash: '$2b$10$abcdef...（ハッシュ化されたパスワード）'
    }
];

// ログイン & 自動サインイン (POST)
export const login = async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;

    // 入力チェック
    if (!username || !password) {
        return res.status(400).json({ message: 'ユーザー名とパスワードは必須です' });
    }

    if (!JWT_SECRET) {
        throw new Error('FATAL: JWT_SECRET が環境変数に設定されていません。');
    }

    // 1. ユーザーの存在チェック
    let user = mockUsers.find(u => u.username === username);

    if (!user) {
        // ==========================================
        // 【新規登録フロー】ユーザーが存在しない場合
        // ==========================================
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        user = {
            id: mockUsers.length + 1,
            username,
            passwordHash
        };
        mockUsers.push(user);
        console.log(`新しいユーザー ${username} が自動作成されました`);
    } else {
        // ==========================================
        // 【ログインフロー】ユーザーが存在する場合
        // ==========================================
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'ユーザー名またはパスワードが違います' });
        }
    }

    // 2. JWT（トークン）の生成（登録/ログイン共通）
    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1d' } // 有効期限：1日
    );

    // 3. HttpOnlyクッキーにセット
    res.cookie('auth_token', token, {
        httpOnly: true, // JavaScriptからのアクセスを禁止（XSS対策）
        secure: process.env.NODE_ENV === 'production', // 本番環境(HTTPS)でのみ送信
        sameSite: 'none', // CSRF対策
        maxAge: 24 * 60 * 60 * 1000 // 1日
    });

    // 4. ご指定のレスポンスを返す
    return res.json({
        username: user.username
    });
};

// ログアウト (POST)
export const logout = async (req: Request, res: Response): Promise<any> => {
    // クッキーをクリア
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    });
    return res.json({ message: 'ログアウトしました' });
};

// ユーザー情報取得 (GET)
export const getMe = async (req: Request, res: Response): Promise<any> => {
    // req.userはverifyTokenミドルウェアで設定される
    const user = req.user as { id: number; username: string } | undefined;
    if (!user) {
        return res.status(401).json({ message: '認証が必要です' });
    }

    return res.json({
        id: user.id,
        username: user.username
    });
}