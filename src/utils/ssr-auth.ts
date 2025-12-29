import { GetServerSidePropsContext } from "next";

export const requireAuth = (context: GetServerSidePropsContext) => {
  const { req } = context;
  const token = req.cookies?.token;

  if (!token) {
    return {
      redirect: {
        destination: "/signin",
        permanent: false,
      },
    };
  }

  return { props: {}, token };
};

export const requireAdmin = (
  context: GetServerSidePropsContext,
  userRole?: string
) => {
  const auth = requireAuth(context);
  if ("redirect" in auth) return auth;

  if (userRole && !["ADMIN", "CONTRIBUTOR"].includes(userRole)) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return { props: {}, token: auth.token };
};
