import { Request, Response } from 'express';

// モックデータ（DBの代わり）
const mockProducts = [
    { id: 1, name: 'Laptop', price: 120000 },
    { id: 2, name: 'Mouse', price: 5000 }
];

// 商品一覧取得 (GET)
export const getProducts = (req: Request, res: Response): void => {
    // ステータスコード200でJSONを返す
    res.status(200).json(mockProducts);
};

// 商品追加 (POST)
export const createProduct = (req: Request, res: Response): void => {
    const { name, price } = req.body; // フロントから送られてきたデータ

    const newProduct = {
        id: mockProducts.length + 1,
        name,
        price
    };

    mockProducts.push(newProduct);
    res.status(201).json(newProduct);
};