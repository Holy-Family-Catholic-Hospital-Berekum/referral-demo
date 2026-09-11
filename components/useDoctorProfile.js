import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useDoctorProfile(uid) {
  const [profile, setProfile] = useState(undefined); // undefined = still loading

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      return;
    }
    return onSnapshot(doc(db, "users", uid), (snap) => {
      setProfile(snap.exists() ? snap.data() : null);
    });
  }, [uid]);

  return { profile: profile ?? null, loading: profile === undefined };
}
