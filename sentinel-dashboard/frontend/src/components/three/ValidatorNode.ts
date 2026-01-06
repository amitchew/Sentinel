import * as THREE from 'three';
import { Validator } from '../../types';

export class ValidatorNodeManager {
    private scene: THREE.Scene;
    private mesh: THREE.InstancedMesh | null = null;
    private dummy = new THREE.Object3D();
    private color = new THREE.Color();
    private validators: Validator[] = [];
    private nodePositions: Map<string, THREE.Vector3> = new Map();

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    public updateValidators(validators: Validator[]) {
        this.validators = validators;
        const count = validators.length;

        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh.dispose();
        }

        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshPhysicalMaterial({ 
            color: 0xffffff,
            metalness: 0.2,
            roughness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            emissiveIntensity: 0.5
        });

        this.mesh = new THREE.InstancedMesh(geometry, material, count);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        const phi = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < count; i++) {
            const v = validators[i];
            
            const y = 1 - (i / (count - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            
            const pos = new THREE.Vector3(x, y, z).multiplyScalar(60);
            this.nodePositions.set(v.id, pos);

            this.dummy.position.copy(pos);
            
            const scale = 1 + (v.stake / 1000000) * 2;
            this.dummy.scale.set(scale, scale, scale);
            
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);

            if (v.status === 'active') this.color.setHex(0x00ff9d);
            else if (v.status === 'jailed') this.color.setHex(0xff0055);
            else this.color.setHex(0x374151);

            this.mesh.setColorAt(i, this.color);
        }

        this.mesh.instanceMatrix.needsUpdate = true;
        this.mesh.instanceColor!.needsUpdate = true;
        
        this.scene.add(this.mesh);
    }

    public update() {

        if (this.mesh) {
            this.mesh.rotation.y += 0.001;
        }
    }

    public getPosition(id: string): THREE.Vector3 | undefined {
        return this.nodePositions.get(id);
    }

    public getValidatorAt(instanceId: number): Validator | undefined {
        return this.validators[instanceId];
    }
    
    public getMesh(): THREE.InstancedMesh | null {
        return this.mesh;
    }

    public dispose() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            (this.mesh.material as THREE.Material).dispose();
        }
    }
}
