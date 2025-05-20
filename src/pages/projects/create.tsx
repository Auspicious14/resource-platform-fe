import CreateProjectPage from "@/modules/projects/create/page";
import React from "react";
import { GetServerSideProps } from "next";

const CreateProject = () => {
  return <CreateProjectPage />;
};

export default CreateProject;

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
