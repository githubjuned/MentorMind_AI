import type { Metadata } from "next";
import MaterialViewer from "@/screens/materials/MaterialViewer";

export const metadata: Metadata = { title: "Document viewer" };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MaterialViewer id={id} />;
}
