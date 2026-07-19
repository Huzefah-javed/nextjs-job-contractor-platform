"use client";

import { useActionState, useState } from "react";
import JoinRoleSelection from "./components/RoleSelector";
import FreelancerJoin from "./components/FreelancerJoin";
import ClientJoin from "./components/ClientJoin";
import { userSignupAction } from "@/serverActions/signup";
import { toast } from "react-toastify";

export default function Signup() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [state, formAction, isPending] = useActionState(userSignupAction, {});

  const handleFormSubmission = async (formData) => {
    formData.append("role", selectedRole);
    await formAction(formData);
  };

  return (
    <>
      {isPending && <h1>Loading ....... </h1>}
      {!selectedRole && (
        <JoinRoleSelection
          setSelectedRole={setSelectedRole}
          selectedRole={selectedRole}
        />
      )}
      {selectedRole && selectedRole === "freelancer" && (
        <FreelancerJoin
          handleFormSubmission={handleFormSubmission}
          stateErrors={state.errors}
        />
      )}
      {selectedRole && selectedRole === "client" && (
        <ClientJoin
          handleFormSubmission={handleFormSubmission}
          stateErrors={state.errors}
        />
      )}
    </>
  );
}
