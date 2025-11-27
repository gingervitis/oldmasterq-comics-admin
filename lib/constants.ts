// Image storage configuration
export const COMIC_STRIP_IMAGE_BASE_URL =
  "https://pub-742c47f9623144339cc6ee1c0cde3e08.r2.dev/strips";

// Helper function to construct comic strip image URL
export function getStripImageUrl(stripId: string): string {
  return `${COMIC_STRIP_IMAGE_BASE_URL}/${stripId}.png`;
}
