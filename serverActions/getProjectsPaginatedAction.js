"use server";

import { dbConnect } from "@/config/db.config";
import { ProjectPost } from "@/schemas/project.schema";

export async function getProjectsPaginatedAction(
  page = 1,
  limit = 10,
  projectStatus = "pending",
) {
  try {
    await dbConnect();

    const currentPage = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (currentPage - 1) * pageSize;

    const query =
      projectStatus === "pending"
        ? { status: { $ne: "approved" } }
        : { status: { $eq: "approved" } };

    let [projects, totalProjects] = await Promise.all([
      ProjectPost.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      ProjectPost.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalProjects / pageSize);

    projects = projects.map((project) => {
      return {
        ...project,
        clientId: project.clientId.toString(),
        _id: project._id.toString(),
      };
    });

    return {
      success: true,
      data: projects,
      pagination: {
        currentPage,
        pageSize,
        totalProjects,
        totalPages: totalPages || 1,
      },
    };
  } catch (error) {
    console.error("Failed to fetch paginated projects:", error);
    return {
      success: false,
      message: "Failed to load project records.",
      data: [],
      pagination: { currentPage: 1, totalPages: 1, totalProjects: 0 },
    };
  }
}
