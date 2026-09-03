"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ThankYouForReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export const ThankYouForReviewModal = ({
  open,
  onOpenChange,
  onContinue,
}: ThankYouForReviewModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader className="items-center">
          {/* Star Icon with Smiley */}
          <div className="relative mb-4 flex items-center justify-center">
            <Star className="w-20 h-20 fill-amber-400 text-amber-400" />
            <svg
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 14C8 12 10 10 12 10C14 10 16 12 16 14"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <DialogTitle className="text-lg font-semibold text-gray-900 text-center">
            Thank you for submitting your review!
          </DialogTitle>
        </DialogHeader>

        <Button
          onClick={() => {
            onContinue();
            onOpenChange(false);
          }}
          className="w-full bg-[#02474F] text-white hover:bg-[#0E808D]"
        >
          Continue Browsing
        </Button>
      </DialogContent>
    </Dialog>
  );
};
