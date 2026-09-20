'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Check, X, Loader2 } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  isVerified: boolean;
  role: string;
  createdAt?: string;
}

interface DashboardData {
  totalUsers: number;
  totalListeners: number;
  pendingUsers: User[];
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/admin/pending-listeners", {
          headers: {
            'x-user-id': session.user.id
          },
          withCredentials: true
        });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-brand-violet animate-spin" />
      </div>
    );
  }

  const handleVerifyListener = async (email: string) => {
    if (!session?.user?.id) return;
    
    try {
      await axios.post("http://localhost:8081/api/admin/verify-listener", 
        { email },
        {
          headers: {
            'x-user-id': session.user.id
          },
          withCredentials: true
        }
      );

      // Update the local state to remove the approved user and update counts
      if (data) {
        setData({
          ...data,
          totalListeners: data.totalListeners + 1,
          pendingUsers: data.pendingUsers.filter((u) => u.email !== email),
        });
      }
    } catch (error) {
      console.error("Failed to verify listener:", error);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold tracking-wide uppercase">Total Users</h3>
          <p className="text-4xl font-bold mt-2 text-brand-dark font-heading">{data?.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-semibold tracking-wide uppercase">Active Listeners</h3>
          <p className="text-4xl font-bold mt-2 text-brand-dark font-heading">{data?.totalListeners || 0}</p>
        </div>
        <div className="bg-brand-violet/10 p-6 rounded-2xl border border-brand-violet/20">
          <h3 className="text-brand-deep text-sm font-semibold tracking-wide uppercase">Pending Approvals</h3>
          <p className="text-4xl font-bold mt-2 text-brand-violet font-heading">{data?.pendingUsers?.length || 0}</p>
        </div>
      </div>

      {/* Pending Listeners Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-brand-deep font-heading">Pending Listeners</h2>
          <p className="text-gray-500 text-sm mt-1">Review and approve applications to become a Listener.</p>
        </div>

        {data?.pendingUsers && data.pendingUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.pendingUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-brand-dark">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="inline-flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors" onClick={() => handleVerifyListener(user.email)}>
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button className="inline-flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-brand-violet" />
            </div>
            <h3 className="text-lg font-bold text-brand-deep font-heading">All caught up!</h3>
            <p className="text-gray-500 mt-2 max-w-sm">There are no pending listener applications to review right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
