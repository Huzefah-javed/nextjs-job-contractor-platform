import { dbConnect } from "@/config/db.config";
import { Escrow } from "@/schemas/escrow.schema";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    await dbConnect();

    const { event, transaction_id } = body;
    console.log(body);
    switch (event) {
      case "party_verification_submitted":
        await Escrow.updateOne(
          { transactionId: transaction_id },
          { clientEscrowStatus: "termsAccepted" },
        );
        break;
      case "agree":
        await Escrow.updateOne(
          { transactionId: transaction_id },
          { proposalEscrowStatus: "termsAccepted" },
        );
        break;
      case "payment_sent":
        await Escrow.updateOne(
          { transactionId: transaction_id },
          { clientEscrowStatus: "payment_sent" },
        );
        break;
      case "payment_approved":
        Escrow.updateOne(
          { transactionId: transaction_id },
          { clientEscrowStatus: "payment_approved" },
        );
        break;

      // case "released":
      //   await ProjectPost.findOneAndUpdate(
      //     { transactionId: transaction_id },
      //     { escrowStatus: "released", status: "completed" },
      //   );
      //   break;

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
