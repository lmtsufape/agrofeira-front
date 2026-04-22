import { ComercianteDetails } from "@/features/comerciantes/components/ComercianteDetails";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ComercianteDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return <ComercianteDetails comercianteId={id} />;
}
