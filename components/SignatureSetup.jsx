import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import SignaturePad from "./SignaturePad";

export default function SignatureSetup({ uid, existingName, onDone }) {
  const [fullName, setFullName] = useState(existingName ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (signatureDataUrl) => {
    if (!fullName.trim()) {
      setError("Enter your name first.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await setDoc(
        doc(db, "users", uid),
        { fullName: fullName.trim(), signatureUrl: signatureDataUrl },
        { merge: true },
      );
      onDone?.();
    } catch (err) {
      setError(err.message ?? "Couldn't save your signature.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Set Up Your Signature
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign once here — it's saved to your account and applied automatically
          to every referral you send or accept from now on.
        </p>

        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Your Name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Draw Your Signature
          </label>
          <SignaturePad onSave={handleSave} saving={saving} />
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
