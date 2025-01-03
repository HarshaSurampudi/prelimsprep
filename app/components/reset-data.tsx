"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useResponses } from "@/hooks/use-responses";

export function ResetData() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth(false);
  const { deleteAllResponses, isDeleting } = useResponses(user?.id ?? null);

  const handleReset = async () => {
    try {
      await deleteAllResponses();
      setOpen(false);
    } catch (error) {
      // Error is handled by the mutation
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Reset Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset Progress</DialogTitle>
          <DialogDescription>
            This will permanently delete all your practice history and progress.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReset}
            disabled={isDeleting}
          >
            {isDeleting ? "Resetting..." : "Reset Everything"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
