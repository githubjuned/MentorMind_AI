import type { Metadata } from "next";
import MaterialViewer from "@/screens/materials/MaterialViewer";

export const metadata: Metadata = { title: "Document viewer" };

export function generateStaticParams() {
  return [
    { id: "mat-1" },
    { id: "mat-2" },
    { id: "mat-3" },
  ];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MaterialViewer id={id} />;
}
