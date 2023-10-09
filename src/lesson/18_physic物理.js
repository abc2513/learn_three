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
import * as CANNON from 'cannon';
const sizes = {
  width: 1200,
  height: 800
}
const createSphere = (radius, position) => {
  
};
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
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const clock = new THREE.Clock();
    let oldElapsedTime = 0;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    //light 光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.2);
    pointLight.position.set(2, 3, 3);
    pointLight.castShadow = true;//产生阴影
    scene.add(pointLight);

    //球和地板
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), new THREE.MeshStandardMaterial({
      metalness: 0.2,
      roughness: 0.4,
      color: 0xffffff,
    }));
    sphere.castShadow = true;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
    }));
    floor.rotation.x = -Math.PI * 0.5;
    floor.rotation.y= -0.05* Math.PI;
    floor.receiveShadow = true;//接受阴影
    const group = new THREE.Group();
    group.add(sphere);
    // group.position.y = .5;
    scene.add(group);
    scene.add(floor);

    //物理
    //常见的物理引擎有：cannon.js、ammo.js、oimo.js等
    //https://schteppe.github.io/cannon.js/docs/#api-classes

    //创建世界
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);
    //物理材料
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
      friction: 0.1,//摩擦系数
      restitution: 0.7,//弹性系数
    });
    world.addContactMaterial(defaultContactMaterial);//将材料添加到世界中
    world.defaultContactMaterial = defaultContactMaterial;//设置默认材料
    //创建形状
    const sphereShape = new CANNON.Sphere(0.5);
    const sphereBody = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape: sphereShape,
    });
    world.addBody(sphereBody);
    const floorShape = new CANNON.Plane();
    const floorBody = new CANNON.Body({
      mass: 0,//质量为0的物体不受重力影响
      shape: floorShape,
    });
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0.1), Math.PI * 0.5);//设置旋转
    world.addBody(floorBody);

    //applyForce：施加力
    //applyImpulse：施加冲量
    //applyLocalForce：施加局部力
    //applyLocalImpulse：施加局部冲量







    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - oldElapsedTime;
      oldElapsedTime = elapsedTime;
      //更新世界
      world.step(1 / 60, deltaTime, 3);//参数：时间步长、时间增量、迭代次数
      //将物理世界中的物体的位置赋值给three.js中的物体
      sphere.position.copy(sphereBody.position);//有多个物体时，可以写入数组中遍历
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
