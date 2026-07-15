import { Request, Response } from 'express';
import pool from '../db';

// 単語一覧取得 (GET)
export const getWords = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const userId = (req.user as { id: string }).id;

        // 単語帳へのアクセス権限チェック（空の単語帳でも正しく200空配列を返すため）
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

        // memorablesテーブルをユーザIDで LEFT JOIN して memorable を取得
        const query = `
            SELECT w.id, w.word, w.meaning,
                   COALESCE(m.memorable, false) AS memorable
            FROM words w
            LEFT JOIN memorables m ON m.word_id = w.id AND m.user_id = $2
            WHERE w.wordbook_id = $1
            ORDER BY w.id ASC
        `;
        const result = await pool.query(query, [wordbookId, userId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching words:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// 単語の作成 (POST)
export const createWord = async (req: Request, res: Response): Promise<void> => {
    const client = await pool.connect();
    try {
        const { wbid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const { word, meaning, memorable } = req.body;
        const userId = (req.user as { id: string }).id;

        const authCheck = await client.query(`
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

        await client.query('BEGIN');

        // words テーブルへ挿入
        const wordResult = await client.query(`
            INSERT INTO words (wordbook_id, word, meaning)
            VALUES ($1, $2, $3)
            RETURNING id, word, meaning
        `, [wordbookId, word, meaning]);

        const newWord = wordResult.rows[0];

        await client.query(`
            INSERT INTO memorables (word_id, user_id, memorable)
            VALUES ($1, $2, $3)
        `, [newWord.id, userId, memorable ?? false]);

        await client.query('COMMIT');

        res.status(201).json({ ...newWord, memorable: false });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating word:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
};

// 単語の取得 (GET)
export const getWord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid, wid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const wordId = parseInt(Array.isArray(wid) ? wid[0] : wid, 10);
        const userId = (req.user as { id: string }).id;

        // memorablesテーブルをユーザIDで LEFT JOIN して memorable を取得
        const query = `
            SELECT w.id, w.word, w.meaning,
                   COALESCE(m.memorable, false) AS memorable
            FROM words w
            LEFT JOIN memorables m ON m.word_id = w.id AND m.user_id = $3
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
    const client = await pool.connect();
    try {
        const { wbid, wid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const wordId = parseInt(Array.isArray(wid) ? wid[0] : wid, 10);
        const { word, meaning, memorable } = req.body;
        const userId = (req.user as { id: string }).id;

        await client.query('BEGIN');

        // words テーブルの更新（認可チェック込み）
        const wordResult = await client.query(`
            UPDATE words w
            SET
                word    = COALESCE($1, w.word),
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
        `, [
            word      !== undefined ? word      : null,
            meaning   !== undefined ? meaning   : null,
            wordId,
            wordbookId,
            userId,
        ]);

        if (wordResult.rowCount === 0) {
            await client.query('ROLLBACK');
            res.status(404).json({ message: 'Word not found' });
            return;
        }

        // memorable が指定された場合のみ memorables テーブルを更新
        if (memorable !== undefined) {
            await client.query(`
                UPDATE memorables
                SET memorable = $1
                WHERE word_id = $2 AND user_id = $3
            `, [memorable, wordId, userId]);
        }

        // 最新の memorable を取得してレスポンスに含める
        const memorableResult = await client.query(`
            SELECT COALESCE(memorable, false) AS memorable
            FROM memorables
            WHERE word_id = $1 AND user_id = $2
        `, [wordId, userId]);

        await client.query('COMMIT');

        res.status(200).json({
            ...wordResult.rows[0],
            memorable: memorableResult.rows[0]?.memorable ?? false,
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating word:', error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
};

// 単語の削除 (DELETE)
export const deleteWord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wbid, wid } = req.params;
        const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
        const wordId = parseInt(Array.isArray(wid) ? wid[0] : wid, 10);
        const userId = (req.user as { id: string }).id;

        // words 削除時に memorables も CASCADE される想定のため、先に memorable を取得
        const memorableResult = await pool.query(`
            SELECT COALESCE(memorable, false) AS memorable
            FROM memorables
            WHERE word_id = $1 AND user_id = $2
        `, [wordId, userId]);

        const memorableValue: boolean = memorableResult.rows[0]?.memorable ?? false;

        // words 削除（認可チェック込み）
        const result = await pool.query(`
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
        `, [wordId, wordbookId, userId]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Word not found' });
            return;
        }

        res.status(200).json({ ...result.rows[0], memorable: memorableValue });
    } catch (error) {
        console.error('Error deleting word:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};