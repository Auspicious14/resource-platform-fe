import { AxiosClient } from "@/components";
import { HomePage } from "@/modules/home/page";
import { useProjectState } from "@/modules/projects/context";
import { IProject } from "@/modules/projects/model";
import { GetServerSideProps } from "next";
import { useEffect } from "react";

export default function Home({ projects }: { projects: IProject[] }) {
  const { setFeaturedProjects } = useProjectState();

  useEffect(() => {
    if (projects) setFeaturedProjects(projects);
  }, [projects]);

  return <HomePage />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;

  const response = await AxiosClient.get(`/projects/featured`);
  const data = response.data?.data;

  if (!data) {
    throw new Error("Project not found");
  }
  return { props: { projects: data } };
};
