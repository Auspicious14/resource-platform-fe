import { notFound } from "next/navigation";
import { GetServerSideProps } from "next";
import React from "react";
import { ProjectDetailPage } from "@/modules/projects/detail";
import { IProject } from "@/modules/projects/model";
import { AxiosClient } from "@/components";

export default function ProjectDetail({
  _id,
  project,
}: {
  _id: string;
  project: IProject;
}) {
  if (!project) return notFound();

  return <ProjectDetailPage project={project} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params } = context;
  const token = req.cookies?.token;

  const config = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

  try {
    const response = await AxiosClient.get(`/projects/${params?._id}`, config);
    const data = response.data?.data;

    if (!data) {
      return { notFound: true };
    }

    return { props: { _id: params?._id, project: data } };
  } catch (error) {
    return { notFound: true };
  }
};
