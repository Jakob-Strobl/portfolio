import { Vector2, WebGLRenderer, Mesh, Scene, PerspectiveCamera, Color, PlaneGeometry, RawShaderMaterial } from "three";

import vertex from "./waves.vert";
import fragment from "./waves.frag";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { isMobile } from "../actions/device-actions";
import { Vec2 } from "../types/vector2";

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
    direction: base_direction.rotateAround(base_pos, Math.PI * Math.random() * 0.25 - Math.PI * 0.125),
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

  let renderer: WebGLRenderer | undefined;
  try {
    // A test on the IsomorphicBackground component is failing because three.js throws an error "Error creating WebGL context."
    // I thought the tests weren't supposed to render the clientOnly code (this code), but maybe I misunderstood.
    // Not sure if breaking change from some recent dependency updates or if it wasn't supposed to work
    // Either way we don't need the renderer to be created for the tests.
    // TODO investigate later
    renderer = new WebGLRenderer({ antialias: true, canvas: canvas });
    renderer.setSize(width, height);
    renderer.setClearColor(new Color(0x130d20));
  } catch (e) {
    console.warn("Waves: Failed to create WebGLRenderer", e);
  }

  return { renderer, wave_mesh, scene, camera };
}

function getCanvasDimensions(): Vec2 {
  if (isMobile()) {
    return { x: screen.width, y: screen.height };
  }

  const vv = window.visualViewport;
  return vv
    ? { x: vv.width, y: vv.height }
    : { x: window.innerWidth, y: window.outerHeight };
}

export interface WavesBackgroundProps {
  num_waves: number;
}

export default function WavesBackground(props: WavesBackgroundProps) {
  const wind_direction = new Vector2().random().normalize();
  const base = new Vector2();
  const waves: Wave[] = [];
  const { x: viewportWidth, y: viewportHieght } = getCanvasDimensions();0;
  const [canvasEl, setCanvasEl] = createSignal<HTMLCanvasElement>();
  const [isReady, setReady] = createSignal(false);

  for (let i = 0; i < props.num_waves; i++) {
    waves.push(createWave(base, wind_direction));
  }

  createEffect(() => {
    if (canvasEl() != null && canvasEl()?.getContext != null) {
      const { renderer, wave_mesh, scene, camera } = createScene(waves, viewportWidth, viewportHieght, canvasEl()!);

      function renderCanvas(this: WebGLRenderer, timestamp = 0) {
        requestAnimationFrame(renderCanvas.bind(this));
        this.render(scene, camera);

        // Update Shader Uniforms to do the wave motion
        //@ts-ignore
        wave_mesh.material.uniforms["time"].value = timestamp * 0.005;
        //@ts-ignore
        wave_mesh.material.uniforms["sineTime"].value = Math.sin(timestamp * 0.00005);
      }

      function resizeHandler() {
        const { x: width, y: height } = getCanvasDimensions();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer?.setSize(width, height);
      }

      onMount(() => {
        window.addEventListener("resize", resizeHandler);
        // FIX(Safari iOS): On orientation change the resize event is fired before the dimensions are updated, 
        //   hence the timeout.
        window.addEventListener("orientationchange", () => setTimeout(resizeHandler, 300));
        setTimeout(() => setReady(true), 1);
      });
      onCleanup(() => window.removeEventListener("resize", resizeHandler));

      if (renderer != undefined) {
        renderCanvas.bind(renderer)(); // start the engine... brrrrr
      }
    }
  }, null);

  return (
    <canvas
      ref={setCanvasEl}
      class="fade-in duration-700 min-h-[-webkit-fill-available]"
      classList={{
        "opacity-0": !isReady(),
      }}
    ></canvas>
  );
}
