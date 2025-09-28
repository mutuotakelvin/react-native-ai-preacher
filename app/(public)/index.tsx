import SignIn from "@/components/clerk/SignIn";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  return <SignIn scheme="aipreacher" signUpUrl="(protected)" homeUrl="(protected)" />
}
