import { escrowApi } from "@/config/escrow.config";

export const createTransaction = async ({
  sellerEmail,
  buyerEmail,
  jobTitle,
  jobDescription,
  inspectionPeriod,
  milestones,
}) => {
  const itemType = milestones.length > 1 ? "milestone" : "general_merchandise";

  const items = milestones.map((milestone) => ({
    title: milestone.title,
    description: milestone.description || milestone.title,
    type: itemType,
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
    description: jobTitle.slice(0, 250),
    items,
  };

  const result = await escrowApi.post("/transaction", postData);

  const data = {
    transactionId: result.data.id,
    buyerNextUrl: result.data.parties.filter((a) => a.role === "buyer")[0]
      ?.next_step,
    sellerNextUrl: result.data.parties.filter((a) => a.role === "seller")[0]
      ?.next_step,
    milestoneIds: result.data.items.map((item) => item.id),
  };

  return data;
};
