"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox, Text } from "@react-three/drei";

const FONT_XB = "/fonts/sharp-sans/sharp-sans-extrabold.otf";
const FONT_LT = "/fonts/sharp-sans/sharp-sans-light.otf";
const FAM_XB = "SharpSansXB";
const FAM_LT = "SharpSansLT";

const BASE_X = 0.45;
const BASE_Y = 0.55;
const BASE_Z = -0.15;
const SPIN_X = 0.14;
const SPIN_Y = 0.18;
const CUBE_Y = 30;
const FLOAT_PX = 6;
const TEXT_Z = -380;

let medirCtx: CanvasRenderingContext2D | null = null;
function medir(texto: string, familia: string, size: number) {
  if (!medirCtx) medirCtx = document.createElement("canvas").getContext("2d");
  const ctx = medirCtx;
  if (!ctx) return texto.length * size * 0.6;
  ctx.font = `400 ${size}px "${familia}"`;
  // compensa el letterSpacing (-0.01em) que aplica troika
  return ctx.measureText(texto).width + texto.length * -0.01 * size;
}

type Texto3D = { fillOpacity: number };

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function suscribeAncho(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

function suscribeReduce(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function Contenido({
  isMobile,
  fontSize,
  cube,
  reduce,
  activo,
  onReady,
}: {
  isMobile: boolean;
  fontSize: number;
  cube: number;
  reduce: boolean;
  activo: boolean;
  onReady?: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const textos = useRef<Array<Texto3D | null>>([]);
  const vel = useRef({ x: 0, y: 0 });
  const ang = useRef({ x: 0, y: 0 });
  const frames = useRef(0);
  const ready = useRef(false);
  const readyT = useRef<number | null>(null);
  const [familias, setFamilias] = useState(false);
  const { gl, invalidate } = useThree();

  useEffect(() => {
    if (isMobile) return;
    let cancelado = false;
    (async () => {
      try {
        const xb = new FontFace(FAM_XB, `url("${FONT_XB}")`);
        const lt = new FontFace(FAM_LT, `url("${FONT_LT}")`);
        const [a, b] = await Promise.all([xb.load(), lt.load()]);
        if (cancelado) return;
        document.fonts.add(a);
        document.fonts.add(b);
        setFamilias(true);
      } catch {
        // si algún .otf no carga, la sección sigue con el titular HTML
        if (!cancelado) setFamilias(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [isMobile]);

  // líneas del titular medidas con las mismas fuentes (solo escritorio)
  const lineas = useMemo(() => {
    if (!familias || isMobile) return [];
    const L = fontSize * 1.05;
    const linea = (segs: { t: string; fam: string }[], i: number) => {
      const anchos = segs.map((s) => medir(s.t, s.fam, fontSize));
      const total = anchos.reduce((a, b) => a + b, 0);
      let x = -total / 2;
      return {
        y: (1 - i) * L,
        segs: segs.map((s, j) => {
          const seg = { t: s.t, url: s.fam === FAM_XB ? FONT_XB : FONT_LT, x };
          x += anchos[j];
          return seg;
        }),
      };
    };
    return [
      linea([{ t: "DEMOS FORMA", fam: FAM_XB }], 0),
      linea(
        [
          { t: "Y DIRECCIÓN", fam: FAM_XB },
          { t: " A TUS", fam: FAM_LT },
        ],
        1,
      ),
      linea([{ t: "PROYECTOS", fam: FAM_LT }], 2),
    ];
  }, [familias, isMobile, fontSize]);

  // reduced motion: un solo cuadro estático + cruce del titular
  useEffect(() => {
    if (!reduce || !activo) return;
    invalidate();
    if (!isMobile && familias && !ready.current) {
      ready.current = true;
      onReady?.();
    }
  }, [reduce, activo, isMobile, familias, invalidate, onReady]);

  // velocidad del cursor -> impulso angular (escritorio, sin reduce)
  useEffect(() => {
    if (isMobile || reduce) return;
    let last: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      if (!last) {
        last = { x: e.clientX, y: e.clientY };
        return;
      }
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      last = { x: e.clientX, y: e.clientY };
      const r = gl.domElement.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2 - CUBE_Y;
      const sobre = Math.abs(e.clientX - cx) < cube * 0.6 && Math.abs(e.clientY - cy) < cube * 0.6;
      const k = 0.006 * (sobre ? 1.5 : 1);
      vel.current.y = clamp(vel.current.y + dx * k, -2.5, 2.5);
      vel.current.x = clamp(vel.current.x + dy * k, -2.5, 2.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [isMobile, reduce, gl, cube]);

  useFrame((state, dtRaw) => {
    frames.current += 1;
    if (reduce) return;

    const dt = Math.min(dtRaw, 0.05);
    const t = state.clock.elapsedTime;

    const decay = Math.pow(0.92, dt * 60);
    vel.current.x *= decay;
    vel.current.y *= decay;
    ang.current.x += (SPIN_X + vel.current.x) * dt;
    ang.current.y += (SPIN_Y + vel.current.y) * dt;

    const g = group.current;
    if (g) {
      g.rotation.set(BASE_X + ang.current.x, BASE_Y + ang.current.y, BASE_Z);
      g.position.y = CUBE_Y + Math.sin(t * 1.2) * FLOAT_PX;
      const e = Math.min(1, t / 1.2);
      g.scale.setScalar(0.94 + 0.06 * (1 - Math.pow(1 - e, 3)));
    }

    if (readyT.current != null) {
      const ft = Math.min(1, (t - readyT.current) / 0.7);
      const o = 1 - Math.pow(1 - ft, 2);
      for (const r of textos.current) if (r) r.fillOpacity = o;
    }

    if (!ready.current && !isMobile && familias && frames.current >= 2) {
      ready.current = true;
      readyT.current = t;
      onReady?.();
    }
  });

  let k = 0;
  return (
    <>
      <ambientLight intensity={0.7} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={8} position={[0, 4, -6]} scale={[12, 6, 1]} color="#ffffff" />
        <Lightformer
          form="rect"
          intensity={5}
          position={[-6, 2, 2]}
          rotation-y={Math.PI / 2}
          scale={[8, 8, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={3}
          position={[6, -2, 2]}
          rotation-y={-Math.PI / 2}
          scale={[8, 8, 1]}
          color="#ffffff"
        />
        <Lightformer form="ring" intensity={4} position={[0, 0, 6]} scale={4} color="#ffffff" />
      </Environment>

      <group ref={group} position={[0, CUBE_Y, 0]}>
        <RoundedBox args={[cube, cube, cube]} radius={cube * 0.06} smoothness={5}>
          <MeshTransmissionMaterial
            transmission={1}
            thickness={cube * 0.12}
            roughness={0}
            ior={1.25}
            chromaticAberration={0.1}
            anisotropicBlur={0.05}
            distortion={0.04}
            distortionScale={0.1}
            temporalDistortion={0}
            samples={isMobile ? 3 : 8}
            resolution={isMobile ? 256 : 512}
            backside
          />
        </RoundedBox>
      </group>

      {!isMobile &&
        lineas.map((linea, i) =>
          linea.segs.map((seg) => {
            const idx = k++;
            return (
              <Text
                key={`${i}-${idx}`}
                ref={(el) => {
                  textos.current[idx] = el as unknown as Texto3D | null;
                }}
                font={seg.url}
                fontSize={fontSize}
                fillOpacity={reduce ? 1 : 0}
                color="#ffffff"
                anchorX="left"
                anchorY="middle"
                letterSpacing={-0.01}
                position={[seg.x, linea.y, TEXT_Z]}
              >
                {seg.t}
              </Text>
            );
          }),
        )}
    </>
  );
}

export default function GlassScene({ onReady }: { onReady?: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(true);
  const width = useSyncExternalStore(suscribeAncho, () => window.innerWidth, () => 1500);
  const reduce = useSyncExternalStore(suscribeReduce, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);

  const isMobile = width < 768;
  const fontSize = isMobile ? 44 : Math.min(96, Math.max(60, width * 0.064));
  const cube = isMobile ? 170 : width * 0.24;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActivo(e.isIntersecting && !document.hidden));
    io.observe(el);
    const onVis = () => setActivo(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={host} className="h-full w-full">
      <Canvas
        orthographic
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 1200], zoom: 1, near: 0.1, far: 3000 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduce ? (activo ? "demand" : "never") : activo ? "always" : "never"}
        style={{ pointerEvents: "none" }}
      >
        <Contenido
          isMobile={isMobile}
          fontSize={fontSize}
          cube={cube}
          reduce={reduce}
          activo={activo}
          onReady={onReady}
        />
      </Canvas>
    </div>
  );
}
