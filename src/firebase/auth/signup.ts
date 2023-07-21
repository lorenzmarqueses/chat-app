import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { signUpInputProps } from "./types";

const auth = getAuth(firebase_app);

/**
 * The function exports an asynchronous function that signs up a user with an email and password,
 * returning the result and any error that occurred.
 * @param {signUpInputProps}  - The `signUp` function takes in an object as its parameter, which should
 * have two properties: `email` and `password`. These properties are of type `signUpInputProps`.
 * @returns an object with two properties: "result" and "error". The "result" property contains the
 * result of the "createUserWithEmailAndPassword" function, which is the result of signing up a user
 * with the provided email and password. The "error" property contains any error that occurred during
 * the sign-up process.
 */
export default async function signUp({ email, password }: signUpInputProps) {
  let result = null,
    error = null;
  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
}
