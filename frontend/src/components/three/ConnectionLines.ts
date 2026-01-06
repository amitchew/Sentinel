import * as THREE from 'three';
import { Validator } from '../../types';

export class ConnectionLineManager {
    private scene: THREE.Scene;
    private lines: THREE.LineSegments | null = null;
    


    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    public updateConnections(validators: Validator[]) {
         if (this.lines) {
            this.scene.remove(this.lines);
            this.lines.geometry.dispose();
             if (Array.isArray(this.lines.material)) {
                 this.lines.material.forEach(m => m.dispose());
             } else {
                 this.lines.material.dispose();
             }
         }

        const points: number[] = [];
        const positions = new Map<string, THREE.Vector3>();


        const count = validators.length;
        const phi = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < count; i++) {
             const y = 1 - (i / (count - 1)) * 2;
             const radius = Math.sqrt(1 - y * y);
             const theta = phi * i;
             const x = Math.cos(theta) * radius;
             const z = Math.sin(theta) * radius;
             const pos = new THREE.Vector3(x, y, z).multiplyScalar(60);
             positions.set(validators[i].id, pos);
        }


        validators.forEach(v => {
            const start = positions.get(v.id);
            if (!start) return;

            v.peers.forEach(peerId => {
                const end = positions.get(peerId);
                if (end && v.id < peerId) {
                    points.push(start.x, start.y, start.z);
                    points.push(end.x, end.y, end.z);
                }
            });
        });

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        
        const material = new THREE.LineBasicMaterial({ 
            color: 0x00f3ff,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending 
        });

        this.lines = new THREE.LineSegments(geometry, material);
        this.scene.add(this.lines);
    }

    public dispose() {
        if (this.lines) {
            this.scene.remove(this.lines);
            this.lines.geometry.dispose();
            (this.lines.material as THREE.Material).dispose();
        }
    }
}
