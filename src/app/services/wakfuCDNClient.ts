import axios, {AxiosResponse} from 'axios';
import type {Texture, Theme} from '../types/core';
import {download, loadTheme, saveTheme} from './appFileManager';
import {WAKFU_CDN} from '../../utils/consts';

const wakfuCDNClient = axios.create({
  baseURL: WAKFU_CDN,
});

async function downloadJSONThemeFromWakfu(): Promise<Theme> {
  const res = await wakfuCDNClient.get('theme/theme.json', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return res.data;
}

async function downloadTexturesFromWakfu(textures: Texture[]): Promise<void> {
  const promises: Promise<unknown>[] = [];

  textures.forEach((texture) => {
    const path = texture.path.replace('.tga', '.png');
    const promise = download(WAKFU_CDN + path, path);
    promises.push(promise);
  });

  await Promise.all(promises);
}

function formatJSONTheme(data: Theme) {
  const positionIdMap = {
    north_west: 'NorthWest',
    north: 'North',
    north_east: 'NorthEast',
    west: 'West',
    center: 'Center',
    east: 'East',
    south_west: 'SouthWest',
    south: 'South',
    south_east: 'SouthEast',
  };

  function extractPixmapFromThemeElement(item) {
    const uniquePixmaps = [];
    if (item.specificPixmaps) {
      item.specificPixmaps.forEach((p) => {
        if (
          !uniquePixmaps.some(
            (uP) =>
              p.texture === uP.texture &&
              p.x === uP.x &&
              p.y === uP.y &&
              p.width === uP.width &&
              p.height === uP.height,
          )
        ) {
          uniquePixmaps.push({ ...p });
        }
      });

      uniquePixmaps.forEach((p) => {
        if (p.id) {
          p.id = p.id.replace(
            new RegExp(`${positionIdMap[p.position]}$`, 'g'),
            '',
          );
        }
        p.position = 'center';
        p.flipHorizontally = false;
        p.flipVertically = false;
      });

      uniquePixmaps.forEach((p) => {
        if (
          !data.pixmaps.some(
            (uP) =>
              p.texture === uP.texture &&
              p.x === uP.x &&
              p.y === uP.y &&
              p.width === uP.width &&
              p.height === uP.height,
          )
        ) {
          data.pixmaps.push(p);
        }
      });
    }

    if (item.childrenThemeElements) {
      item.childrenThemeElements.forEach((i) =>
        extractPixmapFromThemeElement(i),
      );
    }
  }

  data.themeElement.forEach((item) => {
    extractPixmapFromThemeElement(item);
  });
}

export async function getTheme(): Promise<Theme> {
  try {
    const res = await loadTheme();
    return JSON.parse(new TextDecoder().decode(res));
  } catch {
    const data = await downloadJSONThemeFromWakfu();
    formatJSONTheme(data);
    await saveTheme(data);
    await downloadTexturesFromWakfu(data.textures);
    return data;
  }
}
