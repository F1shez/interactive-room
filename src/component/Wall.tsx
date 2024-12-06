interface WallProps {
    position: [number, number, number];
    rotation: [number, number, number];
}

export default function Wall({ position, rotation }: WallProps) {
    return (
        <mesh
            userData={{ collision: true }}
            rotation={rotation}
            position={position}
        >
            <planeGeometry attach="geometry" args={[10, 10]} />
            <meshBasicMaterial attach="material" color="#888888" />
        </mesh>
    );
}
