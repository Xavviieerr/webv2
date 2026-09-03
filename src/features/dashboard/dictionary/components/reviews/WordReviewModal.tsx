"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RatingsAndReviewsPanel } from "./RatingsAndReviewsPanel";
import { LeaveReviewForm } from "./LeaveReviewForm";
import { ThankYouForReviewModal } from "./ThankYouForReviewModal";
import { getStatusDisplay, getPronunciation } from "../../utils/helpers";

interface WordReviewModalWord {
  id: string;
  ota: string;
  status: string;
  oho?: Array<{ upho?: string; uphoesio?: string }>;
}

interface WordReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  word: WordReviewModalWord;
}

export const WordReviewModal = ({
  open,
  onOpenChange,
  word,
}: WordReviewModalProps) => {
  const [showThankYou, setShowThankYou] = useState(false);
  const pronunciation = getPronunciation(word);
  const statusDisplay = getStatusDisplay(word.status);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto custom-scrollbar bg-white pr-10">
          <DialogHeader>
            {/* Word Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold text-[#02474F]">
                  {word.ota}
                </DialogTitle>
                {pronunciation && (
                  <p className="text-sm text-gray-500 italic mt-1">
                    /{pronunciation}/
                  </p>
                )}
              </div>
              <span
                className="shrink-0 rounded-md px-2.5 py-1 text-xs font-medium"
                style={{ backgroundColor: "#02474F", color: "#ffffff" }}
              >
                {statusDisplay}
              </span>
            </div>
          </DialogHeader>

          {/* Reviews Section */}
          <div className="space-y-6 mt-2">
            <RatingsAndReviewsPanel wordId={word.id} />
            <LeaveReviewForm
              wordId={word.id}
              onSubmitSuccess={() => setShowThankYou(true)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <ThankYouForReviewModal
        open={showThankYou}
        onOpenChange={setShowThankYou}
        onContinue={() => {}}
      />
    </>
  );
};
