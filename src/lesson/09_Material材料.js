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
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    const clock = new THREE.Clock();


    //加载纹理
    const textureLoader = new THREE.TextureLoader();
    const colorTexture = textureLoader.load('/textures/door/color.jpg');
    const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
    const heightTexture = textureLoader.load('/textures/door/height.jpg');
    const normalTexture = textureLoader.load('/textures/door/normal.jpg');
    const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
    const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
    const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
    const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');
    const matcapTexture = textureLoader.load('/textures/matcaps/3.png');

    //环境纹理
    const cubeTextureLoader = new THREE.CubeTextureLoader();//立方体纹理加载器
    const environmentMapTexture = cubeTextureLoader.load([
      '/textures/environmentMaps/0/px.jpg',
      '/textures/environmentMaps/0/nx.jpg',
      '/textures/environmentMaps/0/py.jpg',
      '/textures/environmentMaps/0/ny.jpg',
      '/textures/environmentMaps/0/pz.jpg',
      '/textures/environmentMaps/0/nz.jpg',
    ]);
    //环境贴图网站：https://hdrihaven.com/hdris/

    //MeshBasicMaterial，使用了均匀的颜色，不受光照影响
    const meshBashMaterial = new THREE.MeshBasicMaterial({
      // color: 0x00ff00,
      side: THREE.DoubleSide,//FrontSide BackSide DoubleSide,渲染的面 
      map: colorTexture,//颜色纹理
      wireframe: false,//线框模式
      opacity: 1,//透明度
      transparent: true,//透明
      alphaMap: alphaTexture,//透明纹理
    });

    //MeshNormalMaterial，使用了法线作为颜色，不受光照影响
    const meshNormalMaterial = new THREE.MeshNormalMaterial({
      side: THREE.DoubleSide,
      wireframe: false,
      flatShading: false,//平面着色
    });
    //MeshMatcapMaterial，使用了matcap贴图作为颜色，不受光照影响
    const meshMatcapMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture,
    });
    //MeshDepthMaterial，使用了深度作为颜色，不受光照影响。离相机太远可能看不到
    const meshDepthMaterial = new THREE.MeshDepthMaterial({});

    //MeshLambertMaterial，使用了Lambert光照模型作为颜色，受光照影响
    //性能较好
    const meshLambertMaterial = new THREE.MeshLambertMaterial();

    //MeshPhongMaterial，使用了Phong光照模型作为颜色，受光照影响
    //更加细致，有反射高光
    const meshPhongMaterial = new THREE.MeshPhongMaterial({
      shininess: 100,//高光的亮度
      specular: 0x1188ff,//高光的颜色
    });
    //MeshToonMaterial，使用了Toon光照模型作为颜色，受光照影响
    gradientTexture.minFilter = THREE.NearestFilter;
    gradientTexture.magFilter = THREE.NearestFilter;//一点卡通画效果
    const meshToonMaterial = new THREE.MeshToonMaterial({
      gradientMap: gradientTexture,//渐变纹理
    });
    //MeshStandardMaterial，使用了PBR光照模型作为颜色，受光照影响
    const meshStandardMaterial = new THREE.MeshStandardMaterial({
      // metalness: 0.7,//金属度
      // roughness: 0.6,//粗糙度
      // map: colorTexture,//map用于应用纹理
      aoMap: ambientOcclusionTexture,//aoMap用于应用环境光遮蔽
      displacementMap: heightTexture,//displacementMap用于应用位移纹理。几何图形需要足够的顶点才能工作
      displacementScale: 0.05,//displacementScale用于控制位移纹理的强度
      // metalnessMap: metalnessTexture,//metalnessMap用于应用金属度纹理
      // roughnessMap: roughnessTexture,//roughnessMap用于应用粗糙度纹理
      normalMap: normalTexture,//normalMap用于应用法线纹理
      alphaMap: alphaTexture,//alphaMap用于应用透明纹理，需要设置transparent为true
      transparent: true,//透明
      envMap: environmentMapTexture,//envMap用于应用环境纹理
    });
    //GUI
    const gui = new GUI();
    const materialFolder = gui.addFolder('material');
    materialFolder.add(meshStandardMaterial, 'metalness').min(0).max(1).step(0.01);
    materialFolder.add(meshStandardMaterial, 'roughness').min(0).max(1).step(0.01);
    materialFolder.open();

    //PointsMaterial，用于渲染大量的点
    //LineBasicMaterial，用于渲染线
    //LineDashedMaterial，用于渲染虚线
    //ShaderMaterial，用于渲染自定义着色器
    //RawShaderMaterial，用于渲染自定义着色器
    //ShadowMaterial，用于渲染阴影
    //SpriteMaterial，用于渲染精灵




    const material = meshStandardMaterial;
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5,64,64), material);
  
    sphere.position.x = -1.5;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1,100,100), material);
    // plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));//uv2这里没听懂

    const tours = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.2,64, 64), material);
    tours.position.x = 1.5;
    scene.add(sphere, plane, tours);


    //light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.x = 2;
    pointLight.position.y = 3;
    pointLight.position.z = 4;
    scene.add(pointLight);




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
