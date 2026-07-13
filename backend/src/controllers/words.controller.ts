import { Request, Response } from 'express';
import pool from '../db';

// 単語一覧取得 (GET)
export const getWords = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);

        const query = `
            SELECT id, word, meaning
            FROM words
            WHERE wordbook_id = $1
            ORDER BY id ASC
        `;
        const result = await pool.query(query, [wordbookId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 単語の作成 (POST)
export const createWord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const { word, meaning } = req.body;

        const query = `
            INSERT INTO words (wordbook_id, word, meaning)
            VALUES ($1, $2, $3)
            RETURNING id, word, meaning
        `;
        const result = await pool.query(query, [wordbookId, word, meaning]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating word:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 単語の取得 (GET)
export const getWord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid, wid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const wordId = parseInt(Array.isArray(wid) ? wid[0] : wid, 10);

        const query = `
            SELECT id, word, meaning
            FROM words
            WHERE id = $1 AND wordbook_id = $2
        `;
        const result = await pool.query(query, [wordId, wordbookId]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Word not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching word:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 単語の編集 (PATCH)
export const updateWord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid, wid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const wordId = parseInt(Array.isArray(wid) ? wid[0] : wid, 10);
        const { word, meaning } = req.body;

        const query = `
            UPDATE words
            SET
                word = COALESCE($1, word),
                meaning = COALESCE($2, meaning),
                updated_at = NOW()
            WHERE id = $3 AND wordbook_id = $4
            RETURNING id, word, meaning
        `;

        // undefined の場合は null に変換し、COALESCE が正しく機能するようにする
        const values = [
            word !== undefined ? word : null,
            meaning !== undefined ? meaning : null,
            wordId,
            wordbookId
        ];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Word not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating word:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 単語の削除 (DELETE)
// ※ api.md では誤って PATCH と記載されているが、削除操作のため DELETE として実装する
export const deleteWord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid, wid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const wordId = parseInt(Array.isArray(wid) ? wid[0] : wid, 10);

        const query = `
            DELETE FROM words
            WHERE id = $1 AND wordbook_id = $2
            RETURNING id, word, meaning
        `;
        const result = await pool.query(query, [wordId, wordbookId]);
        

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Word not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting word:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
