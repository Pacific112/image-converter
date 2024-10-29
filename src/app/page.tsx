import MainCard from "@/components/main-card";
import { serverClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await serverClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className="p-4">
      <MainCard></MainCard>
    </div>
  );
}
