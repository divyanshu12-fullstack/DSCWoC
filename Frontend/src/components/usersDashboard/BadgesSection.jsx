import { Award } from "lucide-react";
import { useRef, useState } from "react";

const rarityStyles = {
  common: {
    border: "border-muted-foreground/30",
    bg: "bg-muted/50",
    glow: "",
    label: "Common",
    labelColor: "text-muted-foreground",
  },
  rare: {
    border: "border-star-blue/50",
    bg: "bg-star-blue/10",
    glow: "",
    label: "Rare",
    labelColor: "text-star-blue",
  },
  epic: {
    border: "border-cosmic-purple/50",
    bg: "bg-cosmic-purple/10",
    glow: "",
    label: "Epic",
    labelColor: "text-cosmic-purple",
  },
  legendary: {
    border: "border-supernova-orange/50",
    bg: "bg-supernova-orange/10",
    glow: "",
    label: "Legendary",
    labelColor: "text-supernova-orange",
  },
};

function BadgeSkeleton() {
  return (
    <div className="glass-card p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="w-24 h-4 bg-muted rounded" />
          <div className="w-32 h-3 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
        <Award className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No Badges Yet</h3>
      <p className="text-muted-foreground max-w-sm mx-auto">
        Keep contributing to earn badges and showcase your achievements!
      </p>
    </div>
  );
}

export function BadgesSection({ badges, isLoading }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Badges
        </h2>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <BadgeSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Badges
        </h2>
        <EmptyState />
      </div>
    );
  }

  const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
  const sortedBadges = [...badges].sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
        <Award className="w-5 h-5 text-primary" />
        Badges
        <span className="text-sm font-normal text-muted-foreground">({badges.length})</span>
      </h2>

      <div
        ref={scrollRef}
        className={`flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        {sortedBadges.map((badge) => {
          const rarity = rarityStyles[badge.rarity];

          return (
            <div
              key={badge.id}
              className={`glass-card p-4 border ${rarity.border} flex-shrink-0 w-[160px] md:w-[200px] hover:transition-transform hover:border-nebula-pink`}
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${rarity.bg} flex items-center justify-center mb-3`}
                >
                  <span className="text-2xl md:text-3xl">{badge.icon}</span>
                </div>

                <h3 className="font-semibold text-foreground text-xs md:text-sm mb-1">
                  {badge.name}
                </h3>

                <span className={`text-xs font-medium ${rarity.labelColor} mb-2`}>
                  {rarity.label}
                </span>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
