"use client";

import { useRouter } from "next/navigation";

/**
 * Botón "Volver" de la política de privacidad: regresa a la página anterior
 * (history.back, que además restaura el scroll) o a inicio si no hay historial.
 */
export default function VolverButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push("/");
      }}
      className="mt-12 inline-flex h-[56px] items-center gap-3 rounded-[14px] bg-[#0bcadf] px-7 text-[16px] font-semibold text-[#03081e] transition-colors duration-300 hover:bg-[#22d9f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0bcadf] md:h-[64px] md:px-9 md:text-[18px]"
    >
      <svg viewBox="0 0 16 12" className="h-3 w-4" fill="none" aria-hidden="true">
        <path
          d="M15 6H1M6 1L1 6l5 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Volver
    </button>
  );
}
