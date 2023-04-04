import { Suspense } from "react";
import { Card, Elevation } from "@blueprintjs/core";
import Object from "../components/Object";
import { Canvas } from "@react-three/fiber";
import { OBJLoader } from "three-stdlib";

export default function Block({ object3d }) {
  const loader = new OBJLoader();
  const object3dMesh = loader.parse(object3d).children[0];

  return (
    <Card elevation={Elevation.ZERO}>
      <div className="canvas-container" style={{ height: "300px" }}>
        <Canvas
          camera={{
            fov: 30,
            near: 0.1,
            far: 1000,
            position: [0, 0, 2],
          }}
        >
          <Suspense fallback={null}>
            <Object geometry={object3dMesh.geometry} />
          </Suspense>
        </Canvas>
      </div>
    </Card>
  );
}
