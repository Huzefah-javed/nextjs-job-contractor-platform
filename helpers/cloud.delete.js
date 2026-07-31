import cloudinary from "@/config/cloudnary.config"

export const deleteFromCloud =async(imgPublicId)=>{
        try {
             await cloudinary.uploader.destroy(imgPublicId)
             return true
        } catch (error) {
            return false
        }
}
