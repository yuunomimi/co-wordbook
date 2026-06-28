import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET; // 本番では環境変数から

// ルートを保護するためのミドルウェア
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ message: '認証が必要です' });
    if (!JWT_SECRET) {
        throw new Error('FATAL: JWT_SECRET が環境変数に設定されていません。');
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // 後続のコントローラーでユーザー情報を使えるようにする
        next(); // 次の処理（コントローラー）へ進む
    } catch (err) {
        return res.status(403).json({ message: 'トークンが無効です' });
    }
};