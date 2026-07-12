import { Request, Response } from 'express';

// TODO: 実際にはデータベースから取得するように変更する

// 単語一覧取得 (GET)
export const getWords = (req: Request, res: Response): void => {
    const { wbid } = req.params;
    console.log("wbid:", wbid); // デバッグ用にwbidをログ出力
    const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);

    const words = mockWords
        .filter(w => w.wordbookId === wordbookId)
        .map(({ wordbookId: _, ...rest }) => rest);

    res.status(200).json(words);
};

// 単語の作成 (POST)
export const createWord = (req: Request, res: Response): void => {
    const { wbid, wid } = req.params;
    const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
    const wordId = parseInt(Array.isArray(wid) ? wid[0] : wid, 10);
    const { word, meaning } = req.body;

    const newWord = {
        id: wordId,
        wordbookId,
        word,
        meaning
    };

    mockWords.push(newWord);

    const { wordbookId: _, ...response } = newWord;
    res.status(201).json(response);
};

// 単語の取得 (GET)
export const getWord = (req: Request, res: Response): void => {
    const { wbid, wid } = req.params;
    const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
    const wordId = parseInt(Array.isArray(wid) ? wid[0] : wid, 10);

    const word = mockWords.find(w => w.id === wordId && w.wordbookId === wordbookId);
    if (!word) {
        res.status(404).json({ message: 'Word not found' });
        return;
    }

    const { wordbookId: _, ...response } = word;
    res.status(200).json(response);
};

// 単語の編集 (PATCH)
export const updateWord = (req: Request, res: Response): void => {
    const { wbid, wid } = req.params;
    const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
    const wordId = parseInt(Array.isArray(wid) ? wid[0] : wid, 10);
    const { word, meaning } = req.body;

    const wordIndex = mockWords.findIndex(w => w.id === wordId && w.wordbookId === wordbookId);
    if (wordIndex === -1) {
        res.status(404).json({ message: 'Word not found' });
        return;
    }

    const updatedWord = {
        ...mockWords[wordIndex],
        word: word || mockWords[wordIndex].word,
        meaning: meaning || mockWords[wordIndex].meaning
    };

    mockWords[wordIndex] = updatedWord;

    const { wordbookId: _, ...response } = updatedWord;
    res.status(200).json(response);
};

// 単語の削除 (DELETE)
// ※ api.md では誤って PATCH と記載されているが、削除操作のため DELETE として実装する
export const deleteWord = (req: Request, res: Response): void => {
    const { wbid, wid } = req.params;
    const wordbookId = parseInt(Array.isArray(wbid) ? wbid[0] : wbid, 10);
    const wordId = parseInt(Array.isArray(wid) ? wid[0] : wid, 10);

    const wordIndex = mockWords.findIndex(w => w.id === wordId && w.wordbookId === wordbookId);
    if (wordIndex === -1) {
        res.status(404).json({ message: 'Word not found' });
        return;
    }

    const deleted = mockWords[wordIndex];
    mockWords.splice(wordIndex, 1);

    const { wordbookId: _, ...response } = deleted;
    res.status(200).json(response);
};

// モックデータ（DBの代わり）
// wordbookId はレスポンスには含めず、フィルタリング用として保持する
const mockWords: { id: number; wordbookId: number; word: string; meaning: string }[] = [
    // TOEIC単語帳 (wordbookId: 1)
    { id: 1, wordbookId: 1, word: 'acquaint', meaning: '知らせる、精通させる' },
    { id: 2, wordbookId: 1, word: 'substantial', meaning: '相当な、実質的な' },
    { id: 3, wordbookId: 1, word: 'proximity', meaning: '近接、近さ' },

    // FE単語帳 (wordbookId: 2)
    { id: 4, wordbookId: 2, word: 'algorithm', meaning: 'アルゴリズム\n問題を解くための手順や計算方法' },
    { id: 5, wordbookId: 2, word: 'cache', meaning: 'キャッシュ\nデータを一時的に保存する仕組み' },
    { id: 6, wordbookId: 2, word: 'deadlock', meaning: 'デッドロック\n複数のプロセスが互いに相手のリソース解放を待ち続ける状態' },

    // BE単語帳 (wordbookId: 3)
    { id: 7, wordbookId: 3, word: 'middleware', meaning: 'ミドルウェア\nOSとアプリケーションの間で動作するソフトウェア' },
    { id: 8, wordbookId: 3, word: 'idempotent', meaning: '冪等\n同じ操作を何度繰り返しても結果が変わらない性質' },

    // JavaScript単語帳 (wordbookId: 4)
    { id: 9, wordbookId: 4, word: 'closure', meaning: 'クロージャ\n関数とその関数が宣言されたスコープの組み合わせ' },
    { id: 10, wordbookId: 4, word: 'promise', meaning: 'プロミス\n非同期処理の最終的な完了または失敗を表すオブジェクト' },
    { id: 11, wordbookId: 4, word: 'prototype', meaning: 'プロトタイプ\nJavaScriptのオブジェクトが持つ継承の仕組み' },
];
