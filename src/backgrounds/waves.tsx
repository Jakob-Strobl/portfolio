import {
  Vector2,
  WebGLRenderer,
  Mesh,
  Scene,
  PerspectiveCamera,
  Color,
  PlaneGeometry,
  RawShaderMaterial,
} from "three";

import vertex from "./waves.vert";
import fragment from "./waves.frag";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

interface Wave {
  direction: Vector2;
  amplitude: number;
  length: number;
  speed: number;
  frequency: number;
  steepness: number;
}

function createWave(base_pos: Vector2, base_direction: Vector2): Wave {
  const wave = {
    direction: base_direction.rotateAround(
      base_pos,
      Math.PI * Math.random() * 0.25 - Math.PI * 0.125,
    ),
    amplitude: Math.random(),
    length: 40 * Math.random() + 10,
    speed: 10 * Math.random() + 15,
    frequency: 0.0,
    steepness: 0.4 * Math.random(),
  };

  wave.speed = (wave.speed * 2.0) / wave.length;
  wave.frequency = Math.sqrt(9.8 * ((2 * Math.PI) / wave.length));

  return wave;
}

function createWaveMesh(waves: Wave[]): Mesh {
  const geometry = new PlaneGeometry(25, 20, 128, 128);
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, -2, 0);

  const material = new RawShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      sineTime: { value: 1.0 },
      waves: { value: waves },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    side: 2,
    transparent: false,
  });

  const mesh = new Mesh(geometry, material);
  return mesh;
}

function createScene(waves: Wave[], width: number, height: number, canvas: HTMLCanvasElement) {
  const aspect_ratio = width / height;
  const camera = new PerspectiveCamera(90, aspect_ratio, 0.1, 100);
  camera.position.z = 10;
  camera.position.y = 1;

  const wave_mesh = createWaveMesh(waves);
  const scene = new Scene();
  scene.add(wave_mesh);

  const renderer = new WebGLRenderer({ antialias: true, canvas: canvas });
  renderer.setSize(width, height);
  renderer.setClearColor(new Color(0x130d20));

  return { renderer, wave_mesh, scene, camera };
}

export interface WavesBackgroundProps {
  num_waves: number;
}

export default function WavesBackground(props: WavesBackgroundProps) {
  const wind_direction = new Vector2().random().normalize();
  const base = new Vector2();
  const waves: Wave[] = [];
  const window_width = window.innerWidth ?? 1920;
  const window_height = window.innerHeight ?? 1080;
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  for (let i = 0; i < props.num_waves; i++) {
    waves.push(createWave(base, wind_direction));
  }

  createEffect(() => {
    if (canvas() != null && canvas()?.getContext != null) {
      const { renderer, wave_mesh, scene, camera } = createScene(
        waves,
        window_width,
        window_height,
        canvas()!
      );

      function renderCanvas(timestamp = 0) {
        requestAnimationFrame(renderCanvas);
        renderer.render(scene, camera);

        // Update Shader Uniforms to do the wave motion
        //@ts-ignore
        wave_mesh.material.uniforms["time"].value = timestamp * 0.005;
        //@ts-ignore
        wave_mesh.material.uniforms["sineTime"].value = Math.sin(
          timestamp * 0.00005,
        );
      }

      function resizeHandler() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      onMount(() => window.addEventListener("resize", resizeHandler));
      onCleanup(() => window.removeEventListener("resize", resizeHandler));

      renderCanvas(); // start the engine... brrrrr
    }
  }, null)

  return <canvas ref={setCanvas}></canvas>;
}
