"use client";
import { Formik } from "formik";
import { useAuth } from "../context";
import { Button, TextInput } from "../../../components";
import Link from "next/link";
import * as Yup from "yup";
import toast from "react-hot-toast";
import React from "react";

export default function SignUpPage() {
  const { signUp, isLoading } = useAuth();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(8, "Too short!").required("Required"),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Create Account
        </h1>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            signUp(values, actions).catch(() => {
              toast.error("Signup failed");
            });
          }}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="First Name"
                name="firstName"
                type="text"
                onChange={handleChange}
                value={values.firstName}
                placeholder="Enter your email"
              />
              <TextInput
                label="Last Name"
                name="lastName"
                type="text"
                onChange={handleChange}
                value={values.lastName}
                placeholder="Enter your email"
              />

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
                Sign Up
              </Button>
            </form>
          )}
        </Formik>
        <p className="text-center mt-4 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-primary dark:text-blue-400 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
