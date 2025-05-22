import { ProjectsPage } from "@/modules/projects/pages";
import React, { useEffect } from "react";
import { GetServerSideProps } from "next";
import { AxiosClient } from "@/components";
import { IProject } from "@/modules/projects/model";
import { useProjectState } from "@/modules/projects/context";

const Projects = ({ projects }: { projects: IProject[] }) => {
  const { setProjects } = useProjectState();

  useEffect(() => {
    if (projects) setProjects(projects);
  }, [projects]);

  return <ProjectsPage />;
};

export default Projects;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, query } = context;
  const token = req.cookies?.token;
  if (!token) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
  const params = new URLSearchParams();
  if (query.difficulty) params.append("difficulty", String(query.difficulty));
  if (query.title) params.append("title", String(query.title));
  if (query.description)
    params.append("description", String(query.description));
  if (query.requirements)
    params.append("requirements", String(query.requirements));
  const url = `/projects${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await AxiosClient.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data?.data;

  if (!data) {
    throw new Error("Project not found");
  }
  return { props: { projects: data } };
};
