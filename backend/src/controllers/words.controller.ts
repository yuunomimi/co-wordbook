import { Request, Response } from 'express';
import pool from '../db';

// 単語一覧取得 (GET)
export const getWords = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const userId = (req.user as { id: string }).id;

        // 1. 先に単語帳自体へのアクセス権限があるかをチェック（空の単語帳でも正しく200空配列を返すため）
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
        `, [wordbookId, userId]);

        if (authCheck.rowCount === 0) {
            res.status(404).json({ message: 'Wordbook not found' });
            return;
        }

        // 2. 権限があれば単語一覧を取得
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
        const userId = (req.user as { id: string }).id;

        // 不正な単語帳への単語追加を防ぐため、事前に単語帳の書き込み権限をチェック
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
        `, [wordbookId, userId]);

        if (authCheck.rowCount === 0) {
            res.status(404).json({ message: 'Wordbook not found' });
            return;
        }

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
        const userId = (req.user as { id: string }).id;

        // 単語が指定の単語帳に属し、かつその単語帳の権限をユーザーが持っているか一発で判定
        const query = `
            SELECT w.id, w.word, w.meaning
            FROM words w
            WHERE w.id = $1 AND w.wordbook_id = $2
              AND EXISTS (
                  SELECT 1 FROM wordbooks wb
                  WHERE wb.id = $2
                    AND (
                      wb.owner_id = $3
                      OR EXISTS (
                          SELECT 1 FROM collaborators c 
                          WHERE c.wordbook_id = wb.id AND c.user_id = $3
                      )
                    )
              )
        `;
        const result = await pool.query(query, [wordId, wordbookId, userId]);

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
        const userId = (req.user as { id: string }).id;

        // WHERE句に親テーブル（wordbooks）の認可条件を埋め込み
        const query = `
            UPDATE words w
            SET
                word = COALESCE($1, w.word),
                meaning = COALESCE($2, w.meaning),
                updated_at = NOW()
            WHERE w.id = $3 AND w.wordbook_id = $4
              AND EXISTS (
                  SELECT 1 FROM wordbooks wb
                  WHERE wb.id = $4
                    AND (
                      wb.owner_id = $5
                      OR EXISTS (
                          SELECT 1 FROM collaborators c 
                          WHERE c.wordbook_id = wb.id AND c.user_id = $5
                      )
                    )
              )
            RETURNING w.id, w.word, w.meaning
        `;

        const values = [
            word !== undefined ? word : null,
            meaning !== undefined ? meaning : null,
            wordId,
            wordbookId,
            userId // $5 に割り当て
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
export const deleteWord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid, wid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const wordId = parseInt(Array.isArray(wid) ? wid[0] : wid, 10);
        const userId = (req.user as { id: string }).id;

        // WHERE句に親テーブル（wordbooks）の認可条件を埋め込み
        const query = `
            DELETE FROM words w
            WHERE w.id = $1 AND w.wordbook_id = $2
              AND EXISTS (
                  SELECT 1 FROM wordbooks wb
                  WHERE wb.id = $2
                    AND (
                      wb.owner_id = $3
                      OR EXISTS (
                          SELECT 1 FROM collaborators c 
                          WHERE c.wordbook_id = wb.id AND c.user_id = $3
                      )
                    )
              )
            RETURNING w.id, w.word, w.meaning
        `;
        const result = await pool.query(query, [wordId, wordbookId, userId]);
        

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