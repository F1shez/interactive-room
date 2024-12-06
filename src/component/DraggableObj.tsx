import React, { useState, useRef, useEffect } from "react";
import { useDrag } from "@use-gesture/react";
import { animated } from "@react-spring/three";
import * as THREE from "three";
import { Object3D } from "three";

type Figure = "sphere" | "box" //виды мебели, например стул и кровать;

interface DraggableObjProps {
    origX: number; // Исходная позиция объекта по X
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
    floorPlane: THREE.Plane;
    addObjectRef: (ref: Object3D) => void;
    color: string;
    figure: Figure;
    setActiveObjName: (name: string) => void;
}

function DraggableObj({
    origX,
    setIsDragging,
    floorPlane,
    addObjectRef,
    color,
    figure,
    setActiveObjName
}: DraggableObjProps) {
    const [pos, setPos] = useState<number[]>([origX, 0.5, 0]);
    const dragObjectRef = useRef<THREE.Mesh>(null);
    const [isDragging, setIsDraggingState] = useState(false);


    useEffect(() => {
        if (dragObjectRef.current) {
            addObjectRef(dragObjectRef.current);
        }
    }, [addObjectRef]);

    const isColliding = (newPos: number[]) => {
        if (dragObjectRef.current) {
            const boundingBox = new THREE.Box3().setFromObject(dragObjectRef.current);

            boundingBox.translate(
                new THREE.Vector3(newPos[0] - pos[0], newPos[1] - pos[1], newPos[2] - pos[2])
            );

            for (const obj of dragObjectRef.current.parent?.children || []) {
                if (obj !== dragObjectRef.current && obj.userData.collision) {
                    const otherBoundingBox = new THREE.Box3().setFromObject(obj);
                    if (boundingBox.intersectsBox(otherBoundingBox)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const bind = useDrag(
        ({ active, event }) => {
            if (active) {
                const planeIntersectPoint = new THREE.Vector3();
                (event as any).ray.intersectPlane(floorPlane, planeIntersectPoint);

                if (!isColliding([planeIntersectPoint.x, 0.5, planeIntersectPoint.z])) {
                    setPos([planeIntersectPoint.x, 0.5, planeIntersectPoint.z]);
                } else if (!isColliding([planeIntersectPoint.x, 0.5, pos[2]])) {
                    setPos([planeIntersectPoint.x, 0.5, pos[2]]);
                } else if (!isColliding([pos[0], 0.5, planeIntersectPoint.z])) {
                    setPos([pos[0], 0.5, planeIntersectPoint.z]);
                }
            }
            setIsDraggingState(active);
            setIsDragging(active);
        },
        { delay: true }
    );

    return (
        <animated.mesh
            onClick={() => { if (!isDragging) setActiveObjName(figure) }}
            position={pos}
            {...bind() as any}
            userData={{ collision: true }}
            castShadow
            ref={dragObjectRef}
        >
            {figure === "box" && <boxGeometry args={[1, 1, 1]} />}
            {figure === "sphere" && <sphereGeometry args={[0.5, 32, 32]} />}
            <meshStandardMaterial color={color} />
        </animated.mesh>
    );
}

export default DraggableObj;
