"use client";
import React, { useEffect } from "react";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { X, Plus, Trash2 } from "lucide-react";
import { Button, SelectInput, TextInput } from "@/components";
import { useProjectState } from "@/modules/projects/context";
import { IProject } from "@/modules/projects/model";

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: IProject | null;
}

const difficultyOptions = [
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
];

const resourceTypeOptions = [
  { label: "Video", value: "video" },
  { label: "Article", value: "article" },
  { label: "Course", value: "course" },
];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Project title is required"),
  difficultyLevel: Yup.string()
    .oneOf(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
    .required("Difficulty is required"),
  description: Yup.string().required("Description is required"),
  coverImage: Yup.mixed().nullable(),
  technologies: Yup.string().required("Technologies are required"),
  categories: Yup.string().required("Categories are required"),
  estimatedTime: Yup.string().required("Estimated time is required"),
});

export const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { updateProject, isLoading } = useProjectState();

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800">
        <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Project
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-8">
          <Formik
            initialValues={{
              title: project.title,
              description: project.description,
              difficultyLevel: project.difficultyLevel,
              coverImage: project.coverImage || "",
              technologies: project.technologies?.join(", ") || "",
              categories: project.categories?.join(", ") || "",
              estimatedTime: project.estimatedTime || "",
              starterRepoUrl: project.starterRepoUrl || "",
              learningObjectives: project.learningObjectives?.length
                ? project.learningObjectives
                : [""],
              resourceLinks: project.resourceLinks?.length
                ? project.resourceLinks
                : [{ type: "video", url: "", title: "" }],
              milestones: project.milestones?.length
                ? project.milestones
                : [{ title: "", description: "" }],
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              const formattedValues = {
                ...values,
                technologies: values.technologies
                  .split(",")
                  .map((t) => t.trim()),
                categories: values.categories.split(",").map((c) => c.trim()),
              };
              await updateProject(project.id, formattedValues);
              onClose();
            }}
          >
            {({ handleSubmit, handleChange, values, setFieldValue }) => (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    label="Project Title"
                    name="title"
                    onChange={handleChange}
                    value={values.title}
                  />
                  <SelectInput
                    label="Difficulty"
                    name="difficultyLevel"
                    options={difficultyOptions}
                    value={values.difficultyLevel}
                    onChange={({ target }) =>
                      setFieldValue("difficultyLevel", target.value)
                    }
                  />
                </div>

                <TextInput
                  label="Description"
                  name="description"
                  type="textarea"
                  onChange={handleChange}
                  value={values.description}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    label="Technologies (comma separated)"
                    name="technologies"
                    onChange={handleChange}
                    value={values.technologies}
                  />
                  <TextInput
                    label="Categories (comma separated)"
                    name="categories"
                    onChange={handleChange}
                    value={values.categories}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    label="Estimated Time"
                    name="estimatedTime"
                    onChange={handleChange}
                    value={values.estimatedTime}
                  />
                  <TextInput
                    label="Starter Repo URL"
                    name="starterRepoUrl"
                    onChange={handleChange}
                    value={values.starterRepoUrl}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Cover Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG or WEBP (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(event) => {
                          setFieldValue(
                            "coverImage",
                            event.currentTarget.files?.[0]
                          );
                        }}
                      />
                    </label>
                  </div>
                  {values.coverImage && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium truncate max-w-xs">
                        {typeof values.coverImage === "string"
                          ? "Current image URL"
                          : `Selected: ${values.coverImage.name}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFieldValue("coverImage", "")}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Milestones */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Milestones
                  </label>
                  <FieldArray name="milestones">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.milestones.map((_, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-4"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                                Milestone #{index + 1}
                              </span>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                            <TextInput
                              label="Milestone Title"
                              name={`milestones.${index}.title`}
                              onChange={handleChange}
                              value={values.milestones[index].title}
                            />
                            <TextInput
                              label="Milestone Description"
                              name={`milestones.${index}.description`}
                              type="textarea"
                              onChange={handleChange}
                              value={values.milestones[index].description}
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => push({ title: "", description: "" })}
                          className="w-full border-dashed"
                        >
                          <Plus size={16} className="mr-2" /> Add Milestone
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Learning Objectives */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Learning Objectives
                  </label>
                  <FieldArray name="learningObjectives">
                    {({ push, remove }) => (
                      <div className="space-y-2">
                        {values.learningObjectives.map((_, index) => (
                          <div key={index} className="flex gap-2">
                            <TextInput
                              name={`learningObjectives.${index}`}
                              onChange={handleChange}
                              value={values.learningObjectives[index]}
                            />
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push("")}
                          className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Objective
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Resource Links */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Resource Links
                  </label>
                  <FieldArray name="resourceLinks">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.resourceLinks.map((resource: any, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30"
                          >
                            <SelectInput
                              name={`resourceLinks.${index}.type`}
                              label="Type"
                              options={resourceTypeOptions}
                              value={resource.type}
                              onChange={({ target }) =>
                                setFieldValue(
                                  `resourceLinks.${index}.type`,
                                  target.value
                                )
                              }
                            />
                            <TextInput
                              name={`resourceLinks.${index}.title`}
                              label="Title"
                              onChange={handleChange}
                              value={resource.title}
                            />
                            <div className="flex gap-2 items-end">
                              <TextInput
                                name={`resourceLinks.${index}.url`}
                                label="URL"
                                onChange={handleChange}
                                value={resource.url}
                              />
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="mb-2 text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() =>
                            push({
                              type: "video",
                              url: "",
                              title: "",
                            })
                          }
                          className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Plus size={14} /> Add Resource
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Save Changes
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
