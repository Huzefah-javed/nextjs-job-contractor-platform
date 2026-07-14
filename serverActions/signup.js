"use server";

import { signupSchema } from "@/validations/signup.validation";

export const userSignupAction = async (formData) => {
    const form = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        region: formData.get("region"),
    }
  const result =  signupSchema.safeParse(form)
     if (!result.success) {
      const message = result.error.issues.map((issue) => {
        const fieldName = issue.path.join('.'); 
        return `${fieldName}: ${issue.message}`;
      })
      .join(', ');
}
}