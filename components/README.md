# Referral Bridge — Demo

Minimal doctor-to-doctor referral demo: a doctor fills the "Referred From" side
and sends it; any doctor logged in can open "Incoming Referrals," filter by
department, and "sign" the "Referred To" side by typing their name. Either
side can download a print-style JPEG of the form at any time.

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
7. Install dependencies and run:

   ```bash
   npm install firebase
   npm run dev
   ```

## Files

- `src/firebase.js` — Firebase config/init (fill in your project's values)
- `src/departments.js` — the list of departments/clinics in the dropdowns
- `src/AuthContext.jsx` — wraps Firebase Auth state
- `src/Login.jsx` — email/password sign-in screen
- `src/NewReferral.jsx` — the "send a referral" form
- `src/IncomingReferrals.jsx` — the "accept a referral" queue, filtered by department
- `src/referralFormCanvas.js` — generates the downloadable JPEG form
- `src/App.jsx` — top-level shell/tabs

## Demoing it to a supervisor

1. Sign in as Doctor A, submit a referral from OPD → Internal Medicine.
2. Sign out, sign in as Doctor B.
3. Open "Incoming Referrals," switch the filter to Internal Medicine, see
   the pending referral appear live, and accept it.
4. Download the form from either screen to show the printable output.

## Known simplifications (by design, for a demo)

- No sign-up flow — accounts are created manually in the Firebase console.
- No department tied to a login — a doctor picks/types their own
  department and name on each referral rather than having a stored profile.
- Signatures are typed names rendered in a script font, not drawn/uploaded
  images.
- Firestore rules are wide-open to any signed-in user.

None of these are hard to add later if this becomes the real system — the
full Referral Bridge project (roles, registration keys, per-department
locking, offline sync) is a natural next step once the supervisor's on board.
