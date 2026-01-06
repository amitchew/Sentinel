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
            
            const logStake = Math.log10(v.stake + 10);
            const baseScale = Math.max(0.7, Math.min(6.0, logStake / 2)); 
            
            this.dummy.scale.set(baseScale, baseScale, baseScale);
            
            this.dummy.updateMatrix();
            this.mesh.setMatrixAt(i, this.dummy.matrix);

            this.color.setHex(0x374151);

            if (v.status === 'active') {
                const t = 1 - (i / count); 
                
                if (t > 0.9) {
                    this.color.setHSL(0.9 - ((t - 0.9) * 3.5), 1.0, 0.6); 
                } else {
                    const normalizedT = t / 0.9;
                    this.color.setHSL(0.6 + (normalizedT * 0.15), 0.9, 0.5 + (normalizedT * 0.2));
                }
            }
            else if (v.status === 'jailed') this.color.setHex(0xff003c);
            else if (v.status === 'unbonding') this.color.setHex(0xff9f1c);
            else if (v.status === 'unbonded') this.color.setHex(0x2b2d42);

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
