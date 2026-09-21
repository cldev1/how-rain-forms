"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StageConfig } from "./stageConfig";

function SkyBackdrop({ top, bottom }: { top: string; bottom: string }) {
  const mat = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 2, 256);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.LinearFilter;
    return new THREE.MeshBasicMaterial({ map: tex, depthWrite: false });
  }, [top, bottom]);

  return (
    <mesh position={[0, 2, -12]} scale={[28, 18, 1]} material={mat}>
      <planeGeometry />
    </mesh>
  );
}

function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 4.2 + Math.sin(clock.elapsedTime * 0.4) * 0.08;
    }
  });
  return (
    <group position={[-4.5, 4.2, -6]}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.85, 24, 24]} />
        <meshStandardMaterial
          color="#FFE566"
          emissive="#FFD040"
          emissiveIntensity={0.6}
        />
      </mesh>
      <pointLight color="#FFE8A0" intensity={1.2} distance={20} />
    </group>
  );
}

function Ground({ wet }: { wet: number }) {
  const color = useMemo(() => {
    const dry = new THREE.Color("#9ED99A");
    const wetC = new THREE.Color("#6BB86E");
    return dry.clone().lerp(wetC, Math.min(1, wet));
  }, [wet]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
      <circleGeometry args={[10, 48]} />
      <meshStandardMaterial color={color} roughness={0.85 - wet * 0.3} />
    </mesh>
  );
}

function Hills() {
  return (
    <group>
      {[
        [-3.5, -1.6, -2, 1.8, 1.1],
        [2.8, -1.7, -1.5, 2.2, 1.0],
        [0.2, -1.85, -3, 2.5, 0.9],
      ].map(([x, y, z, sx, sy], i) => (
        <mesh key={i} position={[x, y, z]} scale={[sx, sy, 1.2]}>
          <sphereGeometry args={[1, 20, 16]} />
          <meshStandardMaterial color={i === 1 ? "#7BC67E" : "#8FD18A"} />
        </mesh>
      ))}
    </group>
  );
}

function FluffyCloud({
  position,
  scale = 1,
  color,
  darkness,
}: {
  position: [number, number, number];
  scale?: number;
  color: string;
  darkness: number;
}) {
  const group = useRef<THREE.Group>(null);
  const baseY = position[1];
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.y =
        baseY + Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.12;
    }
  });
  const c = useMemo(() => {
    const col = new THREE.Color(color);
    col.lerp(new THREE.Color("#6B7A8A"), darkness);
    return col;
  }, [color, darkness]);

  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 0.7],
    [0.55, 0.1, 0.1, 0.55],
    [-0.55, 0.05, 0.05, 0.55],
    [0.15, 0.35, -0.1, 0.45],
    [-0.25, 0.3, 0.15, 0.4],
  ];

  return (
    <group ref={group} position={position} scale={scale}>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 16, 16]} />
          <meshStandardMaterial
            color={c}
            roughness={0.9}
            transparent
            opacity={0.95}
          />
        </mesh>
      ))}
    </group>
  );
}

function Vapor({ intensity }: { intensity: number }) {
  const count = Math.floor(60 * intensity);
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(80 * 3);
    const speeds = new Float32Array(80);
    for (let i = 0; i < 80; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 1] = -2 + Math.random() * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      speeds[i] = 0.4 + Math.random() * 0.6;
    }
    return { positions, speeds };
  }, []);

  useFrame((_, dt) => {
    if (!ref.current || intensity < 0.05) return;
    const pos = ref.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < 80; i++) {
      pos[i * 3 + 1] += speeds[i] * dt * intensity;
      if (pos[i * 3 + 1] > 2.5) {
        pos[i * 3 + 1] = -2;
        pos[i * 3] = (Math.random() - 0.5) * 3;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    (ref.current.material as THREE.PointsMaterial).opacity = 0.35 * intensity;
  });

  if (intensity < 0.05) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={80}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#D6F0FF"
        size={0.12}
        transparent
        opacity={0.35}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Rain({
  count,
  speed,
  size,
}: {
  count: number;
  speed: number;
  size: number;
}) {
  const max = 280;
  const ref = useRef<THREE.Points>(null);
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(max * 3);
    const velocities = new Float32Array(max);
    for (let i = 0; i < max; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 8 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      velocities[i] = 0.8 + Math.random() * 0.4;
    }
    return { positions, velocities };
  }, []);

  useFrame((_, dt) => {
    if (!ref.current || count < 1) return;
    const pos = ref.current.geometry.attributes.position
      .array as Float32Array;
    const n = Math.min(count, max);
    for (let i = 0; i < n; i++) {
      pos[i * 3 + 1] -= speed * velocities[i] * dt;
      if (pos[i * 3 + 1] < -2.2) {
        pos[i * 3 + 1] = 4 + Math.random() * 2;
        pos[i * 3] = (Math.random() - 0.5) * 10;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  if (count < 1) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={Math.min(count, max)}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#A8D4FF"
        size={size}
        transparent
        opacity={0.75}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Thermometer({ visible }: { visible: boolean }) {
  const needle = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!needle.current || !visible) return;
    const t = (Math.sin(clock.elapsedTime * 0.8) + 1) / 2;
    needle.current.position.y = -0.6 + t * 1.0;
    (needle.current.material as THREE.MeshStandardMaterial).color.setHSL(
      0.08 + t * 0.45,
      0.75,
      0.55
    );
  });
  if (!visible) return null;
  return (
    <group position={[3.2, 0.2, 1]}>
      <mesh>
        <boxGeometry args={[0.22, 1.6, 0.12]} />
        <meshStandardMaterial color="#FFF8F0" />
      </mesh>
      <mesh position={[0, -0.95, 0.02]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#FF8A6A" emissive="#FF6040" emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={needle} position={[0, 0, 0.08]}>
        <boxGeometry args={[0.1, 0.18, 0.08]} />
        <meshStandardMaterial color="#FF8A6A" />
      </mesh>
      {/* warm→cool arrows */}
      <mesh position={[-0.55, -0.4, 0]} rotation={[0, 0, 0.4]}>
        <coneGeometry args={[0.12, 0.35, 8]} />
        <meshStandardMaterial color="#FFB060" />
      </mesh>
      <mesh position={[-0.55, 0.5, 0]} rotation={[0, 0, Math.PI - 0.3]}>
        <coneGeometry args={[0.12, 0.35, 8]} />
        <meshStandardMaterial color="#80C8FF" />
      </mesh>
    </group>
  );
}

function Condensation({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(36 * 3);
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const r = 0.3 + (i % 5) * 0.12;
      p[i * 3] = Math.cos(a) * r;
      p[i * 3 + 1] = 1.6 + Math.sin(a * 2) * 0.25;
      p[i * 3 + 2] = Math.sin(a) * r * 0.5;
    }
    return p;
  }, []);
  useFrame(({ clock }) => {
    if (!ref.current || !visible) return;
    const s = 1 + Math.sin(clock.elapsedTime * 2) * 0.08;
    ref.current.scale.setScalar(s);
  });
  if (!visible) return null;
  return (
    <points ref={ref} position={[0, 0.3, 0.5]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={36}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#FFFFFF"
        size={0.14}
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

function LightningFlash({
  active,
  trigger,
}: {
  active: boolean;
  trigger: number;
}) {
  const light = useRef<THREE.PointLight>(null);
  const flashUntil = useRef(0);

  useEffect(() => {
    if (active && trigger > 0) {
      flashUntil.current = performance.now() + 180;
    }
  }, [trigger, active]);

  useFrame(() => {
    if (!light.current) return;
    const on = active && performance.now() < flashUntil.current;
    light.current.intensity = on ? 8 : 0;
  });

  if (!active) return null;
  return (
    <pointLight
      ref={light}
      position={[0, 3, 2]}
      color="#FFF8D0"
      intensity={0}
      distance={30}
    />
  );
}

function DewMascot3D({ mood }: { mood: StageConfig["dewMood"] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const bounce =
      mood === "excited"
        ? Math.abs(Math.sin(clock.elapsedTime * 4)) * 0.2
        : Math.sin(clock.elapsedTime * 2) * 0.08;
    ref.current.position.y = -1.5 + bounce;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.5) * 0.08;
  });

  return (
    <group ref={ref} position={[-3.2, -1.5, 2]} scale={0.9}>
      {/* body */}
      <mesh scale={[1, 1.25, 1]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial
          color="#B8E8FF"
          roughness={0.25}
          metalness={0.1}
          emissive="#A0DCFF"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* highlight */}
      <mesh position={[-0.12, 0.18, 0.28]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.85} />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.1, 0.1, 0.3]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#2A4060" />
      </mesh>
      <mesh position={[0.1, 0.1, 0.3]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#2A4060" />
      </mesh>
      {/* smile */}
      <mesh position={[0, -0.02, 0.32]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.08, 0.018, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#2A4060" />
      </mesh>
    </group>
  );
}

export function SceneContent({
  stage,
  flashTrigger,
}: {
  stage: StageConfig;
  flashTrigger: number;
}) {
  const wet = Math.min(1, stage.rainCount / 200);

  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#E8F4FF", "#9ED99A", 0.55]} />
      <directionalLight position={[5, 8, 4]} intensity={0.7} color="#FFF5E0" />

      <SkyBackdrop top={stage.skyTop} bottom={stage.skyBottom} />
      <Sun />
      <Ground wet={wet} />
      <Hills />

      <FluffyCloud
        position={[0, 2.0, 0]}
        scale={1.4 + stage.cloudDarkness * 0.3}
        color={stage.cloudColor}
        darkness={stage.cloudDarkness}
      />
      <FluffyCloud
        position={[-2.2, 1.7, -1]}
        scale={0.9}
        color={stage.cloudColor}
        darkness={stage.cloudDarkness}
      />
      <FluffyCloud
        position={[2.4, 1.85, -0.8]}
        scale={1.0}
        color={stage.cloudColor}
        darkness={stage.cloudDarkness * 0.8}
      />

      <Vapor intensity={stage.vapor} />
      <Rain
        count={stage.rainCount}
        speed={stage.rainSpeed}
        size={stage.rainSize}
      />
      <Thermometer visible={stage.showThermo} />
      <Condensation visible={stage.showCondensation} />
      <LightningFlash active={stage.showLightning} trigger={flashTrigger} />
      <DewMascot3D mood={stage.dewMood} />
    </>
  );
}
