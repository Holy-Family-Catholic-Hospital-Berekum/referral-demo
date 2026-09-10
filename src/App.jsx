import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "../components/AuthContext";
import Login from "../components/Login";
import NewReferral from "../components/NewReferral";
import IncomingReferrals from "../components/IncomingReferrals";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../components/firebase";
import { DEPARTMENTS } from "../components/departments";

function Shell() {
  const { user, loading, logout } = useAuth();
  const [tab, setTab] = useState("new");
  const [department, setDepartment] = useState(DEPARTMENTS[1]);
  const [pendingCount, setPendingCount] = useState(0);

  // Lightweight listener just for the badge count, scoped to whichever
  // department is currently selected on the Incoming Referrals tab, so the
  // number shown always matches what that tab would show if opened.
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "referrals"),
      where("referredToDepartment", "==", department),
      where("status", "==", "PENDING"),
    );
    return onSnapshot(
      q,
      (snapshot) => setPendingCount(snapshot.size),
      () => {
        // Same composite-index caveat as IncomingReferrals — badge just stays
        // at its last known value if this listener errors.
      },
    );
  }, [user, department]);

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
            {pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-[#2F6F62] px-1.5 py-0.5 text-[11px] font-semibold text-white">
                {pendingCount}
              </span>
            )}
          </TabButton>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {tab === "new" ? (
          <NewReferral />
        ) : (
          <IncomingReferrals
            department={department}
            setDepartment={setDepartment}
          />
        )}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center border-b-2 px-3 py-2 text-sm font-medium ${
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
