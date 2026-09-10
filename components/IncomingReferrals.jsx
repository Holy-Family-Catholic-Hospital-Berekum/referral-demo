import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import { DEPARTMENTS } from "./departments";

export default function IncomingReferrals({ department, setDepartment }) {
  const [referrals, setReferrals] = useState([]);
  const [signingId, setSigningId] = useState(null);
  const [signerName, setSignerName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "referrals"),
      where("referredToDepartment", "==", department),
      where("status", "==", "PENDING"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snapshot) => {
      setReferrals(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [department]);

  const handleAccept = async (referral) => {
    if (!signerName.trim()) return;
    setError("");

    // Remove it from view immediately rather than waiting on the snapshot
    // listener's round trip — the listener will confirm this shortly after,
    // but the doctor sees it disappear the instant they confirm.
    setReferrals((prev) => prev.filter((r) => r.id !== referral.id));
    setSigningId(null);
    const name = signerName.trim();
    setSignerName("");

    try {
      await updateDoc(doc(db, "referrals", referral.id), {
        referredToDoctorName: name,
        referredToDate: serverTimestamp(),
        status: "ACCEPTED",
      });
    } catch (err) {
      // Put it back if the write actually failed.
      setReferrals((prev) => [referral, ...prev]);
      setError(err.message ?? "Couldn't accept the referral.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Incoming Referrals
        </h2>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          {DEPARTMENTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 space-y-3">
        {referrals.length === 0 && (
          <p className="text-sm text-slate-400">
            No referrals for {department} yet.
          </p>
        )}

        {referrals.map((referral) => (
          <div
            key={referral.id}
            className="rounded-md border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-slate-900">
                  {referral.patientName}
                </p>
                <p className="text-sm text-slate-500">
                  From {referral.referredFromDepartment} — Dr.{" "}
                  {referral.referredFromDoctorName}
                </p>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Pending
              </span>
            </div>

            <div className="mt-3 flex items-center gap-2">
              {signingId !== referral.id && (
                <button
                  type="button"
                  onClick={() => setSigningId(referral.id)}
                  className="rounded-md bg-[#2F6F62] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#265a50]"
                >
                  Accept &amp; Sign
                </button>
              )}
            </div>

            {signingId === referral.id && (
              <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                <input
                  autoFocus
                  placeholder="Your name"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-48 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleAccept(referral)}
                  disabled={!signerName.trim()}
                  className="rounded-md bg-[#2F6F62] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#265a50] disabled:opacity-50"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setSigningId(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
