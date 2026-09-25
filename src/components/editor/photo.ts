/**
 * A photograph chosen in the editor, prepared in the browser before it is
 * uploaded: turned upright, scaled to at most 2,000 px on its long side and
 * re-encoded as JPEG. Re-encoding drops everything but the pixels — camera
 * details and, above all, the GPS location a phone writes into a photo.
 */
export type Prepared = { blob: Blob; width: number; height: number; preview: string };

async function draw(bitmap: ImageBitmap, max: number, quality: number): Promise<{ blob: Blob; width: number; height: number }> {
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser can't prepare photos.");
  // Transparent PNGs get the page's own paper behind them, not black.
  ctx.fillStyle = "#f0e7d0";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("The photo couldn't be prepared."))), "image/jpeg", quality),
  );
  return { blob, width, height };
}

function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function preparePhoto(file: File): Promise<Prepared> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("This photo's format can't be read here. Please choose a JPEG or PNG.");
  }
  try {
    const full = await draw(bitmap, 2000, 0.86);
    const thumb = await draw(bitmap, 480, 0.72);
    return { ...full, preview: await toDataUrl(thumb.blob) };
  } finally {
    bitmap.close();
  }
}
