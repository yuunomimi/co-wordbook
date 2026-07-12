import { Request, Response } from 'express';
// TODO: 実際にはデータベースから取得するように変更する
// 単語帳一覧取得 (GET)
export const getWordbooks = (req: Request, res: Response): void => {
    res.status(200).json(mockWB);
};

// 単語帳追加 (POST)
export const createWordbook = (req: Request, res: Response): void => {
    const { title, description, themeColor } = req.body; // フロントから送られてきたデータ

    const newWordbook = {
        id: mockWB.length + 1,
        title,
        description,
        themeColor: themeColor || '#6c757d', // デフォルトのテーマカラー
        ownerId: 1, // デフォルトの所有者ID
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        isShared: false
    };

    mockWB.push(newWordbook);
    res.status(201).json(newWordbook);
};

// 単語帳取得 (GET)
export const getWordbook = (req: Request, res: Response): void => {
    const { id } = req.params;
    const wbid = Array.isArray(id) ? id[0] : id;

    const wordbook = mockWB.find(wb => wb.id === parseInt(wbid));
    if (!wordbook) {
        res.status(404).json({ message: 'Wordbook not found' });
        return;
    }
    res.status(200).json(wordbook);
}

// 単語帳の更新（PATCH）
export const updateWordbook = (req: Request, res: Response): void => {
    const { id } = req.params;
    const wbid = Array.isArray(id) ? id[0] : id;
    const { title, description, themeColor, isPublic, isShared } = req.body;

    const wordbookIndex = mockWB.findIndex(wb => wb.id === parseInt(wbid));
    if (wordbookIndex === -1) {
        res.status(404).json({ message: 'Wordbook not found' });
        return;
    }

    const updatedWordbook = {
        ...mockWB[wordbookIndex],
        title: title || mockWB[wordbookIndex].title,
        description: description || mockWB[wordbookIndex].description,
        themeColor: themeColor || mockWB[wordbookIndex].themeColor,
        isPublic: isPublic !== undefined ? isPublic : mockWB[wordbookIndex].isPublic,
        isShared: isShared !== undefined ? isShared : mockWB[wordbookIndex].isShared,
        updatedAt: new Date()
    };

    mockWB[wordbookIndex] = updatedWordbook;
    res.status(200).json(updatedWordbook);
}

// 単語帳の削除（DELETE）
export const deleteWordbook = (req: Request, res: Response): void => {
    const { id } = req.params;
    console.log("id:", id); // デバッグ用にidをログ出力
    const wbid = Array.isArray(id) ? id[0] : id;

    const wordbookIndex = mockWB.findIndex(wb => wb.id === parseInt(wbid));
    if (wordbookIndex === -1) {
        res.status(404).json({ message: 'Wordbook not found' });
        return;
    }
    mockWB.splice(wordbookIndex, 1);
    res.status(200).json({ "id": parseInt(wbid), "title": mockWB[wordbookIndex].title });
}

// モックデータ（DBの代わり）
const mockWB = [
    {
        id: 1,
        title: 'TOEIC単語帳',
        description: 'TOEICの頻出単語をまとめた単語帳',
        themeColor: '#007bff',
        ownerId: 1,
        createdAt: new Date(2026, 1, 1),
        updatedAt: new Date(2026, 1, 1),
        isPublic: true,
        isShared: false
    },
    {
        id: 2,
        title: 'FE単語帳',
        description: 'FEの頻出単語をまとめた単語帳でーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーす',
        themeColor: '#28a745',
        ownerId: 1,
        createdAt: new Date(2026, 2, 1),
        updatedAt: new Date(2026, 3, 1),
        isPublic: false,
        isShared: true
    }
];