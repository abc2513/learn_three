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

    const geometry = new THREE.PlaneGeometry(1, 1, 20,20);//平面
    const count = geometry.attributes.position.count;
    console.log(geometry);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random(i);
      // randoms[i] = Math.sin(geometry.attributes.position.getX(i)*geometry.attributes.position.getY(i) * 40);
      // console.log(randoms[i]);
    }
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));//设置点的属性，参数是数据和每个点的属性数量
    const material = new THREE.RawShaderMaterial({
      vertexShader: /*glsl*/`
        //uniform
        uniform mat4 projectionMatrix;//投影矩阵
        uniform mat4 viewMatrix;//视图矩阵
        uniform mat4 modelMatrix;//模型矩阵

        uniform float zScale;//z轴缩放
        //attribute,用于获取点的属性
        attribute vec3 position;
        attribute float aRandom;
        //varying,用于传递数据给片元着色器
        varying float vRandom;

        void main(){
          int a=1;
          float b=1.0;
          // 不能 float c=a*b;,不同类型不能混合运算
          float c=float(a)*b;
          bool d=true;
          vec2 vec_2=vec2(1.0,2.0);//二维向量
          vec_2.x=3.0;
          vec_2.y=4.0;
          vec_2*=2.0;//向量乘法
          vec2 vec_2_1=vec_2.yx;//向量反转,xy->yx,简写
          vec3 vec_3=vec3(1.0,2.0,3.0);//三维向量
          //可以使用rgb或者xyz来访问向量的分量
          vec_3.r=4.0;
          vec_3.g=5.0;
          vec_3.b=6.0;
          vec4 vec_4=vec4(1.0,2.0,3.0,4.0);//四维向量
          //可以使用rgba或者xyzw来访问向量的分量

          // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position,1.0);
          vec4 modelPosition=modelMatrix*vec4(position,1.0);//模型坐标
          modelPosition.y+=aRandom*zScale;//z轴偏移
          vRandom=aRandom;//传递给片元着色器
          vec4 viewPosition=viewMatrix*modelPosition;//视图坐标
          vec4 projectionPosition=projectionMatrix*viewPosition;//投影坐标
          gl_Position=projectionPosition;//裁剪坐标
        }
      `,
      fragmentShader: /*glsl*/`
        precision mediump float;
        varying float vRandom;
        void main(){
          gl_FragColor=vec4(0.5,vRandom,1.0,1.0);
        }
      `,
      wireframe: true,
      // transparent: true,
      uniforms:{//传递uniform，材料的全局变量
        zScale:{value:0.15}
      }
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI * 0.5;
    scene.add(plane);
    const gui = new GUI();
    gui.add(material.uniforms.zScale, 'value').min(0).max(1).step(0.01).name('zScale');


    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - oldElapsedTime;
      oldElapsedTime = elapsedTime;
      const randoms = new Float32Array(count);
      // for (let i = 0; i < count; i++) {
      //   // randoms[i] = Math.sin(i/10);
      //   randoms[i] = Math.sin(geometry.attributes.position.getX(i)*geometry.attributes.position.getY(i) * 40 + elapsedTime);
      //   // console.log(randoms[i]);
      // }
      // geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));//设置点的属性，参数是数据和每个点的属性数量

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
