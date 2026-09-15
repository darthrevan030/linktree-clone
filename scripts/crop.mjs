/**
 * Pure crop maths for the avatar, kept separate from sharp/file IO so it can
 * be unit-tested.
 *
 * The crop is described in FRACTIONS of the image, so it survives the photo
 * being re-exported at a different resolution:
 *   centerX, centerY — where the crop is centred (0..1 of width / height)
 *   size             — crop side as a fraction of the image's SHORTER side (0..1]
 *
 * @param {number} width  source width in px
 * @param {number} height source height in px
 * @param {{ centerX: number, centerY: number, size: number }} crop
 * @returns {{ left: number, top: number, width: number, height: number }}
 */
export function computeSquareCrop(width, height, { centerX, centerY, size }) {
  if (!(width > 0 && height > 0)) throw new RangeError('image dimensions must be positive');
  if (!(size > 0 && size <= 1)) throw new RangeError('size must be in (0, 1]');
  if (!(centerX >= 0 && centerX <= 1 && centerY >= 0 && centerY <= 1)) {
    throw new RangeError('centerX and centerY must be in [0, 1]');
  }

  const side = Math.round(size * Math.min(width, height));
  const clamp = (value, max) => Math.min(Math.max(value, 0), max);

  // Shift the square back inside the image rather than shrinking it, so the
  // output is always exactly side x side.
  const left = clamp(Math.round(centerX * width - side / 2), width - side);
  const top = clamp(Math.round(centerY * height - side / 2), height - side);

  return { left, top, width: side, height: side };
}
