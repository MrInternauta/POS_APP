/**
 * Every row of a list asks for its picture, and scrolling back rebuilds those rows, so without
 * this the same file is downloaded and turned into a data url again and again. The answers are
 * shared by every instance of the pipe.
 */
const cache = new Map<string, Promise<unknown>>();

/** Each entry holds a whole picture as base64, so the oldest ones are dropped */
export const MAX_CACHED_IMAGES = 100;

export function imageCacheKey(type: string, img: string): string {
  return `${type}/${img}`;
}

export function getCachedImage(key: string): Promise<unknown> | undefined {
  return cache.get(key);
}

export function rememberImage(key: string, value: Promise<unknown>): void {
  cache.set(key, value);

  while (cache.size > MAX_CACHED_IMAGES) {
    const oldest = cache.keys().next();

    if (oldest.done) {
      break;
    }

    cache.delete(oldest.value);
  }
}

export function forgetImage(key: string): void {
  cache.delete(key);
}

export function clearImageCache(): void {
  cache.clear();
}

export function cachedImageCount(): number {
  return cache.size;
}
