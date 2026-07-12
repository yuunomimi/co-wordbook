import { Request, Response } from 'express';
import pool from '../db';

// 単語帳一覧取得 (GET)
export const getWordbooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req.user as { id: number }).id;

        const query = `
            SELECT
                id, title, description,
                theme_color AS "themeColor",
                owner_id AS "ownerId",
                created_at AS "createdAt",
                updated_at AS "updatedAt",
                is_public AS "isPublic",
                is_shared AS "isShared"
            FROM wordbooks
            WHERE owner_id = $1
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query, [userId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching wordbooks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 単語帳追加 (POST)
export const createWordbook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, themeColor } = req.body;
        // const ownerId = 1; // 元のコード
        const ownerId = (req.user as { id: number })?.id || 1; // req.userが存在すればそれを使う

        const query = `
            INSERT INTO wordbooks (title, description, theme_color, owner_id, is_public, is_shared)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                id, title, description,
                theme_color AS "themeColor",
                owner_id AS "ownerId",
                created_at AS "createdAt",
                updated_at AS "updatedAt",
                is_public AS "isPublic",
                is_shared AS "isShared"
        `;

        const values = [
            title,
            description,
            themeColor || '#6c757d',
            ownerId,
            false,
            false
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating wordbook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 単語帳取得 (GET)
export const getWordbook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const wbid = parseInt(Array.isArray(id) ? id[0] : id, 10);

        const query = `
            SELECT 
                id, title, description,
                theme_color AS "themeColor",
                owner_id AS "ownerId",
                created_at AS "createdAt",
                updated_at AS "updatedAt",
                is_public AS "isPublic",
                is_shared AS "isShared"
            FROM wordbooks
            WHERE id = $1
        `;
        const result = await pool.query(query, [wbid]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Wordbook not found' });
            return;
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching wordbook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 単語帳の更新（PATCH）
export const updateWordbook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const wbid = parseInt(Array.isArray(id) ? id[0] : id, 10);
        const { title, description, themeColor, isPublic, isShared } = req.body;

        // COALESCE を使うことで、送られてこなかった値(null)は更新せず、既存の値を維持します
        const query = `
            UPDATE wordbooks
            SET 
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                theme_color = COALESCE($3, theme_color),
                is_public = COALESCE($4, is_public),
                is_shared = COALESCE($5, is_shared),
                updated_at = NOW()
            WHERE id = $6
            RETURNING 
                id, title, description, 
                theme_color AS "themeColor", 
                owner_id AS "ownerId", 
                created_at AS "createdAt", 
                updated_at AS "updatedAt", 
                is_public AS "isPublic", 
                is_shared AS "isShared"
        `;

        // undefined の場合は null に変換し、SQLの COALESCE が正しく機能するようにします
        const values = [
            title !== undefined ? title : null,
            description !== undefined ? description : null,
            themeColor !== undefined ? themeColor : null,
            isPublic !== undefined ? isPublic : null,
            isShared !== undefined ? isShared : null,
            wbid
        ];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Wordbook not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating wordbook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 単語帳の削除（DELETE）
export const deleteWordbook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const wbid = parseInt(Array.isArray(id) ? id[0] : id, 10);

        const query = `
            DELETE FROM wordbooks 
            WHERE id = $1 
            RETURNING id, title
        `;
        const result = await pool.query(query, [wbid]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Wordbook not found' });
            return;
        }

        // ※元のコードでは削除直後に splice された配列の同じインデックス（mockWB[wordbookIndex]）を
        // 参照しようとするバグがありましたが、RETURNING句を使うことで安全に解決しています。
        res.status(200).json({
            id: result.rows[0].id,
            title: result.rows[0].title
        });
    } catch (error) {
        console.error('Error deleting wordbook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};