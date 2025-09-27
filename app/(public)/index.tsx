import SignIn from "@/components/clerk/SignIn";

export default function Index() {
  return (
    <SignIn scheme="aipreacher" signUpUrl="/sign-up" homeUrl="(protected)" />
  );
}
