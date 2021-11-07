export type Texture = {
    id: string;
    path: string;
    overridable: boolean;
    since: string;
}

export type Pixmap = {
    "id": string;
    "texture": string;
    "position": string;
    "x": number;
    "y": number;
    "width": number;
    "height": number;
    "flipHorizontally": boolean;
    "flipVertically": boolean;
    "since": string;
}

export type Color = {
    "id": string;
    "red": number;
    "green": number;
    "blue": number;
    "alpha": number;
    "since": string;
    "usage": string[];
}

export type ThemeElement = {
    "id": string;
    "scaled": boolean;
    "type": number;
    "specificPixmaps": Pixmap[];
    "childrenThemeElements": ThemeElement[];
    "since": number;
}

export type Theme = {
    textures: Texture[];
    pixmaps: Pixmap[];
    colors: Color[];
    themeElement: ThemeElement[];
}