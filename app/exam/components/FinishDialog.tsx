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
import { ReactNode } from "react";
import { signOut } from "next-auth/react";

const FinishDialog = ({
  children,
  shouldShow,
}: {
  children: ReactNode;
  shouldShow: boolean;
}) => {
  return (
    <Dialog open={shouldShow}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Success</DialogTitle>
          <DialogDescription>
            Your exam has been submitted. Look for mobile app for the result
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              signOut({ callbackUrl: "/login" });
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FinishDialog;
