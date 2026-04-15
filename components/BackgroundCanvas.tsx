import React, { useRef, useLayoutEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const CameraRig = () => {
  const { camera } = useThree();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    // We create a timeline linked to the scroll of the entire document body
    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth scrubbing
      }
    });

    // Animate camera moving forward and slightly rotating
    timelineRef.current
      .to(camera.position, { z: -50, ease: "none" }, 0)
      .to(camera.rotation, { z: Math.PI / 4, ease: "none" }, 0);

    return () => {
      // Cleanup
      if (timelineRef.current) {
        timelineRef.current.scrollTrigger?.kill();
        timelineRef.current.kill();
      }
    };
  }, [camera]);

  return null;
};

const BackgroundCanvas: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{ alpha: true, antialias: true }}
      >
        <CameraRig />
        <ambientLight intensity={0.5} />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
      </Canvas>
    </div>
  );
};

export default BackgroundCanvas;