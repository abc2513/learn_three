import { useEffect, useRef } from 'react';
import './App.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader }  from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper';
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
    const clock = new THREE.Clock();
    const axesHelper = new THREE.AxesHelper();
    // scene.add(axesHelper);

    //light 光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);//环境光，均匀的光源.
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xfff000, 0.2);//点光源，从一个点向四周发射光线.颜色，强度
    pointLight.position.set(2, 3, 3);
    // scene.add(pointLight);
    const directionalLight = new THREE.DirectionalLight(0x00ffff, 0.5);//平行光，沿着一个方向发射光线
    directionalLight.position.set(2, -3, 4);
    // scene.add(directionalLight);
    const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.5);//半球光，上半球红色，下半球蓝色。像环境光一样来自四面八方。
    scene.add(hemisphereLight);
    const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 1, 2,2);//矩形光，从一个矩形区域发射光线.
    rectAreaLight.position.set(-2, 1, 0);//矩形光的位置
    rectAreaLight.lookAt(new THREE.Vector3());
    scene.add(rectAreaLight);
    const spotLight = new THREE.SpotLight(0x00ff00, 0.8, 10, Math.PI * 0.1, 0.25, 1);//聚光灯，类似手电筒.
    spotLight.position.set(0, 2, 3);
    scene.add(spotLight);
    //环境光、半球光花费性能较低，平行光、点光源花费性能较高，聚光灯、矩形光花费性能最高

    //光源辅助对象，用于可视化光源的位置和方向
    const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
    scene.add(hemisphereLightHelper);
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
    scene.add(directionalLightHelper);
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
    scene.add(pointLightHelper);
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);
    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);//这个需要单独导入
    scene.add(rectAreaLightHelper);



    //球体 平面 甜甜圈
    const material = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
    });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5,64,64), material);
    sphere.position.x = -1.5;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1,100,100), material);
    const tours = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2,64, 64), material);
    tours.position.x = 1.5;
    const floor= new THREE.Mesh(new THREE.PlaneGeometry(5,5), material);
    floor.rotation.x = -Math.PI * 0.5;
    const group= new THREE.Group();
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
