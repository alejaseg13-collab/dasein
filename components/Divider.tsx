/**
 * Separador (sección 4).
 * El isotipo no existe suelto en /public/logo: se usan los mismos rects del
 * marca de cruz de "Logo Dasein vertical studio.svg" (sin inventar nada).
 */
const ISOTIPO_PATHS = [
  { x: 149.32, y: 20.45, w: 20.08, h: 20.07 },
  { x: 189.47, y: 0.38, w: 20.08, h: 40.14 },
  { x: 229.62, y: 20.45, w: 20.07, h: 20.07 },
  { x: 149.32, y: 100.74, w: 20.08, h: 20.08 },
  { x: 129.25, y: 60.6, w: 40.15, h: 20.07 },
  { x: 229.62, y: 60.6, w: 40.15, h: 20.07 },
  { x: 229.62, y: 100.74, w: 20.07, h: 20.08 },
  { x: 189.47, y: 100.74, w: 20.08, h: 40.15 },
];

export default function Divider() {
  return (
    <section className="relative z-10 px-6 md:px-[5.5%]">
      <div className="relative flex h-[40px] items-center justify-between px-5">
        <span className="text-[15px] leading-none text-white/70 md:text-[18px]">
          © 2026.
        </span>

        <svg
          viewBox="129.25 0.38 140.52 140.51"
          className="h-[38px] w-[38px] shrink-0 md:h-[40px] md:w-[40px]"
          role="img"
          aria-label="Dasein"
        >
          {ISOTIPO_PATHS.map((r) => (
            <rect
              key={`${r.x}-${r.y}`}
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              rx="1.38"
              ry="1.38"
              fill="#fff"
            />
          ))}
        </svg>

        <span
          aria-hidden="true"
          className="flex w-[52px] shrink-0 flex-col items-end gap-[7px] md:w-[58px]"
        >
          <span className="h-[2px] w-[72%] bg-white/85" />
          <span className="h-[2px] w-full bg-white/85" />
        </span>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[calc(50%+9px)] h-px bg-white/10"
        />
      </div>
    </section>
  );
}
