"use server";

import { dbConnect } from "@/config/db.config";
import { uploadToCloud } from "@/helpers/cloud.upload";
import { users } from "@/schemas/user.schema";
import { contractorSignupSchema } from "@/validations/contractor.signup.validation";
import bcrypt from "bcrypt";

export const contractorSignupAction = async (prevState, formData) => {
  const form = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    region: formData.get("region"),
    role: formData.get("role"),
    country: formData.get("country"),
    docNumber: formData.get("documentNumber"),
    specialization: formData.get("specialization"),
  };
  const result1 = await uploadToCloud(
    formData.get("documentFront"),
    "job_platform/freelancer_cred",
  );
  if (!result1) console.log("cloud failed 1");
  const result2 = await uploadToCloud(
    formData.get("documentBack"),
    "job_platform/freelancer_cred",
  );
  if (!result2) console.log("cloud failed 2");

  form.docFrontLink = result1.secureUrl;
  form.docFrontPublicId = result1.publicId;
  form.docBackLink = result2.secureUrl;
  form.docBackPublicId = result2.publicId;

  console.log(form);

  const result = contractorSignupSchema.safeParse(form);

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
