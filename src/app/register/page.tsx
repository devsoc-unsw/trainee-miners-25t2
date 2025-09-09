import * as React from "react";
import styles from "./page.module.css";
import { Mic } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/70 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="animate-fade-in flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Formify</span>
          </div>

          <nav className="flex items-center gap-4 text-sm text-gray-600">
            <Link href="/">Home</Link>
            <Link href="/register" className="rounded-lg border px-3 py-1.5">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <div className={styles.page}>
        <div className={styles.ring}>
          <i style={{ ["--clr" as any]: "#D9DD92" }} />
          <i style={{ ["--clr" as any]: "#311E10" }} />
          <i style={{ ["--clr" as any]: "#DD6031" }} />
          <div className={styles.login}>
            <h2>Sign up here!</h2>

            <div className={styles.inputBx}>
              <input type="text" placeholder="Username" />
            </div>
            <div className={styles.inputBx}>
              <input type="text" placeholder="Email" />
            </div>
            <div className={styles.inputBx}>
              <input type="password" placeholder="Password" />
            </div>
            <div className={`${styles.inputBx} ${styles.inputBxAccent}`}>
              <input type="submit" value="Register!" />
            </div>
            <div className={`${styles.inputBx} ${styles.inputBxAccent}`}>
              <input type="submit" value="Sign up with Google" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
