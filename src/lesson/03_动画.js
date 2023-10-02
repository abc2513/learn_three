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

    const clock = new THREE.Clock();

    //请求动画帧，目的是在下一帧调用函数
    //1.自己写每帧发生的变化
    const tick = () => {
      // cube.rotation.x += 0.01;
      //这样的写法会导致速度和帧数相关，因此需要使用clock。或者手写时间差

      const elapsedTime = clock.getElapsedTime();
      cube.rotation.x = 0.1 * elapsedTime;//单位是s


    };

    //2.使用gsap动画库：yarn add gsap
    gsap.to(cube.rotation, { duration: 1, x: 1, y: 1, });

    //不管那种方式，每帧的渲染是必需的
    const animate = () => {
      // tick();//自己写的每帧动画
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    };
    animate();



  }, []);
  return (
    <div className="App" ref={appRef}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;