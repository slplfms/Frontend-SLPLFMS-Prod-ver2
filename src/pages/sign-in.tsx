// import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from "../components/auth/layout";
import { SignInForm } from "../components/auth/sign-in-form";

export default function SignIn(): React.JSX.Element {
  return (
    <Layout>
      {/* //   <GuestGuard> */}
      <SignInForm />
      {/* </GuestGuard> */}
    </Layout>
  );
}
