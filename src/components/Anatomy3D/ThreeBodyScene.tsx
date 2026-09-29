import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { ANATOMY_STRUCTURES, AnatomicalStructure } from '../../anatomy/anatomyData';

interface ThreeBodySceneProps {
  selectedStructureId: string | null;
  onSelectStructure: (structure: AnatomicalStructure) => void;
  activeSystems: Record<string, boolean>;
  activeLayer: number; // 1 to 8
  viewPreset: 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom' | 'head' | 'chest' | 'abdomen' | 'pelvis' | 'upper_limb' | 'lower_limb';
  isXRayMode: boolean;
  transparencyValue: number; // 0 to 100
  isIsolatedMode: boolean;
  isExplodedView?: boolean;
  explodeFactor?: number;
  crossSectionAxis: 'none' | 'x' | 'y' | 'z';
  crossSectionPosition: number; // -2 to 2
  showLabels: boolean;
  autoRotate: boolean;
  bodySex: 'male' | 'female';
  functionalView: 'none' | 'circulation' | 'respiration' | 'digestion' | 'nervous' | 'lymph';
  onCaptureScreenshotRef?: (callback: () => string) => void;
}

export const ThreeBodyScene: React.FC<ThreeBodySceneProps> = ({
  selectedStructureId,
  onSelectStructure,
  activeSystems,
  activeLayer,
  viewPreset,
  isXRayMode,
  transparencyValue,
  isIsolatedMode,
  isExplodedView = false,
  explodeFactor = 0,
  crossSectionAxis,
  crossSectionPosition,
  showLabels,
  autoRotate,
  bodySex,
  functionalView,
  onCaptureScreenshotRef
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshMapRef = useRef<Map<string, THREE.Mesh | THREE.Group>>(new Map());
  const materialsMapRef = useRef<Map<string, THREE.Material>>(new Map());
  const originalPositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());
  const clippingPlaneRef = useRef<THREE.Plane | null>(null);

  // Interaction & camera animation state
  const isDraggingRef = useRef(false);
  const isPanningRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDistanceRef = useRef<number | null>(null);
  const cameraDistanceRef = useRef(5.0);
  const cameraAngleRef = useRef({ theta: 0, phi: Math.PI / 2 }); // spherical coords
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0.4, 0));
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0.4, 0));
  const [hoveredStructure, setHoveredStructure] = useState<AnatomicalStructure | null>(null);

  // Label 2D screen positions projection state
  const [labelPositions, setLabelPositions] = useState<{ id: string; name: string; x: number; y: number; visible: boolean }[]>([]);

  // Camera preset positions
  const applyCameraPreset = useCallback((preset: string) => {
    switch (preset) {
      case 'front':
        cameraAngleRef.current = { theta: 0, phi: Math.PI / 2 };
        targetLookAtRef.current.set(0, 0.4, 0);
        cameraDistanceRef.current = 4.8;
        break;
      case 'back':
        cameraAngleRef.current = { theta: Math.PI, phi: Math.PI / 2 };
        targetLookAtRef.current.set(0, 0.4, 0);
        cameraDistanceRef.current = 4.8;
        break;
      case 'left':
        cameraAngleRef.current = { theta: -Math.PI / 2, phi: Math.PI / 2 };
        targetLookAtRef.current.set(0, 0.4, 0);
        cameraDistanceRef.current = 4.8;
        break;
      case 'right':
        cameraAngleRef.current = { theta: Math.PI / 2, phi: Math.PI / 2 };
        targetLookAtRef.current.set(0, 0.4, 0);
        cameraDistanceRef.current = 4.8;
        break;
      case 'top':
        cameraAngleRef.current = { theta: 0, phi: 0.1 };
        targetLookAtRef.current.set(0, 0.4, 0);
        cameraDistanceRef.current = 5.2;
        break;
      case 'bottom':
        cameraAngleRef.current = { theta: 0, phi: Math.PI - 0.1 };
        targetLookAtRef.current.set(0, -0.4, 0);
        cameraDistanceRef.current = 5.2;
        break;
      case 'head':
        cameraAngleRef.current = { theta: 0, phi: Math.PI / 2 };
        targetLookAtRef.current.set(0, 2.3, 0);
        cameraDistanceRef.current = 1.9;
        break;
      case 'chest':
        cameraAngleRef.current = { theta: 0, phi: Math.PI / 2 };
        targetLookAtRef.current.set(0, 1.35, 0.1);
        cameraDistanceRef.current = 2.4;
        break;
      case 'abdomen':
        cameraAngleRef.current = { theta: 0, phi: Math.PI / 2 };
        targetLookAtRef.current.set(0, 0.55, 0.1);
        cameraDistanceRef.current = 2.3;
        break;
      case 'pelvis':
        cameraAngleRef.current = { theta: 0, phi: Math.PI / 2 };
        targetLookAtRef.current.set(0, 0.05, 0);
        cameraDistanceRef.current = 2.2;
        break;
      case 'upper_limb':
        cameraAngleRef.current = { theta: -0.3, phi: Math.PI / 2 };
        targetLookAtRef.current.set(-0.45, 1.35, 0);
        cameraDistanceRef.current = 2.3;
        break;
      case 'lower_limb':
        cameraAngleRef.current = { theta: 0, phi: Math.PI / 2 };
        targetLookAtRef.current.set(-0.24, -1.0, 0);
        cameraDistanceRef.current = 3.0;
        break;
    }
  }, []);

  useEffect(() => {
    applyCameraPreset(viewPreset);
  }, [viewPreset, applyCameraPreset]);

  // Center camera on selected structure
  useEffect(() => {
    if (selectedStructureId && ANATOMY_STRUCTURES[selectedStructureId]) {
      const struct = ANATOMY_STRUCTURES[selectedStructureId];
      targetLookAtRef.current.set(struct.position3D[0], struct.position3D[1], struct.position3D[2]);
      cameraDistanceRef.current = Math.max(1.8, Math.min(3.2, cameraDistanceRef.current));
    }
  }, [selectedStructureId]);

  // Expose screenshot method
  useEffect(() => {
    if (onCaptureScreenshotRef && rendererRef.current) {
      onCaptureScreenshotRef(() => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
          return rendererRef.current.domElement.toDataURL('image/png');
        }
        return '';
      });
    }
  }, [onCaptureScreenshotRef]);

  // Setup WebGL Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 700;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    cameraRef.current = camera;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xfff8ee, 1.4);
    mainKeyLight.position.set(3, 5, 4);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1); // Cyan rim light for medical glow
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xa5b4fc, 0.7); // Subtle fill
    fillLight.position.set(0, -3, 3);
    scene.add(fillLight);

    // Anatomical Grid Platform
    const gridHelper = new THREE.GridHelper(6, 24, 0x0284c7, 0x1e293b);
    gridHelper.position.y = -2.25;
    scene.add(gridHelper);

    // Subtle Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.12, 32);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.8,
      metalness: 0.2
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -2.31;
    scene.add(pedestal);

    // ==========================================
    // BUILD 3D ANATOMICAL MODEL OBJECTS
    // ==========================================
    const anatomyGroup = new THREE.Group();
    anatomyGroup.name = 'HumanAnatomyModel';
    scene.add(anatomyGroup);

    meshMapRef.current.clear();
    materialsMapRef.current.clear();

    // Helper material generator
    const createAnatomyMaterial = (colorHex: string, roughness = 0.45, metalness = 0.1) => {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        roughness,
        metalness,
        side: THREE.DoubleSide
      });
      return mat;
    };

    // 1. SKULL / CRANIUM
    const skullGroup = new THREE.Group();
    const craniumMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 24, 24),
      createAnatomyMaterial('#f8fafc', 0.6)
    );
    craniumMesh.scale.set(1, 1.25, 1.1);
    craniumMesh.position.set(0, 2.38, 0.05);

    const jawMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.12, 0.22, 16),
      createAnatomyMaterial('#f1f5f9', 0.65)
    );
    jawMesh.position.set(0, 2.12, 0.14);
    jawMesh.rotation.x = 0.2;

    skullGroup.add(craniumMesh);
    skullGroup.add(jawMesh);
    skullGroup.userData = { structureId: 'cranium_skull' };
    craniumMesh.userData = { structureId: 'cranium_skull' };
    jawMesh.userData = { structureId: 'cranium_skull' };
    anatomyGroup.add(skullGroup);
    meshMapRef.current.set('cranium_skull', skullGroup);
    materialsMapRef.current.set('cranium_skull', craniumMesh.material);

    // 2. BRAIN (Interior neurocranium)
    const brainGroup = new THREE.Group();
    const brainLeft = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 20, 20),
      createAnatomyMaterial('#c084fc', 0.7)
    );
    brainLeft.scale.set(0.7, 1.05, 1.2);
    brainLeft.position.set(-0.1, 2.36, 0.04);

    const brainRight = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 20, 20),
      createAnatomyMaterial('#c084fc', 0.7)
    );
    brainRight.scale.set(0.7, 1.05, 1.2);
    brainRight.position.set(0.1, 2.36, 0.04);

    const cerebellum = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      createAnatomyMaterial('#a855f7', 0.8)
    );
    cerebellum.scale.set(1.4, 0.8, 1);
    cerebellum.position.set(0, 2.18, -0.12);

    brainGroup.add(brainLeft, brainRight, cerebellum);
    brainGroup.userData = { structureId: 'brain' };
    brainLeft.userData = { structureId: 'brain' };
    brainRight.userData = { structureId: 'brain' };
    cerebellum.userData = { structureId: 'brain' };
    anatomyGroup.add(brainGroup);
    meshMapRef.current.set('brain', brainGroup);
    materialsMapRef.current.set('brain', brainLeft.material);

    // 3. VERTEBRAL COLUMN & SPINAL CORD
    const spineCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.05, -0.06),
      new THREE.Vector3(0, 1.8, -0.09), // cervical lordosis
      new THREE.Vector3(0, 1.35, -0.03), // thoracic kyphosis
      new THREE.Vector3(0, 0.75, -0.1), // lumbar lordosis
      new THREE.Vector3(0, 0.15, -0.05) // sacrum
    ]);
    const spineGeo = new THREE.TubeGeometry(spineCurve, 32, 0.075, 12, false);
    const spineMesh = new THREE.Mesh(spineGeo, createAnatomyMaterial('#e2e8f0', 0.7));
    spineMesh.userData = { structureId: 'vertebral_column' };
    anatomyGroup.add(spineMesh);
    meshMapRef.current.set('vertebral_column', spineMesh);
    materialsMapRef.current.set('vertebral_column', spineMesh.material);

    // Spinal cord (internal neural tract)
    const cordGeo = new THREE.TubeGeometry(spineCurve, 32, 0.035, 8, false);
    const cordMesh = new THREE.Mesh(cordGeo, createAnatomyMaterial('#e9d5ff', 0.4, 0.2));
    cordMesh.userData = { structureId: 'spinal_cord' };
    anatomyGroup.add(cordMesh);
    meshMapRef.current.set('spinal_cord', cordMesh);
    materialsMapRef.current.set('spinal_cord', cordMesh.material);

    // 4. RIB CAGE & STERNUM
    const ribcageGroup = new THREE.Group();
    // Sternum
    const sternumMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.55, 0.05),
      createAnatomyMaterial('#f8fafc', 0.6)
    );
    sternumMesh.position.set(0, 1.32, 0.32);
    ribcageGroup.add(sternumMesh);

    // Rib hoops
    for (let r = 0; r < 9; r++) {
      const ribRadius = 0.32 + Math.sin((r / 8) * Math.PI) * 0.16;
      const ribY = 1.62 - r * 0.085;
      const ribGeo = new THREE.TorusGeometry(ribRadius, 0.024, 8, 24, Math.PI * 1.5);
      const ribMesh = new THREE.Mesh(ribGeo, createAnatomyMaterial('#f1f5f9', 0.65));
      ribMesh.rotation.x = Math.PI / 2 + 0.15;
      ribMesh.rotation.z = Math.PI * 0.25;
      ribMesh.position.set(0, ribY, 0.06);
      ribcageGroup.add(ribMesh);
    }
    ribcageGroup.userData = { structureId: 'ribs' };
    sternumMesh.userData = { structureId: 'ribs' };
    anatomyGroup.add(ribcageGroup);
    meshMapRef.current.set('ribs', ribcageGroup);
    materialsMapRef.current.set('ribs', sternumMesh.material);

    // 5. HEART
    const heartMesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.24, 2),
      createAnatomyMaterial('#dc2626', 0.35, 0.15)
    );
    heartMesh.scale.set(0.95, 1.25, 0.85);
    heartMesh.position.set(-0.12, 1.26, 0.16);
    heartMesh.rotation.z = -0.25;
    heartMesh.rotation.y = 0.2;
    heartMesh.userData = { structureId: 'heart' };
    anatomyGroup.add(heartMesh);
    meshMapRef.current.set('heart', heartMesh);
    materialsMapRef.current.set('heart', heartMesh.material);

    // 6. AORTA & GREAT VESSELS
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, 1.32, 0.15),
      new THREE.Vector3(-0.06, 1.55, 0.12), // ascending
      new THREE.Vector3(-0.02, 1.62, 0.08), // arch
      new THREE.Vector3(-0.05, 1.35, -0.02), // thoracic descending
      new THREE.Vector3(-0.04, 0.7, -0.04) // abdominal
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 28, 0.04, 12, false);
    const aortaMesh = new THREE.Mesh(aortaGeo, createAnatomyMaterial('#ef4444', 0.3, 0.2));
    aortaMesh.userData = { structureId: 'aorta' };
    anatomyGroup.add(aortaMesh);
    meshMapRef.current.set('aorta', aortaMesh);
    materialsMapRef.current.set('aorta', aortaMesh.material);

    // Superior Vena Cava
    const svcCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.08, 1.62, 0.1),
      new THREE.Vector3(0.06, 1.35, 0.14)
    ]);
    const svcGeo = new THREE.TubeGeometry(svcCurve, 12, 0.042, 12, false);
    const svcMesh = new THREE.Mesh(svcGeo, createAnatomyMaterial('#3b82f6', 0.35, 0.2));
    svcMesh.userData = { structureId: 'superior_vena_cava' };
    anatomyGroup.add(svcMesh);
    meshMapRef.current.set('superior_vena_cava', svcMesh);
    materialsMapRef.current.set('superior_vena_cava', svcMesh.material);

    // 7. LUNGS
    const lungsGroup = new THREE.Group();
    const rightLung = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.7, 16),
      createAnatomyMaterial('#f472b6', 0.6)
    );
    rightLung.scale.set(1.1, 1, 0.85);
    rightLung.position.set(0.24, 1.28, 0.12);
    rightLung.rotation.z = -0.08;

    const leftLung = new THREE.Mesh(
      new THREE.ConeGeometry(0.26, 0.65, 16),
      createAnatomyMaterial('#f472b6', 0.6)
    );
    leftLung.scale.set(1.0, 1, 0.8);
    leftLung.position.set(-0.25, 1.28, 0.12);
    leftLung.rotation.z = 0.08;

    lungsGroup.add(rightLung, leftLung);
    lungsGroup.userData = { structureId: 'lungs' };
    rightLung.userData = { structureId: 'lungs' };
    leftLung.userData = { structureId: 'lungs' };
    anatomyGroup.add(lungsGroup);
    meshMapRef.current.set('lungs', lungsGroup);
    materialsMapRef.current.set('lungs', rightLung.material);

    // 8. TRACHEA
    const tracheaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.95, 0.1),
      new THREE.Vector3(0, 1.5, 0.12)
    ]);
    const tracheaGeo = new THREE.TubeGeometry(tracheaCurve, 16, 0.042, 12, false);
    const tracheaMesh = new THREE.Mesh(tracheaGeo, createAnatomyMaterial('#cbd5e1', 0.5));
    tracheaMesh.userData = { structureId: 'trachea' };
    anatomyGroup.add(tracheaMesh);
    meshMapRef.current.set('trachea', tracheaMesh);
    materialsMapRef.current.set('trachea', tracheaMesh.material);

    // 9. DIAPHRAGM
    const diaphragmGeo = new THREE.SphereGeometry(0.48, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const diaphragmMesh = new THREE.Mesh(diaphragmGeo, createAnatomyMaterial('#b91c1c', 0.5));
    diaphragmMesh.position.set(0, 0.96, 0.08);
    diaphragmMesh.rotation.x = Math.PI;
    diaphragmMesh.scale.set(1.1, 0.35, 0.9);
    diaphragmMesh.userData = { structureId: 'diaphragm' };
    anatomyGroup.add(diaphragmMesh);
    meshMapRef.current.set('diaphragm', diaphragmMesh);
    materialsMapRef.current.set('diaphragm', diaphragmMesh.material);

    // 10. LIVER
    const liverMesh = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.35, 2),
      createAnatomyMaterial('#991b1b', 0.45, 0.1)
    );
    liverMesh.scale.set(1.3, 0.75, 0.9);
    liverMesh.position.set(0.18, 0.78, 0.16);
    liverMesh.rotation.z = -0.15;
    liverMesh.userData = { structureId: 'liver' };
    anatomyGroup.add(liverMesh);
    meshMapRef.current.set('liver', liverMesh);
    materialsMapRef.current.set('liver', liverMesh.material);

    // 11. STOMACH
    const stomachGroup = new THREE.Group();
    const stomachBody = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.1, 16, 24, Math.PI * 1.25),
      createAnatomyMaterial('#f97316', 0.4)
    );
    stomachBody.position.set(-0.16, 0.76, 0.17);
    stomachBody.rotation.z = Math.PI * 0.75;
    stomachGroup.add(stomachBody);
    stomachGroup.userData = { structureId: 'stomach' };
    stomachBody.userData = { structureId: 'stomach' };
    anatomyGroup.add(stomachGroup);
    meshMapRef.current.set('stomach', stomachGroup);
    materialsMapRef.current.set('stomach', stomachBody.material);

    // 12. PANCREAS
    const pancreasMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.03, 0.35, 12),
      createAnatomyMaterial('#fbbf24', 0.5)
    );
    pancreasMesh.position.set(0.02, 0.65, 0.08);
    pancreasMesh.rotation.z = Math.PI / 2.3;
    pancreasMesh.userData = { structureId: 'pancreas' };
    anatomyGroup.add(pancreasMesh);
    meshMapRef.current.set('pancreas', pancreasMesh);
    materialsMapRef.current.set('pancreas', pancreasMesh.material);

    // 13. SPLEEN
    const spleenMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 16, 16),
      createAnatomyMaterial('#701a75', 0.45)
    );
    spleenMesh.scale.set(1.2, 0.8, 0.6);
    spleenMesh.position.set(-0.36, 0.78, 0.06);
    spleenMesh.userData = { structureId: 'spleen' };
    anatomyGroup.add(spleenMesh);
    meshMapRef.current.set('spleen', spleenMesh);
    materialsMapRef.current.set('spleen', spleenMesh.material);

    // 14. KIDNEYS
    const kidneysGroup = new THREE.Group();
    const rKidney = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      createAnatomyMaterial('#831843', 0.4)
    );
    rKidney.scale.set(0.7, 1.25, 0.7);
    rKidney.position.set(0.2, 0.65, -0.06);

    const lKidney = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      createAnatomyMaterial('#831843', 0.4)
    );
    lKidney.scale.set(0.7, 1.25, 0.7);
    lKidney.position.set(-0.2, 0.7, -0.06);

    kidneysGroup.add(rKidney, lKidney);
    kidneysGroup.userData = { structureId: 'kidneys' };
    rKidney.userData = { structureId: 'kidneys' };
    lKidney.userData = { structureId: 'kidneys' };
    anatomyGroup.add(kidneysGroup);
    meshMapRef.current.set('kidneys', kidneysGroup);
    materialsMapRef.current.set('kidneys', rKidney.material);

    // 15. INTESTINES (Small & Large)
    const intestinesGroup = new THREE.Group();
    const smallIntestine = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.22, 0.06, 48, 12, 2, 3),
      createAnatomyMaterial('#f9a8d4', 0.5)
    );
    smallIntestine.scale.set(1.1, 0.9, 0.6);
    smallIntestine.position.set(0, 0.34, 0.16);
    smallIntestine.userData = { structureId: 'small_intestine' };

    // Large Intestine framing
    const colonPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.28, 0.05, 0.15), // cecum
      new THREE.Vector3(0.32, 0.48, 0.14), // ascending
      new THREE.Vector3(0.28, 0.62, 0.16), // hepatic flexure
      new THREE.Vector3(0.0, 0.64, 0.22), // transverse
      new THREE.Vector3(-0.28, 0.62, 0.16), // splenic flexure
      new THREE.Vector3(-0.32, 0.25, 0.14), // descending
      new THREE.Vector3(-0.16, 0.02, 0.15), // sigmoid
      new THREE.Vector3(0.0, -0.15, 0.05) // rectum
    ]);
    const colonGeo = new THREE.TubeGeometry(colonPath, 36, 0.065, 12, false);
    const largeIntestine = new THREE.Mesh(colonGeo, createAnatomyMaterial('#b45309', 0.5));
    largeIntestine.userData = { structureId: 'large_intestine' };

    intestinesGroup.add(smallIntestine, largeIntestine);
    anatomyGroup.add(intestinesGroup);
    meshMapRef.current.set('small_intestine', smallIntestine);
    meshMapRef.current.set('large_intestine', largeIntestine);
    materialsMapRef.current.set('small_intestine', smallIntestine.material);
    materialsMapRef.current.set('large_intestine', largeIntestine.material);

    // 16. PELVIS & SACRUM
    const pelvisGroup = new THREE.Group();
    const pelvisIliumL = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.065, 12, 16, Math.PI * 1.2),
      createAnatomyMaterial('#e2e8f0', 0.65)
    );
    pelvisIliumL.position.set(-0.22, 0.06, 0.05);
    pelvisIliumL.rotation.y = -0.4;

    const pelvisIliumR = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.065, 12, 16, Math.PI * 1.2),
      createAnatomyMaterial('#e2e8f0', 0.65)
    );
    pelvisIliumR.position.set(0.22, 0.06, 0.05);
    pelvisIliumR.rotation.y = Math.PI + 0.4;

    pelvisGroup.add(pelvisIliumL, pelvisIliumR);
    pelvisGroup.userData = { structureId: 'pelvis_sacrum' };
    pelvisIliumL.userData = { structureId: 'pelvis_sacrum' };
    pelvisIliumR.userData = { structureId: 'pelvis_sacrum' };
    anatomyGroup.add(pelvisGroup);
    meshMapRef.current.set('pelvis_sacrum', pelvisGroup);
    materialsMapRef.current.set('pelvis_sacrum', pelvisIliumL.material);

    // 17. URINARY BLADDER
    const bladderMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 16, 16),
      createAnatomyMaterial('#facc15', 0.45)
    );
    bladderMesh.scale.set(1.1, 0.9, 1);
    bladderMesh.position.set(0, -0.08, 0.16);
    bladderMesh.userData = { structureId: 'urinary_bladder' };
    anatomyGroup.add(bladderMesh);
    meshMapRef.current.set('urinary_bladder', bladderMesh);
    materialsMapRef.current.set('urinary_bladder', bladderMesh.material);

    // 18. FEMURS & LEGS (Bones)
    const legBonesGroup = new THREE.Group();
    // Left Femur
    const femurL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.055, 0.95, 16),
      createAnatomyMaterial('#f1f5f9', 0.6)
    );
    femurL.position.set(-0.24, -0.62, 0.04);
    femurL.rotation.z = 0.05;
    femurL.userData = { structureId: 'femur_bone' };

    // Right Femur
    const femurR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.055, 0.95, 16),
      createAnatomyMaterial('#f1f5f9', 0.6)
    );
    femurR.position.set(0.24, -0.62, 0.04);
    femurR.rotation.z = -0.05;
    femurR.userData = { structureId: 'femur_bone' };

    // Tibias
    const tibiaL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.035, 0.88, 16),
      createAnatomyMaterial('#e2e8f0', 0.65)
    );
    tibiaL.position.set(-0.22, -1.62, 0.02);
    tibiaL.userData = { structureId: 'tibia_fibula' };

    const tibiaR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.035, 0.88, 16),
      createAnatomyMaterial('#e2e8f0', 0.65)
    );
    tibiaR.position.set(0.22, -1.62, 0.02);
    tibiaR.userData = { structureId: 'tibia_fibula' };

    legBonesGroup.add(femurL, femurR, tibiaL, tibiaR);
    anatomyGroup.add(legBonesGroup);
    meshMapRef.current.set('femur_bone', femurL);
    meshMapRef.current.set('tibia_fibula', tibiaL);
    materialsMapRef.current.set('femur_bone', femurL.material);
    materialsMapRef.current.set('tibia_fibula', tibiaL.material);

    // 19. SCIATIC NERVES
    const sciaticL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.012, 1.2, 8),
      createAnatomyMaterial('#facc15', 0.3)
    );
    sciaticL.position.set(-0.22, -0.72, -0.06);
    sciaticL.userData = { structureId: 'sciatic_nerve' };
    anatomyGroup.add(sciaticL);
    meshMapRef.current.set('sciatic_nerve', sciaticL);
    materialsMapRef.current.set('sciatic_nerve', sciaticL.material);

    // 20. MUSCLES: Pectoralis Major & Deltoids & Biceps & Quadriceps & Calves
    // Pectoralis Major
    const pecL = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.28, 0.12),
      createAnatomyMaterial('#dc2626', 0.5)
    );
    pecL.position.set(-0.22, 1.45, 0.26);
    pecL.rotation.z = -0.15;
    pecL.userData = { structureId: 'pectoralis_muscle' };

    const pecR = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.28, 0.12),
      createAnatomyMaterial('#dc2626', 0.5)
    );
    pecR.position.set(0.22, 1.45, 0.26);
    pecR.rotation.z = 0.15;
    pecR.userData = { structureId: 'pectoralis_muscle' };

    anatomyGroup.add(pecL, pecR);
    meshMapRef.current.set('pectoralis_muscle', pecL);
    materialsMapRef.current.set('pectoralis_muscle', pecL.material);

    // Deltoids
    const deltoidL = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      createAnatomyMaterial('#b91c1c', 0.5)
    );
    deltoidL.scale.set(0.9, 1.2, 0.9);
    deltoidL.position.set(-0.54, 1.62, 0.08);
    deltoidL.userData = { structureId: 'deltoid_muscle' };
    anatomyGroup.add(deltoidL);
    meshMapRef.current.set('deltoid_muscle', deltoidL);
    materialsMapRef.current.set('deltoid_muscle', deltoidL.material);

    // Biceps
    const bicepsL = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.08, 0.32, 12, 16),
      createAnatomyMaterial('#dc2626', 0.5)
    );
    bicepsL.position.set(-0.56, 1.28, 0.12);
    bicepsL.userData = { structureId: 'biceps_brachii' };
    anatomyGroup.add(bicepsL);
    meshMapRef.current.set('biceps_brachii', bicepsL);
    materialsMapRef.current.set('biceps_brachii', bicepsL.material);

    // Rectus Abdominis
    const absMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.65, 0.08),
      createAnatomyMaterial('#b91c1c', 0.5)
    );
    absMesh.position.set(0, 0.58, 0.24);
    absMesh.userData = { structureId: 'rectus_abdominis' };
    anatomyGroup.add(absMesh);
    meshMapRef.current.set('rectus_abdominis', absMesh);
    materialsMapRef.current.set('rectus_abdominis', absMesh.material);

    // Quadriceps
    const quadL = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.11, 0.65, 12, 16),
      createAnatomyMaterial('#b91c1c', 0.5)
    );
    quadL.position.set(-0.25, -0.62, 0.14);
    quadL.userData = { structureId: 'quadriceps_muscle' };
    anatomyGroup.add(quadL);
    meshMapRef.current.set('quadriceps_muscle', quadL);
    materialsMapRef.current.set('quadriceps_muscle', quadL.material);

    // Gastrocnemius (Calf)
    const calfL = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.09, 0.5, 12, 16),
      createAnatomyMaterial('#991b1b', 0.5)
    );
    calfL.position.set(-0.23, -1.52, -0.06);
    calfL.userData = { structureId: 'gastrocnemius_muscle' };
    anatomyGroup.add(calfL);
    meshMapRef.current.set('gastrocnemius_muscle', calfL);
    materialsMapRef.current.set('gastrocnemius_muscle', calfL.material);

    // 21. THYROID GLAND
    const thyroidMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.035, 12, 16, Math.PI * 1.4),
      createAnatomyMaterial('#ec4899', 0.4)
    );
    thyroidMesh.position.set(0, 1.84, 0.16);
    thyroidMesh.rotation.z = Math.PI * 0.8;
    thyroidMesh.userData = { structureId: 'thyroid_gland' };
    anatomyGroup.add(thyroidMesh);
    meshMapRef.current.set('thyroid_gland', thyroidMesh);
    materialsMapRef.current.set('thyroid_gland', thyroidMesh.material);

    // 22. ADRENAL GLANDS
    const adrenalL = new THREE.Mesh(
      new THREE.ConeGeometry(0.05, 0.08, 6),
      createAnatomyMaterial('#f59e0b', 0.4)
    );
    adrenalL.position.set(-0.19, 0.82, -0.05);
    adrenalL.userData = { structureId: 'adrenal_glands' };
    anatomyGroup.add(adrenalL);
    meshMapRef.current.set('adrenal_glands', adrenalL);
    materialsMapRef.current.set('adrenal_glands', adrenalL.material);

    // Cache original base positions for explosion animation
    originalPositionsRef.current.clear();
    meshMapRef.current.forEach((meshOrGroup, structId) => {
      originalPositionsRef.current.set(structId, meshOrGroup.position.clone());
    });

    // ==========================================
    // RENDER LOOP & ORBIT CONTROLS
    // ==========================================
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto-rotation if enabled
      if (autoRotate && !isDraggingRef.current) {
        cameraAngleRef.current.theta += 0.005;
      }

      // Smooth camera interpolation towards target LookAt
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.08);

      // Convert spherical angles to Cartesian camera position
      const phi = cameraAngleRef.current.phi;
      const theta = cameraAngleRef.current.theta;
      const dist = cameraDistanceRef.current;

      const cx = currentLookAtRef.current.x + dist * Math.sin(phi) * Math.sin(theta);
      const cy = currentLookAtRef.current.y + dist * Math.cos(phi);
      const cz = currentLookAtRef.current.z + dist * Math.sin(phi) * Math.cos(theta);

      camera.position.set(cx, cy, cz);
      camera.lookAt(currentLookAtRef.current);

      renderer.render(scene, camera);

      // Project label 2D screen positions for high-yield structures
      if (showLabels) {
        const labelsToProject = ['heart', 'lungs', 'brain', 'liver', 'stomach', 'cranium_skull', 'femur_bone', 'kidneys'];
        const projected = labelsToProject.map(id => {
          const struct = ANATOMY_STRUCTURES[id];
          if (!struct) return null;
          const pos = new THREE.Vector3(struct.position3D[0], struct.position3D[1], struct.position3D[2]);
          pos.project(camera);

          const halfWidth = width / 2;
          const halfHeight = height / 2;
          const screenX = pos.x * halfWidth + halfWidth;
          const screenY = -pos.y * halfHeight + halfHeight;
          const visible = pos.z < 1; // within frustum front

          return {
            id,
            name: struct.name,
            x: screenX,
            y: screenY,
            visible
          };
        }).filter(Boolean) as { id: string; name: string; x: number; y: number; visible: boolean }[];

        setLabelPositions(projected);
      }
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotate, showLabels]);

  // ==========================================
  // CLIPPING PLANE (Cross Section Mode)
  // ==========================================
  useEffect(() => {
    if (!rendererRef.current) return;
    if (crossSectionAxis === 'none') {
      rendererRef.current.clippingPlanes = [];
      clippingPlaneRef.current = null;
    } else {
      let normal = new THREE.Vector3(1, 0, 0); // Sagittal
      if (crossSectionAxis === 'y') normal = new THREE.Vector3(0, 1, 0); // Transverse
      if (crossSectionAxis === 'z') normal = new THREE.Vector3(0, 0, 1); // Coronal

      const plane = new THREE.Plane(normal, -crossSectionPosition);
      clippingPlaneRef.current = plane;
      rendererRef.current.clippingPlanes = [plane];
    }
  }, [crossSectionAxis, crossSectionPosition]);

  // ==========================================
  // SYSTEM / LAYER / ISOLATION / X-RAY VISIBILITY
  // ==========================================
  useEffect(() => {
    meshMapRef.current.forEach((meshOrGroup, structId) => {
      const struct = ANATOMY_STRUCTURES[structId];
      if (!struct) return;

      const isSystemActive = activeSystems[struct.system] !== false;
      const isLayerActive = struct.layer <= activeLayer;
      const isSelected = selectedStructureId === structId;

      // Base visibility
      let visible = isSystemActive && isLayerActive;

      // Isolation mode
      if (isIsolatedMode && selectedStructureId) {
        visible = isSelected;
      }

      meshOrGroup.visible = visible;

      // Materials update (X-Ray / Transparency / Highlights)
      meshOrGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const origMat = materialsMapRef.current.get(structId) as THREE.MeshStandardMaterial;

          if (origMat) {
            const mat = mesh.material as THREE.MeshStandardMaterial;

            if (isSelected) {
              // Bright golden highlight glow
              mat.emissive = new THREE.Color(0xf59e0b);
              mat.emissiveIntensity = 0.55;
            } else if (isXRayMode) {
              // Holographic cyan glowing X-ray look
              mat.emissive = new THREE.Color(struct.category === 'bone' ? 0x38bdf8 : 0x0284c7);
              mat.emissiveIntensity = struct.category === 'bone' ? 0.7 : 0.25;
              mat.transparent = true;
              mat.opacity = struct.category === 'bone' ? 0.9 : 0.35;
            } else if (transparencyValue > 0) {
              mat.emissive = new THREE.Color(0x000000);
              mat.transparent = true;
              mat.opacity = Math.max(0.08, 1 - transparencyValue / 100);
            } else {
              // Reset to normal
              mat.emissive = new THREE.Color(0x000000);
              mat.emissiveIntensity = 0;
              mat.transparent = false;
              mat.opacity = 1.0;
            }
          }
        }
      });
    });
  }, [activeSystems, activeLayer, selectedStructureId, isIsolatedMode, isXRayMode, transparencyValue]);

  // ==========================================
  // EXPLODED VIEW EFFECT
  // ==========================================
  useEffect(() => {
    const factor = isExplodedView ? (explodeFactor > 0 ? explodeFactor : 0.6) : 0;
    meshMapRef.current.forEach((meshOrGroup, structId) => {
      const origPos = originalPositionsRef.current.get(structId);
      if (!origPos) return;

      if (factor === 0) {
        meshOrGroup.position.copy(origPos);
      } else {
        // Offset outward from vertical anatomical axis (0, y, 0)
        const dir = new THREE.Vector3(origPos.x, 0, origPos.z);
        if (dir.lengthSq() < 0.002) {
          // If perfectly centered (e.g. spine or sternum), offset along Z or Y
          dir.set(0, 0, origPos.z >= 0 ? 1 : -1);
        } else {
          dir.normalize();
        }

        const yOffset = origPos.y > 1.2 ? factor * 0.25 : origPos.y < 0 ? -factor * 0.25 : 0;
        meshOrGroup.position.set(
          origPos.x + dir.x * factor * 0.85,
          origPos.y + yOffset,
          origPos.z + dir.z * factor * 0.85
        );
      }
    });
  }, [isExplodedView, explodeFactor]);

  // ==========================================
  // MOUSE & TOUCH EVENT HANDLERS (ORBIT, PAN, PINCH-ZOOM & RAYCASTING)
  // ==========================================
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointersRef.current.size === 1) {
      if (e.button === 2 || e.shiftKey) {
        isPanningRef.current = true;
      } else {
        isDraggingRef.current = true;
      }
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    } else if (activePointersRef.current.size === 2) {
      // Pinch to zoom initiation
      isDraggingRef.current = false;
      isPanningRef.current = false;
      const pts = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartDistanceRef.current = dist;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (activePointersRef.current.size === 2 && pinchStartDistanceRef.current !== null) {
      // 2-finger Pinch Zoom
      const pts = Array.from(activePointersRef.current.values());
      const currentDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const diff = pinchStartDistanceRef.current - currentDist;

      cameraDistanceRef.current = Math.max(1.2, Math.min(8.5, cameraDistanceRef.current + diff * 0.01));
      pinchStartDistanceRef.current = currentDist;
    } else if (isPanningRef.current) {
      // Pan camera LookAt target
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetLookAtRef.current.x -= deltaX * 0.004;
      targetLookAtRef.current.y += deltaY * 0.004;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    } else if (isDraggingRef.current) {
      // 360° Orbit Rotation
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      cameraAngleRef.current.theta += deltaX * 0.007;
      cameraAngleRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI - 0.1, cameraAngleRef.current.phi - deltaY * 0.007)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    } else {
      // Raycasting for Hover Detection
      if (!rendererRef.current || !cameraRef.current || !sceneRef.current || !mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
      let found: AnatomicalStructure | null = null;

      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr) {
          if (curr.userData && curr.userData.structureId) {
            const s = ANATOMY_STRUCTURES[curr.userData.structureId];
            if (s) {
              found = s;
              break;
            }
          }
          curr = curr.parent;
        }
        if (found) break;
      }

      setHoveredStructure(found);
      mountRef.current.style.cursor = found ? 'pointer' : 'grab';
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) {
      pinchStartDistanceRef.current = null;
    }
    if (activePointersRef.current.size === 0) {
      isDraggingRef.current = false;
      isPanningRef.current = false;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current || !mountRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);
    for (const hit of intersects) {
      let curr: THREE.Object3D | null = hit.object;
      while (curr) {
        if (curr.userData && curr.userData.structureId) {
          const struct = ANATOMY_STRUCTURES[curr.userData.structureId];
          if (struct) {
            onSelectStructure(struct);
            return;
          }
        }
        curr = curr.parent;
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    cameraDistanceRef.current = Math.max(1.2, Math.min(8.5, cameraDistanceRef.current + e.deltaY * 0.0035));
  };

  return (
    <div
      ref={mountRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full h-full select-none overflow-hidden touch-none"
    >
      {/* 3D Anatomical Labels Overlay with Leader Lines */}
      {showLabels && labelPositions.map(label => {
        if (!label.visible) return null;
        const isSelected = selectedStructureId === label.id;
        const struct = ANATOMY_STRUCTURES[label.id];
        return (
          <div
            key={label.id}
            style={{
              position: 'absolute',
              left: `${label.x}px`,
              top: `${label.y}px`,
              transform: 'translate(-50%, -100%)',
              pointerEvents: 'auto'
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (struct) onSelectStructure(struct);
            }}
            className="group cursor-pointer transition-all duration-150"
          >
            {/* Label Pin Badge */}
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg transition-transform hover:scale-108 ${
              isSelected
                ? 'bg-amber-500 text-slate-950 ring-2 ring-white'
                : 'bg-slate-900/80 backdrop-blur-md text-white border border-slate-700/80 hover:border-teal-400'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span>{label.name}</span>
            </div>
            {/* Leader dot */}
            <div className="w-1 h-2 bg-teal-400/80 mx-auto" />
            <div className="w-1.5 h-1.5 rounded-full bg-teal-300 mx-auto -mt-0.5" />
          </div>
        );
      })}

      {/* Hover Tooltip Widget */}
      {hoveredStructure && (
        <div className="absolute top-4 left-4 z-20 pointer-events-none bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-2.5 shadow-2xl animate-in fade-in duration-100 max-w-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredStructure.color }} />
            <span className="text-xs font-bold text-white">{hoveredStructure.name}</span>
          </div>
          <p className="text-[11px] text-teal-400 font-medium mt-0.5">{hoveredStructure.systemName}</p>
          <p className="text-[10px] text-slate-400 italic line-clamp-2 mt-1">{hoveredStructure.description}</p>
        </div>
      )}
    </div>
  );
};
