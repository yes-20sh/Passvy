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

  const [googleAuthMutation, { loading }] = useMutation(GoogleAuthDocument, {
    onError: (err) => {
      toast.error("Google Login failed", {
        description: err.message || "Could not login with Google.",
      });
    },
    onCompleted: (data) => {
      if (data.googleAuth.accessToken) {
        // You can update this to extract the actual email if needed
        dispatch(setLoginState({ email: "Google User" })); 
        toast.success("Login successful!", {
          description: "Welcome back to Passvy.",
        });
        router.push("/events");
      }
    },
  });

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Ensure your firebase config exports the 'auth' instance correctly
      const result = await signInWithPopup(firebaseAuth, provider);
      const token = await result.user.getIdToken();

      await googleAuthMutation({ variables: { input: { idToken: token } } });
    } catch (error) {
      console.error(error);
      toast.error("Popup Error", {
        description: "Failed to open Google authentication popup.",
      });
    }
  };

  return { loginWithGoogle: handleLogin, loading };
};
