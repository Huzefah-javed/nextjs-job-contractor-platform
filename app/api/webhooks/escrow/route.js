import { dbConnect } from "@/config/db.config";
import { ProjectPost } from "@/schemas/project.schema";
import { Proposal } from "@/schemas/proposal.schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    await dbConnect();

    const { event, transaction_id } = body;

    switch (event) {
      case "agree":
        await Proposal.updateOne(
          { transactionId: transaction_id },
          { status: "accepted", escrowStatus: "accepted" },
        );
        break;
      case "payment_sent":
        await ProjectPost.updateOne(
          { transactionId: transaction_id },
          { escrowStatus: "payment_sent" },
        );
        break;
      case "payment_approved":
        ProjectPost.updateOne(
          { transactionId: transaction_id },
          { projectPhase: "inProgress", escrowStatus: "payment_approved" },
        );
        break;

      case "released":
        await ProjectPost.findOneAndUpdate(
          { transactionId: transaction_id },
          { escrowStatus: "released", status: "completed" },
        );
        break;

      case "cancelled":
        await ProjectPost.findOneAndUpdate(
          { transactionId: transaction_id },
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
