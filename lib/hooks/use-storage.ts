"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/context/auth-context";
import { db } from "@/lib/firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export function useStorage<T>(key: string, initialValue: T) {
  const { user } = useAuth();
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    async function initializeAndSubscribe() {
      console.log(`[useStorage] Initializing storage for key: ${key}`);

      if (!user) {
        console.log(
          `[useStorage] No user logged in, using initial value for key: ${key}`
        );
        setStoredValue(initialValue);
        setIsLoading(false);
        return;
      }

      const docRef = doc(db, "users", user.uid, "data", key);

      try {
        // Initial load
        console.log(`[useStorage] Loading initial data for key: ${key}`);
        const docSnap = await getDoc(docRef);

        if (isMounted) {
          if (docSnap.exists()) {
            console.log(
              `[useStorage] Document exists for key: ${key}`,
              docSnap.data().value
            );
            setStoredValue(docSnap.data().value);
          } else {
            console.log(
              `[useStorage] Initializing new document for key: ${key}`
            );
            await setDoc(docRef, {
              value: initialValue,
              updatedAt: serverTimestamp(),
            });
          }
          setIsLoading(false);
        }

        // Set up subscription only after initial load
        if (isMounted) {
          console.log(`[useStorage] Setting up subscription for key: ${key}`);
          unsubscribe = onSnapshot(docRef, (doc) => {
            if (isMounted && doc.exists()) {
              console.log(
                `[useStorage] Received update for key: ${key}`,
                doc.data().value
              );
              setStoredValue(doc.data().value);
            }
          });
        }
      } catch (error) {
        console.error(`[useStorage] Error initializing ${key}:`, error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initializeAndSubscribe();

    return () => {
      console.log(`[useStorage] Cleaning up subscription for key: ${key}`);
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid, key]);

  const setValue = useCallback(
    async (value: T | ((prev: T) => T)) => {
      if (!user) {
        console.warn(
          `[useStorage] Cannot save data: No user is logged in (key: ${key})`
        );
        return;
      }

      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      try {
        console.log(
          `[useStorage] Saving new value for key: ${key}`,
          valueToStore
        );
        const docRef = doc(db, "users", user.uid, "data", key);
        await setDoc(docRef, {
          value: valueToStore,
          updatedAt: serverTimestamp(),
        });
        setStoredValue(valueToStore);
        console.log(`[useStorage] Successfully saved value for key: ${key}`);
      } catch (error) {
        console.error(`[useStorage] Error saving data for key: ${key}:`, error);
      }
    },
    [user, key, storedValue]
  );

  return [storedValue, setValue, isLoading] as const;
}
