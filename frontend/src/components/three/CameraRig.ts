import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

export class CameraRig {
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;
    
    constructor(camera: THREE.PerspectiveCamera, controls: OrbitControls) {
        this.camera = camera;
        this.controls = controls;
    }

    public focusOnPosition(position: THREE.Vector3) {

        gsap.to(this.controls.target, {
            x: position.x,
            y: position.y,
            z: position.z,
            duration: 1.5,
            ease: "power3.inOut",
            onUpdate: () => {
                this.controls.update();
            }
        });

        const offset = new THREE.Vector3().subVectors(this.camera.position, this.controls.target);

        const targetPos = position.clone().add(offset.normalize().multiplyScalar(40));

        gsap.to(this.camera.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 1.5,
            ease: "power3.inOut"
        });
    }

    public reset() {
        gsap.to(this.controls.target, {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.5,
            ease: "power3.inOut"
        });
        
        gsap.to(this.camera.position, {
            x: 0,
            y: 100,
            z: 200,
            duration: 1.5,
            ease: "power3.inOut"
        });
    }
}
