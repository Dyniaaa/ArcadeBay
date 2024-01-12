import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GeometryHelper } from "./game/GeometryHelper.js";
import { NavLink } from "react-router-dom";

const ThreeJSGame = () => {
  const rendererRef = useRef(null);

  useEffect(() => {
    let renderer = rendererRef.current;
    let div = document.querySelector("#root");

    if (!renderer) {
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(800, 400);
      renderer.setClearColor(0x101010);
      div.appendChild(renderer.domElement);

      rendererRef.current = renderer; // Zapisz renderer w ref
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(5, 2, 7);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    const geometryHelper = new GeometryHelper();

    const cubeTextures = new THREE.CubeTextureLoader()
      .setPath("./cube1/")
      .load(["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"]);

    scene.background = cubeTextures;

    const textMaterial = new THREE.MeshPhongMaterial();
    textMaterial.envMap = cubeTextures;

    let stackBlocks = [];
    let points3dtext = null;
    let gameWorld = new THREE.Object3D();
    scene.add(gameWorld);

    let flyingBlock = null;

    const blockWidth = 3;
    const blockHeight = 0.3;
    const blockDepth = 3;

    function generateBlockMesh({
      width = blockWidth,
      height = blockHeight,
      depth = blockDepth,
      type = "z",
      color = null,
    } = {}) {
      const colorsArr = [
        "red",
        "green",
        "orange",
        "yellow",
        "blue",
        "aqua",
        "pink",
        "black",
        "silver",
        "gold",
        "gray",
      ];
      const randColor = colorsArr[Math.floor(Math.random() * colorsArr.length)];
      if (!color) {
        color = randColor;
      }

      let blockMaterial = new THREE.MeshLambertMaterial({ color: color });
      let blockMesh = geometryHelper.createSimpleCube({
        width: width,
        height: height,
        depth: depth,
        material: blockMaterial,
      });

      blockMesh.position.set(width / 2, -height / 2, depth / 2);

      const blockData = {
        type: type,
        width: width,
        height: height,
        depth: depth,
        blockMaterial: blockMaterial,
        mesh: blockMesh,
        color: color,
      };

      return blockData;
    }

    function addBlock() {
      let firstBlock = false;

      if (stackBlocks.length === 0) {
        firstBlock = true;
      }

      if (flyingBlock) {
        stackBlocks.push(flyingBlock);
      }

      let blockData = generateBlockMesh({
        type: "z",
      });

      if (!firstBlock) {
        blockData.mesh.position.z -= 7;
      }

      gameWorld.add(blockData.mesh);

      if (firstBlock) {
        stackBlocks.push(blockData);
      } else {
        flyingBlock = blockData;
        updateStack();
      }

      updatePoints(stackBlocks.length - 1);
    }

    function updateStack() {
      stackBlocks.forEach((block) => {
        block.mesh.position.y -= block.height;
      });
    }

    function flyingBlockFrameUpdate(time, timePassed) {
      let speed = 0.0015;
      if (flyingBlock) {
        if (flyingBlock.type === "z") {
          flyingBlock.mesh.position.z += speed * timePassed;
        }
      }
    }

    addBlock();

    function checkIntersection() {
      if (stackBlocks.length === 0) return;

      if (!flyingBlock) {
        addBlock();
        return;
      }

      const topBlock = stackBlocks[stackBlocks.length - 1];
      const topPosition = topBlock.mesh.position;
      const flyingPosition = flyingBlock.mesh.position;

      if (flyingBlock.type === "z") {
        const topZ1 = topPosition.z - topBlock.depth / 2;
        const topZ2 = topPosition.z + topBlock.depth / 2;

        const flyZ1 = flyingPosition.z - flyingBlock.depth / 2;
        const flyZ2 = flyingPosition.z + flyingBlock.depth / 2;

        if (flyZ1 === topZ1 && flyZ2 === topZ2) {
          addBlock();
          return;
        }

        if (flyZ1 > topZ1 && flyZ1 < topZ2) {
          const newDepth = Math.abs(topZ2 - flyZ1);
          scene.remove(flyingBlock.mesh);

          let blockData = generateBlockMesh({
            depth: newDepth,
            color: flyingBlock.color,
            type: "z",
          });
          blockData.mesh.position.z = topZ2 - blockData.depth / 2;
          gameWorld.add(blockData.mesh);
          stackBlocks.push(blockData);

          gameWorld.remove(flyingBlock.mesh);
          flyingBlock.mesh.geometry.dispose();
          flyingBlock.mesh.material.dispose();
          flyingBlock = null;
          addBlock();
          return;
        } else if (flyZ2 > topZ1 && flyZ2 < topZ2) {
          const newDepth = Math.abs(flyZ2 - topZ1);
          scene.remove(flyingBlock.mesh);

          let blockData = generateBlockMesh({
            depth: newDepth,
            color: flyingBlock.color,
            type: "z",
          });
          blockData.mesh.position.z = flyZ2 - blockData.depth / 2;
          gameWorld.add(blockData.mesh);
          stackBlocks.push(blockData);

          gameWorld.remove(flyingBlock.mesh);
          flyingBlock.mesh.geometry.dispose();
          flyingBlock.mesh.material.dispose();
          flyingBlock = null;
          addBlock();
          return;
        }
      }
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        e.preventDefault();
        checkIntersection();
        return;
      }
      if (e.key === "r") {
        e.preventDefault();
        restartGame();
        return;
      }
    });

    function restartGame() {
      scene.remove(gameWorld);
      gameWorld = new THREE.Object3D();
      scene.add(gameWorld);
      flyingBlock = null;
      stackBlocks = [];
      addBlock();
    }

    function updatePoints(pointsNum) {
      geometryHelper.create3dText({
        str: "Score: " + pointsNum,
        curveSegments: 36,
        size: 0.4,
        height: 0.2,
        callbackReady: function (readytext3d) {
          gameWorld.remove(points3dtext);
          points3dtext = readytext3d;
          points3dtext.position.set(-5, 0, 2);
          points3dtext.rotation.y = Math.PI / 2;
          gameWorld.add(points3dtext);
        },
      });
    }

    const color = 0xffffff;
    const intesity = 1.5;
    const light = new THREE.DirectionalLight(color, intesity);
    light.position.set(2, 10, 10);
    light.target.position.set(0, 0, 0);
    scene.add(light);
    scene.add(light.target);

    window.addEventListener("resize", (e) => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let lastTime = 0;

    function render(time) {
      if (!time) {
        time = 0;
      }
      const timePassed = time - lastTime;
      lastTime = time;

      flyingBlockFrameUpdate(time, timePassed);

      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }

    render();
  }, []);

  function cleanUp() {
    let canvas = document.querySelector("canvas");

    if (canvas) {
      canvas.remove();
    }
  }

  return (
    <div>
      <div id="threejs-container"></div>
      <NavLink
        to={"/"}
        className={"returnButton stackGameReturnButton"}
        onClick={cleanUp}
      >
        Return
      </NavLink>
    </div>
  );
};

export default ThreeJSGame;
