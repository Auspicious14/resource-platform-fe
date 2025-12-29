"use client";
import React, { useEffect } from "react";
import { X, Plus, Trash2, Upload } from "lucide-react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  TextInput,
  SelectInput,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components";
import { useProfile } from "./context";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  bio: Yup.string().max(200, "Bio must be at most 200 characters"),
  skillLevel: Yup.string().required("Skill level is required"),
  //   avatarUrl: Yup.string().url("Invalid URL"),
  portfolioLinks: Yup.array().of(Yup.string().url("Invalid URL")),
});

const skillLevelOptions = [
  { label: "Beginner", value: "BEGINNER" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { profile, updateProfile, isLoading } = useProfile();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const initialValues = {
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: profile?.email || "",
    bio: profile?.bio || "",
    skillLevel: profile?.skillLevel || "BEGINNER",
    avatarUrl: profile?.avatarUrl || "",
    portfolioLinks: profile?.portfolioLinks || [],
  };

  const handleSubmit = async (values: any) => {
    const success = await updateProfile(values);
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl"
          >
            <Card className="border-none shadow-none">
              <CardHeader className="flex flex-row items-center justify-between border-b dark:border-gray-800 pb-4">
                <CardTitle className="text-2xl font-bold">
                  Edit Profile
                </CardTitle>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </CardHeader>
              <CardContent className="p-6">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, values, setFieldValue }) => (
                    <Form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput
                          name="firstName"
                          label="First Name"
                          placeholder="Enter your first name"
                          // error={touched.firstName ? errors.firstName : ""}
                        />
                        <TextInput
                          name="lastName"
                          label="Last Name"
                          placeholder="Enter your last name"
                          // error={touched.lastName ? errors.lastName : ""}
                        />
                      </div>

                      <TextInput
                        name="email"
                        label="Email Address"
                        placeholder="email@example.com"
                        //   error={touched.email ? errors.email : ""}
                      />

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={values.bio}
                          onChange={(e) => setFieldValue("bio", e.target.value)}
                          placeholder="Tell us about yourself..."
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none h-32"
                        />
                        {touched.bio && errors.bio && (
                          <div className="text-red-500 text-xs font-bold mt-1">
                            {errors.bio as any}
                          </div>
                        )}
                      </div>

                      <SelectInput
                        name="skillLevel"
                        label="Skill Level"
                        options={skillLevelOptions}
                      />

                      <div className="space-y-4 pt-2">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          Avatar Settings
                        </label>
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border dark:border-gray-700">
                            <img
                              src={
                                values.avatarUrl ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${values.firstName}`
                              }
                              alt="Avatar Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2 w-full">
                            <TextInput
                              name="avatarUrl"
                              placeholder="https://example.com/avatar.jpg"
                              className="w-full"
                            />
                            <div className="relative">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="avatar-upload"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setFieldValue("avatarUrl", reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              <label
                                htmlFor="avatar-upload"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-bold cursor-pointer transition-colors"
                              >
                                <Upload size={16} />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            Portfolio & Social Links
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 rounded-lg text-xs"
                            onClick={() => {
                              const newLinks = [...values.portfolioLinks, ""];
                              setFieldValue("portfolioLinks", newLinks);
                            }}
                          >
                            <Plus size={14} />
                          </Button>
                        </div>

                        <FieldArray name="portfolioLinks">
                          {({ remove }) => (
                            <div className="space-y-3">
                              {values.portfolioLinks.map(
                                (link: string, index: number) => (
                                  <div
                                    key={index}
                                    className="flex gap-2 items-center"
                                  >
                                    <div className="flex-1">
                                      <TextInput
                                        name={`portfolioLinks.${index}`}
                                        placeholder="https://github.com/your-username"
                                      />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="transparent"
                                      className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl shrink-0"
                                      onClick={() => remove(index)}
                                    >
                                      <Trash2 size={18} />
                                    </Button>
                                  </div>
                                )
                              )}
                              {values.portfolioLinks.length === 0 && (
                                <div className="text-sm text-gray-400 italic py-2">
                                  No portfolio links added yet.
                                </div>
                              )}
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={onClose}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          isLoading={isLoading}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
