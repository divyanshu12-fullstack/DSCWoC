import { useState, useRef } from "react";
import { Star, GitFork, ExternalLink, Code2, FolderKanban, ChevronLeft, ChevronRight } from "lucide-react";

const languageColors = {
  TypeScript: "bg-star-blue",
  JavaScript: "bg-supernova-orange",
  Python: "bg-galaxy-violet",
  Go: "bg-stellar-cyan",
  Rust: "bg-nebula-pink",
};

function ProjectSkeleton() {
  return (
    <div className="glass-card p-4 md:p-5 animate-pulse min-w-[260px] md:min-w-[300px] flex-shrink-0">
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <div className="w-28 md:w-32 h-4 md:h-5 bg-muted rounded" />
        <div className="w-14 md:w-16 h-4 md:h-5 bg-muted rounded" />
      </div>
      <div className="w-full h-3 md:h-4 bg-muted rounded mb-3 md:mb-4" />
      <div className="flex gap-2 mb-3 md:mb-4">
        <div className="w-14 md:w-16 h-5 md:h-6 bg-muted rounded-full" />
        <div className="w-14 md:w-16 h-5 md:h-6 bg-muted rounded-full" />
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-10 md:w-12 h-3 md:h-4 bg-muted rounded" />
        <div className="w-14 md:w-16 h-3 md:h-4 bg-muted rounded" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass-card p-6 md:p-8 text-center">
      <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-muted/50 flex items-center justify-center">
        <FolderKanban className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
      </div>
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-1.5 md:mb-2">No Projects Yet</h3>
      <p className="text-sm md:text-base text-muted-foreground max-w-sm mx-auto">
        You haven't joined any projects yet. Browse available projects and start contributing!
      </p>
    </div>
  );
}

export function JoinedProjects({ projects, isLoading }) {
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const scroll = (direction) => {
    const scrollAmount = 320;
    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
          <Code2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          Joined Projects
        </h2>
        <div className="flex gap-3 md:gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <ProjectSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="space-y-3 md:space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
          <Code2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          Joined Projects
        </h2>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4 max-w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
          <Code2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          Joined Projects
          <span className="text-xs md:text-sm font-normal text-muted-foreground">({projects.length})</span>
        </h2>
        <div className="flex gap-1.5 md:gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-1.5 md:p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1.5 md:p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className={`flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-3 md:pb-4 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="glass-card p-4 md:p-5 glow-border group hover:bg-card/90 transition-all duration-300 min-w-[260px] md:min-w-[300px] flex-shrink-0 select-none"
          >
            <div className="flex items-start justify-between mb-2 md:mb-3">
              <div className="flex items-center gap-1.5 md:gap-2">
                <span className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${languageColors[project.language] || "bg-muted"}`} />
                <h3 className="text-sm md:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
              </div>
              <a
                href={`https://github.com/${project.owner}/${project.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 md:p-1.5 rounded-md hover:bg-muted transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
              </a>
            </div>

            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-3 md:mb-4">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {project.stars.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5 md:w-4 md:h-4" />
                {project.openIssues} open issues
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
