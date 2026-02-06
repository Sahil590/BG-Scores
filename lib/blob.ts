import { put, del } from '@vercel/blob';

export async function uploadToBlob(file: File, pathname: string): Promise<string> {
  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function deleteFromBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Error deleting from blob:', error);
  }
}
