"use client";

import { useState } from "react";
import JoinRoleSelection from "./components/RoleSelector";
import FreelancerJoin from "./components/FreelancerJoin";
import ClientJoin from "./components/ClientJoin";

export default function Signup() {
  const [selectedRole, setSelectedRole] = useState(null);
  return (
    <>
      {!selectedRole && (
        <JoinRoleSelection
          setSelectedRole={setSelectedRole}
          selectedRole={selectedRole}
        />
      )}
      {selectedRole && selectedRole === "freelancer" && <FreelancerJoin />}
      {selectedRole && selectedRole === "client" && <ClientJoin />}
    </>
  );
}
