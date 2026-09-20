import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, LayoutDashboard, Users, FileText } from "lucide-react";
import SignOutButton from "../../components/SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-brand-cream text-brand-dark font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight text-brand-deep font-heading">
            Someone Admin
          </h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-2.5 text-brand-dark font-medium rounded-lg hover:bg-brand-cream transition-colors bg-brand-cream shadow-sm border border-gray-100"
          >
            <LayoutDashboard className="w-5 h-5 text-brand-violet" />
            Dashboard
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 font-medium rounded-lg hover:bg-brand-cream hover:text-brand-dark transition-colors"
          >
            <Users className="w-5 h-5" />
            Users
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center gap-3 px-4 py-2.5 text-gray-500 font-medium rounded-lg hover:bg-brand-cream hover:text-brand-dark transition-colors"
          >
            <FileText className="w-5 h-5" />
            Reports
          </Link>
        </nav>
        <div className="p-4 mt-auto border-t border-gray-100">
          <SignOutButton className="flex items-center w-full gap-3 px-4 py-2 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 border-b border-gray-200 bg-white/80 flex items-center px-8 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-xl font-bold font-heading text-brand-deep">Admin Panel</h1>
        </header>
        <div className="flex-1 overflow-auto p-8">{children}</div>
      </main>
    </div>
  );
}
