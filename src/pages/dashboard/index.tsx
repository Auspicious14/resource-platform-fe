import { DashboardPage } from "@/modules/dashboard/page";
import { requireAuth } from "@/utils/ssr-auth";
import { GetServerSideProps } from "next";

export default function Dashboard() {
  return <DashboardPage />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = requireAuth(context);
  if ("redirect" in auth) return auth;

  return { props: {} };
};
