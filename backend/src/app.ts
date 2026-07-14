import express, { Application, Request, Response } from 'express'; // Request, Responseを追加
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path'; // 追加：パスを扱うためのモジュール
import wordbooksRoutes from './routes/wordbooks.routes';
import authRoutes from './routes/auth.routes';
import { verifyToken } from './middlewares/auth.middleware';
import fs from 'fs'; // 追加

const app: Application = express();

// フロントエンドからの通信を許可（CORS設定）
// ※同じサーバーで動かす場合、本番環境ではCORSは不要になりますが、
// ローカル開発用にこのまま残しておいて問題ありません。
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// --- APIのルーティング ---
app.use('/api/wordbooks', verifyToken, wordbooksRoutes);
app.use('/api/auth', authRoutes);


// --- 追加：フロントエンドの静的ファイル配信とSPA対応 ---

// 1. フロントエンドのビルド済みファイル（distフォルダなど）のパスを指定
// ※注意：コンパイル後のJSファイル（backend/dist/app.js など）から見たパスを指定します。
// 構成に合わせて階層(`../`)を調整してください。
const frontendPath = path.join(__dirname, '../../frontend/dist');

// 2. 静的ファイルの提供を許可
app.use(express.static(frontendPath));

// // デバッグ用のログを出力（Renderのログで確認できます）
// console.log("===============================");
// console.log("__dirname is:", __dirname);
// console.log("frontendPath is:", frontendPath);
// console.log("Does frontendPath exist?:", fs.existsSync(frontendPath));
// console.log("===============================");

// 3. APIルート以外のすべてのGETリクエストをフロントエンドの index.html に流す（SPA用）
app.get(/(.*)/, (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

export default app;