import { SignInPanel } from "@/components/portal/sign-in-panel";

/** The vault, signed out: answered with 401, and the Google sign-in. */
export default function VaultSignedOut() {
  return <SignInPanel area="vault" next="/vault" />;
}
