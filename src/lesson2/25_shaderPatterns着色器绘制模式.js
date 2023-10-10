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
    camera.position.z = 1;
    camera.position.y = 0.5;
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
    // controls.enableDamping = true;

    const geometry = new THREE.PlaneGeometry(1, 1, 20, 20);//平面

    const material = new THREE.ShaderMaterial({
      vertexShader: /*glsl*/`
      //ShaderMaterial会自动传入uniform和attribute，不能重复定义
        //uniform
        // uniform mat4 projectionMatrix;//投影矩阵
        // uniform mat4 viewMatrix;//视图矩阵
        // uniform mat4 modelMatrix;//模型矩阵

        //attribute
        // attribute vec2 uv;//uv坐标
        // attribute vec3 position;//顶点坐标
        //varying
        varying vec2 vUv;

        void main(){
          vUv = uv; 
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: /*glsl*/`
        varying vec2 vUv;
        void main(){
          gl_FragColor=vec4(vUv.x,vUv.y,1.0,1.0); 

        }
      `,
      sider: THREE.DoubleSide,
      
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI * 0.5;
    scene.add(plane);

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - oldElapsedTime;
      oldElapsedTime = elapsedTime;


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
