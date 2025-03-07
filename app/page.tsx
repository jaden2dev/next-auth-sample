"use client"

import { signIn, signOut } from "next-auth/react";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div>
      <p>your are not signed in</p>
      {session && <p>Signed in as {session.user?.name}</p>}

      <button type="button" className="bg-red-500 text-white p-2 rounded-md" onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
