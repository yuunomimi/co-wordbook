import { Request, Response } from 'express';
import pool from '../db';

// 単語帳一覧取得 (GET) - 自分がオーナー、またはコラボレーターであるものを取得
export const getWordbooks = async (req: Request, res: Response): Promise<void> => {
    try {
        // user_id は UUID のため string にキャスト
        const userId = (req.user as { id: string }).id;

        const query = `
            SELECT
                w.id, w.title, w.description,
                w.theme_color AS "themeColor",
                w.owner_id AS "ownerId",
                w.created_at AS "createdAt",
                w.updated_at AS "updatedAt",
                w.is_public AS "isPublic",
                EXISTS (
                    SELECT 1 FROM collaborators c WHERE c.wordbook_id = w.id
                ) AS "isShared"
            FROM wordbooks w
            WHERE w.owner_id = $1
               OR EXISTS (
                   SELECT 1 FROM collaborators c
                   WHERE c.wordbook_id = w.id AND c.user_id = $1
               )
            ORDER BY w.created_at DESC
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
        const ownerId = (req.user as { id: string })?.id;

        if (!ownerId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const query = `
            INSERT INTO wordbooks (title, description, theme_color, owner_id, is_public)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id, title, description,
                theme_color AS "themeColor",
                owner_id AS "ownerId",
                created_at AS "createdAt",
                updated_at AS "updatedAt",
                is_public AS "isPublic",
                false AS "isShared"
        `;

        const values = [
            title,
            description,
            themeColor || '#6c757d',
            ownerId,
            false // is_public
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating wordbook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 単語帳取得 (GET) - 自分がオーナー、またはコラボレーターである場合のみ取得可能
export const getWordbook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const userId = (req.user as { id: string }).id;

        const query = `
            SELECT 
                w.id, w.title, w.description,
                w.theme_color AS "themeColor",
                w.owner_id AS "ownerId",
                w.created_at AS "createdAt",
                w.updated_at AS "updatedAt",
                w.is_public AS "isPublic",
                EXISTS (
                    SELECT 1 FROM collaborators c WHERE c.wordbook_id = w.id
                ) AS "isShared"
            FROM wordbooks w
            WHERE w.id = $1
              AND (
                w.owner_id = $2
                OR EXISTS (
                    SELECT 1 FROM collaborators c 
                    WHERE c.wordbook_id = w.id AND c.user_id = $2
                )
              )
        `;
        const result = await pool.query(query, [wordbookId, userId]);

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

// 単語帳の更新（PATCH）- オーナー、またはコラボレーターのみ更新可能
export const updateWordbook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        // isShared は collaborators への登録/削除API側で管理するため更新対象から除外
        const { title, description, themeColor, isPublic } = req.body;
        const userId = (req.user as { id: string }).id;

        const query = `
            UPDATE wordbooks w
            SET 
                title = COALESCE($1, w.title),
                description = COALESCE($2, w.description),
                theme_color = COALESCE($3, w.theme_color),
                is_public = COALESCE($4, w.is_public),
                updated_at = NOW()
            WHERE w.id = $5
              AND (
                w.owner_id = $6
                OR EXISTS (
                    SELECT 1 FROM collaborators c 
                    WHERE c.wordbook_id = w.id AND c.user_id = $6
                )
              )
            RETURNING 
                w.id, w.title, w.description, 
                w.theme_color AS "themeColor", 
                w.owner_id AS "ownerId", 
                w.created_at AS "createdAt", 
                w.updated_at AS "updatedAt", 
                w.is_public AS "isPublic",
                EXISTS (
                    SELECT 1 FROM collaborators c WHERE c.wordbook_id = w.id
                ) AS "isShared"
        `;

        const values = [
            title !== undefined ? title : null,
            description !== undefined ? description : null,
            themeColor !== undefined ? themeColor : null,
            isPublic !== undefined ? isPublic : null,
            wordbookId,
            userId // $6
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

// 単語帳の削除（DELETE）- 【重要】オーナーのみ削除可能
export const deleteWordbook = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const userId = (req.user as { id: string }).id;

        const query = `
            DELETE FROM wordbooks
            WHERE id = $1 AND owner_id = $2
            RETURNING id, title
        `;
        const result = await pool.query(query, [wordbookId, userId]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Wordbook not found' });
            return;
        }

        res.status(200).json({
            id: result.rows[0].id,
            title: result.rows[0].title
        });
    } catch (error) {
        console.error('Error deleting wordbook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};