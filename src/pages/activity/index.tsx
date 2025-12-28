"use client";
import ActivityFeed from "@/modules/social/activity-feed";
import SEO from "@/components/seo";

export default function ActivityPage() {
  return (
    <>
      <SEO
        title="Activity Feed"
        description="See what developers you follow are working on and their recent achievements"
        keywords={["activity feed", "social", "developer community"]}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ActivityFeed />
      </div>
    </>
  );
}
