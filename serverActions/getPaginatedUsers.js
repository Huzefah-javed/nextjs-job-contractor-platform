"use server";

import { dbConnect } from "@/config/db.config";
import { users } from "@/schemas/user.schema";

export async function getPaginatedUsers({
  page = 1,
  limit = 10,
  search = "",
  role = "All Roles",
  status = "All Status",
}) {
  try {
    await dbConnect();

    const skip = (page - 1) * limit;

    const query = { role: { $in: ["contractor", "client"] } };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (role !== "All Roles") {
      query.role = role.toLowerCase();
    }
    if (status !== "All Status") {
      query.profileStatus = profileStatus.toLowerCase();
    }

    const [Users, totalCount] = await Promise.all([
      users
        .find(query)
        .select(
          "name role region country status email profileStatus specialization docNumber docFrontLink docBackLink companyEmail companyName repRole phone companySize taxId role profileStatus companyRegistrationDoc companyRegistrationDocPbId representativeIdDoc representativeIdDocPbId createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      users.countDocuments(query),
    ]);

    const serializedUsers = Users.map((user) => ({
      ...user,
      _id: user._id.toString(),
    }));

    return {
      Users: serializedUsers,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      success: true,
    };
  } catch (error) {
    console.error("Server Action Error:", error);
    return {
      Users: [],
      totalPages: 1,
      currentPage: 1,
      success: false,
      error: "Failed to fetch Users.",
    };
  }
}
