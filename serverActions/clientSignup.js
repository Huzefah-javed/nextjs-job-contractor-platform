"use server";

import { dbConnect } from "@/config/db.config";
import { uploadToCloud } from "@/helpers/cloud.upload";
import { users } from "@/schemas/user.schema";
import { clientRegistrationSchema } from "@/validations/client.signup";
import bcrypt from "bcrypt";

export const clientSignupAction = async (prevState, formData) => {
  const form = {
    name: formData.get("name"),
    companyName: formData.get("companyName"),
    repRole: formData.get("repRole"),
    companyEmail: formData.get("companyEmail"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    companySize: formData.get("companySize"),
    region: formData.get("region"),
    role: formData.get("role"),
    taxId: formData.get("taxId"),
  };
  const result1 = await uploadToCloud(
    formData.get("companyRegistrationDoc"),
    "job_platform/client_cred",
  );

  if (!result1) console.log("cloud failed 1");

  const result2 = await uploadToCloud(
    formData.get("representativeIdDoc"),
    "job_platform/client_cred",
  );

  if (!result2) console.log("cloud failed 2");

  form.companyRegistrationDoc = result1.secureUrl;
  form.companyRegistrationDocPbId = result1.publicId;
  form.representativeIdDoc = result2.secureUrl;
  form.representativeIdDocPbId = result2.publicId;

  console.log(form);

  const result = clientRegistrationSchema.safeParse(form);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    console.log("validation result: ", result);

    return {
      success: false,
      errors: fieldErrors,
      message: "Please correct the errors in the form.",
    };
  }
  try {
    await dbConnect();
    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const userData = {
      ...result.data,
      password: hashedPassword,
    };

    const newUser = await users.create(userData);

    return {
      success: true,
      errors: {},
      message: "Registration successful!",
    };
  } catch (error) {
    console.error("Database Error:", error);
    return {
      success: false,
      errors: {},
      message: "Something went wrong on our end. Please try again later.",
    };
  }
};
