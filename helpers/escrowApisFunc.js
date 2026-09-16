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
        payer_customer: "huzefahjaved@gmail.com" || buyerEmail,
        beneficiary_customer: "devbyhuzefah@gmail.com" || sellerEmail,
      },
    ],
  }));

  const postData = {
    parties: [
      {
        role: "buyer",
        customer: "huzefahjaved@gmail.com" || buyerEmail,
      },
      {
        role: "seller",
        customer: "devbyhuzefah@gmail.com" || sellerEmail,
      },
    ],
    currency: "usd",
    description: jobTitle.slice(0, 250),
    items,
  };

  const result = await escrowApi.post("/transaction", postData);

  const data = {
    transactionId: result.data.id,
    nextUrl: result.data.parties.filter((a) => Object.hasOwn(a, "next_step"))[0]
      ?.next_step,
    milestoneIds: result.data.items.map((item) => item.id),
  };

  return data;
};
