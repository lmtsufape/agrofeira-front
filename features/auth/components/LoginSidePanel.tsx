"use client";

export function LoginSidePanel() {
  return (
    <div className="hidden md:flex md:flex-1 relative items-end p-12 bg-gradient-to-br from-[#0f2d1a] via-[#1a4731] to-[#2d7a4f] overflow-hidden">
      {/* Imagem de fundo */}
      <div className="absolute inset-0 opacity-25 bg-cover bg-center transition-transform duration-10000 hover:scale-110 bg-[url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=80')]" />
      <div className="relative z-10 text-white max-w-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-0.5 bg-[#5eba85]" />
          <span className="text-xs font-semibold tracking-widest text-[#a7f3c8]">
            BEM-VINDO À
          </span>
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-8">
          Plataforma <span className="text-[#5eba85]">EcoFeira</span>
        </h1>
        <blockquote className="bg-white/10 border border-white/15 rounded-xl px-6 py-5 text-[#d1fae5] italic text-sm leading-relaxed backdrop-blur-sm">
          &quot;Fortalecendo os processos de comercialização e geração de renda
          a partir de produtos agroecológicos.&quot;
        </blockquote>
      </div>
    </div>
  );
}
