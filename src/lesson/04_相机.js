import { useEffect, useRef } from 'react';
import './App.css';
import * as THREE from 'three';
import gsap from 'gsap';
const sizes = {
  width: 1600,
  height: 1200
}
function App() {
  const appRef = useRef();
  const canvasRef = useRef();
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(sizes.width, sizes.height);
    const axesHelper = new THREE.AxisHelper();
    scene.add(axesHelper);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    //抽象类：相机Camera

    //正交相机OrthographicCamera
    //相机的位置不会影响物体的大小，物体的大小是由正交相机的大小决定的

    //透视相机PerspectiveCamera
    //相机的位置会影响物体的大小，物体的大小是由相机的位置决定的

    //立方体相机CubeCamera
    //立方体相机是透视相机的一种，可以渲染立方体贴图

    //相机数组
    //相机数组是一个数组，可以同时渲染多个相机，比如可以同时渲染正交相机和透视相机
    const camera1 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera1.position.z = 5;
    camera1.lookAt(new THREE.Vector3(0, 0, 0));
    const camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera2.position.z = 5;
    camera2.lookAt(new THREE.Vector3(0, 0, 0));
    //数组
    const cameras = [camera1, camera2];
    //渲染
    renderer.render(scene, camera1);
    renderer.render(scene, camera2);
    //切换相机
    let currentCamera = 0;
    const btn = document.createElement('button');
    btn.innerText = '切换相机';
    btn.style.position = 'absolute';
    btn.style.top = '10px';
    btn.style.left = '10px';
    btn.style.zIndex = '999';
    btn.onclick = () => {
      currentCamera++;
      if (currentCamera >= cameras.length) {
        currentCamera = 0;
      }
      renderer.render(scene, cameras[currentCamera]);
    }
    appRef.current.appendChild(btn);


  }, []);
  return (
    <div className="App" ref={appRef}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
