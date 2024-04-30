import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARYNAME, 
  api_key: process.env.CLOUDINARYKEY,   // credentials were the issue
  api_secret: process.env.CLOUDINARYSECRET, 
});

export default async function uploadCloudinary(fileBase64: string):Promise<string|null> {
  try {
    const uploadData: UploadApiResponse = await cloudinary.uploader.upload(fileBase64, {
      resource_type: "video",
      width: 400,
      height: 400,
       crop: "limit",
    });
  
    return uploadData.url;
  } catch (e: any) {
    console.log(e);
    return null;
  }
}
