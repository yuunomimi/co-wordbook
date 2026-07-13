import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';

const JWT_SECRET = process.env.JWT_SECRET;

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

    try {
        // 1. ユーザーの存在チェック
        const userResult = await pool.query(
            'SELECT id, username, password_hash FROM users WHERE username = $1',
            [username]
        );
        let user = userResult.rows[0];

        if (!user) {
            // ==========================================
            // 【新規登録フロー】ユーザーが存在しない場合
            // ==========================================
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            
            // 新規ユーザーをDBに保存し、生成されたidとusernameを返す
            const insertResult = await pool.query(
                'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
                [username, passwordHash]
            );
            
            user = insertResult.rows[0];
            console.log(`新しいユーザー ${username} が自動作成されました`);
        } else {
            // ==========================================
            // 【ログインフロー】ユーザーが存在する場合
            // ==========================================
            const isMatch = await bcrypt.compare(password, user.password_hash);
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

            //TODO sameSiteの設定をあとで検討
            // 3. HttpOnlyクッキーにセット
            res.cookie('auth_token', token, {
                httpOnly: true, // JavaScriptからのアクセスを禁止（XSS対策）
                secure: process.env.NODE_ENV === 'production', // 本番環境(HTTPS)でのみ送信
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000 // 1日
            });

        // 4. レスポンスを返す
        return res.json({
            username: user.username
        });

    } catch (error) {
        console.error('ログイン処理中にエラーが発生しました:', error);
        return res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
};

// ログアウト (POST)
export const logout = async (req: Request, res: Response): Promise<any> => {
    // クッキーをクリア
    //TODO sameSiteの設定をあとで検討
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    });
    return res.json({ message: 'ログアウトしました' });
};