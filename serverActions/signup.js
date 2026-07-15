"use server";

import { dbConnect } from "@/config/db.config";
import { users } from "@/schemas/user.schema";
import { signupSchema } from "@/validations/signup.validation";

export const userSignupAction = async (prevState, formData) => {
  const form = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    region: formData.get("region"),
    role: formData.get("role"),
  };

  const result = signupSchema.safeParse(form);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    return {
      success: false,
      errors: fieldErrors, 
      message: "Please correct the errors in the form.",
    };
  }
  try {
    await dbConnect();
    const newUser = await users.create(result.data);
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