import { useEffect, useRef } from 'react';
import './App.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.z = 5;
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(sizes.width, sizes.height);
    const axesHelper = new THREE.AxesHelper();
    scene.add(axesHelper);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    renderer.render(scene, camera);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    const tick = () => {
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    }
    tick();

     //使用dat.GUI调试（有段时间没更新了，可选lil-gui代替）
     //yarn add dat.gui

     //先清除原来的dat.GUI
      // const datDom = document.querySelector('.dg');
      // if (datDom) {
      //   datDom.remove();
      // }
      // const gui = new dat.GUI();
      // const cubeFolder = gui.addFolder('cube');
      // //
      // cubeFolder.add(cube.position, 'x', -3, 3, 0.01);//对象，属性，最小值，最大值，步长
      // cubeFolder.add(cube.position, 'y', -3, 3, 0.01);
      // cubeFolder.add(cube.position, 'z', -3, 3, 0.01);
      // //使用Promise风格的写法
      // cubeFolder.add(cube.scale, 'x').min(-3).max(3).step(0.01).name('scaleX');
      // cubeFolder.add(cube.scale, 'y').min(-3).max(3).step(0.01).name('scaleY');
      // cubeFolder.add(cube.scale, 'z').min(-3).max(3).step(0.01).name('scaleZ');
      // //
      // cubeFolder.add(cube, 'visible');
      // cubeFolder.add(material, 'wireframe');
      // cubeFolder.addColor({color: 0x7bd665}, 'color').onChange((color) => {
      //   material.color.set(color);
      // });
      // cubeFolder.add({click: () => {
      //   gsap.to(cube.rotation, {duration: 1, y: cube.rotation.y + Math.PI * 2});
      // }}, 'click');
      
      // cubeFolder.open();



      //使用lil-gui调试
      //yarn add lil-gui
      const gui = new GUI();
      const cubeFolder = gui.addFolder('cube');
      //
      cubeFolder.add(cube.position, 'x', -3, 3, 0.01);//对象，属性，最小值，最大值，步长
      cubeFolder.add(cube.position, 'y', -3, 3, 0.01);
      cubeFolder.add(cube.position, 'z', -3, 3, 0.01);
      //使用Promise风格的写法
      cubeFolder.add(cube.scale, 'x').min(-3).max(3).step(0.01).name('scaleX');
      cubeFolder.add(cube.scale, 'y').min(-3).max(3).step(0.01).name('scaleY');
      cubeFolder.add(cube.scale, 'z').min(-3).max(3).step(0.01).name('scaleZ');
      //
      cubeFolder.add(cube, 'visible');
      cubeFolder.add(material, 'wireframe');
      cubeFolder.addColor({color: 0x7bd665}, 'color').onChange((color) => {
        material.color.set(color);
      });
      cubeFolder.add({click: () => {
        gsap.to(cube.rotation, {duration: 1, y: cube.rotation.y + Math.PI * 2});
      }}, 'click');
      

  }, []);
  return (
    <div className="App" ref={appRef}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
