'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Loader2, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";

interface ModerationReport {
    id: string;
    sessionId: string;
    reporterId: number;
    reason: string;
    timestamp: string;
}

export default function AdminReportsPage() {
    const { data: session } = useSession();
    const [reports, setReports] = useState<ModerationReport[]>([]);
    const [loading, setLoading] = useState(true);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8081";

    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchReports = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/admin/reports`, {
                    headers: {
                        'x-user-id': session.user.id
                    },
                    withCredentials: true
                });
                setReports(res.data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
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
                    <h2 className="text-2xl font-bold font-heading text-brand-deep">Moderation & Safety Reports</h2>
                    <p className="text-gray-500 text-sm mt-1">Review flagged conversations and reports filed by seekers and listeners.</p>
                </div>
                <div className="bg-orange-50 text-orange-700 border border-orange-200 font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-orange-600" /> Total Reports: {reports.length}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {reports.length === 0 ? (
                    <div className="p-16 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-brand-deep font-heading">Zero Safety Flags</h3>
                        <p className="text-gray-500 text-sm mt-1 max-w-sm">No moderation events or abuse reports have been logged.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Report ID</th>
                                    <th className="px-6 py-4">Session ID</th>
                                    <th className="px-6 py-4">Reporter User ID</th>
                                    <th className="px-6 py-4">Reason</th>
                                    <th className="px-6 py-4">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{report.id.substring(0, 8)}...</td>
                                        <td className="px-6 py-4 font-mono text-xs text-brand-violet font-semibold">{report.sessionId}</td>
                                        <td className="px-6 py-4 font-medium text-gray-700">User #{report.reporterId}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-lg">
                                                {report.reason}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(report.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
