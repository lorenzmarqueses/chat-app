"use client";
import React from "react";
import { onAuthStateChanged, getAuth, initializeAuth, User } from "firebase/auth";
import firebase_app from "@/firebase/config";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

const auth = getAuth(firebase_app);

interface AuthContextProps {
  user?: User | null;
}

export const AuthContext = React.createContext<AuthContextProps>({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }: any) => {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
