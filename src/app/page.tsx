import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";
import { getUserSession } from "@/lib/get-user-session";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUserSession();

  if (user?.email) {
    redirect("/chat");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <AuthModal>
        <Button>open auth modal</Button>
      </AuthModal>
    </div>
  );
}
