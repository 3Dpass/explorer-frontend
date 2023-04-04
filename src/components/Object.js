import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const textureUrl = "/space.jpg";
const textureUrls = [
  textureUrl,
  textureUrl,
  textureUrl,
  textureUrl,
  textureUrl,
  textureUrl,
];
const cubeTextureLoader = new THREE.CubeTextureLoader();
const textureCube = cubeTextureLoader.load(textureUrls);
textureCube.wrapS = THREE.MirroredRepeatWrapping;
textureCube.wrapT = THREE.MirroredRepeatWrapping;
textureCube.mapping = THREE.CubeRefractionMapping;

export default function Object({ geometry }) {
  const meshRef = useRef();
  const [scaled, setScaled] = useState(false);

  useEffect(() => {
    // scale object to fit in a viewport
    if (!scaled) {
      const bbox = new THREE.Box3().setFromObject(meshRef.current);
      const size = bbox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.0 / maxDim;
      meshRef.current.scale.set(scale, scale, scale);
      setScaled(true);
    }
  }, [meshRef, scaled]);

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }
    meshRef.current.rotation.set(
      clock.getElapsedTime() / 10.0,
      clock.getElapsedTime() / 10.0,
      clock.getElapsedTime() / 10.0
    );
  });

  return (
    <>
      <ambientLight color={[1, 1, 1]} />
      <pointLight intensity={2} position={[-10, -10, -10]} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhongMaterial
          color="#fff"
          envMap={textureCube}
          refractionRatio={0.7}
          reflectivity={1}
          flatShading={true}
        />
      </mesh>
    </>
  );
}
