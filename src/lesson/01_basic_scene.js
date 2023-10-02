import { useEffect, useRef } from 'react';
import './App.css';
import * as THREE from 'three';
const sizes={
  width:1600,
  height:1200
}
function App() {
  const appRef= useRef();
  const canvasRef = useRef();
  useEffect(() => {
    //创建场景，场景是所有物体的容器
    const scene = new THREE.Scene();
    //创建透视相机，透视指的是远小近大。除此之外还有正交相机，正交指的是远近一样大
    //相机的位置默认是0,0,0，朝向默认是z轴负方向
    //参数：视野角度，长宽比，近截面，远截面
    const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height , 0.1, 1000);
    camera.position.z = 5;
    scene.add(camera);
    //创建渲染器，渲染器决定了渲染的结果应该画在页面的什么元素上面，以及渲染的时候应该考虑多大的区域
    const renderer = new THREE.WebGLRenderer({canvas: canvasRef.current});
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);//渲染器渲染场景和相机
    
    //创建一个立方体,默认只能看到“向外的那一面”
    const geometry = new THREE.BoxGeometry(1,1,1);
    //创建一个材质
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    //创建一个立方体网格。网格是由几何体和材质组成的
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    renderer.render(scene, camera);//重绘

  }, []);
  return (
    <div className="App" ref={appRef}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
