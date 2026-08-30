import React from 'react';
import clsx from 'clsx';

interface RiskScoreProps {
  score: number;
  level: string;
}

const RiskScore: React.FC<RiskScoreProps> = ({ score, level }) => {
  const normalizedLevel = level.toUpperCase();
  const isHigh = normalizedLevel === 'HIGH';
  const isMedium = normalizedLevel === 'MEDIUM';
  const isLow = normalizedLevel === 'LOW';

  return (
    <div className={clsx(
      "p-6 rounded-xl border-l-4 border-y-0 border-r-0 bg-black/20",
      isHigh && "border-red-500",
      isMedium && "border-yellow-500",
      isLow && "border-green-500",
      !isHigh && !isMedium && !isLow && "border-white/20"
    )}>
      <h3 className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-2">Overall Risk Score</h3>
      <div className="flex items-end gap-3">
        <span className={clsx(
          "text-6xl font-bold bg-clip-text text-transparent",
          isHigh && "bg-gradient-to-r from-red-500 to-red-300",
          isMedium && "bg-gradient-to-r from-yellow-500 to-yellow-300",
          isLow && "bg-gradient-to-r from-green-500 to-green-300",
          !isHigh && !isMedium && !isLow && "bg-gradient-to-r from-gray-400 to-gray-200"
        )}>
          {score.toFixed(1)}
        </span>
        <span className="text-2xl text-secondaryText mb-1 font-medium">/ 100</span>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-300 flex items-center">
        Risk Level: <span className={clsx(
          "ml-3 px-3 py-1 rounded-full text-xs font-bold",
          isHigh && "bg-red-500/20 text-red-400 border border-red-500/30",
          isMedium && "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
          isLow && "bg-green-500/20 text-green-400 border border-green-500/30",
          !isHigh && !isMedium && !isLow && "bg-white/10 text-white"
        )}>{normalizedLevel}</span>
      </p>
    </div>
  );
};

export default RiskScore;
