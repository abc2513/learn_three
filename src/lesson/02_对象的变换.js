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
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height , 0.1, 1000);
    camera.position.z = 5;
    scene.add(camera);
    const renderer = new THREE.WebGLRenderer({canvas: canvasRef.current});
    renderer.setSize(sizes.width, sizes.height);
    renderer.render(scene, camera);
    

    //AxesHelper：坐标轴辅助工具，新版本叫AxisHelper
    const axesHelper = new THREE.AxisHelper();
    scene.add(axesHelper);

    const geometry = new THREE.BoxGeometry(1,1,1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);

    //继承自Object3D的常见属性
    //mesh网格、scene场景、camera相机等都继承自Object3D
    //position定位、rotation旋转、scale缩放、quaternion四元数、up向上方向、matrix矩阵、matrixWorld世界矩阵、modelViewMatrix模型视图矩阵、normalMatrix法线矩阵、visible是否可见、castShadow是否投射阴影、receiveShadow是否接受阴影、frustumCulled是否裁剪、renderOrder渲染顺序、userData用户数据、name名称、type类型、id唯一标识符、uuid唯一标识符、parent父级、children子级、onBeforeRender渲染前、onAfterRender渲染后、applyMatrix应用矩阵、applyQuaternion应用四元数、setRotationFromAxisAngle设置旋转轴角度、setRotationFromEuler设置旋转欧拉角、setRotationFromMatrix设置旋转矩阵、setRotationFromQuaternion设置旋转四元数、rotateOnAxis绕轴旋转、rotateX绕X轴旋转、rotateY绕Y轴旋转、rotateZ绕Z轴旋转、translateOnAxis沿轴移动、translateX沿X轴移动、translateY沿Y轴移动、translateZ沿Z轴移动、localToWorld本地转世界、worldToLocal世界转本地、lookAt朝向某个点、add添加子级、remove移除子级、getObjectById通过id获取子级、getObjectByName通过name获取子级、getObjectByProperty通过属性获取子级、getWorldPosition获取世界坐标、getWorldQuaternion获取世界四元数、getWorldScale获取世界缩放、getWorldDirection获取世界方向、traverse遍历子级、traverseVisible遍历可见子级、traverseAncestors遍历祖先、updateMatrix更新矩阵、updateMatrixWorld更新世界矩阵、raycast射线检测、clone克隆、copy复制、toJSON转JSON、dispose
    
     //position：定位，相对于父级的位置
    cube.position.x = 0.7;
    cube.position.y = -0.6;
    cube.position.z = 1;
    cube.position.set(0.7,-0.6,1);
    cube.position.copy(new THREE.Vector3(0.7,-0.6,1));
    //距离函数
    console.log(cube.position.distanceTo(camera.position));

    //scale：缩放
    cube.scale.x = 2;
    cube.scale.y = 0.5;
    cube.scale.z = 0.5;
    cube.scale.set(2,0.5,0.5);
    //旋转顺序
    cube.rotation.order = 'YXZ';
    //lookAt：将物体的-z轴指向某个点
    camera.position.set(4,4,4);
    camera.lookAt(new THREE.Vector3(0,0,0));

    //rotation：旋转，欧拉角   
    //欧拉角：x轴旋转、y轴旋转、z轴旋转，转轴是相对于物体本身的
    cube.rotation.x = Math.PI * 0.25;
    cube.rotation.y = Math.PI * 0.25;
    cube.rotation.z = Math.PI * 0.25;
    
    //上述属性都是相对父级的，因此可以把物体放入一个group中，然后对group进行操作
    const group = new THREE.Group();
    group.add(cube);
    group.position.y = 1;



    // scene.add(cube);
    scene.add(group);
    renderer.render(scene, camera);
  }, []);
  return (
    <div className="App" ref={appRef}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
