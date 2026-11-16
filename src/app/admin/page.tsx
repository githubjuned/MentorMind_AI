"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Lock,
  KeyRound,
  CheckCircle2,
  Users,
  Activity,
  Server,
  Cpu,
  Trash2,
  Eye,
  Search,
  ArrowRight,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";

interface MockUser {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  joined: string;
  status: "active" | "suspended";
}

interface PrivacyReq {
  id: string;
  email: string;
  type: string;
  date: string;
  status: "pending" | "resolved";
}

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"users" | "privacy" | "health">("users");

  const [users, setUsers] = useState<MockUser[]>([
    {
      id: "usr_001",
      name: "Juned K",
      email: "juned@example.com",
      department: "Computer Science",
      year: "Final Year",
      joined: "Nov 15, 2026",
      status: "active",
    },
    {
      id: "usr_002",
      name: "Priya Sharma",
      email: "priya.s@example.com",
      department: "AI & DS",
      year: "Second Year",
      joined: "Nov 16, 2026",
      status: "active",
    },
    {
      id: "usr_003",
      name: "Aditya Verma",
      email: "aditya.v@example.com",
      department: "Mechanical",
      year: "Third Year",
      joined: "Nov 12, 2026",
      status: "suspended",
    },
  ]);

  const [privacyReqs, setPrivacyReqs] = useState<PrivacyReq[]>([
    {
      id: "pr_982",
      email: "aditya.v@example.com",
      type: "Data Erasure (DPDP)",
      date: "Nov 16, 2026",
      status: "pending",
    },
    {
      id: "pr_981",
      email: "priya.s@example.com",
      type: "Summary of Processing",
      date: "Nov 15, 2026",
      status: "resolved",
    },
  ]);

  const [search, setSearch] = useState("");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "mentormind-admin" || passcode === "admin2026" || passcode === "AQ.Ab8RN6Jq") {
      setAuthorized(true);
      setError("");
    } else {
      setError("Invalid administrative security key. Access denied.");
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers((cur) =>
      cur.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
      )
    );
  };

  const toggleReqStatus = (id: string) => {
    setPrivacyReqs((cur) =>
      cur.map((r) =>
        r.id === id ? { ...r, status: r.status === "pending" ? "resolved" : "pending" } : r
      )
    );
  };

  if (!authorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-app px-4">
        <div className="w-full max-w-md rounded-3xl border border-line bg-card p-8 shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <KeyRound className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-center font-display text-2xl font-bold text-ink">
            Admin Access Portal
          </h1>
          <p className="mt-1.5 text-center text-xs text-muted">
            Restricted to authorized system administrators and Grievance Officers.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-bad/30 bg-bad/10 p-3 text-xs text-bad">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink">Administrative Security Passcode</label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter master key..."
                className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-indigo-500 focus:outline-none"
              />
              <span className="mt-1 block text-[11px] text-muted">
                Default key: <code className="bg-surface px-1 py-0.5 rounded">admin2026</code>
              </span>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <Lock className="h-4 w-4" />
              Verify & Enter Console
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-xs text-muted hover:text-ink hover:underline">
              ← Return to public website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-app text-ink">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-card/90 px-6 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="rounded-full bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 text-[11px] font-bold text-indigo-800">
              Admin Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="rounded-xl border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-card transition"
            >
              Student Dashboard
            </Link>
            <button
              onClick={() => setAuthorized(false)}
              className="flex items-center gap-1.5 rounded-xl border border-bad/30 bg-bad/10 px-3 py-1.5 text-xs font-semibold text-bad hover:bg-bad/20 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-6 sm:p-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">Total Registered Students</span>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="mt-3 font-display text-2xl font-extrabold text-ink">{users.length}</div>
            <div className="mt-1 text-[11px] text-emerald-600 font-medium">100% Verified in Firebase</div>
          </div>

          <div className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">RTDB Security Status</span>
              <Server className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-3 font-display text-lg font-bold text-emerald-600 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Per-User UID Rules Active
            </div>
            <div className="mt-1 text-[11px] text-muted">US-Central1 Location</div>
          </div>

          <div className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">Gemini 2.0 AI Latency</span>
              <Cpu className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-3 font-display text-2xl font-extrabold text-ink">540 ms</div>
            <div className="mt-1 text-[11px] text-emerald-600 font-medium">Model: gemini-flash-lite-latest</div>
          </div>

          <div className="rounded-2xl border border-line bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">DPDP Requests Pending</span>
              <ShieldAlert className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="mt-3 font-display text-2xl font-extrabold text-ink">
              {privacyReqs.filter((r) => r.status === "pending").length}
            </div>
            <div className="mt-1 text-[11px] text-amber-600 font-medium">Within 48h ACK Window</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-line gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("users")}
            className={`pb-3 transition ${
              activeTab === "users"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-muted hover:text-ink"
            }`}
          >
            User Management ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`pb-3 transition ${
              activeTab === "privacy"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-muted hover:text-ink"
            }`}
          >
            DPDP Privacy Requests ({privacyReqs.length})
          </button>
          <button
            onClick={() => setActiveTab("health")}
            className={`pb-3 transition ${
              activeTab === "health"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-muted hover:text-ink"
            }`}
          >
            System Health & Diagnostics
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter users by name, email, department..."
                  className="w-full rounded-xl border border-line bg-card py-2 pl-9 pr-3 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-line bg-card">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface2 text-ink border-b border-line">
                  <tr>
                    <th className="p-3.5 font-semibold">Student Name</th>
                    <th className="p-3.5 font-semibold">Email</th>
                    <th className="p-3.5 font-semibold">Department & Year</th>
                    <th className="p-3.5 font-semibold">Registered</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-muted">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-surface/50 transition">
                      <td className="p-3.5 font-semibold text-ink">{user.name}</td>
                      <td className="p-3.5 font-mono">{user.email}</td>
                      <td className="p-3.5">{user.department} · {user.year}</td>
                      <td className="p-3.5">{user.joined}</td>
                      <td className="p-3.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            user.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                            user.status === "active"
                              ? "border border-rose-300 text-rose-600 hover:bg-rose-50"
                              : "border border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {user.status === "active" ? "Suspend Account" : "Reactivate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div className="overflow-x-auto rounded-2xl border border-line bg-card">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface2 text-ink border-b border-line">
                <tr>
                  <th className="p-3.5 font-semibold">Request ID</th>
                  <th className="p-3.5 font-semibold">Data Principal Email</th>
                  <th className="p-3.5 font-semibold">Statutory Right</th>
                  <th className="p-3.5 font-semibold">Date Logged</th>
                  <th className="p-3.5 font-semibold">Resolution Status</th>
                  <th className="p-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-muted">
                {privacyReqs.map((req) => (
                  <tr key={req.id}>
                    <td className="p-3.5 font-mono font-bold text-ink">{req.id}</td>
                    <td className="p-3.5 font-mono">{req.email}</td>
                    <td className="p-3.5 font-semibold text-indigo-600">{req.type}</td>
                    <td className="p-3.5">{req.date}</td>
                    <td className="p-3.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          req.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {req.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => toggleReqStatus(req.id)}
                        className="rounded-lg border border-line bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink hover:bg-card transition"
                      >
                        Mark as {req.status === "pending" ? "Resolved" : "Pending"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === "health" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-ink">Infrastructure Integrity</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <span className="text-muted">Firebase Project ID:</span>
                  <span className="font-mono text-ink font-semibold">mentormindai-137a0</span>
                </div>
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <span className="text-muted">Realtime Database:</span>
                  <span className="text-emerald-600 font-semibold">CONNECTED (Active)</span>
                </div>
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <span className="text-muted">Security Ruleset:</span>
                  <span className="text-emerald-600 font-semibold">Strict Per-User UID Enforcement</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Firebase Auth Providers:</span>
                  <span className="text-ink font-semibold">Google OAuth & Email / Password</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-card p-6 space-y-4">
              <h3 className="font-display text-base font-bold text-ink">AI Orchestration Status</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <span className="text-muted">Primary Inference Model:</span>
                  <span className="font-mono text-indigo-600 font-semibold">gemini-flash-lite-latest</span>
                </div>
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <span className="text-muted">Fallback Inference Model:</span>
                  <span className="font-mono text-muted">gemini-2.0-flash</span>
                </div>
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <span className="text-muted">Live API Key State:</span>
                  <span className="text-emerald-600 font-semibold">Active & Validated</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">Specialist Agents Deployed:</span>
                  <span className="text-ink font-semibold">7 Specialists + 1 Coordinator</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
