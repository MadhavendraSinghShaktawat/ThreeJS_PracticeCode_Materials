import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'



/*
Debug Gui
*/
const gui = new dat.GUI()



/*
TEXTURES
*/
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()


const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')


const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
])





/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/*
OBJECTS
*/

// /*
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture

// to use alpha textures
// material.transparent = true
// material.alphaMap = doorAlphaTexture
    //To use alpha textures in different sides
    // material.side = THREE.FrontSide  //texture will only visible to one side only: fornt side
    // material.side = THREE.BackSide  //texture will only visible to one side only: back side
    // material.side = THREE.DoubleSide  //texture will visible to both side
    // try to avoid double side because it increases calculation for cpu
// */

/*
// Matcap textures
  //- These are used for shiny and reflecting surfaces
const material = new THREE.MeshMatcapMaterial()
material.matcap = matcapTexture
*/

// Mesh Depth Material
    //- In this mesh material when we are close to obj it seems white 
    //  and when we are far away it becomes black, so we have to zoom a 
    //  bit to see our objects
    //- We can use it in fogs and other stuffs
// const material = new THREE.MeshDepthMaterial()


// Mesh Lambert Material    -Reacts with light in scene

//   the only problem while using it is it will show strange
//   pattern on our object(3D-Model)
// const material = new THREE.MeshLambertMaterial()




// Mesh Phong Material  -Reacts with light in scene
// this will solve strange patterns on objects(3d-Model)
// const material = new THREE.MeshPhongMaterial()
// material.shininess = 1000
// material.specular = new THREE.Color(0x1188ff)



//Mesh Toon Material   -Gives us anime feel in material
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture  //it will not show wanted results so we can solve it by using filters
// gradientTexture.magFilter = THREE.NearestFilter
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.generateMipmaps = false   // to increase frame rates if we are using nearest filter or any other filter



//Mesh Standard Material
// One of the best materials for smooth material
const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.envMap = environmentMapTexture
// material.map = doorColorTexture

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)




const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16), material
)
sphere.position.x = -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1), material
)

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32), material
)
torus.position.x = 1.5

scene.add(sphere, plane, torus)


/*
Lights
*/
const ambientlight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientlight)

const pointlight = new THREE.PointLight(0xffffff, 0.5)
scene.add(pointlight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update Objects
    sphere.rotation.x = 0.1 * elapsedTime
    plane.rotation.x = 0.1 * elapsedTime
    torus.rotation.x = 0.1 * elapsedTime

    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y= 0.1 * elapsedTime
    torus.rotation.y= 0.1 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()