import { escrowApi } from "@/config/escrow.config";

// export const createTransaction = async ({
//   sellerEmail,
//   buyerEmail,
//   inspectionPeriod,
//   milestones,
// }) => {
//   const items = milestones.map((milestone) => ({
//     title: milestone.title,
//     description: milestone.title,
//     type: "milestone",
//     inspection_period: inspectionPeriod || 259200 * 5,
//     quantity: 1,
//     schedule: [
//       {
//         amount: milestone.amount,
//         payer_customer: "huzaifa@predawnsolutions.com" || buyerEmail,
//         beneficiary_customer: "devbyhuzefah@gmail.com" || sellerEmail,
//       },
//     ],
//   }));

//   const postData = {
//     parties: [
//       {
//         role: "buyer",
//         customer: "huzaifa@predawnsolutions.com" || buyerEmail,
//       },
//       {
//         role: "seller",
//         customer: "devbyhuzefah@gmail.com" || sellerEmail,
//       },
//       {
//         role: "broker",
//         customer: "huzefahjaved@gmail.com",
//       },
//     ],
//     currency: "usd",
//     description: milestones
//       .map((a) => a.title)
//       .join("-")
//       .slice(0, 250),
//     items,
//   };

//   const result = await escrowApi.post("/transaction", postData);

//   console.log(result.data.parties);

//   const data = {
//     transactionId: result.data.id,
//     buyerNextUrl: result.data.parties.filter((a) => a.role === "buyer")[0]
//       ?.next_step,
//     buyer_verification_required:
//       result.data.parties.filter((a) => a.role === "buyer")[0]
//         ?.verification_required || false,
//     sellerNextUrl: result.data.parties.filter((a) => a.role === "seller")[0]
//       ?.next_step,
//     seller_verification_required:
//       result.data.parties.filter((a) => a.role === "seller")[0]
//         ?.verification_required || false,
//     milestones: result.data.items.map((item) => ({
//       id: item.id,
//       title: item.title,
//     })),
//   };

//   return data;
// };

export const createTransaction = async ({
  sellerEmail,
  buyerEmail,
  inspectionPeriod,
  milestones,
}) => {
  const BUYER_EMAIL = "huzaifa@predawnsolutions.com" || buyerEmail;
  const SELLER_EMAIL = "devbyhuzefah@gmail.com" || sellerEmail;
  const BROKER_EMAIL = "huzefahjaved@gmail.com";

  const effectiveInspectionPeriod = inspectionPeriod || 86400;

  const BROKER_SHARE_RATE = 0.075;

  const splitEscrowFees = [
    {
      payer_customer: BUYER_EMAIL,
      split: 0.5,
      type: "escrow",
    },
    {
      payer_customer: SELLER_EMAIL,
      split: 0.5,
      type: "escrow",
    },
  ];

  const milestoneItems = milestones.map((milestone) => ({
    title: milestone.title,
    description: milestone.title,
    type: "milestone",
    inspection_period: effectiveInspectionPeriod,
    quantity: 1,
    schedule: [
      {
        amount: Number(milestone.amount),
        payer_customer: BUYER_EMAIL,
        beneficiary_customer: SELLER_EMAIL,
      },
    ],
    fees: splitEscrowFees,
  }));

  const brokerFeeItems = milestones.flatMap((milestone, idx) => {
    const amount = Number(milestone.amount);
    const halfBrokerFee = Number((amount * BROKER_SHARE_RATE).toFixed(2));

    return [
      {
        title: `Broker Fee (Buyer 7.5%) - ${milestone.title || `Milestone ${idx + 1}`}`,
        description: `50% of 15% broker commission paid by buyer for ${milestone.title || `Milestone ${idx + 1}`}`,
        type: "broker_fee",
        quantity: 1,
        schedule: [
          {
            amount: halfBrokerFee,
            payer_customer: BUYER_EMAIL,
            beneficiary_customer: BROKER_EMAIL,
          },
        ],
      },
      {
        title: `Broker Fee (Seller 7.5%) - ${milestone.title || `Milestone ${idx + 1}`}`,
        description: `50% of 15% broker commission paid by seller for ${milestone.title || `Milestone ${idx + 1}`}`,
        type: "broker_fee",
        quantity: 1,
        schedule: [
          {
            amount: halfBrokerFee,
            payer_customer: SELLER_EMAIL,
            beneficiary_customer: BROKER_EMAIL,
          },
        ],
      },
    ];
  });

  const postData = {
    parties: [
      {
        role: "buyer",
        customer: BUYER_EMAIL,
      },
      {
        role: "seller",
        customer: SELLER_EMAIL,
      },
      {
        role: "broker",
        customer: BROKER_EMAIL,
      },
    ],
    currency: "usd",
    description: milestones
      .map((a) => a.title)
      .join("-")
      .slice(0, 250),
    items: [...milestoneItems, ...brokerFeeItems],
  };

  const result = await escrowApi.post("/transaction", postData);

  const buyerParty = result.data.parties.find((a) => a.role === "buyer");
  const sellerParty = result.data.parties.find((a) => a.role === "seller");

  const data = {
    transactionId: result.data.id,
    buyerNextUrl: buyerParty?.next_step,
    buyer_verification_required: buyerParty?.verification_required || false,
    sellerNextUrl: sellerParty?.next_step,
    seller_verification_required: sellerParty?.verification_required || false,
    milestones: result.data.items.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
    })),
  };

  return data;
};

async function triggerTransactionAction(transactionId, action, customerEmail) {
  const response = await escrowApi.patch(
    `/transaction/${transactionId}`,
    { action },
    { headers: { "As-Customer": customerEmail } },
  );
  return response.data;
}

async function triggerMilestoneAction(
  transactionId,
  itemId,
  action,
  customerEmail,
) {
  customerEmail =
    action === "ship"
      ? "devbyhuzefah@gmail.com"
      : action === "receive"
        ? "huzaifa@predawnsolutions.com"
        : "huzefahjaved@gmail.com";

  const response = await escrowApi.patch(
    `/transaction/${transactionId}/item/${itemId}`,
    { action },
    { headers: { "As-Customer": customerEmail } },
  );
  return response.data;
}

export async function checkCustomerVerification(customerEmail) {
  const response = await escrowApi.get("/customer/me", {
    headers: { "As-Customer": customerEmail },
  });

  console.log(response);
  const customer = response.data;
  const isVerified = customer?.verification_status === "verified";

  return isVerified;
}

export async function getTransactionUsersStatus(transactionId) {
  const response = await escrowApi.get(`/transaction/${transactionId}`);
  const transaction = response.data;

  const parties = transaction?.parties || [];

  const buyerParty = parties.find((p) => p.role === "buyer");
  const sellerParty = parties.find((p) => p.role === "seller");

  const formatPartyDetails = (party) => {
    if (!party) return null;
    const needsVerification = party.verification_required === true;
    return {
      partyId: party.id,
      email: party.customer,
      role: party.role,
      isVerified: !needsVerification,
      needsVerification,
      agreedToTerms: Boolean(party.agreed),
      disbursementMethodSelected: party.disbursement_method_selected ?? null,
      nextStepUrl: party.next_step || null,
    };
  };

  const clientDetails = formatPartyDetails(buyerParty);
  const contractorDetails = formatPartyDetails(sellerParty);

  return {
    transactionId: transaction.id,
    client: clientDetails,
    contractor: contractorDetails,
    clientEscrowVerified: clientDetails?.isVerified ?? false,
    contractorEscrowVerified: contractorDetails?.isVerified ?? false,
  };
}

export const escrowMilestone = {
  agreeToTransaction: (txId, userEmail) =>
    triggerTransactionAction(txId, "agree", userEmail),

  shipMilestone: (txId, itemId, contractorEmail) =>
    triggerMilestoneAction(txId, itemId, "ship", contractorEmail),

  receiveMilestone: (txId, itemId, clientEmail) =>
    triggerMilestoneAction(txId, itemId, "receive", clientEmail),

  releaseMilestoneFunds: (txId, itemId, clientEmail) =>
    triggerMilestoneAction(txId, itemId, "accept", clientEmail),
};

export const createEscrowCustomer = async ({
  email,
  firstName,
  lastName,
  phoneNumber,
}) => {
  const payload = {
    email: email.trim().toLowerCase(),
  };
  if (firstName && firstName.trim().length !== 0) {
    payload.firstName = firstName.trim().toLowerCase();
  }
  if (lastName && lastName.trim().length !== 0) {
    payload.firstName = lastName.trim().toLowerCase();
  }
  if (phoneNumber) {
    payload.phoneNumber = phoneNumber;
  }

  try {
    const response = await escrowApi.post("/customer", payload);
    return {
      success: true,
      alreadyExists: false,
      escrowCustomerId: response.data?.id || null,
      data: response.data,
    };
  } catch (error) {
    const status = error.response?.status;
    const errorData = error.response?.data;
    const serializedError = JSON.stringify(errorData || "").toLowerCase();

    console.log(serializedError);

    if (
      status === 409 ||
      serializedError.includes("already exists") ||
      serializedError.includes("already registered") ||
      serializedError.includes("duplicate")
    ) {
      return {
        success: true,
        alreadyExists: true,
        escrowCustomerId: null,
      };
    }

    throw new Error(
      errorData?.error ||
        JSON.stringify(errorData?.errors) ||
        "Failed to register customer on Escrow.com",
    );
  }
};
