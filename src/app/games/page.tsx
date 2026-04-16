import { redirect } from "next/navigation";

export default function GamesPage() {
  // /games was legacy — Experiences are the canonical surface in the KAM Studio.
  redirect("/experiences");
}
