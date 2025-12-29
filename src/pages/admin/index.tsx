import { requireAdmin } from "@/utils/ssr-auth";
import { GetServerSideProps } from "next";
import { AxiosClient } from "@/components";
import { AdminDashboard } from "@/modules/admin/dashboard";

export default function Admin() {
  return <AdminDashboard />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = requireAdmin(context);
  if ("redirect" in auth) return auth;

  try {
    const response = await AxiosClient.get("/auth/me", {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    const user = response.data?.data;

    if (!["ADMIN", "CONTRIBUTOR"].includes(user?.role)) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return { props: { user } };
  } catch (error) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }
};
