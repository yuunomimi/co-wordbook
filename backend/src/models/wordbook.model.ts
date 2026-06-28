export class Wordbook {
    id: number;
    title: string;
    description: string;
    themeColor: string;
    ownerId: number;
    createdAt: Date;
    updatedAt: Date;
    isPublic: boolean;
    isShared: boolean;

    constructor(
        id: number,
        title: string,
        description: string,
        themeColor: string,
        ownerId: number,
        createdAt: Date,
        updatedAt: Date,
        isPublic: boolean,
        isShared: boolean
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.themeColor = themeColor;
        this.ownerId = ownerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isPublic = isPublic;
        this.isShared = isShared;
    }
}