"use server";

import { dbConnect } from "@/config/db.config";
import { authAndGetUser } from "@/helpers/authAndGetUser";
import { Escrow } from "@/schemas/escrow.schema";

export async function projectEscrowDetails(projectId) {
  try {
    await dbConnect();
    const res = await authAndGetUser();
    if (!res.success) return { success: false };

    let selectedFields =
      "clientEscrowStatus proposalEscrowStatus transactionId";
    if (res.role === "client") selectedFields += " clientNextUrl";
    if (res.role === "contractor") selectedFields += " contractorNextUrl";

    const result = await Escrow.findOne({ projectId })
      .select(selectedFields)
      .lean();
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: "something went wrong",
    };
  }
}
