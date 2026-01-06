
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useValidatorStore } from '../../store/validatorStore';
import { useUIStore } from '../../store/uiStore';
import { ValidatorNodeManager } from './ValidatorNode';
import { ConnectionLineManager } from './ConnectionLines';
import { CameraRig } from './CameraRig';

export const NetworkScene = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const frameIdRef = useRef<number>(0);
    

    const nodeManagerRef = useRef<ValidatorNodeManager | null>(null);
    const connectionManagerRef = useRef<ConnectionLineManager | null>(null);
    const cameraRigRef = useRef<CameraRig | null>(null);

    const { validators } = useValidatorStore();
    const { setSelectedValidatorId } = useUIStore();

    useEffect(() => {
        if (!containerRef.current) return;


        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#0a0a0b');
        scene.fog = new THREE.FogExp2('#0a0a0b', 0.002);
        sceneRef.current = scene;


        const camera = new THREE.PerspectiveCamera(
            60, 
            containerRef.current.clientWidth / containerRef.current.clientHeight, 
            0.1, 
            1000
        );
        camera.position.set(0, 100, 200);
        cameraRef.current = camera;


        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;


        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxDistance = 500;
        controls.minDistance = 20;
        controlsRef.current = controls;


        cameraRigRef.current = new CameraRig(camera, controls);


        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(50, 50, 50);
        scene.add(pointLight);


        nodeManagerRef.current = new ValidatorNodeManager(scene);
        connectionManagerRef.current = new ConnectionLineManager(scene);


        const onMouseMove = (event: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };

        const onClick = () => {
             if (!cameraRef.current || !nodeManagerRef.current) return;
             raycaster.current.setFromCamera(mouse.current, cameraRef.current);
             
             const mesh = nodeManagerRef.current.getMesh();
             if (mesh) {
                 const intersects = raycaster.current.intersectObject(mesh);
                 if (intersects.length > 0) {
                     const instanceId = intersects[0].instanceId;
                     if (instanceId !== undefined) {
                         const validator = nodeManagerRef.current.getValidatorAt(instanceId);
                         if (validator) {
                             setSelectedValidatorId(validator.id);
                             const pos = nodeManagerRef.current.getPosition(validator.id);
                             if (pos && cameraRigRef.current) {
                                 cameraRigRef.current.focusOnPosition(pos);
                             }
                         }
                     }
                 } else {
                     setSelectedValidatorId(null);
                     cameraRigRef.current?.reset();
                 }
             }
        };

        const onDoubleClick = () => {

        };

        containerRef.current.addEventListener('mousemove', onMouseMove);
        containerRef.current.addEventListener('click', onClick);
        containerRef.current.addEventListener('dblclick', onDoubleClick);


        const animate = () => {
            frameIdRef.current = requestAnimationFrame(animate);
            
            if (controlsRef.current) controlsRef.current.update();
            if (nodeManagerRef.current) nodeManagerRef.current.update();
            

            
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();


        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
            cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                containerRef.current.removeEventListener('mousemove', onMouseMove);
                containerRef.current.removeEventListener('click', onClick);
                containerRef.current.removeEventListener('dblclick', onDoubleClick);
            }
            cancelAnimationFrame(frameIdRef.current);
            if (rendererRef.current) {
                rendererRef.current.dispose();
                containerRef.current?.removeChild(rendererRef.current.domElement);
            }
            nodeManagerRef.current?.dispose();
            connectionManagerRef.current?.dispose();
        };
    }, []);


    useEffect(() => {
        if (nodeManagerRef.current && validators.length > 0) {
            nodeManagerRef.current.updateValidators(validators);
            if (connectionManagerRef.current) connectionManagerRef.current.updateConnections(validators);
        }
    }, [validators]);

    return <div ref={containerRef} className="absolute inset-0" />;
};
