import express, { Application } from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';

const app: Application = express();

// フロントエンドからの通信を許可（CORS設定）
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); // JSONリクエストの解析

// ルーティングの登録
app.use('/api/products', productRoutes);

export default app;