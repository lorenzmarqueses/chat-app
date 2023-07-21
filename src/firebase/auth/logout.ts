import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { signUpInputProps } from "./types";

const auth = getAuth(firebase_app);

export default async function logout() {
  return await signOut(auth);
}
