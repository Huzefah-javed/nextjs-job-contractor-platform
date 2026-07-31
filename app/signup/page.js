"use client";

import { useActionState, useState } from "react";
import JoinRoleSelection from "./components/RoleSelector";
import FreelancerJoin from "./components/FreelancerJoin";
import ClientJoin from "./components/ClientJoin";
import { clientSignupAction } from "@/serverActions/clientSignup";
import { contractorSignupAction } from "@/serverActions/contractorSignup";

export default function Signup() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [state, formAction, isPending] = useActionState(contractorSignupAction, {});
  const clientAct = useActionState(clientSignupAction, {});

  const handleFormSubmission = async (formData) => {
    formData.append("role", selectedRole);
    if (selectedRole === "contractor") await formAction(formData);
    if (selectedRole === "client") await clientAct[1](formData)
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
      {selectedRole && selectedRole === "contractor" && (
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
