import { useEffect, useRef } from 'react';
import './App.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import { GUI } from 'lil-gui';
const sizes = {
  width: 1200,
  height: 800
}
function App() {
  const appRef = useRef();
  const canvasRef = useRef();
  useEffect(() => {
    //scane camera renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 1;
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(sizes.width, sizes.height);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    //关闭渲染器、光源、图形的阴影
    // renderer.shadowMap.enabled = true;

    //加载阴影的纹理
    const textureLoader = new THREE.TextureLoader();
    const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg');
    const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg');

    //light 光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xeee000, 0.2);
    pointLight.position.set(2, 3, 3);
    // pointLight.castShadow = true;
    scene.add(pointLight);
    const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.5);
    directionalLight.position.set(2, 3, 4);

    //圆形
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64),
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
      }));
    //圆形的阴影
    const sphereShadow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5),
      new THREE.MeshStandardMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow,
        side: THREE.DoubleSide,
      }));
    sphereShadow.rotation.x = -Math.PI * 0.5;
    sphereShadow.position.y = -0.5+0.01;
    sphere.add(sphereShadow);
    //带阴影的平面
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 5),
      new THREE.MeshBasicMaterial({
        map: bakedShadow,
        side: THREE.DoubleSide,
      }));
    floor.rotation.x = -Math.PI * 0.5;
    const group = new THREE.Group();
    group.add(sphere);
    group.position.y = .5;
    scene.add(group);
    scene.add(floor);




    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    }
    tick();

  }, []);
  return (
    <div className="App" ref={appRef}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
