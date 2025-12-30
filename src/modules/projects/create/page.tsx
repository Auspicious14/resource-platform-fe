"use client";
import React from "react";
import { ProjectForm } from "../components/ProjectForm";
import { useRouter } from "next/navigation";

export default function CreateProjectPage() {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4 min-h-screen transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-3xl border border-gray-100 dark:border-gray-800">
        <ProjectForm
          title="Create New Project"
          onSuccess={() => router.push("/projects")}
        />
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4 text-sm">
          Fill in the details to add a new project to the library.
        </p>
      </div>
    </div>
  );
}
