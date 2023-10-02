import { useEffect, useRef } from 'react';
import './App.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader }  from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
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
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(sizes.width, sizes.height);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    const clock = new THREE.Clock();
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);

    //light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(pointLight);

    //Texture
    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load('/textures/matcaps/8.png');

    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('Hello Three.js', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      });
      textGeometry.computeBoundingBox();
      // textGeometry.translate(
      //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,//边界的X轴最大值
      //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
      //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5,
      // );
      textGeometry.center();
      // const textMaterial = new THREE.MeshNormalMaterial();
      const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
      const text = new THREE.Mesh(textGeometry, textMaterial);
      // text.position.x = -2;
      scene.add(text);
    });

    //100 donuts
    for(let i = 0; i < 100; i++){
      const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
      const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture});
      const donut = new THREE.Mesh(donutGeometry, donutMaterial);
      donut.position.x = (Math.random() - 0.5) * 15;
      donut.position.y = (Math.random() - 0.5) * 15;
      donut.position.z = (Math.random() - 0.5) * 15;
      donut.rotation.x = Math.random() * Math.PI;
      donut.rotation.y = Math.random() * Math.PI;
      const scale = Math.random();
      donut.scale.set(scale, scale, scale);
      scene.add(donut);
    }


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
