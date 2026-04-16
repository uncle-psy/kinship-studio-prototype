import { redirect } from "next/navigation";

export default function PacksPage() {
  // The Asset Packs concept was replaced by Markets in the KAM Studio.
  redirect("/markets");
}
