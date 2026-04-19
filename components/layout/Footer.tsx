import { LeafIcon } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="h-[50px] px-8 flex justify-between items-center w-full">
      {/* Esquerda: Ícone + Copyright */}
      <div className="flex justify-start items-center gap-2">
        <LeafIcon size={16} color="#8b968c" />
        <div className="text-[#8b968c] text-[12px] font-normal leading-[18px]">
          © {currentYear} EcoFeira · Associação Agroecológica
        </div>
      </div>

      {/* Direita: Direitos Reservados */}
      <div className="text-[#8b968c] text-[11.20px] font-normal leading-[16.80px]">
        Todos os direitos reservados
      </div>
    </footer>
  );
}
