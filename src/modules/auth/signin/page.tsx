"use client";
import { Formik } from "formik";
import { useAuth } from "../context";
import { Button, TextInput } from "../../../components";
import Link from "next/link";
import * as Yup from "yup";
import toast from "react-hot-toast";
import React from "react";

export default function SignInPage() {
  const { signIn, isLoading } = useAuth();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
  });

  return (
    <div className="min-h-full  flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Welcome Back
        </h1>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            signIn(values, actions).catch(() => {
              toast.error("Sign in failed");
            });
          }}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                value={values.email}
                placeholder="Enter your email"
              />
              <TextInput
                label="Password"
                name="password"
                type="password"
                onChange={handleChange}
                value={values.password}
                placeholder="••••••••"
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>
          )}
        </Formik>
        <div className="mt-4 space-y-2 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-primary dark:text-blue-400 hover:underline"
          >
            Forgot password?
          </Link>
          <p className="text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-primary dark:text-blue-400 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
