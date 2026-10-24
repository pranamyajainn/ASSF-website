import { SignInPanel } from "@/components/portal/sign-in-panel";

/** The vault, signed in with an account not on its list: answered with 403, and a way to switch accounts. */
export default function VaultRefused() {
  return <SignInPanel area="vault" next="/vault" />;
}
