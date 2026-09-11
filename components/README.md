# Referral Bridge — Demo

Doctor-to-doctor referral demo: a doctor fills the "Referred From" side and
sends it; any doctor logged in can open "Incoming Referrals," filter by
department, and accept the "Referred To" side with one click. Signatures are
drawn once per account and reused automatically on every referral from then
on. Either side can download a print-style JPEG of the form at any time.

## Setup

1. **Create/select a Firebase project** at console.firebase.google.com.
2. **Enable Authentication → Email/Password.**
3. **Enable Firestore Database** (production mode is fine — we're overriding
   the rules below).
4. **Add a Web App** in Project Settings → your apps, and copy the config
   object into `src/firebase.js`, replacing the placeholder values.
5. **Publish `firestore.rules`** (Firestore → Rules tab, paste the contents
   of this repo's `firestore.rules`, click Publish). These rules are
   deliberately wide-open for a demo — see the warning comment in the file.
6. **Create 2–3 demo doctor accounts** under Authentication → Users → Add
   user (just email + password — no sign-up screen exists in this app).
7. **Add your hospital crest** as `src/logo.png` (referenced by
   `src/referralFormCanvas.js` — rename the import there if you use a
   different filename).
8. Install dependencies and run:

   ```bash
   npm install firebase
   npm run dev
   ```

## First login

The first time a doctor signs in, they'll be asked to type their name and
draw their signature once (mouse or touch). That's saved to their account
(`users/{uid}` in Firestore) and used automatically afterward — no more
typing a name or uploading anything per referral. A doctor can redraw their
signature any time via "Update signature" in the header.

## Files

- `src/firebase.js` — Firebase config/init (fill in your project's values)
- `src/departments.js` — the list of departments/clinics in the dropdowns
- `src/AuthContext.jsx` — wraps Firebase Auth state
- `src/Login.jsx` — email/password sign-in screen
- `src/useDoctorProfile.js` — live-loads the signed-in doctor's saved name/signature
- `src/SignaturePad.jsx` — freehand signature canvas (mouse + touch)
- `src/SignatureSetup.jsx` — one-time (or editable) name + signature screen
- `src/NewReferral.jsx` — the "send a referral" form
- `src/IncomingReferrals.jsx` — the "accept a referral" queue, filtered by department
- `src/referralFormCanvas.js` — generates the downloadable JPEG form
- `src/App.jsx` — top-level shell/tabs, gates on having a saved signature

## Demoing it to a supervisor

1. Sign in as Doctor A. First time in, set a name and draw a signature.
2. Submit a referral from OPD → Internal Medicine.
3. Sign out, sign in as Doctor B (also sets up their signature the first time).
4. Open "Incoming Referrals," switch the filter to Internal Medicine, see
   the pending referral appear live, and accept it with one click.
5. Download the form from either screen to show the printable output —
   both signatures now appear as real handwriting, not typed text.

## Known simplifications (by design, for a demo)

- No sign-up flow — accounts are created manually in the Firebase console.
- No department tied to a login — a doctor picks the department per
  referral rather than having one fixed to their profile.
- Signatures and names are stored directly on `users/{uid}` in Firestore as
  a base64 image string (no Firebase Storage setup needed for a demo).
- Firestore rules are wide-open to any signed-in user for referrals; each
  doctor can only touch their own profile doc.

None of these are hard to add later if this becomes the real system — the
full Referral Bridge project (roles, registration keys, per-department
locking, offline sync) is a natural next step once the supervisor's on board.
