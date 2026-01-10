import { useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Starfield from "../components/Starfield.jsx";
import { DashboardHeader } from "../components/usersDashboard/DashboardHeader.jsx";
import { ProfileSection } from "../components/usersDashboard/ProfileSection.jsx";
import { StatsOverview } from "../components/usersDashboard/StatsOverview.jsx";
import { JoinedProjects } from "../components/usersDashboard/JoinedProjects.jsx";
import { PullRequestsTable } from "../components/usersDashboard/PullRequestsTable.jsx";
import { BadgesSection } from "../components/usersDashboard/BadgesSection.jsx";
import { LeaderboardPreview } from "../components/usersDashboard/LeaderboardPreview.jsx";
import { EventCountdown } from "../components/usersDashboard/EventCountdown.jsx";

import {
  currentUser,
  userProjects,
  leaderboard,
  getUserRank,
  eventDates,
} from "../data/mockData";

import { useUserDashboardData, useUserPullRequests } from "../hooks/useApi.js";

/* -------------------------------- Utilities -------------------------------- */

function getInitialUser() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access_token");
    return user?.id && user?.github_username && token ? user : null;
  } catch {
    return null;
  }
}

/* -------------------------------- Component -------------------------------- */

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useMemo(getInitialUser, []);

  const { data, isLoading, isError, error } = useUserDashboardData(Boolean(user));

  const {
    data: pullRequestsData,
    isLoading: isPullRequestsLoading,
  } = useUserPullRequests(data?.data?._id, { enabled: !!data?.data?._id });

  const clearAuthAndRedirect = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  }, [navigate]);

  /* ----------------------------- Auth Handling ------------------------------ */

  useEffect(() => {
    if (!user) clearAuthAndRedirect();
  }, [user, clearAuthAndRedirect]);

  useEffect(() => {
    if (
      isError &&
      (error?.response?.status === 401 ||
        error?.message?.toLowerCase().includes("unauthorized"))
    ) {
      clearAuthAndRedirect();
    }
  }, [isError, error, clearAuthAndRedirect]);

  /* ------------------------------ Derived Data ------------------------------ */

  const userRank = useMemo(() => getUserRank(user?.id), [user?.id]);

  const profileUser = useMemo(() => {
    const u = data?.data;
    return {
      id: u?.github_id ?? "user-001",
      name: u?.fullName ?? "Anonymous",
      githubUsername: u?.github_username ?? "unknown",
      avatar:
        u?.avatar_url ??
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      college: u?.college ?? "VIT Bhopal",
      role: u?.role ?? "contributor",
      totalPRs: u?.stats?.totalPRs ?? 0,
      mergedPRs: u?.stats?.mergedPRs ?? 0,
      totalPoints: u?.stats?.points ?? 0,
    };
  }, [data]);

  const badges = useMemo(
    () =>
      data?.data?.badges?.map((badge, index) => ({
        id: badge._id || `badge-${index}`,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        rarity: badge.rarity?.toLowerCase() || "common",
      })) || [],
    [data]
  );

  /* ------------------------------- UI States -------------------------------- */

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Starfield />
        <span className="text-white">Loading dashboard...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Starfield />
        <span className="text-red-500">
          {error?.message || "Failed to load dashboard"}
        </span>
      </div>
    );
  }

  /* ---------------------------------- UI ----------------------------------- */

  return (
    <div className="min-h-screen bg-background">
      <Starfield />

      <DashboardHeader avatar={user.avatar_url} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8 animate-fade-in">
          {/* Event Countdown */}
          <EventCountdown
            eventStartDate={eventDates.start}
            eventEndDate={eventDates.end}
          />

          {/* Profile */}
          <ProfileSection
            user={profileUser}
            rank={userRank}
            isLoading={isLoading}
          />

          {/* Stats */}
          <StatsOverview
            totalPRs={profileUser.totalPRs}
            mergedPRs={profileUser.mergedPRs}
            totalPoints={profileUser.totalPoints}
            rank={userRank}
            isLoading={isLoading}
          />

          {/* Badges */}
          <BadgesSection badges={badges} isLoading={isLoading} />

          {/* Content Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <JoinedProjects projects={userProjects} isLoading={false} />
              <PullRequestsTable
                pullRequests={pullRequestsData?.data.map((pr) => ({
                  id: pr.github_pr_id,
                  title: pr.title,
                  repository: pr.project?.github_repo || "unknown-repo",
                  owner: pr.project?.github_owner || "unknown-owner",
                  status: pr.status || "unknown",
                  createdAt: pr.createdAt || "2024-01-15T10:30:00Z",
                  points: pr.points || 0,
                  prNumber: pr.github_pr_number || 0,
                })) || []}
                isLoading={isPullRequestsLoading}
              />
            </div>

            <aside className="space-y-8">
              <LeaderboardPreview
                entries={leaderboard}
                currentUserId={currentUser.id}
                isLoading={false}
              />
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}
