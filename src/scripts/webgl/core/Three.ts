import * as THREE from 'three'
import { EventDispatcher } from './EventDispatcher'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

class Three {
  public time = { delta: 0, elapsed: 0 }

  private _renderer?: THREE.WebGLRenderer
  private _scene?: THREE.Scene
  private _camera?: THREE.PerspectiveCamera
  private eventDispatcher?: EventDispatcher
  private _controls?: OrbitControls
  private clock = new THREE.Clock()

  setup(canvas: HTMLCanvasElement) {
    this._renderer = this.createRenderer(canvas)
    this._scene = this.createScene()
    this._camera = this.createCamera()
    this.eventDispatcher = this.createEvents()
  }

  private createRenderer(canvas: HTMLCanvasElement) {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    return renderer
  }

  private createScene() {
    const scene = new THREE.Scene()
    return scene
  }

  private createCamera() {
    const camera = new THREE.PerspectiveCamera(45, this.size.aspect, 0.01, 10)
    camera.position.z = 2
    return camera
  }

  private createEvents() {
    const events = new EventDispatcher()
    events.resize = () => {
      const { innerWidth: width, innerHeight: height } = window
      this.renderer.setSize(width, height)
      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
    }
    return events
  }

  get size() {
    const { width, height } = this.renderer.domElement
    return { width, height, aspect: width / height }
  }

  get renderer() {
    if (this._renderer) return this._renderer
    else throw new Error('renderer is not defined')
  }

  get scene() {
    if (this._scene) return this._scene
    else throw new Error('scene is not defined')
  }

  get camera() {
    if (this._camera) return this._camera
    else throw new Error('camera is not defined')
  }

  get controls() {
    if (!this._controls) {
      this._controls = new OrbitControls(this.camera, this.renderer.domElement)
    }
    return this._controls
  }

  animation(anime: (() => void) | null) {
    if (anime) {
      this.renderer.setAnimationLoop(() => {
        this.time.delta = this.clock.getDelta()
        this.time.elapsed = this.clock.getElapsedTime()
        anime()
      })
    } else {
      this.renderer.setAnimationLoop(null)
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.animation(null)
    this.renderer.dispose()
    this.eventDispatcher?.remove()
  }
}

export const three = new Three()
