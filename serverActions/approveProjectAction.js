"use server";

import { dbConnect } from "@/config/db.config";
import { ProjectPost } from "@/schemas/project.schema";
import mongoose from "mongoose";

export async function approveProjectAction(projectId) {

    try {
    if (
      !projectId ||
      typeof projectId !== "string" ||
      !mongoose.Types.ObjectId.isValid(projectId)
    ) {
      return {
        success: false,
        message: "Invalid project ID provided.",
      };
    }

    const targetObjectId = new mongoose.Types.ObjectId(projectId);
    
    await dbConnect();

    const updatedProject = await ProjectPost.findByIdAndUpdate(targetObjectId, {
      status: "approved",
    });

    if (!updatedProject) {
      return {
        success: false,
        message: "Project record not found in database.",
      };
    }

    return {
      success: true
    };
    
  } catch (error) {
    console.error("Error approving project:", error);
    return {
      success: false,
      message:"something went wrong"
     };
  }
}
