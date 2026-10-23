import { useState } from "react";
import { useAppDispatch } from "@/store/hooks/useAppDispatch";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "@/integrations/firebase/firebase";
import { useMutation } from "@apollo/client/react";
import { login as setLoginState } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { GoogleAuthDocument } from "@/gql/graphql";
import { toast } from "sonner";

export const useGoogleLogin = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [googleAuthMutation, { loading }] = useMutation(GoogleAuthDocument, {
    onError: (err) => {
      toast.error("Google Login failed", {
        description: err.message || "Could not login with Google.",
      });
    },
    onCompleted: (data) => {
      if (data.googleAuth.accessToken) {
        dispatch(setLoginState({ email: "Google User" })); 
        toast.success("Login successful!", {
          description: "Welcome back to Passvy.",
        });
        router.push("/events");
      }
    },
  });

  const handleLogin = async () => {
    if (isLoggingIn || loading) return;

    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const token = await result.user.getIdToken();

      await googleAuthMutation({ variables: { input: { idToken: token } } });
    } catch (err) {
      const error = err as { code?: string; message?: string };
      const errorCode = error?.code;
      const errorMessage = error?.message || "";

      // Handle popup blocked specifically
      if (errorCode === "auth/popup-blocked") {
        toast.error("Popup Blocked", {
          description: "Please allow popups for this site to log in with Google.",
        });
        return;
      }

      // Ignore expected cancellation errors and Firebase internal assertion issues 
      // that happen when a popup is forcefully closed or blocked
      const isCancelled = 
        errorCode === "auth/cancelled-popup-request" || 
        errorCode === "auth/popup-closed-by-user";
        
      const isInternalAssertion = 
        errorCode === "auth/internal-error" || 
        errorMessage.includes("INTERNAL ASSERTION FAILED");

      if (!isCancelled && !isInternalAssertion) {
        toast.error("Google Login Error", {
          description: errorMessage || "An unexpected error occurred during login.",
        });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return { loginWithGoogle: handleLogin, loading: loading || isLoggingIn };
};
