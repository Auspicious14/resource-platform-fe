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
  if (!token) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  const response = await AxiosClient.get(`/projects/${params?._id}`);
  const data = response.data?.data;

  if (!data) {
    throw new Error("Project not found");
  }

  return { props: { _id: params?._id, project: data } };
};
