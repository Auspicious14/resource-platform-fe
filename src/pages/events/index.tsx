"use client";
import EventsList from "@/modules/events/list";
import SEO from "@/components/seo";

export default function EventsPage() {
  return (
    <>
      <SEO
        title="Events & Challenges"
        description="Join coding challenges, hackathons, and compete with other developers. Win prizes and improve your skills."
        keywords={[
          "coding challenges",
          "hackathons",
          "developer events",
          "programming competitions",
        ]}
      />
      <EventsList />
    </>
  );
}
