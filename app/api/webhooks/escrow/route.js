import { dbConnect } from "@/config/db.config";
import { Escrow } from "@/schemas/escrow.schema";
import { ProjectPost } from "@/schemas/project.schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    await dbConnect();

    const { event, transaction_id, item_ids } = body;
    console.log(body);
    switch (event) {
      case "agree":
        await Escrow.updateOne(
          { transactionId: transaction_id },
          {
            proposalEscrowStatus: "termsAccepted",
            clientEscrowStatus: "termsAccepted",
          },
        );
        break;
      case "payment_sent":
        await Escrow.updateOne(
          { transactionId: transaction_id },
          { clientEscrowStatus: "payment_sent" },
        );
        break;
      case "payment_approved":
        await Escrow.updateOne(
          { transactionId: transaction_id },
          { clientEscrowStatus: "payment_approved", activeAt: new Date() },
        );
        break;
      case "ship":
        await Escrow.findOneAndUpdate(
          { transactionId: transaction_id },
          { "milestones.$[elem].status": "pending" },
          {
            arrayFilters: [{ "elem.escrowMilestoneId": { $in: item_ids } }],
          },
        );
      case "receive":
        const response = await Escrow.findOneAndUpdate(
          { transactionId: transaction_id },
          { "milestones.$[elem].status": "approved" },
          {
            arrayFilters: [{ "elem.escrowMilestoneId": { $in: item_ids } }],
            returnDocument: "after",
          },
        );

        let approvedMilestones = response.milestones.filter(
          (p) => p.status === "approved",
        ).length;
        let totalMilestones = response.milestones.length;

        if (approvedMilestones === totalMilestones) {
          await Promise.all([
            Escrow.findByIdAndUpdate(response._id, {
              isProjectCompleted: true,
            }),
            ProjectPost.findOneAndUpdate(
              { escrowId: response._id },
              { projectPhase: "completed" },
            ),
          ]);
        }

        break;

      // case "cancelled":
      //   await ProjectPost.findOneAndUpdate(
      //     { transactionId: transaction_id },
      //     { escrowStatus: "cancelled" },
      //   );
      //   break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
