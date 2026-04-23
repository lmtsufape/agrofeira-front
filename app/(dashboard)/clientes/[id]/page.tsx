import { ClienteEdit } from "@/features/clientes/components/ClienteEdit";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarClientePage({ params }: PageProps) {
  const { id } = await params;

  return <ClienteEdit clienteId={id} />;
}
