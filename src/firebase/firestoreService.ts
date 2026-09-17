import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  updateDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { DoctorProfile, AppointmentRecord } from '../types/doctor';
import { DEFAULT_DOCTOR_DATA } from '../data/defaultDoctorData';

const PROFILE_DOC_PATH = {
  collection: 'practice_config',
  id: 'profile',
};

/**
 * Subscribes to real-time doctor profile updates from Firestore.
 * Falls back to default data if the document doesn't exist yet,
 * and primes the database with initial defaults if empty.
 */
export function subscribeDoctorProfile(
  onData: (profile: DoctorProfile) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const profileRef = doc(db, PROFILE_DOC_PATH.collection, PROFILE_DOC_PATH.id);

  return onSnapshot(
    profileRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<DoctorProfile>;
        // Deep merge with defaults to avoid undefined fields
        const merged: DoctorProfile = {
          ...DEFAULT_DOCTOR_DATA,
          ...data,
          clinicInfo: {
            ...DEFAULT_DOCTOR_DATA.clinicInfo,
            ...(data.clinicInfo || {}),
          },
          visibility: {
            ...DEFAULT_DOCTOR_DATA.visibility,
            ...(data.visibility || {}),
          },
        };
        onData(merged);
      } else {
        // Document does not exist yet. Feed default and attempt to seed Firestore
        onData(DEFAULT_DOCTOR_DATA);
        try {
          await setDoc(profileRef, DEFAULT_DOCTOR_DATA);
          console.log('Successfully seeded default doctor profile into Firestore.');
        } catch (seedErr) {
          console.warn('Initial seeding encountered Firestore rule or network restriction:', seedErr);
        }
      }
    },
    (err) => {
      console.warn('Firestore onSnapshot listener error (using local state fallback):', err);
      if (onError) onError(err);
      onData(DEFAULT_DOCTOR_DATA);
    }
  );
}

/**
 * Fetches doctor profile once from Firestore.
 */
export async function getDoctorProfile(): Promise<DoctorProfile> {
  try {
    const profileRef = doc(db, PROFILE_DOC_PATH.collection, PROFILE_DOC_PATH.id);
    const snapshot = await getDoc(profileRef);
    if (snapshot.exists()) {
      return {
        ...DEFAULT_DOCTOR_DATA,
        ...(snapshot.data() as Partial<DoctorProfile>),
      };
    }
    return DEFAULT_DOCTOR_DATA;
  } catch (err) {
    console.warn('Failed to fetch doctor profile from Firestore:', err);
    return DEFAULT_DOCTOR_DATA;
  }
}

/**
 * Saves/updates the Doctor Profile in Firestore.
 * Base64 images are saved directly in fields.
 */
export async function updateDoctorProfile(
  updatedData: Partial<DoctorProfile>
): Promise<void> {
  const profileRef = doc(db, PROFILE_DOC_PATH.collection, PROFILE_DOC_PATH.id);
  const payload = {
    ...updatedData,
    lastUpdated: new Date().toISOString(),
  };

  await setDoc(profileRef, payload, { merge: true });
}

/**
 * Reset profile back to original default clinic state.
 */
export async function resetProfileToDefaults(): Promise<void> {
  const profileRef = doc(db, PROFILE_DOC_PATH.collection, PROFILE_DOC_PATH.id);
  await setDoc(profileRef, {
    ...DEFAULT_DOCTOR_DATA,
    lastUpdated: new Date().toISOString(),
  });
}

/**
 * Book an appointment and persist to Firestore `appointments` collection.
 */
export async function bookAppointment(
  appointment: Omit<AppointmentRecord, 'id' | 'createdAt' | 'status'>
): Promise<string> {
  const appointmentsRef = collection(db, 'appointments');
  const docRef = await addDoc(appointmentsRef, {
    ...appointment,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

/**
 * Real-time listener for incoming patient appointments.
 */
export function subscribeAppointments(
  onData: (appointments: AppointmentRecord[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const appointmentsRef = collection(db, 'appointments');
  const q = query(appointmentsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const records: AppointmentRecord[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AppointmentRecord, 'id'>),
      }));
      onData(records);
    },
    (err) => {
      console.warn('Firestore appointments listener error:', err);
      if (onError) onError(err);
      onData([]);
    }
  );
}

/**
 * Update an appointment's status (e.g. pending, confirmed, completed, cancelled)
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentRecord['status']
): Promise<void> {
  const appointmentRef = doc(db, 'appointments', appointmentId);
  await updateDoc(appointmentRef, { status });
}
