import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    password: { type: String },
    region: { type: String },
    role: { type: String },

    companyEmail: { type: String },
    companyName: { type: String },
    repRole: { type: String },
    phone: { type: String },
    companySize: { type: String },
    taxId: { type: String },
    companyRegistrationDoc: { type: String },
    companyRegistrationDocPbId: { type: String },
    representativeIdDoc: { type: String },
    representativeIdDocPbId: { type: String },
     profileStatus: { 
    type: String, 
    enum: ["pending", "approved", "suspended"], 
    default: "pending" 
  },
    email: { type: String },
    country: { type: String },
    specialization: { type: String },
    docNumber: { type: String },
    docFrontLink: { type: String },
    docFrontPublicId: { type: String },
    docBackLink: { type: String },
    docBackPublicId: { type: String },
  },
  { timestamps: true },
);

export const users = mongoose.models.User || mongoose.model("User", userSchema);
