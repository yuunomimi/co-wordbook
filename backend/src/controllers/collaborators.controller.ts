import { Request, Response } from 'express';
import pool from '../db';

// 共同編集者一覧取得 (GET /api/wordbooks/:wbid/users)
export const getCollaborators = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const currentUserId = (req.user as { id: string }).id;

        const authCheck = await pool.query(`
            SELECT 1 FROM wordbooks wb
            WHERE wb.id = $1
              AND (
                wb.owner_id = $2
                OR EXISTS (
                    SELECT 1 FROM collaborators c
                    WHERE c.wordbook_id = wb.id AND c.user_id = $2
                )
              )
        `, [wordbookId, currentUserId]);

        if (authCheck.rowCount === 0) {
            res.status(404).json({ message: 'Wordbook not found' });
            return;
        }

        const query = `
            SELECT u.id, u.username, u.email
            FROM collaborators c
            JOIN users u ON c.user_id = u.id
            WHERE c.wordbook_id = $1
            ORDER BY u.username ASC
        `;
        const result = await pool.query(query, [wordbookId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching collaborators:', error);
        res.status(500).json({ message: 'Internal server error', error: error instanceof Error ? error.message : String(error) });
    }
};

// 共同編集者追加 (POST /api/wordbooks/:wbid/users)
export const addCollaborator = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const { username } = req.body; // bodyから username を受け取る
        const currentUserId = (req.user as { id: string }).id;

        // リクエストしたユーザーが「単語帳のオーナー」であるかチェック
        const ownerCheck = await pool.query(`
            SELECT owner_id FROM wordbooks
            WHERE id = $1 AND owner_id = $2
        `, [wordbookId, currentUserId]);

        if (ownerCheck.rowCount === 0) {
            res.status(404).json({ message: 'Wordbook not found' });
            return;
        }

        const userResult = await pool.query(`
            SELECT id FROM users WHERE username = $1
        `, [username]);

        if (userResult.rowCount === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const targetUserId = userResult.rows[0].id;

        // オーナー自身を追加しようとしていないか
        if (targetUserId === currentUserId) {
            res.status(400).json({ message: 'Cannot add yourself as a collaborator' });
            return;
        }

        // 既に共同編集者として登録されていないか
        const existCheck = await pool.query(`
            SELECT 1 FROM collaborators
            WHERE wordbook_id = $1 AND user_id = $2
        `, [wordbookId, targetUserId]);

        if (existCheck.rowCount == null) {
            console.error('Unexpected result from existCheck query:', existCheck);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        if (existCheck.rowCount > 0) {
            res.status(400).json({ message: 'User is already a collaborator' });
            return;
        }

        // 5. 共同編集者を追加
        await pool.query(`
            INSERT INTO collaborators (wordbook_id, user_id)
            VALUES ($1, $2)
        `, [wordbookId, targetUserId]);


        res.status(201).json({ message: 'Collaborator added successfully' });
    } catch (error) {
        console.error('Error adding collaborator:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

// 共同編集者削除 (DELETE /api/wordbooks/:wbid/users/:userId)
export const removeCollaborator = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid, userId } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const currentUserId = (req.user as { id: string }).id;

        // リクエストしたユーザーが「単語帳のオーナー」であるかチェック
        const ownerCheck = await pool.query(`
            SELECT owner_id FROM wordbooks
            WHERE id = $1 AND owner_id = $2
        `, [wordbookId, currentUserId]);

        if (ownerCheck.rowCount === 0) {
            res.status(404).json({ message: 'Wordbook not found' });
            return;
        }


        const result = await pool.query(`
            DELETE FROM collaborators
            WHERE wordbook_id = $1
              AND user_id = $2
            RETURNING *
        `, [wordbookId, userId]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Collaborator not found' });
            return;
        }

        res.status(200).json({ message: 'Collaborator removed successfully' });
    } catch (error) {
        console.error('Error removing collaborator:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
};