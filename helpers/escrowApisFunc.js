import { escrowApi } from "@/config/escrow.config";

export const createTransaction = async ({
  sellerEmail,
  buyerEmail,
  inspectionPeriod,
  milestones,
}) => {
  const items = milestones.map((milestone) => ({
    title: milestone.title,
    description: milestone.title,
    type: "milestone",
    inspection_period: inspectionPeriod || 259200 * 5,
    quantity: 1,
    schedule: [
      {
        amount: milestone.amount,
        payer_customer: "huzaifa@predawnsolutions.com" || buyerEmail,
        beneficiary_customer: "devbyhuzefah@gmail.com" || sellerEmail,
      },
    ],
  }));

  const postData = {
    parties: [
      {
        role: "buyer",
        customer: "huzaifa@predawnsolutions.com" || buyerEmail,
      },
      {
        role: "seller",
        customer: "devbyhuzefah@gmail.com" || sellerEmail,
      },
      {
        role: "broker",
        customer: "huzefahjaved@gmail.com",
      },
    ],
    currency: "usd",
    description: milestones
      .map((a) => a.title)
      .join("-")
      .slice(0, 250),
    items,
  };

  const result = await escrowApi.post("/transaction", postData);

  const data = {
    transactionId: result.data.id,
    buyerNextUrl: result.data.parties.filter((a) => a.role === "buyer")[0]
      ?.next_step,
    sellerNextUrl: result.data.parties.filter((a) => a.role === "seller")[0]
      ?.next_step,
    milestones: result.data.items.map((item) => ({
      id: item.id,
      title: item.title,
    })),
  };

  return data;
};
