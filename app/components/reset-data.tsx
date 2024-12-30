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

export function ResetData() {
  const [open, setOpen] = useState(false);

  const handleReset = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("responses");
      window.dispatchEvent(new Event("storage"));
      setOpen(false);

      // Reload the page after a brief delay to allow the dialog to close
      setTimeout(() => {
        window.location.reload();
      }, 100);
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReset}>
            Reset Everything
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
