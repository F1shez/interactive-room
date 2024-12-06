import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef, useState } from 'react';
import DraggableObj from './component/DraggableObj';
import { Object3D, Plane, Vector3 } from 'three';
import Wall from './component/Wall';
import './index.css';

const floorPlane = new Plane(new Vector3(0, 1, 0), 0);

function App() {
  const [dragging, setDragging] = useState(false);
  const [activeObjName, setActiveObjName] = useState<string>('');
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const objectsRef = useRef<Object3D[]>([]);

  const addObjectRef = (ref: Object3D) => {
    if (ref && !objectsRef.current.includes(ref)) {
      objectsRef.current.push(ref);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onClick={handleMouseMove} className="w-full h-screen">
      {activeObjName && <div style={{}} className='absolute w-screen h-screen z-50' onClick={(e) => { setActiveObjName(''); e.preventDefault(); }}>
        <div style={{
          top: cursorPosition.y,
          left: cursorPosition.x,
        }} className="absolute z-50 p-2 bg-white rounded-xl">это {activeObjName}</div>
      </div>}
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <group>
          <ambientLight />
          <directionalLight position={[5, 10, 5]} castShadow />
          <OrbitControls enabled={!dragging} />
        </group>
        <group>
          <planeHelper args={[floorPlane, 10]} />
          <mesh
            userData={{ collision: true }}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 10, 0]}
          >
            <planeGeometry attach="geometry" args={[10, 10]} />
            <meshBasicMaterial attach="material" color="#888866" />
          </mesh>
        </group>
        <group>
          <Wall rotation={[0, 0, 0]} position={[0, 5, -5]} />
          <Wall rotation={[-Math.PI, 0, 0]} position={[0, 5, 5]} />
          <Wall rotation={[0, -Math.PI / 2, 0]} position={[5, 5, 0]} />
          <Wall rotation={[0, Math.PI / 2, 0]} position={[-5, 5, 0]} />
          <DraggableObj setActiveObjName={setActiveObjName} figure='box' color='blue' addObjectRef={addObjectRef} origX={1} setIsDragging={setDragging} floorPlane={floorPlane} />
          <DraggableObj setActiveObjName={setActiveObjName} figure='sphere' color='red' addObjectRef={addObjectRef} origX={-1} setIsDragging={setDragging} floorPlane={floorPlane} />
        </group>
      </Canvas>
    </div>
  );
}

export default App;
