import * as THREE from "three";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

class GeometryHelper {
  createSimpleCube = ({
    width = 1,
    height = 1,
    depth = 1,
    numSegments = 3,
    color = "green",
    wireframe = true,
    material = null,
  } = {}) => {
    let cubeGeometry = new THREE.BoxGeometry(
      width,
      height,
      depth,
      numSegments,
      numSegments,
      numSegments
    );

    if (!material) {
      material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: wireframe,
      });
    }

    return new THREE.Mesh(cubeGeometry, material);
  };

  createSimpleSphere = ({
    radius = 1,
    widthSegments = 16,
    heightSegments = 16,
    color = 0xff99cc,
    wireframe = true,
    material = null,
  } = {}) => {
    const sphereGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );

    if (!material) {
      material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: wireframe,
      });
    }

    return new THREE.Mesh(sphereGeometry, material);
  };

  createSimpleTorus = ({
    radius = 1,
    tubeRadius = 0.4,
    radialSegments = 16,
    tubularSegements = 16,
    arc = Math.PI * 2, //360 stopni
    color = 0xffff00,
    wireframe = false,
    material = null,
  } = {}) => {
    const torusGeometry = new THREE.TorusGeometry(
      radius,
      tubeRadius,
      radialSegments,
      tubularSegements,
      arc
    );

    if (!material) {
      material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: wireframe,
      });
    }

    return new THREE.Mesh(torusGeometry, material);
  };

  createSimpleCylinder = ({
    radiusTop = 1,
    radiusBottom = 1,
    height = 1,
    radialSegments = 12,
    heightSegments = 12,
    color = 0x00cc00,
    wireframe = false,
    material = null,
  } = {}) => {
    const cylinderGeometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      radialSegments,
      heightSegments
    );

    if (!material) {
      material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: wireframe,
      });
    }

    return new THREE.Mesh(cylinderGeometry, material);
  };

  createSimplePlane = ({
    width = 1,
    height = 1,
    widthSegments = 1,
    heightSegments = 1,
    color = 0x0000cc,
    wireframe = false,
    material = null,
    side = THREE.DoubleSide, // strona ktora ma miec kolor
  } = {}) => {
    const planeGeometry = new THREE.PlaneGeometry(
      width,
      height,
      widthSegments,
      heightSegments
    );

    if (!material) {
      material = new THREE.MeshBasicMaterial({
        color: color,
        side: side,
        wireframe: wireframe,
      });
    }

    return new THREE.Mesh(planeGeometry, material);
  };

  createSimpleCone = ({
    radius = 1,
    height = 1,
    radialSegments = 8,
    heightSegments = 20,
    color = 0xff8000,
    wireframe = false,
    material = null,
  } = {}) => {
    const coneGeometry = new THREE.ConeGeometry(
      radius,
      height,
      radialSegments,
      heightSegments
    );

    if (!material) {
      material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: wireframe,
      });
    }

    return new THREE.Mesh(coneGeometry, material);
  };

  // LOSOWE KOLORY WIERZCHOLKÓW

  createCubeWithRandomVertexColors = ({
    width = 1,
    height = 1,
    depth = 1,
  } = {}) => {
    const boxGeometry = new THREE.BoxGeometry(
      width,
      height,
      depth
    ).toNonIndexed(); // geometria sklada sie z nikalnych wierzcholkow a nie wspoldzielonych

    const boxMaterial = new THREE.MeshBasicMaterial({
      vertexColors: true, //wymagane dla shadera
    });

    //wierzcholki

    const positionAttribute = boxGeometry.getAttribute("position");

    const colors = [];

    const color = new THREE.Color();

    for (let i = 0; i < positionAttribute.count; i += 3) {
      //losowy kolor

      let r = color.set(Math.random() * 0xffffff).r;
      let g = color.set(Math.random() * 0xffffff).g;
      let b = color.set(Math.random() * 0xffffff).b;

      colors.push(r, g, b);
      colors.push(g, b, r);
      colors.push(b, r, g);
    }

    boxGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    return new THREE.Mesh(boxGeometry, boxMaterial);
  };

  create3dText = ({
    str = "Hello Three.js!",
    fontUrl = "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
    color = 0xffd500,
    wireframe = false,
    material = null,
    centerText = false,
    height = 1,
    size = 2,
    curveSegments = 12,
    callbackReady,
  } = {}) => {
    if (!this.fontLoader) {
      this.fontLoader = new FontLoader();
    }

    this.fontLoader.load(
      fontUrl,

      //onload callback
      function (font) {
        console.log("font zaladowany");

        const textGeomtry = new TextGeometry(str, {
          font: font,
          size: size,
          height: height,
          curveSegments: curveSegments,
        });

        if (!material) {
          material = new THREE.MeshPhongMaterial({
            color: color,
            wireframe: wireframe,
          });
        }

        const text3d = new THREE.Mesh(textGeomtry, material);

        if (centerText) {
          textGeomtry.computeBoundingBox();
          textGeomtry.translate(
            -textGeomtry.boundingBox.max.x * 0.5,
            -textGeomtry.boundingBox.max.y * 0.5,
            -textGeomtry.boundingBox.max.z * 0.5
          );
        }

        callbackReady(text3d);
      },
      function (xhr) {
        //postep ladowania
      },

      function (err) {
        console.log("błąd ładowania czcionki", err);
      }
    );
  };

  createAxesHelper = (length) => {
    const axes = new THREE.AxesHelper(length);
    axes.material.depthTest = false; // wylaczamy bufor z
    axes.renderOrder = 1; // zawsze axes beda malowane po sferze

    return axes;
  };

  loadTexture = ({
    textureUrl = "/Programowanie gier w JavaScript/threejs/assets/textures/uv.png",
    textureRepeatX = 1,
    textureRepeatY = 1,
    textureWrapS = THREE.RepeatWrapping,
    textureWrapT = THREE.RepeatWrapping,
    textureRotation = 0,
    textureCenterX = 0,
    textureCenterY = 0,
    textureOffSetX = 0,
    textureOffSetY = 0,
  } = {}) => {
    const textureLoader = new THREE.TextureLoader();
    const texture1 = textureLoader.load(textureUrl);

    // WIELOKROTNE POWTARZANIE TEKSTURY

    texture1.repeat.x = textureRepeatX;
    texture1.repeat.y = textureRepeatY;

    texture1.wrapS = textureWrapS;
    texture1.wrapT = textureWrapT;

    // OBROT TEKSTURY

    texture1.rotation = textureRotation; // Math.PI / 4;

    // PUNKT OBROTU TEKSTURY

    texture1.center.x = textureCenterX;
    texture1.center.y = textureCenterY;

    // PRZESUNIECIE OFFSET

    texture1.offset.x = textureOffSetX;
    texture1.offset.y = textureOffSetY;

    return texture1;
  };
}

export { GeometryHelper };
