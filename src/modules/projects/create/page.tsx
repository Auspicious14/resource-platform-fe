"use client";
import { Formik, FieldArray } from "formik";
import { Button, SelectInput, TextInput } from "../../../components";
import * as Yup from "yup";
import React from "react";
import { useAuth } from "../../auth/context";
import { useProjectState } from "../context";

const difficultyOptions = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const resourceTypeOptions = [
  { label: "Video", value: "video" },
  { label: "Article", value: "article" },
  { label: "Course", value: "course" },
];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Project title is required"),
  difficulty: Yup.object({
    label: Yup.string().required(),
    value: Yup.string()
      .oneOf(["beginner", "intermediate", "advanced"])
      .required("Difficulty is required"),
  }).required(),
  description: Yup.string().required("Description is required"),
  requirements: Yup.array()
    .of(Yup.string().required("Requirement can't be empty"))
    .min(1, "At least one requirement is required"),
  resources: Yup.array().of(
    Yup.object().shape({
      type: Yup.object({
        label: Yup.string().required(),
        value: Yup.string()
          .oneOf(["video", "article", "course"])
          .required("Type is required"),
      }).required(),
      url: Yup.string().url("Invalid URL").required("Resource URL is required"),
      title: Yup.string().required("Resource title is required"),
    })
  ),
});

export default function CreateProjectPage() {
  // const {} = useAuth();
  // if (!isAuthenticated) {
  //   return (
  //     <div className="max-w-2xl mx-auto py-16 px-4 text-center">
  //       <h2 className="text-2xl font-bold text-blue-900 mb-4">
  //         Please log in to create a project.
  //       </h2>
  //       <a href="/login" className="text-blue-600 hover:underline">
  //         Go to Login
  //       </a>
  //     </div>
  //   );
  // }
  const { createProject, updateProject, isLoading } = useProjectState();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Create New Project
        </h1>
        <Formik
          initialValues={{
            title: "",
            description: "",
            difficulty: difficultyOptions[0],
            requirements: [""],
            resources: [],
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            createProject({
              ...values,
              difficulty: values.difficulty.value,
              resources: values.resources.map((r: any) => ({
                ...r,
                type: r.type.value,
              })),
            });
          }}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            setFieldValue,
            isSubmitting,
            errors,
            touched,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-6">
              <TextInput
                label="Project Title"
                name="title"
                onChange={handleChange}
                value={values.title}
                placeholder="Enter project title"
              />
              <TextInput
                label="Description"
                name="description"
                type="textarea"
                onChange={handleChange}
                value={values.description}
                placeholder="Enter project description"
              />
              <SelectInput
                label="Difficulty"
                name="difficulty"
                options={difficultyOptions}
                value={values.difficulty.value}
                onChange={(option) => setFieldValue("difficulty", option)}
              />
              <FieldArray name="requirements">
                {({ push, remove }) => (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Requirements
                    </label>
                    {values.requirements.map((_, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-start w-full mb-2"
                      >
                        <TextInput
                          name={`requirements.${index}`}
                          onChange={handleChange}
                          value={values.requirements[index]}
                          placeholder="Enter project requirement"
                          label={""}
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="mt-2 p-2 text-red-500 hover:text-red-700"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push("")}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <PlusIcon />
                      Add Requirement
                    </button>
                  </div>
                )}
              </FieldArray>
              <FieldArray name="resources">
                {({ push, remove }) => (
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Resources
                    </label>
                    {values.resources.map((resource: any, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row gap-2 items-start w-full mb-2"
                      >
                        <SelectInput
                          name={`resources.${index}.type`}
                          label="Type"
                          options={resourceTypeOptions}
                          value={resource.type}
                          onChange={(option) =>
                            setFieldValue(`resources.${index}.type`, option)
                          }
                        />
                        <TextInput
                          name={`resources.${index}.title`}
                          label="Title"
                          onChange={handleChange}
                          value={resource.title}
                          placeholder="Resource title"
                        />
                        <TextInput
                          name={`resources.${index}.url`}
                          label="URL"
                          onChange={handleChange}
                          value={resource.url}
                          placeholder="Resource URL"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-6 p-2 text-red-500 hover:text-red-700"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          type: resourceTypeOptions[0],
                          url: "",
                          title: "",
                        })
                      }
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <PlusIcon />
                      Add Resource
                    </button>
                  </div>
                )}
              </FieldArray>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
                isLoading={isLoading}
              >
                Create Project
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
    className="h-5 w-5"
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
    className="h-5 w-5"
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
