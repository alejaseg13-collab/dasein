"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial, RoundedBox, Text } from "@react-three/drei";

const FONT_BOLD = "/fonts/sharp-sans/sharp-sans-extrabold.otf";
const FONT_LIGHT = "/fonts/sharp-sans/sharp-sans-light.otf";
const FAM_BOLD = "SharpSansXB";
const FAM_LIGHT = "SharpSansLight";

/** Ancho real de un nodo del DOM (usa las mismas fuentes/weights/tracking que
 * el titular HTML → calza con lo que troika renderiza en el canvas). */
function medirTexto(el: Element): number {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect().width;
}

const BASE_X = 0.45;
const BASE_Y = 0.55;
const BASE_Z = -0.15;
const SPIN_X = 0.14;
const SPIN_Y = 0.18;
const CUBE_Y = 30;
const FLOAT_PX = 6;
const TEXT_Z = -380;

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
  onFallback,
}: {
  isMobile: boolean;
  fontSize: number;
  cube: number;
  reduce: boolean;
  activo: boolean;
  onReady?: () => void;
  onFallback?: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const vel = useRef({ x: 0, y: 0 });
  const ang = useRef({ x: 0, y: 0 });
  const frames = useRef(0);
  const ready = useRef(false);
  const fuentesCargadas = useRef(false);
  const [familias, setFamilias] = useState(false);
  const [tick, setTick] = useState(0);
  const { gl, invalidate } = useThree();
  // Móvil: el cubo se centra sobre el titular (no sobre la sección) para que
  // cubra únicamente "Demos forma..." sin bajar al párrafo. Desktop: +30.
  const yBase = isMobile ? 95 : CUBE_Y;

  // Carga de la fuente del titular (una sola vez, aunque el padre re-renderice).
  // Si falla, el HTML queda como titular de respaldo.
  useEffect(() => {
    if (isMobile) {
      onFallback?.();
      return;
    }
    if (fuentesCargadas.current) return;
    fuentesCargadas.current = true;
    let vivo = true;
    (async () => {
      try {
        const bold = new FontFace(FAM_BOLD, `url("${FONT_BOLD}")`, { weight: "800" });
        const light = new FontFace(FAM_LIGHT, `url("${FONT_LIGHT}")`, { weight: "300" });
        await Promise.all([bold.load(), light.load()]);
        await document.fonts.ready;
        if (!vivo) return;
        document.fonts.add(bold);
        document.fonts.add(light);
        setFamilias(true);
      } catch {
        if (vivo) onFallback?.();
      }
    })();
    return () => {
      vivo = false;
    };
  }, [isMobile, onFallback]);

  // Si el titular todavía no está en el DOM cuando las fuentes se resuelven,
  // reintenta la medición en vez de quedarse sin texto3D.
  useEffect(() => {
    if (!familias || isMobile) return;
    const h2 = [...document.querySelectorAll("h2")].find((h) =>
      h.textContent.toLowerCase().includes("demos forma"),
    );
    if (h2) return;
    const id = window.setTimeout(() => setTick((v) => v + 1), 300);
    return () => window.clearTimeout(id);
  }, [familias, isMobile, tick]);

  // líneas del titular: las simples se centran por construcción (anchor center,
  // sin medir) y la compuesta (bold+light) se mide desde el propio HTML
  const lineas = useMemo(() => {
    void tick; // invalida el cálculo cuando reintenta la medición
    if (!familias || isMobile) return [];
    const h2 = [...document.querySelectorAll("h2")].find((h) => h.textContent.toLowerCase().includes("demos forma"));
    if (!h2) return [];
    const L = fontSize * 1.05;
    const hijos = [...h2.children];
    return hijos.map((lineaEl, i) => {
      const spans = [...lineaEl.querySelectorAll(":scope > span")];
      const segEls = spans.length > 0 ? spans : [lineaEl];
      const compuesta = segEls.length > 1;
      const anchos = segEls.map((s) => medirTexto(s));
      const total = anchos.reduce((a, b) => a + b, 0);
      let x = -total / 2;
      return {
        y: (1 - i) * L,
        center: !compuesta,
        segs: segEls.map((s, j) => {
          const weight = parseInt(getComputedStyle(s).fontWeight, 10) || 400;
          const segX = compuesta ? x : 0;
          if (compuesta) x += anchos[j];
          return { t: (s.textContent ?? "").toUpperCase(), weight, x: segX };
        }),
      };
    });
  }, [familias, isMobile, fontSize, tick]);

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
      const k = 0.011 * (sobre ? 2 : 1);
      vel.current.y = clamp(vel.current.y + dx * k, -3.5, 3.5);
      vel.current.x = clamp(vel.current.x + dy * k, -3.5, 3.5);
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
      g.position.y = yBase + Math.sin(t * 1.2) * FLOAT_PX;
      const e = Math.min(1, t / 1.2);
      g.scale.setScalar(0.94 + 0.06 * (1 - Math.pow(1 - e, 3)));
    }

    if (!ready.current && !isMobile && familias && frames.current >= 2) {
      ready.current = true;
      onReady?.();
    }
  });

  return (
    <>
      <ambientLight intensity={0.95} />
      <Environment resolution={512} frames={1}>
        <Lightformer form="rect" intensity={13} position={[0, 4, -6]} scale={[12, 6, 1]} color="#ffffff" />
        <Lightformer
          form="rect"
          intensity={9}
          position={[-6, 2, 2]}
          rotation-y={Math.PI / 2}
          scale={[8, 8, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={7}
          position={[6, -2, 2]}
          rotation-y={-Math.PI / 2}
          scale={[8, 8, 1]}
          color="#ffffff"
        />
        <Lightformer form="ring" intensity={7} position={[0, 0, 6]} scale={4} color="#ffffff" />
        <Lightformer form="rect" intensity={6} position={[4, 5, 3]} rotation-x={Math.PI / 3} scale={[7, 4, 1]} color="#eafffb" />
        {/* destellos de color (estilo prisma/iridiscencia de la referencia) */}
        <Lightformer form="circle" intensity={18} position={[3, 2, -4]} scale={2.6} color="#ffb64d" />
        <Lightformer form="circle" intensity={16} position={[-4, -1, 3]} scale={2.2} color="#4d82ff" />
        <Lightformer form="circle" intensity={14} position={[1, -3, -3]} scale={2} color="#a06bff" />
        <Lightformer form="ring" intensity={11} position={[-2, 4, 4]} scale={3} color="#7de8ff" />
      </Environment>

          <group ref={group} position={[0, yBase, 0]}>
        <RoundedBox args={[cube, cube, cube]} radius={cube * 0.06} smoothness={5}>
          <MeshTransmissionMaterial
            transmission={1}
            thickness={cube * 0.08}
            roughness={0}
            ior={1.5}
            chromaticAberration={0.06}
            anisotropicBlur={0}
            distortion={0.03}
            distortionScale={0.1}
            temporalDistortion={0}
            samples={isMobile ? 3 : 8}
            resolution={isMobile ? 512 : 2048}
            envMapIntensity={1.1}
            attenuationColor="#c2cccd"
            attenuationDistance={cube * 0.12}
          />
        </RoundedBox>
      </group>

      {!isMobile &&
        lineas.map((linea, i) =>
          linea.segs.map((seg) => (
            <Text
              key={`${i}-${seg.t}-${seg.x}`}
              font={seg.weight > 300 ? FONT_BOLD : FONT_LIGHT}
              fontWeight={seg.weight}
              fontSize={fontSize}
              fillOpacity={1}
              color="#ffffff"
              anchorX={linea.center ? "center" : "left"}
              anchorY="middle"
              letterSpacing={-0.01}
              position={[seg.x, linea.y, TEXT_Z]}
            >
              {seg.t}
            </Text>
          )),
        )}
    </>
  );
}

export default function GlassScene({
  onReady,
  onFallback,
}: {
  onReady?: () => void;
  onFallback?: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(true);
  const width = useSyncExternalStore(suscribeAncho, () => window.innerWidth, () => 1500);
  const reduce = useSyncExternalStore(suscribeReduce, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => false);

  const isMobile = width < 768;
  const fontSize = isMobile ? 48 : Math.min(108, Math.max(64, width * 0.072));
  const cube = isMobile ? 130 : width * 0.24;

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
          onFallback={onFallback}
        />
      </Canvas>
    </div>
  );
}
