import { authOptions } from "@/constants/auth-options";
import { getServerSession } from "next-auth";

export const getUserSession = async () => {
  const user = await getServerSession(authOptions);
  return user?.user ?? null;
};
