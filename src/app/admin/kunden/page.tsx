import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLogin } from "@/components/admin-login";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminCustomersPage() {
  const authenticated = await isAdminAuthenticated();

  return (
    <main className="min-h-screen bg-[#F4F8FA] px-4 py-8 text-[#10212E]">
      {authenticated ? <AdminDashboard view="customers" /> : <AdminLogin />}
    </main>
  );
}
