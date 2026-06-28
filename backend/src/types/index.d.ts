import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        export interface Request {
            // jwt.verifyの戻り値の型に合わせて定義
            user?: string | JwtPayload;
        }
    }
}