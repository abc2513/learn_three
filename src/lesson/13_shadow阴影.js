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
    renderer.shadowMap.enabled = true;//开启阴影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;//阴影的算法
    //BasicShadowMap 性能最好，阴影边缘有锯齿
    //PCFShadowMap 性能较好，但是阴影边缘有锯齿
    //PCFSoftShadowMap 优化阴影的算法，但是性能较差
    //VSMShadowMap 性能最差，阴影边缘最柔和

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    //render,light,产生阴影的物体,接收阴影的物体都需要设置，才能出现阴影
    //只有点光源、平行光源、聚光灯才能产生阴影


    //light 光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xfff000, 0.2);
    pointLight.position.set(2, 3, 3);
    pointLight.castShadow = true;//产生阴影
    scene.add(pointLight);
    const spotLight = new THREE.SpotLight(0x00ff00, 0.8, 10, Math.PI * 0.1, 0.25, 1);
    spotLight.position.set(0, 2, 3);
    spotLight.castShadow = true;//产生阴影
    scene.add(spotLight);
    const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.5);
    directionalLight.position.set(2, 3, 4);
    directionalLight.castShadow = true;//产生阴影
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;//指定阴影贴图的分辨率，以提高性能
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 8;//指定阴影贴图的渲染范围，以提高性能
    const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);//可视化光源计算投影的范围
    scene.add(directionalLightCameraHelper);
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);//可视化光源的位置和方向
    scene.add(directionalLightHelper);
    scene.add(directionalLight);


    //球体 平面 甜甜圈
    const material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
    });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
    sphere.position.x = -1.5;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
    plane.castShadow = true;//产生阴影
    const tours = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2, 64, 64), material);
    tours.position.x = 1.5;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
    floor.rotation.x = -Math.PI * 0.5;
    floor.receiveShadow = true;//接受阴影
    const group = new THREE.Group();
    group.add(sphere, plane, tours);
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
