"use client";
import { Formik } from "formik";
import { useAuth } from "../context";
import { Button, TextInput } from "../../../components";
import Link from "next/link";
import * as Yup from "yup";
import toast from "react-hot-toast";
import React from "react";

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Reset Password
        </h1>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            forgotPassword(values.email).finally(() => setSubmitting(false));
          }}
        >
          {({
            handleSubmit,
            handleChange,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                value={values.email}
                placeholder="Enter your registered email"
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading || isSubmitting}
                isLoading={isLoading || isSubmitting}
              >
                Reset Password
              </Button>
            </form>
          )}
        </Formik>
        <div className="mt-4 text-center">
          <Link
            href="/signin"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
