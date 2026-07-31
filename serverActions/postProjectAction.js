"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import { uploadToCloud } from "@/helpers/cloud.upload";
import { ProjectPost } from "@/schemas/project.schema";
import { projectPostSchema } from "@/validations/project.validation";

export const postProjectAction = async (prevState, form) => {
  const res = await authAndGetUser();
  if (!res.success) return { success: false };
  form.clientId = res.id;

  let fileToUpload = form.imageFiles;
  fileToUpload.push(form.documentFile);

  const uploadResponse = await Promise.all(
    fileToUpload.map((file) => uploadToCloud(file, "projectsFiles")),
  );

  form.documentFile = uploadResponse[uploadResponse.length - 1];
  form.imageFiles = uploadResponse.slice(0, uploadResponse.length - 1);

  const result = projectPostSchema.safeParse(form);
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    console.log("validation result: ", result);

    return {
      success: false,
      errors: fieldErrors,
      message: "Please correct the errors in the form.",
    };
  }

  try {
    await dbConnect();
    const newProject = await ProjectPost.create(result.data);

    return {
      success: true,
      errors: {},
      message: "Post Project successful!",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errors: {},
      message: "Something went wrong on our end. Please try again later.",
    };
  }
};
