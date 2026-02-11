import { redirect } from "next/navigation";
import DashboardPage from "./(dashboard)/page";
import { auth } from "@/lib/auth";

export default async function Home() {
  // Server-side: check session. If not logged in redirect to /login.
  const session = await auth();
  if (!session) return redirect("/login");

  // If logged in, render the dashboard page directly.
  return <DashboardPage />;
}
