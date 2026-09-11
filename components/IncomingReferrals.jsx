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
import { downloadReferralForm } from "./referralFormCanvas";

export default function IncomingReferrals({
  department,
  setDepartment,
  profile,
}) {
  const [referrals, setReferrals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "referrals"),
      where("referredToDepartment", "==", department),
      where("status", "==", "PENDING"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(
      q,
      (snapshot) => {
        setReferrals(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (err) => {
        console.error("Incoming referrals listener error:", err);
        setError(
          "Live updates aren't connected right now (check the console for details).",
        );
      },
    );
  }, [department]);

  const handleAccept = async (referral) => {
    setError("");

    const accepted = {
      ...referral,
      referredToDoctorName: profile.fullName,
      referredToDate: new Date(),
      referredToSignatureUrl: profile.signatureUrl,
      status: "ACCEPTED",
    };

    setReferrals((prev) => prev.filter((r) => r.id !== referral.id));

    try {
      await updateDoc(doc(db, "referrals", referral.id), {
        referredToDoctorName: accepted.referredToDoctorName,
        referredToDate: serverTimestamp(),
        referredToSignatureUrl: accepted.referredToSignatureUrl,
        status: "ACCEPTED",
      });
      await downloadReferralForm(accepted);
    } catch (err) {
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
              <button
                type="button"
                onClick={() => downloadReferralForm(referral)}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Download Form
              </button>
              <button
                type="button"
                onClick={() => handleAccept(referral)}
                className="rounded-md bg-[#2F6F62] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#265a50]"
              >
                Accept &amp; Sign as {profile.fullName}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
