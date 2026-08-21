import { dbConnect } from "@/config/db.config";
import { ProjectPost } from "@/schemas/project.schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Escrow webhook:", body);

    await dbConnect();

    const { event, transaction_id } = body;

    switch (action) {
      case "agree":
        await Proposal.updateOne({ transactionId: transaction_id }, {status:"accepted"});
        break;
      case "funded":
        await Proposal.updateMany(
          { jobId: objectJobId },
          [
            {
              $set: {
                status: {
                  $cond: {
                    if: { $eq: ["$_id", objectProposalId] },
                    then: "accepted",
                    else: "rejected",
                  },
                },
                nextUrl: {
                  $cond: {
                    if: { $eq: ["$_id", objectProposalId] },
                    then: nextUrl,
                    else: null,
                  },
                },
              },
            },
          ],
          { updatePipeline: true },
        );

        await ProjectPost.findByIdAndUpdate(objectJobId, {
          projectPhase: "inProgress",
        });
        await ProjectPost.findOneAndUpdate(
          { transactionId: transaction_id },
          { escrowStatus: "funded", status: "active" },
        );
        break;

      case "released":
        await Job.findOneAndUpdate(
          { escrowTransactionId: transaction_id },
          { escrowStatus: "released", status: "completed" },
        );
        break;

      case "cancelled":
        await Job.findOneAndUpdate(
          { escrowTransactionId: transaction_id },
          { escrowStatus: "cancelled" },
        );
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
