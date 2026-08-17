import { escrowApi } from "@/config/escrow.config";

export const createTransaction = async ({
  sellerEmail,
  buyerEmail,
  amount,
  jobDescription,
  inspectionPeriod,
}) => {
  const postData = {
    parties: [
      {
        role: "buyer",
        customer: buyerEmail || "huzefahjaved@gmail.com",
      },
      {
        role: "seller",
        customer: sellerEmail || "devbyhuzefah@gmail.com",
      },
    ],
    currency: "usd",
    description: jobDescription || "Test Job Payment",
    items: [
      {
        title: "Test Job",
        description: "Testing escrow integration",
        type: "general_merchandise",
        inspection_period: inspectionPeriod || 259200 * 5,
        quantity: 1,
        schedule: [
          {
            amount: amount || 500.0,
            payer_customer: buyerEmail || "huzefahjaved@gmail.com",
            beneficiary_customer: sellerEmail || "devbyhuzefah@gmail.com",
          },
        ],
      },
    ],
  };
  const result = await escrowApi.post("/transaction", postData);

  const data = {
    transactionId: result.data.id,
    nextUrl: result.data.parties.filter((a) => Object.hasOwn(a, "next_step"))[0]
      ?.next_step,
  };

  return data;
};

// export const getClientEscrowPaymentLink = async (transactionId) => {
//   const { data } = await escrowApi.post(
//     `https://api.escrow-sandbox.com/2017-09-01/transaction/${transactionId}/payment_methods/credit_card`,
//     {},
//   );

//   console.log(data);
//   return data?.landing_page || null;
// };
