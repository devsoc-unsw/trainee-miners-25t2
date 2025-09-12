"use client";
import { signIn } from "next-auth/react";

export function GoogleButton() {
  return (
    <div className="inputBx">
      <input
        type="submit"
        value="Continue with Google"
        onClick={(e) => {
          e.preventDefault();
          signIn("google", { callbackUrl: "/" });
        }}
      />
    </div>
  );
}
