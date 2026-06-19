export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  format: string
  width: number
  height: number
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'shopfresherz') // You'll need to create this preset in Cloudinary
  formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Failed to upload image to Cloudinary')
  }

  const data: CloudinaryUploadResult = await response.json()
  return data.secure_url
}

export async function deleteFromCloudinary(imageUrl: string): Promise<void> {
  // Extract public_id from the Cloudinary URL
  // URL format: https://res.cloudinary.com/<cloud>/image/upload/v<version>/<public_id>.<ext>
  const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i;
  const match = imageUrl.match(regex);
  if (!match) return;

  const publicId = match[1];

  await fetch('/api/cloudinary/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId }),
  });
}