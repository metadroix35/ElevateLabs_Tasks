import React from 'react';
import clsx from 'clsx';

interface RiskScoreProps {
  score: number;
  level: string;
}

const RiskScore: React.FC<RiskScoreProps> = ({ score, level }) => {
  const isHigh = level === 'High';
  const isMedium = level === 'Medium';
  const isLow = level === 'Low';

  return (
    <div className={clsx(
      "p-6 rounded-lg border",
      isHigh && "border-red-500 bg-red-50",
      isMedium && "border-yellow-500 bg-yellow-50",
      isLow && "border-green-500 bg-green-50",
      !isHigh && !isMedium && !isLow && "border-border bg-surface"
    )}>
      <h3 className="text-xl mb-2 font-serif text-secondaryText">Overall Risk Score</h3>
      <div className="flex items-end gap-4">
        <span className={clsx(
          "text-5xl font-semibold",
          isHigh && "text-red-700",
          isMedium && "text-yellow-700",
          isLow && "text-green-700",
        )}>
          {score.toFixed(1)}
        </span>
        <span className="text-2xl text-secondaryText mb-1">/ 100</span>
      </div>
      <p className="mt-4 text-lg font-medium">Risk Level: {level}</p>
    </div>
  );
};

export default RiskScore;
