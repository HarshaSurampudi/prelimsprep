"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { saveUserResponses } from "@/lib/firebase/storage";
import { useAuth } from "@/lib/context/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ResetData() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = async () => {
    if (user) {
      await saveUserResponses(user.uid, []);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" />
          Reset Data
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset All Data</DialogTitle>
          <DialogDescription>
            This will permanently delete all your progress and statistics. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReset}>
            Reset All Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
