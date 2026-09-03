"use client";

import React from "react";
import { WordToReview } from "@/types";
import { motion } from "framer-motion";

interface WordReviewCardProps {
  word: WordToReview;
  index?: number;
  onClick?: () => void;
}

const WordReviewCard: React.FC<WordReviewCardProps> = ({ word, index = 0, onClick }) => {
  const meaning = word.oho?.[0]?.oto || "";
  const partOfSpeech = word.oho?.[0]?.ekerota?.[0] || "";
  const pronunciation = word.oho?.[0]?.uphoesio || word.oho?.[0]?.upho || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div 
        onClick={onClick}
        className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 hover:border-[#05353A]/30 p-4 transition-all duration-200 cursor-pointer group h-full flex flex-col min-h-[160px]"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-[#05353A] group-hover:text-[#065a63] transition-colors">
            {word.ota.charAt(0).toUpperCase() + word.ota.slice(1)}
          </h3>
          {partOfSpeech && (
            <span className="text-xs bg-[#05353A]/10 text-[#05353A] px-2 py-1 rounded-full shrink-0">
              {partOfSpeech}
            </span>
          )}
        </div>
        
        {pronunciation && (
          <p className="text-sm text-gray-500 mb-2 font-mono">/{pronunciation}/</p>
        )}
        
        <p className="text-sm text-gray-600 line-clamp-2 flex-grow">
          {meaning}
        </p>
        
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {word.erevwe}
          </span>
          <span className="text-xs text-[#05353A] font-medium group-hover:underline">
            Review →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default WordReviewCard;

