"use client"

import { signIn, useSession } from "next-auth/react";

const LoginPage = () => {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div>
      <button type="button" className="bg-blue-500 text-white p-2 rounded-md" onClick={() => signIn("credentials", {
        token: "test",
        role: "admin",
        redirect: false,
      })}>Admin Sign in</button>

      <button type="button" className="bg-blue-500 text-white p-2 rounded-md" onClick={() => signIn("credentials", {
        token: "test",
        role: "user",
        redirect: false,
      })}>user Sign in</button>

    </div>
  );
};

export default LoginPage;