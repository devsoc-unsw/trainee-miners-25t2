// src/app/register/page.tsx
import styles from "./page.module.css";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <section className={styles.root}>
      <div className={`${styles.container} ${styles.active}`}>
        <div className={`${styles.user} ${styles.signupBx}`}>
          <div className={styles.formBx}>
            <form>
              <h2>Create an account</h2>
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                required
              />
              <input
                type="password"
                name="confirm"
                placeholder="Confirm Password"
                required
              />
              <input type="submit" value="Sign Up" />
              <p className={styles.signup}>
                Already have an account? <Link href="/login">Sign in.</Link>
              </p>
            </form>
          </div>

          <div className={styles.imgBx}>
            <img
              src="https://raw.githubusercontent.com/WoojinFive/CSS_Playground/master/Responsive%20Login%20and%20Registration%20Form/img2.jpg"
              alt="Create your account"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
