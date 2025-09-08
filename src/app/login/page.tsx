import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";

// export default function LoginPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
//       <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
//         <div className="text-center">
//           <h1 className="mb-4 text-3xl font-bold text-gray-900">Login</h1>
//           <p className="mb-8 text-gray-600">
//             Login functionality coming soon! We&apos;re working hard to bring
//             you the best authentication experience.
//           </p>
//           <Link href="/">
//             <Button className="inline-flex items-center">
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Home
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/LoginCard.tsx
import * as React from "react";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.ring}>
        <i style={{ ["--clr" as any]: "#00ff0a" }} />
        <i style={{ ["--clr" as any]: "#ff0057" }} />
        <i style={{ ["--clr" as any]: "#fffd44" }} />
        <div className={styles.login}>
          <h2>Login</h2>
          <div className={styles.inputBx}>
            <input type="text" placeholder="Username" />
          </div>
          <div className={styles.inputBx}>
            <input type="password" placeholder="Password" />
          </div>
          <div className={styles.inputBx}>
            <input type="submit" value="Sign in" />
          </div>
          <div className={styles.links}>
            <a href="/">Back to home</a>
            <a href="/register">Signup</a>
          </div>
        </div>
      </div>
    </div>
  );
}
