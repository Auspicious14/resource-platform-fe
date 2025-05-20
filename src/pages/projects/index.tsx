import { ProjectsPage } from "@/modules/projects/pages";
import React from "react";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const token = req.cookies?.token;
  if (!token) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
  return { props: {} };
};

const Projects = () => {
  return <ProjectsPage />;
};

export default Projects;
