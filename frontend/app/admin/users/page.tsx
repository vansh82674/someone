'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Loader2, Users, ShieldCheck, Wallet } from "lucide-react";

interface AdminUser {
    id: number;
    name: string;
    email: string;
    anonId: string;
    role: string;
    isVerified: boolean;
    isAdmin: boolean;
    walletBalance: number;
    hourlyRate: number;
}

export default function AdminUsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/admin/users`, {
                    headers: {
                        'x-user-id': session.user.id
                    },
                    withCredentials: true
                });
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [session?.user?.id, backendUrl]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-brand-violet animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-heading text-brand-deep">Registered Users</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage user accounts, roles, and balances across the platform.</p>
                </div>
                <div className="bg-brand-violet/10 text-brand-violet font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" /> Total Users: {users.length}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Anon ID</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Wallet Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-brand-dark">
                                        <div className="flex items-center gap-2">
                                            {user.name}
                                            {user.isVerified && (
                                                <ShieldCheck className="w-4 h-4 text-green-600" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-brand-violet font-bold">{user.anonId}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                            user.isAdmin 
                                                ? "bg-purple-100 text-purple-700"
                                                : user.role === 'LISTENER'
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}>
                                            {user.isAdmin ? 'ADMIN' : user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-brand-dark">
                                        ₹{user.walletBalance || 0}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
