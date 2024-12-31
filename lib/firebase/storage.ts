import { db } from "@/lib/firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";
import { Question, UserResponse } from "@/lib/types";
import { getFirestore } from "firebase/firestore";

// User Preferences
export interface UserPreferences {
  targetQuestions?: number;
}

export async function getUserPreferences(
  userId: string
): Promise<UserPreferences> {
  console.log("[storage] Getting user preferences for userId:", userId);

  if (!userId) {
    console.log("[storage] No userId provided, returning default preferences");
    return { targetQuestions: 5 };
  }

  const docRef = doc(db, "users", userId, "data", "preferences");

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("[storage] Found existing preferences for userId:", userId);
      return docSnap.data().value;
    }

    console.log(
      "[storage] No preferences found, initializing defaults for userId:",
      userId
    );
    // Initialize with default preferences
    const defaultPreferences = {
      targetQuestions: 5,
    };
    await setDoc(docRef, {
      value: defaultPreferences,
      updatedAt: serverTimestamp(),
    });
    return defaultPreferences;
  } catch (error) {
    console.error("[storage] Error getting user preferences:", error);
    return { targetQuestions: 5 };
  }
}

export async function saveUserPreferences(
  userId: string,
  preferences: UserPreferences
) {
  console.log(
    "[storage] Saving preferences for userId:",
    userId,
    "preferences:",
    preferences
  );

  if (!userId) {
    console.warn("[storage] Cannot save preferences: No user ID provided");
    return;
  }

  try {
    const docRef = doc(db, "users", userId, "data", "preferences");
    await setDoc(docRef, {
      value: preferences,
      updatedAt: serverTimestamp(),
    });
    console.log("[storage] Successfully saved preferences for userId:", userId);
  } catch (error) {
    console.error("[storage] Error saving user preferences:", error);
    throw error;
  }
}

// User Responses
export async function getUserResponses(userId: string) {
  console.log("[storage] Getting user responses for userId:", userId);

  if (!userId) {
    console.log(
      "[storage] No userId provided, returning empty responses array"
    );
    return [];
  }

  const docRef = doc(db, "users", userId, "data", "responses");

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("[storage] Found existing responses for userId:", userId);
      return docSnap.data().value as UserResponse[];
    }

    console.log(
      "[storage] No responses found, initializing empty array for userId:",
      userId
    );
    // Initialize with empty array
    await setDoc(docRef, {
      value: [],
      updatedAt: serverTimestamp(),
    });
    return [];
  } catch (error) {
    console.error("[storage] Error getting user responses:", error);
    return [];
  }
}

export async function saveUserResponses(
  userId: string,
  responses: UserResponse[]
) {
  console.log(
    "[storage] Saving responses for userId:",
    userId,
    "count:",
    responses.length
  );

  if (!userId) {
    console.warn("[storage] Cannot save responses: No user ID provided");
    return;
  }

  try {
    const docRef = doc(db, "users", userId, "data", "responses");
    await setDoc(docRef, {
      value: responses,
      updatedAt: serverTimestamp(),
    });
    console.log("[storage] Successfully saved responses for userId:", userId);
  } catch (error) {
    console.error("[storage] Error saving user responses:", error);
    throw error;
  }
}

interface QuestionReport {
  questionId: string;
  userId: string;
  reportText: string;
  timestamp: string;
  questionData: Question;
}

export async function addQuestionReport(report: QuestionReport) {
  const db = getFirestore();
  const reportsRef = collection(db, "questionReports");

  await addDoc(reportsRef, {
    ...report,
    status: "pending", // For tracking report status
    createdAt: serverTimestamp(),
  });
}
