"use client";
import { Formik, FieldArray, FormikHelpers } from "formik";
import { Button, SelectInput, TextInput } from "../../../components";
import * as Yup from "yup";
import React from "react";
import { useProjectState } from "../context";
import { IProject } from "../model";
import { Trash2 as TrashIcon, Plus as PlusIcon } from "lucide-react";

const difficultyOptions = [
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
];

const difficultyModeOptions = [
  { label: "Guided", value: "GUIDED" },
  { label: "Standard", value: "STANDARD" },
  { label: "Hardcore", value: "HARDCORE" },
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
  difficultyModes: Yup.array()
    .of(Yup.string())
    .min(1, "Select at least one difficulty mode"),
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
        hints: Yup.object().shape({
          GUIDED: Yup.array().of(Yup.string()),
          STANDARD: Yup.array().of(Yup.string()),
          HARDCORE: Yup.array().of(Yup.string()),
        }),
        validationCriteria: Yup.string(),
      })
    )
    .min(1, "At least one milestone is required"),
});

interface ProjectFormProps {
  initialData?: IProject;
  onSuccess?: () => void;
  title?: string;
}

export function ProjectForm({
  initialData,
  onSuccess,
  title: formTitle,
}: ProjectFormProps) {
  const { createProject, updateProject } = useProjectState();
  const [isLoading, setIsLoading] = React.useState(false);

  const initialValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    difficultyLevel: initialData?.difficultyLevel || "BEGINNER",
    coverImage: initialData?.coverImage || "",
    technologies: initialData?.technologies?.join(", ") || "",
    categories: initialData?.categories?.join(", ") || "",
    estimatedTime: initialData?.estimatedTime || "",
    starterRepoUrl: initialData?.starterRepoUrl || "",
    difficultyModes: initialData?.difficultyModes || [
      "GUIDED",
      "STANDARD",
      "HARDCORE",
    ],
    learningObjectives: initialData?.learningObjectives?.length
      ? initialData.learningObjectives
      : [""],
    resourceLinks: initialData?.resourceLinks?.length
      ? initialData.resourceLinks
      : [{ type: "video", url: "", title: "" }],
    milestones: initialData?.milestones?.length
      ? initialData.milestones.map((m) => ({
          title: m.title,
          description: m.description,
          hints: {
            GUIDED: Array.isArray(m.hints)
              ? m.hints
              : (m.hints as any)?.GUIDED || [""],
            STANDARD: (m.hints as any)?.STANDARD || [""],
            HARDCORE: (m.hints as any)?.HARDCORE || [""],
          },
          validationCriteria: m.validationCriteria || "",
        }))
      : [
          {
            title: "",
            description: "",
            hints: { GUIDED: [""], STANDARD: [""], HARDCORE: [""] },
            validationCriteria: "",
          },
        ],
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    setIsLoading(true);
    try {
      // Process values for submission
      const processedValues = {
        ...values,
        technologies: values.technologies
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean),
        categories: values.categories
          .split(",")
          .map((c: string) => c.trim())
          .filter(Boolean),
        learningObjectives: values.learningObjectives.filter(Boolean),
        milestones: values.milestones.map((m: any) => ({
          ...m,
          hints: {
            GUIDED: m.hints.GUIDED.filter(Boolean),
            STANDARD: m.hints.STANDARD.filter(Boolean),
            HARDCORE: m.hints.HARDCORE.filter(Boolean),
          },
        })),
      };

      if (initialData?.id) {
        await updateProject(initialData.id, processedValues);
      } else {
        await createProject(processedValues);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
            {initialData ? "Edit Project" : "Create New Project"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {initialData
              ? "Update the project details"
              : "Add a new learning project to the platform"}
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            handleSubmit,
            handleChange,
            values,
            setFieldValue,
            errors,
            touched,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    label="Project Title"
                    name="title"
                    onChange={handleChange}
                    value={values.title}
                    placeholder="e.g. E-commerce Dashboard"
                  />
                  {errors.title && touched.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}

                  <SelectInput
                    label="Difficulty"
                    name="difficultyLevel"
                    options={difficultyOptions}
                    value={values.difficultyLevel}
                    onChange={({ target }: any) =>
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
                {errors.description && touched.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>

              {/* Project Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2">
                  Project Details
                </h2>

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

                {/* Difficulty Modes */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Available Difficulty Modes
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {difficultyModeOptions.map((mode) => (
                      <label
                        key={mode.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={values.difficultyModes.includes(
                            mode.value as any
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFieldValue("difficultyModes", [
                                ...values.difficultyModes,
                                mode.value,
                              ]);
                            } else {
                              setFieldValue(
                                "difficultyModes",
                                values.difficultyModes.filter(
                                  (m) => m !== mode.value
                                )
                              );
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {mode.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Cover Image
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0];
                          if (file) {
                            setFieldValue("coverImage", file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {values.coverImage && (
                    <div className="mt-2 flex items-center gap-4">
                      <div className="relative w-24 h-16 rounded-lg overflow-hidden border">
                        <img
                          src={
                            values.coverImage instanceof File
                              ? URL.createObjectURL(values.coverImage)
                              : values.coverImage
                          }
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFieldValue("coverImage", "")}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Milestones with Hints */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2">
                  Project Milestones
                </h2>
                <FieldArray name="milestones">
                  {({ push, remove }) => (
                    <div className="space-y-6">
                      {values.milestones.map((milestone, index) => (
                        <div
                          key={index}
                          className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 space-y-4"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase">
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
                            value={milestone.title}
                            placeholder="e.g. Set up Project Structure"
                          />

                          <TextInput
                            label="Milestone Description"
                            name={`milestones.${index}.description`}
                            type="textarea"
                            onChange={handleChange}
                            value={milestone.description}
                            placeholder="Detail what needs to be done..."
                          />

                          <TextInput
                            label="Validation Criteria (Optional)"
                            name={`milestones.${index}.validationCriteria`}
                            type="textarea"
                            onChange={handleChange}
                            value={milestone.validationCriteria}
                            placeholder="e.g. All components are properly structured, Routes are configured..."
                          />

                          {/* Hints per Difficulty Mode */}
                          <div className="space-y-4 mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg">
                            <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300">
                              Progressive Hints (by Difficulty Mode)
                            </h4>

                            {["GUIDED", "STANDARD", "HARDCORE"].map((mode) => (
                              <div key={mode} className="space-y-2">
                                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">
                                  {mode} Mode Hints
                                </label>
                                <FieldArray
                                  name={`milestones.${index}.hints.${mode}`}
                                >
                                  {({ push: pushHint, remove: removeHint }) => (
                                    <div className="space-y-2">
                                      {milestone.hints[
                                        mode as keyof typeof milestone.hints
                                      ]?.map(
                                        (hint: string, hintIdx: number) => (
                                          <div
                                            key={hintIdx}
                                            className="flex gap-2"
                                          >
                                            <input
                                              type="text"
                                              name={`milestones.${index}.hints.${mode}.${hintIdx}`}
                                              value={hint}
                                              onChange={handleChange}
                                              placeholder={`Hint ${
                                                hintIdx + 1
                                              }`}
                                              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
                                            />
                                            {hintIdx > 0 && (
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  removeHint(hintIdx)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                              >
                                                <TrashIcon />
                                              </button>
                                            )}
                                          </div>
                                        )
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => pushHint("")}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                      >
                                        + Add Hint
                                      </button>
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={() =>
                          push({
                            title: "",
                            description: "",
                            hints: {
                              GUIDED: [""],
                              STANDARD: [""],
                              HARDCORE: [""],
                            },
                            validationCriteria: "",
                          })
                        }
                        className="w-full border-2 "
                      >
                        <PlusIcon className="w-4 h-4 mr-2" /> Add Milestone
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Learning Objectives */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2">
                  Learning Objectives
                </h2>
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
                        <PlusIcon className="w-4 h-4 mr-1" /> Add Objective
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Resource Links */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2">
                  Resource Links
                </h2>
                <FieldArray name="resourceLinks">
                  {({ push, remove }) => (
                    <div className="space-y-4">
                      {values.resourceLinks.map((resource: any, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30"
                        >
                          <SelectInput
                            name={`resourceLinks.${index}.type`}
                            label="Type"
                            options={resourceTypeOptions}
                            value={resource.type}
                            onChange={({ target }: any) =>
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
                        <PlusIcon className="w-4 h-4 mr-1" /> Add Resource
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl shadow-lg"
                disabled={isLoading}
              >
                {isLoading
                  ? initialData
                    ? "Updating..."
                    : "Creating..."
                  : initialData
                  ? "Update Project"
                  : "Launch Project"}
              </Button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
