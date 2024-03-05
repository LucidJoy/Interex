import React from "react";
import { Environment, Float, Sparkles, Text3D } from "@react-three/drei";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";

const Hero = () => {
  return (
    <>
      <color attach='background' args={["#000000"]} />

      <ambientLight intensity={2} />
      <spotLight
        position={[0, 25, 0]}
        angle={1.3}
        penumbra={1}
        castShadow
        intensity={0.5}
        shadow-bias={-0.001}
      />

      <Environment preset='studio' />

      <EffectComposer>
        <Bloom
          intensity={2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={1000}
        />
        <DepthOfField
          focusDistance={0}
          focalLength={0.02}
          bokehScale={5}
          height={480}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.5} />
      </EffectComposer>

      <Float speed={0.7} floatingRange={[18, 18]}>
        <Sparkles
          noise={0}
          count={500}
          speed={0.01}
          size={0.6}
          color={"#FFD2BE"}
          opacity={10}
          scale={[20, 100, 20]}
        />
        <Sparkles
          noise={0}
          count={50}
          speed={0.01}
          size={10}
          color={"#FFF"}
          opacity={2}
          scale={[30, 100, 10]}
        />
      </Float>
    </>
  );
};

export default Hero;
