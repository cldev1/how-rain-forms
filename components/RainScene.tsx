"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DewMood, StageConfig } from "./stageConfig";


function CameraRig() {
  useFrame(({ camera }) => {
    camera.lookAt(0, 0.35, 0);
  });
  return null;
}

type VisualState = {
  skyTop: THREE.Color;
  skyBottom: THREE.Color;
  cloudColor: THREE.Color;
  cloudDarkness: number;
  sunIntensity: number;
  vapor: number;
  mist: number;
  rainCount: number;
  rainSpeed: number;
  rainSize: number;
};

function makeVisual(stage: StageConfig): VisualState {
  return {
    skyTop: new THREE.Color(stage.skyTop),
    skyBottom: new THREE.Color(stage.skyBottom),
    cloudColor: new THREE.Color(stage.cloudColor),
    cloudDarkness: stage.cloudDarkness,
    sunIntensity: stage.sunIntensity,
    vapor: stage.vapor,
    mist: stage.mist,
    rainCount: stage.rainCount,
    rainSpeed: stage.rainSpeed,
    rainSize: stage.rainSize,
  };
}

function lerpVisual(cur: VisualState, target: VisualState, t: number) {
  cur.skyTop.lerp(target.skyTop, t);
  cur.skyBottom.lerp(target.skyBottom, t);
  cur.cloudColor.lerp(target.cloudColor, t);
  cur.cloudDarkness += (target.cloudDarkness - cur.cloudDarkness) * t;
  cur.sunIntensity += (target.sunIntensity - cur.sunIntensity) * t;
  cur.vapor += (target.vapor - cur.vapor) * t;
  cur.mist += (target.mist - cur.mist) * t;
  cur.rainCount += (target.rainCount - cur.rainCount) * t;
  cur.rainSpeed += (target.rainSpeed - cur.rainSpeed) * t;
  cur.rainSize += (target.rainSize - cur.rainSize) * t;
}

function SkyBackdrop({ visual }: { visual: React.MutableRefObject<VisualState> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      topColor: { value: new THREE.Color("#9ED4FF") },
      bottomColor: { value: new THREE.Color("#F2F9FF") },
    }),
    []
  );

  useFrame(() => {
    if (!matRef.current) return;
    uniforms.topColor.value.copy(visual.current.skyTop);
    uniforms.bottomColor.value.copy(visual.current.skyBottom);
  });

  return (
    <mesh position={[0, 2.2, -14]} scale={[36, 22, 1]}>
      <planeGeometry />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          varying vec2 vUv;
          void main() {
            vec3 col = mix(bottomColor, topColor, smoothstep(0.0, 1.0, vUv.y));
            gl_FragColor = vec4(col, 1.0);
          }
        `}
        depthWrite={false}
      />
    </mesh>
  );
}

function Sun({ visual }: { visual: React.MutableRefObject<VisualState> }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const v = visual.current;
    const bob = Math.sin(clock.elapsedTime * 0.45) * 0.1;
    if (group.current) {
      group.current.position.y = 4.3 + bob;
      group.current.visible = v.sunIntensity > 0.05;
      const s = 0.7 + v.sunIntensity * 0.45;
      group.current.scale.setScalar(s);
    }
    if (light.current) light.current.intensity = v.sunIntensity * 1.4;
    if (glow.current) {
      const m = glow.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.25 + v.sunIntensity * 0.35;
    }
  });

  return (
    <group ref={group} position={[-4.6, 4.3, -7]}>
      <mesh ref={glow} scale={1.85}>
        <sphereGeometry args={[0.85, 24, 24]} />
        <meshBasicMaterial color="#FFE8A0" transparent opacity={0.4} depthWrite={false} />
      </mesh>
      <mesh ref={core}>
        <sphereGeometry args={[0.78, 28, 28]} />
        <meshStandardMaterial
          color="#FFE566"
          emissive="#FFD040"
          emissiveIntensity={0.85}
          roughness={0.35}
        />
      </mesh>
      {/* soft halo only — no harsh spokes */}
      <mesh scale={2.4}>
        <sphereGeometry args={[0.85, 24, 24]} />
        <meshBasicMaterial color="#FFF3C0" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <pointLight ref={light} color="#FFE8A0" intensity={1.2} distance={22} />
    </group>
  );
}

function Terrain({ visual }: { visual: React.MutableRefObject<VisualState> }) {
  const grass = useRef<THREE.MeshStandardMaterial>(null);
  const pond = useRef<THREE.MeshStandardMaterial>(null);
  const dry = useMemo(() => new THREE.Color("#8FD98A"), []);
  const wet = useMemo(() => new THREE.Color("#5EAF6A"), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useFrame(() => {
    const wetAmt = Math.min(1, visual.current.rainCount / 200);
    tmp.copy(dry).lerp(wet, wetAmt);
    if (grass.current) {
      grass.current.color.copy(tmp);
      grass.current.roughness = 0.92 - wetAmt * 0.35;
    }
    if (pond.current) {
      pond.current.opacity = 0.35 + wetAmt * 0.45;
      pond.current.roughness = 0.15;
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.15, 2]} receiveShadow>
        <planeGeometry args={[40, 28]} />
        <meshStandardMaterial ref={grass} color="#8FD98A" roughness={0.9} />
      </mesh>
      {/* far meadow fill so sky never peeks under the world */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, -6]}>
        <planeGeometry args={[50, 20]} />
        <meshStandardMaterial color="#7EC87E" roughness={1} />
      </mesh>

      {/* rolling hills */}
      {[
        [-3.8, -1.55, -2.2, 2.1, 1.15, 1.4, "#7BC67E"],
        [3.2, -1.65, -1.8, 2.4, 1.05, 1.5, "#6FBE72"],
        [0.1, -1.8, -3.4, 2.8, 0.95, 1.6, "#86D086"],
        [-5.5, -1.9, -0.5, 1.6, 0.7, 1.1, "#92D892"],
        [5.2, -1.85, -0.8, 1.7, 0.75, 1.2, "#7EC87E"],
      ].map(([x, y, z, sx, sy, sz, color], i) => (
        <mesh key={i} position={[x as number, y as number, z as number]} scale={[sx as number, sy as number, sz as number]}>
          <sphereGeometry args={[1, 24, 18]} />
          <meshStandardMaterial color={color as string} roughness={0.88} />
        </mesh>
      ))}

      {/* pond */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.6, -2.08, 1.8]}>
        <circleGeometry args={[1.35, 40]} />
        <meshStandardMaterial
          ref={pond}
          color="#7EC8F0"
          transparent
          opacity={0.45}
          roughness={0.15}
          metalness={0.2}
        />
      </mesh>

      {/* flowers */}
      <Flowers />
      <LittleTree position={[-4.2, -2.05, 1.2]} />
      <LittleTree position={[4.5, -2.05, 0.6]} scale={0.85} />
    </group>
  );
}

function Flowers() {
  const spots: [number, number, string][] = [
    [-2.2, 1.5, "#FF8AB0"],
    [-1.4, 2.1, "#FFD070"],
    [0.6, 2.4, "#FF8AB0"],
    [2.8, 1.2, "#C8A0FF"],
    [-0.8, 0.4, "#FFD070"],
    [3.6, 2.2, "#FF8AB0"],
  ];
  return (
    <group>
      {spots.map(([x, z, color], i) => (
        <group key={i} position={[x, -2.05, z]}>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.025, 0.03, 0.36, 6]} />
            <meshStandardMaterial color="#4FA05A" />
          </mesh>
          {[0, 72, 144, 216, 288].map((deg) => (
            <mesh
              key={deg}
              position={[
                Math.cos((deg * Math.PI) / 180) * 0.09,
                0.4,
                Math.sin((deg * Math.PI) / 180) * 0.09,
              ]}
            >
              <sphereGeometry args={[0.07, 10, 10]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color="#FFE566" emissive="#FFD040" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function LittleTree({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.9, 8]} />
        <meshStandardMaterial color="#A07040" />
      </mesh>
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color="#5CB86A" />
      </mesh>
      <mesh position={[0.25, 1.35, 0.1]}>
        <sphereGeometry args={[0.35, 14, 14]} />
        <meshStandardMaterial color="#6ECC78" />
      </mesh>
      <mesh position={[-0.2, 1.4, -0.1]}>
        <sphereGeometry args={[0.32, 14, 14]} />
        <meshStandardMaterial color="#4EAE5E" />
      </mesh>
    </group>
  );
}

function SoftCloud({
  position,
  scale = 1,
  visual,
  phase = 0,
}: {
  position: [number, number, number];
  scale?: number;
  visual: React.MutableRefObject<VisualState>;
  phase?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const mats = useRef<THREE.MeshStandardMaterial[]>([]);
  const baseY = position[1];
  const puffColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.position.y =
      baseY + Math.sin(clock.elapsedTime * 0.55 + phase + position[0]) * 0.14;
    const v = visual.current;
    puffColor.copy(v.cloudColor).lerp(new THREE.Color("#6B7A8A"), v.cloudDarkness);
    for (const m of mats.current) {
      if (m) m.color.copy(puffColor);
    }
  });

  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 0.72],
    [0.62, 0.08, 0.12, 0.58],
    [-0.6, 0.05, 0.08, 0.56],
    [0.2, 0.4, -0.12, 0.48],
    [-0.28, 0.36, 0.18, 0.42],
    [0.85, -0.05, -0.05, 0.38],
    [-0.9, -0.02, 0.05, 0.36],
  ];

  return (
    <group ref={group} position={position} scale={scale}>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[r, 20, 18]} />
          <meshStandardMaterial
            ref={(m) => {
              if (m) mats.current[i] = m;
            }}
            color="#FFFFFF"
            roughness={0.95}
            transparent
            opacity={0.96}
          />
        </mesh>
      ))}
    </group>
  );
}

function Vapor({ visual }: { visual: React.MutableRefObject<VisualState> }) {
  const count = 90;
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3.2;
      positions[i * 3 + 1] = -2 + Math.random() * 2.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.2;
      speeds[i] = 0.35 + Math.random() * 0.55;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, speeds, phases };
  }, []);

  useFrame(({ clock }, dt) => {
    if (!ref.current) return;
    const intensity = visual.current.vapor;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      if (intensity < 0.04) continue;
      pos[i * 3 + 1] += speeds[i] * dt * Math.max(0.15, intensity);
      pos[i * 3] += Math.sin(t * 1.2 + phases[i]) * 0.004;
      if (pos[i * 3 + 1] > 2.6) {
        pos[i * 3 + 1] = -2.05;
        pos[i * 3] = (Math.random() - 0.5) * 3.2;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.4 * intensity;
    mat.size = 0.1 + intensity * 0.06;
    ref.current.visible = intensity > 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#D8F2FF"
        size={0.12}
        transparent
        opacity={0.35}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Mist({ visual }: { visual: React.MutableRefObject<VisualState> }) {
  const count = 50;
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 12;
      p[i * 3 + 1] = -1.6 + Math.random() * 1.4;
      p[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return p;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const m = visual.current.mist;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.08 + m * 0.18;
    ref.current.rotation.y = clock.elapsedTime * 0.02;
    ref.current.visible = m > 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#EAF4FF"
        size={0.28}
        transparent
        opacity={0.2}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function RainStreaks({ visual }: { visual: React.MutableRefObject<VisualState> }) {
  const max = 300;
  const ref = useRef<THREE.Points>(null);
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(max * 3);
    const velocities = new Float32Array(max);
    for (let i = 0; i < max; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 1] = Math.random() * 8 - 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
      velocities[i] = 0.75 + Math.random() * 0.5;
    }
    return { positions, velocities };
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const v = visual.current;
    const count = Math.floor(v.rainCount);
    if (count < 1) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const n = Math.min(count, max);
    for (let i = 0; i < n; i++) {
      pos[i * 3 + 1] -= v.rainSpeed * velocities[i] * dt;
      pos[i * 3] += dt * 0.15;
      if (pos[i * 3 + 1] < -2.15) {
        pos[i * 3 + 1] = 4.2 + Math.random() * 2;
        pos[i * 3] = (Math.random() - 0.5) * 11;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 7;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.geometry.setDrawRange(0, n);
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.size = v.rainSize * 1.15;
    mat.opacity = 0.55 + Math.min(0.3, v.rainCount / 400);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#A8D8FF"
        size={0.05}
        transparent
        opacity={0.7}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

function Thermometer({ visible }: { visible: boolean }) {
  const needle = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.visible = visible;
    if (!visible || !needle.current) return;
    const t = (Math.sin(clock.elapsedTime * 0.85) + 1) / 2;
    needle.current.position.y = -0.55 + t * 0.95;
    (needle.current.material as THREE.MeshStandardMaterial).color.setHSL(
      0.08 + t * 0.42,
      0.78,
      0.55
    );
  });

  return (
    <group ref={group} position={[3.3, 0.15, 1.1]}>
      <mesh>
        <capsuleGeometry args={[0.14, 1.35, 8, 16]} />
        <meshStandardMaterial color="#FFF8F0" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.95, 0]}>
        <sphereGeometry args={[0.22, 18, 18]} />
        <meshStandardMaterial color="#FF8A6A" emissive="#FF6040" emissiveIntensity={0.35} />
      </mesh>
      <mesh ref={needle} position={[0, 0, 0.1]}>
        <boxGeometry args={[0.1, 0.2, 0.08]} />
        <meshStandardMaterial color="#FF8A6A" />
      </mesh>
      <mesh position={[-0.6, -0.35, 0]} rotation={[0, 0, 0.45]}>
        <coneGeometry args={[0.13, 0.38, 10]} />
        <meshStandardMaterial color="#FFB060" emissive="#FF9040" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-0.6, 0.55, 0]} rotation={[0, 0, Math.PI - 0.35]}>
        <coneGeometry args={[0.13, 0.38, 10]} />
        <meshStandardMaterial color="#80C8FF" emissive="#60B0FF" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function Condensation({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const drops = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const r = 0.35 + (i % 4) * 0.14;
      return {
        x: Math.cos(a) * r,
        y: 1.55 + Math.sin(a * 2) * 0.28,
        z: Math.sin(a) * r * 0.55,
        s: 0.06 + (i % 3) * 0.025,
      };
    });
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.visible = visible;
    if (!visible) return;
    const s = 1 + Math.sin(clock.elapsedTime * 2.2) * 0.07;
    ref.current.scale.setScalar(s);
  });

  return (
    <group ref={ref} position={[0, 0.35, 0.4]}>
      {drops.map((d, i) => (
        <mesh key={i} position={[d.x, d.y, d.z]} scale={[1, 1.35, 1]}>
          <sphereGeometry args={[d.s, 12, 12]} />
          <meshStandardMaterial
            color="#C8ECFF"
            transparent
            opacity={0.85}
            roughness={0.2}
            metalness={0.15}
            emissive="#A0D8FF"
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
      {/* dust sparkles */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={`dust-${i}`}
          position={[
            Math.cos(i * 1.1) * 0.7,
            1.4 + (i % 3) * 0.2,
            Math.sin(i * 1.1) * 0.4,
          ]}
        >
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color="#FFE8A0" />
        </mesh>
      ))}
    </group>
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
  const bolt = useRef<THREE.Mesh>(null);
  const flashUntil = useRef(0);

  useEffect(() => {
    if (active && trigger > 0) {
      flashUntil.current = performance.now() + 220;
    }
  }, [trigger, active]);

  useFrame(() => {
    const on = active && performance.now() < flashUntil.current;
    if (light.current) light.current.intensity = on ? 10 : 0;
    if (bolt.current) {
      bolt.current.visible = on;
      const m = bolt.current.material as THREE.MeshBasicMaterial;
      m.opacity = on ? 0.95 : 0;
    }
  });

  if (!active) return null;

  return (
    <group>
      <pointLight ref={light} position={[0.5, 3.2, 2]} color="#FFF8D0" intensity={0} distance={32} />
      <mesh ref={bolt} position={[0.8, 2.4, 0.6]} visible={false}>
        <boxGeometry args={[0.12, 1.6, 0.08]} />
        <meshBasicMaterial color="#FFF4A0" transparent opacity={0} />
      </mesh>
      {/* zigzag friendly bolt via stacked boxes */}
      <group position={[0.8, 2.6, 0.6]}>
        {[
          [0, 0.5, 0, 0.1, 0.55, -0.2],
          [-0.15, 0.05, 0, 0.1, 0.45, 0.15],
          [0.05, -0.4, 0, 0.09, 0.5, -0.12],
        ].map(([x, y, z, sx, sy, rot], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[0, 0, rot]}>
            <boxGeometry args={[sx, sy, 0.06]} />
            <meshBasicMaterial color="#FFE566" transparent opacity={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function DewMascot3D({ mood }: { mood: DewMood }) {
  const ref = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);
  const brows = useRef<THREE.Group>(null);
  const arms = useRef<THREE.Group>(null);
  const sparkles = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    let bounce = Math.sin(t * 2.2) * 0.09;
    let squash = 1;
    if (mood === "excited" || mood === "sparkly") {
      bounce = Math.abs(Math.sin(t * 5)) * 0.22;
      squash = 1 + Math.sin(t * 5) * 0.04;
    } else if (mood === "splashy") {
      bounce = Math.sin(t * 3.2) * 0.14;
    } else if (mood === "cozy") {
      bounce = Math.sin(t * 1.4) * 0.05;
    } else if (mood === "thinking") {
      bounce = Math.sin(t * 1.6) * 0.06;
    }

    ref.current.position.y = -1.35 + bounce;
    ref.current.scale.set(squash, 2 - squash, squash);
    ref.current.rotation.z = Math.sin(t * 1.4) * (mood === "curious" ? 0.12 : 0.06);
    ref.current.rotation.y = Math.sin(t * 0.7) * 0.15;

    // eye blink
    const blink = Math.sin(t * 3.1) > 0.97 ? 0.15 : 1;
    if (leftEye.current) leftEye.current.scale.y = blink;
    if (rightEye.current) rightEye.current.scale.y = blink;

    if (brows.current) {
      brows.current.position.y = mood === "thinking" ? 0.22 : 0.18;
      brows.current.rotation.z = mood === "curious" ? 0.15 : 0;
    }

    if (arms.current) {
      const raise =
        mood === "excited" || mood === "sparkly" || mood === "happy"
          ? 0.8 + Math.sin(t * 4) * 0.25
          : mood === "splashy"
            ? 0.3 + Math.sin(t * 3) * 0.2
            : 0.1;
      arms.current.children.forEach((arm, i) => {
        arm.rotation.z = (i === 0 ? 1 : -1) * (0.4 + raise);
      });
    }

    if (sparkles.current) {
      sparkles.current.visible = mood === "sparkly" || mood === "excited";
      sparkles.current.rotation.y = t * 1.5;
    }
  });

  return (
    <group ref={ref} position={[-2.6, -1.35, 2.4]} scale={1.15}>
      {/* body */}
      <mesh scale={[1, 1.3, 1]} castShadow>
        <sphereGeometry args={[0.42, 28, 28]} />
        <meshStandardMaterial
          color="#9ADFFF"
          roughness={0.22}
          metalness={0.12}
          emissive="#7AD0FF"
          emissiveIntensity={0.18}
        />
      </mesh>
      {/* gloss highlight */}
      <mesh position={[-0.14, 0.22, 0.32]}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0.08, 0.3, 0.28]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.7} />
      </mesh>

      {/* cheeks */}
      <mesh position={[-0.22, 0.0, 0.34]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#FFB0C8" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.22, 0.0, 0.34]}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshStandardMaterial color="#FFB0C8" transparent opacity={0.7} />
      </mesh>

      {/* eyes — big and friendly */}
      <mesh ref={leftEye} position={[-0.13, 0.12, 0.37]}>
        <sphereGeometry args={[0.095, 16, 16]} />
        <meshStandardMaterial color="#1E3048" />
      </mesh>
      <mesh ref={rightEye} position={[0.13, 0.12, 0.37]}>
        <sphereGeometry args={[0.095, 16, 16]} />
        <meshStandardMaterial color="#1E3048" />
      </mesh>
      <mesh position={[-0.1, 0.15, 0.44]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.16, 0.15, 0.44]}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-0.15, 0.08, 0.44]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.11, 0.08, 0.44]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* brows */}
      <group ref={brows} position={[0, 0.18, 0.36]}>
        <mesh position={[-0.12, 0, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.1, 0.025, 0.02]} />
          <meshStandardMaterial color="#243850" />
        </mesh>
        <mesh position={[0.12, 0, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[0.1, 0.025, 0.02]} />
          <meshStandardMaterial color="#243850" />
        </mesh>
      </group>

      {/* smile — curved up */}
      <mesh position={[0, -0.08, 0.39]} rotation={[Math.PI, 0, Math.PI]}>
        <torusGeometry args={[0.1, 0.022, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#243850" />
      </mesh>

      {/* arms */}
      <group ref={arms}>
        <mesh position={[-0.4, 0.05, 0.05]} rotation={[0, 0, 0.6]}>
          <capsuleGeometry args={[0.07, 0.22, 6, 10]} />
          <meshStandardMaterial color="#8AD4F8" />
        </mesh>
        <mesh position={[0.4, 0.05, 0.05]} rotation={[0, 0, -0.6]}>
          <capsuleGeometry args={[0.07, 0.22, 6, 10]} />
          <meshStandardMaterial color="#8AD4F8" />
        </mesh>
      </group>

      {/* tiny feet */}
      <mesh position={[-0.14, -0.48, 0.08]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#7AC8F0" />
      </mesh>
      <mesh position={[0.14, -0.48, 0.08]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#7AC8F0" />
      </mesh>

      {/* sparkles for storm/excited */}
      <group ref={sparkles} visible={false}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 5) * Math.PI * 2) * 0.7,
              0.3 + (i % 2) * 0.35,
              Math.sin((i / 5) * Math.PI * 2) * 0.7,
            ]}
          >
            <octahedronGeometry args={[0.06, 0]} />
            <meshBasicMaterial color="#FFE566" />
          </mesh>
        ))}
      </group>
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
  const visual = useRef<VisualState>(makeVisual(stage));
  const target = useRef<VisualState>(makeVisual(stage));
  const bg = useRef<THREE.Color>(new THREE.Color(stage.skyBottom));

  useEffect(() => {
    target.current = makeVisual(stage);
  }, [stage]);

  useFrame((_, dt) => {
    const t = 1 - Math.exp(-dt * 2.4);
    lerpVisual(visual.current, target.current, t);
    bg.current.copy(visual.current.skyBottom);
  });

  return (
    <>
      <CameraRig />
      <color attach="background" args={[stage.skyBottom]} />
      <ambientLight intensity={0.72} />
      <hemisphereLight args={["#EAF5FF", "#8FD98A", 0.55]} />
      <directionalLight position={[5, 9, 4]} intensity={0.75} color="#FFF6E8" />

      <SkyBackdrop visual={visual} />
      <Sun visual={visual} />
      <Terrain visual={visual} />

      <SoftCloud position={[0, 2.05, 0.2]} scale={1.45} visual={visual} phase={0} />
      <SoftCloud position={[-2.4, 1.75, -1.1]} scale={0.95} visual={visual} phase={1.2} />
      <SoftCloud position={[2.55, 1.9, -0.9]} scale={1.05} visual={visual} phase={2.1} />
      <SoftCloud position={[0.8, 2.4, -2.2]} scale={0.75} visual={visual} phase={0.6} />

      <Vapor visual={visual} />
      <Mist visual={visual} />
      <RainStreaks visual={visual} />
      <Thermometer visible={stage.showThermo} />
      <Condensation visible={stage.showCondensation} />
      <LightningFlash active={stage.showLightning} trigger={flashTrigger} />
      <DewMascot3D mood={stage.dewMood} />
    </>
  );
}
