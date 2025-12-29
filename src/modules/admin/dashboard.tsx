"use client";
import React from "react";
import { AdminAnalytics } from "./components/Analytics";
import { ProjectList } from "./components/ProjectList";

export const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Control Panel
          </h1>
          <p className="text-gray-500 mt-2">
            Manage the platform content and view global analytics.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
            Global Statistics
          </h2>
          <AdminAnalytics />
        </section>

        <section>
          <ProjectList />
        </section>
      </div>
    </div>
  );
};
