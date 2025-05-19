"use client";
import { Formik, FieldArray } from "formik";
import { Button, SelectInput, TextInput } from "../../../components";
import * as Yup from "yup";
import React from "react";
import { useAuth } from "../../auth/context";
import { useProjectState } from "../context";

const deficultyOptions = [
  { label: "easy", value: "easy" },
  { label: "medium", value: "medium" },
  { label: "hard", value: "hard" },
];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Project name is required"),
  description: Yup.string().required("Description is required"),
  requirements: Yup.array()
    .of(Yup.string().required("Requirement can't be empty"))
    .min(1, "At least one requirement is required"),
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
    <div className=" bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Create New Project
        </h1>
        <Formik
          initialValues={{
            title: "",
            description: "",
            difficulty: { label: "easy", value: "easy" },
            requirements: [""],
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            createProject({ ...values, difficulty: values.difficulty.value });
          }}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            setFieldValue,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Project Name"
                name="name"
                onChange={handleChange}
                placeholder="Enter project name"
              />
              <TextInput
                label="Description"
                name="description"
                type="textarea"
                onChange={handleChange}
                placeholder="Enter project description"
              />
              <SelectInput
                label="Difficulty"
                options={deficultyOptions}
                onChange={(e) => setFieldValue("difficulty", e.target.value)}
              />
              <FieldArray name="requirements">
                {({ push, remove }) => (
                  <div className="w-full">
                    {values.requirements.map((_, index) => (
                      <div
                        key={index}
                        className="flex gap-2 items-start w-full"
                      >
                        <TextInput
                          label={
                            index === 0
                              ? "Requirements"
                              : `Requirement ${index + 1}`
                          }
                          name={`requirements.${index}`}
                          onChange={handleChange}
                          value={values.requirements[index]}
                          placeholder="Enter project requirement"
                          // className="flex-1"
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="mt-6 p-2 text-red-500 hover:text-red-700"
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
              ;
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
