"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IProject } from "./model";
import { useProjectState } from "./context";
import { useRouter } from "next/router";
import { Button, SelectInput, TextInput } from "@/components";
import { ChatModal } from "../chat/components/modal";

const difficultyOptions = [
  { label: "All", value: "" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];
export const ProjectsPage = () => {
  const { projects } = useProjectState();
  const router = useRouter();
  const [filters, setFilters] = useState({
    difficulty: router.query.difficulty || "",
    title: router.query.title || "",
    description: router.query.description || "",
    requirements: router.query.requirements || "",
  });
  const [loading, setLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setLoading(true);
      const query: any = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query[key] = value;
      });
      router.push({ pathname: "/projects", query });
    }
  }, [filters, router.isReady]);

  useEffect(() => {
    setLoading(false);
  }, [projects]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query: any = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) query[key] = value;
    });
    router.push({ pathname: "/projects", query });
  };

  return (
    // <div className="max-w-6xl mx-auto py-8 px-4">
    //   <div className="text-center mb-10">
    //     {/* <img
    //       src="/assets/store-illustration.png" // Provide your image path
    //       alt="Store Illustration"
    //       className="mx-auto h-48 mb-4"
    //     /> */}
    //     <h1 className="text-4xl font-bold text-blue-900">
    //       Discover and Build Projects Easily
    //     </h1>
    //     <p className="text-gray-600 mt-2">
    //       Browse a collection of creative, beginner-to-advanced project ideas.
    //     </p>
    //   </div>

    //   <form
    //     onSubmit={handleFilterSubmit}
    //     className="mb-8 flex md:flex-wrap gap-4 md:justify-center w-full"
    //   >
    //     <TextInput
    //       ignoreFormik
    //       type="text"
    //       name="title"
    //       value={filters.title as string}
    //       onChange={(e) =>
    //         handleFilterChange(e as React.ChangeEvent<HTMLInputElement>)
    //       }
    //       placeholder="Search by Project Title"
    //     />
    //     {/* <TextInput
    //       ignoreFormik
    //       type="text"
    //       name="requirements"
    //       value={filters.requirements as string}
    //       onChange={(e) =>
    //         handleFilterChange(e as React.ChangeEvent<HTMLInputElement>)
    //       }
    //       placeholder="Search by Requirements"
    //     /> */}
    //     <SelectInput
    //       name="difficulty"
    //       value={filters.difficulty as string}
    //       onChange={handleFilterChange}
    //       options={difficultyOptions}
    //       className="px-4 py-2 border rounded"
    //       label={""}
    //     />
    //   </form>

    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {loading
    //       ? Array.from({ length: 6 }).map((_, idx) => (
    //           <div
    //             key={idx}
    //             className="bg-white rounded-lg shadow-md p-6 animate-pulse"
    //           >
    //             <div className="h-6 w-32 bg-blue-100 rounded mb-2" />
    //             <div className="h-4 w-full bg-gray-100 rounded mb-2" />
    //             <div className="h-4 w-3/4 bg-gray-100 rounded" />
    //           </div>
    //         ))
    //       : projects.map((project: IProject) => (
    //           <Link
    //             key={project._id}
    //             href={`/projects/${project._id}`}
    //             className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    //           >
    //             <div className="flex items-center justify-between mb-4">
    //               <h3 className="text-xl font-semibold text-blue-800">
    //                 {project.title}
    //               </h3>
    //               <span
    //                 className={`px-3 py-1 rounded-full text-sm ${
    //                   project.difficulty === "beginner"
    //                     ? "bg-blue-100 text-blue-800"
    //                     : project.difficulty === "intermediate"
    //                     ? "bg-purple-100 text-purple-800"
    //                     : "bg-orange-100 text-orange-800"
    //                 }`}
    //               >
    //                 {project.difficulty}
    //               </span>
    //             </div>
    //             <p className="text-gray-600 mb-4">{project.description}</p>
    //             <div className="flex gap-2 items-center flex-wrap">
    //               {project?.requirements?.map((r, i) => (
    //                 <p key={i} className="text-gray-600 capitalize text-sm">
    //                   {r}
    //                 </p>
    //               ))}
    //             </div>
    //           </Link>
    //         ))}
    //   </div>
    // </div>
    <div className="max-w-6xl mx-auto py-8 px-4 relative">

      <div className="text-center mb-10">
       <h1 className="text-4xl font-bold text-blue-900">
           Discover and Build Projects Easily
        </h1>
        <p className="text-gray-600 mt-2">
          Browse a collection of creative, beginner-to-advanced project ideas.
        </p>
      </div>

      <form onSubmit={handleFilterSubmit} 
      className="mb-8 flex md:flex-wrap gap-4 md:justify-center w-full"
        >
        <TextInput
          ignoreFormik
          type="text"
          name="title"
          value={filters.title as string}
          onChange={handleFilterChange as any}
          placeholder="Search By Project Title"
          className="w-1/3"
        />
        {/* <TextInput
        ignoreFormik
        type="text"
        name="requirements"
        value={filters.requirements as string}
        onChange={handleFilterChange}
        placeholder="Search By Project Requirements (comma separated)"
      /> */}
        <SelectInput
          label=""
          name="difficulty"
          value={filters.difficulty as string}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded w-1/3"
          options={difficultyOptions}
        />
        
      </form>
      <div className="md:text-center">
      <Button
          type="button"
        onClick={() => setShowChatModal(true)}
        className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full shadow hover:opacity-90"
      >
        Ask AI
      </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 animate-pulse"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 w-32 bg-blue-100 rounded mb-2" />
                  <div className="h-6 w-20 bg-blue-50 rounded" />
                </div>
                <div className="h-4 w-full bg-gray-100 rounded mb-2" />
                <div className="h-4 w-3/4 bg-gray-100 rounded" />
              </div>
            ))
          : projects.map((project: IProject) => (
              <Link
                key={project._id}
                href={`/projects/${project._id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-blue-800">
                    {project.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      project.difficulty === "beginner"
                        ? "bg-blue-100 text-blue-800"
                        : project.difficulty === "intermediate"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {project.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex gap-2 items-center flex-wrap">
                  {project?.requirements?.map((r, i) => (
                    <p key={i} className="text-gray-600 capitalize text-sm">
                      {r} |
                    </p>
                  ))}
                </div>
              </Link>
            ))}
      </div>

      {showChatModal && <ChatModal onClose={() => setShowChatModal(false)} />}
    </div>
  );
};
