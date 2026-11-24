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

  console.log(result.data.parties);

  const data = {
    transactionId: result.data.id,
    buyerNextUrl: result.data.parties.filter((a) => a.role === "buyer")[0]
      ?.next_step,
    buyer_verification_required:
      result.data.parties.filter((a) => a.role === "buyer")[0]
        ?.verification_required || false,
    sellerNextUrl: result.data.parties.filter((a) => a.role === "seller")[0]
      ?.next_step,
    seller_verification_required:
      result.data.parties.filter((a) => a.role === "seller")[0]
        ?.verification_required || false,
    milestones: result.data.items.map((item) => ({
      id: item.id,
      title: item.title,
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
