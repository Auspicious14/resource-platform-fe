import React from "react";
import { useRouter } from "next/router";
import { ProfilePage } from "@/modules/profile/page";
import Layout from "@/modules/layout";

const UserProfile = () => {
  const router = useRouter();
  const { username } = router.query;

  return (
    <Layout>
      <ProfilePage username={username as string} />
    </Layout>
  );
};

export default UserProfile;
