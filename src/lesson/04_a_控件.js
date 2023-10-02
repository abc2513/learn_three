import { useEffect, useRef } from 'react';
import './App.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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
    // camera.lookAt(new THREE.Vector3(0, 0, 0));
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

    //controls，控制相机
    //这些控制器都不在THREE核心类里，需要单独引入

    //flyControls：像飞船一样控制相机
    //firstPersonControls：第一人称视角控制相机，类似flyControls，但是不能改变向上的轴
    //pointerLockControls，鼠标锁定控制器，类似于fps游戏的控制器（为了使光标作用消失）
    //orbitControls，轨道控制器，类似于3dmax中的轨道控制器
    //trackballControls，轨迹球控制器。类似objectControls，但是没有限制（用于没有地板的情况）
    
    const controls = new OrbitControls(camera, canvasRef.current);
    // controls.enableDamping = true;//惯性
    // controls.target.set(1, 0, 0);//设置控制器的焦点，使控制器围绕这个点旋转


    //动画
    const tick = () => {
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
