import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import wordbooksRoutes from './routes/wordbooks.routes';
import authRoutes from './routes/auth.routes';
import { verifyToken } from './middlewares/auth.middleware';
const app: Application = express();

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/wordbooks', verifyToken, wordbooksRoutes);
app.use('/api/auth', authRoutes);

const frontendPath = path.join(__dirname, '../../frontend/dist');

// 静的ファイルの提供を許可
app.use(express.static(frontendPath));

// APIルート以外のすべてのGETリクエストをフロントエンドの index.html に流す（SPA用）
app.get(/(.*)/, (req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

export default app;