import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { DEPARTMENTS } from "./departments";

const emptyForm = {
  patientName: "",
  memberNo: "",
  lhimsNo: "",
  referredFromDepartment: DEPARTMENTS[0],
  referredFromDoctorName: "",
  referredToDepartment: DEPARTMENTS[1],
};

export default function NewReferral() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await addDoc(collection(db, "referrals"), {
        patientName: form.patientName.trim(),
        memberNo: form.memberNo.trim(),
        lhimsNo: form.lhimsNo.trim(),
        referredFromDepartment: form.referredFromDepartment,
        referredFromDoctorName: form.referredFromDoctorName.trim(),
        referredFromDate: serverTimestamp(),
        referredToDepartment: form.referredToDepartment,
        referredToDoctorName: null,
        referredToDate: null,
        status: "PENDING",
        createdAt: serverTimestamp(),
      });
      setForm(emptyForm);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(
        err.message ?? "Couldn't submit the referral. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">New Referral</h2>

      {success && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Referral sent.
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <Field label="Patient Name">
        <input
          required
          value={form.patientName}
          onChange={update("patientName")}
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Member #">
          <input
            value={form.memberNo}
            onChange={update("memberNo")}
            className={inputCls}
          />
        </Field>
        <Field label="LHIMS #">
          <input
            value={form.lhimsNo}
            onChange={update("lhimsNo")}
            className={inputCls}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Referral From">
          <select
            value={form.referredFromDepartment}
            onChange={update("referredFromDepartment")}
            className={inputCls}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Referral To">
          <select
            value={form.referredToDepartment}
            onChange={update("referredToDepartment")}
            className={inputCls}
          >
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Your Name (Referring Doctor)">
        <input
          required
          value={form.referredFromDoctorName}
          onChange={update("referredFromDoctorName")}
          className={inputCls}
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-[#2F6F62] px-4 py-2 text-sm font-medium text-white hover:bg-[#265a50] disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send Referral"}
      </button>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10";

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}
