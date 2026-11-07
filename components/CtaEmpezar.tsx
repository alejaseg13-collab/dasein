import Image from "next/image";
import Link from "next/link";

/**
 * Cierre de las páginas de caso: "¿Listo para empezar?" sobre el mismo fondo
 * plano #0B0D13 (mano1.png comparte ese color por lo que no se ve ningún borde).
 * El botón lleva al formulario de contacto de la portada (#contacto).
 */
export default function CtaEmpezar() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 px-6 pt-14 pb-10 md:px-[5.5%] md:pt-20 md:pb-24 md:max-w-[54%]">
        <h2 className="text-[40px] font-light leading-[1.06] text-white md:text-[clamp(50px,4.6vw,66px)]">
          <span className="block">¿Listo para</span>
          <span className="block font-daisy italic">empezar?</span>
        </h2>

        <div className="mt-6 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border border-white/80"
          >
            <span className="h-[3px] w-[3px] rounded-full bg-white" />
          </span>
          <span className="text-[12px] font-medium uppercase leading-none tracking-[0.2em] text-white md:text-[13px]">
            Deja tus datos y trabajemos juntos
          </span>
        </div>

        <Link
          href="/#contacto"
          className="mt-7 inline-flex h-[42px] items-center rounded-[6px] bg-[#0bcadf] px-6 text-[14px] font-medium text-[#03081e] transition-colors duration-300 hover:bg-[#22d9f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0bcadf]"
        >
          Empezar
        </Link>
      </div>

      {/* Móvil/tablet: la mano completa debajo del texto. */}
      <Image
        src="/images/mano1.png"
        alt=""
        width={860}
        height={539}
        unoptimized
        className="mx-auto block h-auto w-full max-w-[420px] md:hidden"
      />

      {/* Desktop: la mano grande a la derecha; el borde superior va difuminado
          para que el haz entre suave y sin corte. */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block [mask-image:linear-gradient(to_bottom,transparent_0,black_56px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_56px)]">
        <Image
          src="/images/mano1.png"
          alt=""
          width={860}
          height={539}
          unoptimized
          className="absolute right-[6%] top-0 h-auto w-[52%] max-w-[660px]"
        />
      </div>
    </section>
  );
}
