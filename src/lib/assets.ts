import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * True if a file exists under public/. Evaluated at build time.
 *
 * Lets pages degrade cleanly while assets are still missing — an initials
 * monogram instead of a broken <img>, no download button instead of a 404 —
 * and pick the real asset up automatically once it is added.
 */
export function publicAssetExists(publicPath: string): boolean {
  return existsSync(join(process.cwd(), 'public', publicPath.replace(/^\//, '')));
}
