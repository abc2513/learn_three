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

    //使用lil-gui调试
    //yarn add lil-gui
    // const gui = new GUI();
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

    //texture

    //纹理贴图，将图片贴到几何体上
    //alpah贴图，透明度贴图， 灰度图像，白色部分可见
    //height贴图， 高度贴图， 灰度图像，高度值对应亮度值
    //normal，法线贴图，rgb值对应xyz轴。用于模拟凹凸效果，添加细节
    //metalness，金属贴图，灰度图像，白色部分金属，黑色部分非金属。添加反射
    //roughness，粗糙度贴图，灰度图像，白色光滑，黑色粗糙。添加反射

    //这些贴图都满足PBR原则，基于物理的渲染，能够更好的模拟真实世界
    //很多软件都使用PBR


    //使用原生JS加载图像
    // const image = new Image();
    // image.onload = () => {
    //   console.log('image loaded');
    //   //需要用图片创建纹理
    //   const texture = new THREE.Texture(image);
    //   const material = new THREE.MeshBasicMaterial({ map: texture });
    //   texture.needsUpdate = true;
    //   cube.material = material;

    // }
    // image.src = '/logo512.png';


    //使用textureLoader加载图片
    const textureLoader = new THREE.TextureLoader();
    //mipmapping，纹理贴图的优化，当物体离相机很远时，使用低分辨率的纹理贴图，当物体离相机很近时，使用高分辨率的纹理贴图
    textureLoader.generateMipmaps = false;//是否生成mipmaps

    textureLoader.minFilter = THREE.NearestFilter;//MinFilter，缩小过滤器，当纹理贴图被缩小时，使用的过滤器
    textureLoader.magFilter = THREE.NearestFilter;//MagFilter，放大过滤器，当纹理贴图被放大时，使用的过滤器
    //NearestFilter，最近过滤器，最近的像素点（运行最快）
    //LinearFilter，线性过滤器，最近的像素点的加权平均值

    const texture = textureLoader.load('/logo512.png',//jpg有损压缩，png无损压缩但是文件较大。使用tinypng网站压缩图片
      //可选用的回调函数
      (data) => {
        //loaded
        console.log(data);
      },
      (event) => {
        //progress
        console.log(event.loaded / event.total * 100 + '%');
      },
      (error) => {
        //error
        console.log(error);
      }
    );

    texture.rotation = Math.PI / 6;
    texture.center.x = 0.5;
    texture.center.y = 0.5;

    const material_ = new THREE.MeshBasicMaterial({ map: texture });
    cube.material = material_;

      //获取纹理的网站
      //poliigon.com
      //3dtextures.me
      //arroway-textures.ch








  }, []);
  return (
    <div className="App" ref={appRef}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
