import cloudinary from "@/config/cloudnary.config.js";

export const uploadToCloud = async (file, folderName) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((res, rej) => {
      const result = cloudinary.uploader
        .upload_stream(
          {
            folder: folderName,
            resource_type: "auto",
            quality: "100",
            density: 300,
            max_file_size: 5000000,
          },
          (err, result) => {
            if (err) return rej(err);
            res({ secureUrl: result.secure_url, publicId: result.public_id });
          },
        )
        .end(buffer);
    });
  } catch (error) {
    return false;
  }
};
