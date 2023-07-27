import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "react-three-fiber";
import { useGLTF } from "@react-three/drei";
import useMousePosition from "../../../utils/useMousePosition";

function Kitty({ isPlaying }) {
  const [time, setTime] = useState(0);

  const group = useRef();
  let mousePosition = useMousePosition();

  useEffect(() => {
    if (isPlaying) {
      const timeInterval = setInterval(() => {
        setTime(Math.sin(Date.now() / 100));
      }, 40);

      return () => {
        clearInterval(timeInterval);
      };
    }
  });

  useFrame(() => {
    group.current.rotation.x =
      -Math.atan(
        (window.innerHeight / 2 - mousePosition.mouseY) /
          (window.innerHeight / 2)
      ) + (isPlaying ? time / 40 : 0);
    group.current.rotation.y = -Math.atan(
      (window.innerWidth / 2 - mousePosition.mouseX) / (window.innerWidth / 2)
    );
  });
  const { nodes, materials } = useGLTF("/3d/KittyA.gltf");

  return (
    <group ref={group} dispose={null}>
      <group position={[0, 0, 0]}>
        <mesh
          material={materials.blinn1}
          geometry={nodes.KittyA_MSHPIV.geometry}
          position={[0, 0, 0]}
        />
      </group>
    </group>
  );
}

export default Kitty;
