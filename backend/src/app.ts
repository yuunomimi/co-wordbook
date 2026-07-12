import express, { Application } from 'express';
import cors from 'cors';
import wordbooksRoutes from './routes/wordbooks.routes';
import authRoutes from './routes/auth.routes';
import { verifyToken } from './middlewares/auth.middleware';

const app: Application = express();

// フロントエンドからの通信を許可（CORS設定）
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json()); // JSONリクエストの解析

// ルーティングの登録
// verifyTokenを仲介すること
app.use('/api/wordbooks', verifyToken, wordbooksRoutes);
//app.use('/api/wordbooks', wordbooksRoutes);
app.use('/api/auth', authRoutes);

export default app;