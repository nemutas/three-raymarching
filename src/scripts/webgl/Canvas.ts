import * as THREE from 'three'
import { three } from './core/Three'
import vertexShader from './glsl/vertexShader.glsl'
import fragmentShader from './glsl/fragmentShader.glsl'
import { EventDispatcher } from './core/EventDispatcher'

export class Canvas {
  private box: THREE.Mesh
  private screen: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  private events: EventDispatcher

  constructor(canvas: HTMLCanvasElement) {
    this.init(canvas)
    this.box = this.createBox()
    this.screen = this.createScreen()
    this.events = this.createEvents()
    three.animation(this.anime)
  }

  private init(canvas: HTMLCanvasElement) {
    three.setup(canvas)
    three.scene.background = new THREE.Color('#0f0f0f')
    three.camera.position.z = 1.5
    three.controls.dampingFactor = 0.15
    three.controls.enableDamping = true
  }

  private createBox() {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    const material = new THREE.MeshNormalMaterial({ wireframe: true })
    const mesh = new THREE.Mesh(geometry, material)
    three.scene.add(mesh)
    return mesh
  }

  private createScreen() {
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uCameraPosition: { value: three.camera.position },
        uProjectionMatrixInverse: { value: three.camera.projectionMatrixInverse },
        uViewMatrixInverse: { value: three.camera.matrixWorld },
        uNormalMatrix: { value: three.camera.matrixWorld.clone().transpose() },
        uModelMatrix: { value: this.box.matrixWorld.clone().invert() },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    three.scene.add(mesh)
    return mesh
  }

  private createEvents() {
    const events = new EventDispatcher()
    events.resize = () => {}
    return events
  }

  private anime = () => {
    three.controls.update()

    this.box.rotation.x += three.time.delta
    this.box.rotation.y += three.time.delta * 0.5
    this.box.rotation.z += three.time.delta * 0.3

    // this.box.position.x = Math.sin(three.time.elapsed)
    // this.box.position.y = Math.sin(three.time.elapsed * 3.0) * 0.2

    const unifroms = this.screen.material.uniforms
    unifroms.uProjectionMatrixInverse.value = three.camera.projectionMatrixInverse
    unifroms.uCameraPosition.value = three.camera.position
    unifroms.uViewMatrixInverse.value = three.camera.matrixWorld
    unifroms.uNormalMatrix.value = three.camera.matrixWorld.clone().transpose()
    unifroms.uModelMatrix.value = this.box.matrixWorld.clone().invert()

    three.render()
  }

  dispose() {
    three.dispose()
    this.events.remove()
  }
}
