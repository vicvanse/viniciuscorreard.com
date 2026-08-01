import { connection } from "next/server";
import { AdminPanel } from "@/components/admin/admin-panel";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { readSiteContent } from "@/lib/content-store";

export const metadata = {
  title: "Administração | Vinicius Correard",
  robots: { index: false, follow: false },
};

interface AdminPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  await connection();
  const params = await searchParams;
  const [content, authenticated] = await Promise.all([
    readSiteContent(),
    isAdminAuthenticated(),
  ]);

  return (
    <main className="atmosphere min-h-screen px-5 py-12 sm:px-8 sm:py-16">
      <AdminPanel
        initialContent={content}
        initiallyAuthenticated={authenticated}
        queryError={params.error ?? null}
      />
    </main>
  );
}
