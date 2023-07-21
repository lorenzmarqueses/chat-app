import firebase_app from "../config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { signInInputProps } from "./types";

const auth = getAuth(firebase_app);

/**
 * The above function is an asynchronous function that takes in an email and password as input and
 * attempts to sign in with those credentials using the `signInWithEmailAndPassword` function from the
 * `auth` module.
 * @param {signInInputProps}  - The `signIn` function takes in an object as its parameter, which has
 * two properties: `email` and `password`. These properties represent the email and password values
 * that will be used for signing in.
 * @returns an object with two properties: "result" and "error". The "result" property contains the
 * result of the sign-in operation, while the "error" property contains any error that occurred during
 * the sign-in process.
 */
export default async function signIn({ email, password }: signInInputProps) {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
