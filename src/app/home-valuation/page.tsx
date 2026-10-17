import { permanentRedirect } from "next/navigation";

/** Old URL from the first template version → /home-evaluation. */
export default function LegacyValuation() {
  permanentRedirect("/home-evaluation");
}
