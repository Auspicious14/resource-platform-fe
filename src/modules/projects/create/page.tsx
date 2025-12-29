"use client";
import { Formik, FieldArray } from "formik";
import { Button, SelectInput, TextInput } from "../../../components";
import * as Yup from "yup";
import React from "react";
import { useProjectState } from "../context";

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
  learningObjectives: Yup.array()
    .of(Yup.string().required("Objective can't be empty"))
    .min(1, "At least one learning objective is required"),
  resourceLinks: Yup.array().of(
    Yup.object().shape({
      type: Yup.string()
        .oneOf(["video", "article", "course"])
        .required("Type is required"),
      url: Yup.string().url("Invalid URL").required("Resource URL is required"),
      title: Yup.string().required("Resource title is required"),
    })
  ),
  milestones: Yup.array()
    .of(
      Yup.object().shape({
        title: Yup.string().required("Milestone title is required"),
        description: Yup.string().required("Milestone description is required"),
      })
    )
    .min(1, "At least one milestone is required"),
});

export default function CreateProjectPage() {
  const { createProject, isLoading } = useProjectState();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4 min-h-screen transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-3xl border border-gray-100 dark:border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Create New Project
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Fill in the details to add a new project to the library.
          </p>
        </div>

        <Formik
          initialValues={{
            title: "",
            description: "",
            difficultyLevel: "BEGINNER",
            coverImage: "",
            technologies: "",
            categories: "",
            estimatedTime: "",
            starterRepoUrl: "",
            learningObjectives: [""],
            resourceLinks: [
              {
                type: "video",
                url: "",
                title: "",
              },
            ],
            milestones: [
              {
                title: "",
                description: "",
              },
            ],
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            const formattedValues = {
              ...values,
              technologies: values.technologies.split(",").map((t) => t.trim()),
              categories: values.categories.split(",").map((c) => c.trim()),
            };
            createProject(formattedValues);
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
                  placeholder="e.g. E-commerce Dashboard"
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
                placeholder="A brief overview of the project..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Technologies (comma separated)"
                  name="technologies"
                  onChange={handleChange}
                  value={values.technologies}
                  placeholder="React, Tailwind, Node.js"
                />
                <TextInput
                  label="Categories (comma separated)"
                  name="categories"
                  onChange={handleChange}
                  value={values.categories}
                  placeholder="Frontend, Web App"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Estimated Time"
                  name="estimatedTime"
                  onChange={handleChange}
                  value={values.estimatedTime}
                  placeholder="e.g. 4-6 hours"
                />
                <TextInput
                  label="Starter Repo URL (Optional)"
                  name="starterRepoUrl"
                  onChange={handleChange}
                  value={values.starterRepoUrl}
                  placeholder="https://github.com/..."
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
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {typeof values.coverImage === "string"
                        ? "Current image URL"
                        : `Selected: ${values.coverImage}`}
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
                                <TrashIcon />
                              </button>
                            )}
                          </div>
                          <TextInput
                            label="Milestone Title"
                            name={`milestones.${index}.title`}
                            onChange={handleChange}
                            value={values.milestones[index].title}
                            placeholder="e.g. Set up Project Structure"
                          />
                          <TextInput
                            label="Milestone Description"
                            name={`milestones.${index}.description`}
                            type="textarea"
                            onChange={handleChange}
                            value={values.milestones[index].description}
                            placeholder="Detail what needs to be done..."
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => push({ title: "", description: "" })}
                        className="w-full border-dashed"
                      >
                        <PlusIcon /> Add Milestone
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
                            placeholder="What will builders learn?"
                          />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push("")}
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <PlusIcon /> Add Objective
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
                            placeholder="Tutorial Title"
                          />
                          <div className="flex gap-2 items-end">
                            <TextInput
                              name={`resourceLinks.${index}.url`}
                              label="URL"
                              onChange={handleChange}
                              value={resource.url}
                              placeholder="https://..."
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="mb-2 text-red-500 hover:text-red-700"
                            >
                              <TrashIcon />
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
                        <PlusIcon /> Add Resource
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/20"
                disabled={isLoading}
                isLoading={isLoading}
              >
                Launch Project
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);
