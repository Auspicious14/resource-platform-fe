import React from "react";
import { useRouter } from "next/router";
import { ProfilePage } from "@/modules/profile/page";

const UserProfile = () => {
  const router = useRouter();
  const { username } = router.query;

  return (
      <ProfilePage username={username as string} />
  );
};

export default UserProfile;
