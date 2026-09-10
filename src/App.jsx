import { useState } from "react";
import { AuthProvider, useAuth } from "../components/AuthContext";
import Login from "../components/Login";
import NewReferral from "../components/NewReferral";
import IncomingReferrals from "../components/IncomingReferrals";

function Shell() {
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState("new");

  if (loading) return null;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <h1 className="text-base font-semibold text-slate-900">
            Referral Bridge
          </h1>
          <button
            onClick={logout}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Sign out
          </button>
        </div>
        <div className="mx-auto flex max-w-3xl gap-1 px-4">
          <TabButton active={tab === "new"} onClick={() => setTab("new")}>
            New Referral
          </TabButton>
          <TabButton
            active={tab === "incoming"}
            onClick={() => setTab("incoming")}
          >
            Incoming Referrals
          </TabButton>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {tab === "new" ? <NewReferral /> : <IncomingReferrals />}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`border-b-2 px-3 py-2 text-sm font-medium ${
        active
          ? "border-[#2F6F62] text-[#2F6F62]"
          : "border-transparent text-slate-500 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
