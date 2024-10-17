import React from 'react';

interface BadgeProps {
  milestone: string;
}

const Badge: React.FC<BadgeProps> = ({ milestone }) => {
  return (
    <div className="inline-block bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
      {milestone}
    </div>
  );
};

export default Badge;
