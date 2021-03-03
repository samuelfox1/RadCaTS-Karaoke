import React, { Suspense, useState } from "react";
import { Canvas, useThree } from "react-three-fiber";
import { CubeTextureLoader } from "three";
// import { OrbitControls } from "@react-three/drei";
import './KittyHeader.css';
import Kitty from "../3D/Kitty";
import ManageLights from "../3D/ManageLights";
// import { OrbitControls } from "@react-three/drei"

function SkyBox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();

  const texture = loader.load([
    "/3d/tronbg.png",
    "/3d/tronbg.png",
    "/3d/tronbg.png",
    "/3d/tronbg.png",
    "/3d/tronbg.png",
    "/3d/tronbg.png"
  ])
  scene.background = texture;
  return null;
}

function KittyHeader( { isPlaying } ) {

  return (
    <>
      <Canvas
        colorManagement
        shadowMap
        // camera={{ position: [0, 2, 16], fov: 40 }}>
        camera={{ position: [0, 2, 40], fov: 40 }}>
        <ambientLight intensity={0.7} />
        <ManageLights isPlaying={isPlaying} />
        {/* <OrbitControls /> */}
        <Suspense fallback={null} >
          <Kitty isPlaying={isPlaying} position={[0, -2, 0]} />
          <SkyBox />
        </Suspense>
      </Canvas>
    </>
  )
};

export default KittyHeader;