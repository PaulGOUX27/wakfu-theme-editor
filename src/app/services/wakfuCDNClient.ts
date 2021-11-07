import axios from "axios";
import type {Theme} from "../types/core";

const wakfuCDNClient = axios.create({
    baseURL: 'https://wakfu.cdn.ankama.com/gamedata/',
})

async function downloadJSONThemeFromWakfu(): Promise<Theme> {
    const res = await wakfuCDNClient.get("theme/theme.json", {
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
    }});

    return res.data
}

function formatJSONTheme(data: Theme) {
    const positionIdMap = {
        'north_west': "NorthWest",
        'north': "North",
        'north_east': "NorthEast",
        'west': "West",
        'center': "Center",
        'east': "East",
        'south_west': "SouthWest",
        'south': "South",
        'south_east': "SouthEast"
    }

    function extractPixmapFromThemeElement(item) {
        const uniquePixmaps = [];
        if (item.specificPixmaps) {
            item.specificPixmaps.forEach((p) => {
                if (!uniquePixmaps.some(uP => p.texture === uP.texture
                    && p.x === uP.x
                    && p.y === uP.y
                    && p.width === uP.width
                    && p.height === uP.height)) {
                    uniquePixmaps.push({ ...p })
                }
            });

            uniquePixmaps.forEach(p => {
                if (p.id)
                    p.id = p.id.replace(new RegExp(`${positionIdMap[p.position]}$`, "g"), '');
                p.position = 'center';
                p.flipHorizontally = false;
                p.flipVertically = false;
            });



            uniquePixmaps.forEach(p => {
                if (!data.pixmaps.some(uP => p.texture === uP.texture
                    && p.x === uP.x
                    && p.y === uP.y
                    && p.width === uP.width
                    && p.height === uP.height)) {
                    data.pixmaps.push(p);
                }
            })
        }

        if (item.childrenThemeElements) {
            item.childrenThemeElements.forEach(i =>
                extractPixmapFromThemeElement(i)
            )
        }
    }

    data.themeElement.forEach((item) => {
        extractPixmapFromThemeElement(item);
    })
}

export async function getTheme(): Promise<Theme> {
    let data = await downloadJSONThemeFromWakfu();
    formatJSONTheme(data)
    return data
}