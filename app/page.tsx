import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("agrofeira_token")?.value;

  if (token) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  // Este componente nunca será renderizado devido aos redirects acima
  return null;
}
