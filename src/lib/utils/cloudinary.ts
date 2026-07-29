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

export async function uploadVideoToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'shopfresherz')
  formData.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    // Surface Cloudinary's own message — e.g. "Unsupported video format or
    // file" is what this unsigned preset returns for EVERY video file right
    // now (confirmed with a known-valid mp4), because the "shopfresherz"
    // preset's allowed resource type doesn't include video. That's a
    // Cloudinary dashboard setting, not something this code can work around
    // — the preset needs "video" enabled (or a dedicated video preset) before
    // uploads here can ever succeed.
    let message = 'Failed to upload video to Cloudinary'
    try {
      const body = await response.json()
      if (body?.error?.message) message = body.error.message
    } catch {
      // ignore — fall back to the generic message
    }
    throw new Error(message)
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