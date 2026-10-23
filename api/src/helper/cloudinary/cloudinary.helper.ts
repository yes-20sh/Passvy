import { CloudinaryService } from '@/config/cloudinary/cloudinary.service';

export async function uploadEventImageHelper(
  cloudinaryService: CloudinaryService,
  fileData: string,
  folder: string = 'passvy/events',
): Promise<string> {
  // If the string is already a URL (e.g. from previous upload), return it directly.
  if (fileData.startsWith('http://') || fileData.startsWith('https://')) {
    return fileData;
  }

  // Upload the base64 string directly using the Cloudinary SDK
  const cloudinary = cloudinaryService.getCloudinary();
  const result = await cloudinary.uploader.upload(fileData, {
    folder,
  });

  return result.secure_url;
}
