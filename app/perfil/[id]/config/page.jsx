
import Header from "@/app/components/Header";
import { notFound } from "next/navigation";
import ConfigForm from "./ConfigForm";

async function getUserData(id) {
  const res = await fetch(`http://localhost:3000/api/users/${id}`,
  { cache: 'no-store' });
  if (!res.ok) {
    return notFound();
  }
  return res.json();
}

export default async function ConfigPage({ params }) {
    const id = params.id;
    const { user } = await getUserData(id);

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header />
            <main className="container mx-auto p-4 md:p-8 max-w-2xl">
                <ConfigForm user={user} />
            </main>
        </div>
    );
}
