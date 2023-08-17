type Callback = (e?: any) => void

export class EventDispatcher {
  private callbacks: { [key in string]: Callback } = {}
  private resizeObserver?: ResizeObserver
  private domResizeCallback?: Callback
  private enabled = true

  constructor(private target?: HTMLElement) {
    if (target) {
      this.resizeObserver = this.createResizeObserver(target)
    }
  }

  private createResizeObserver(target: HTMLElement) {
    const observer = new ResizeObserver((entries) => {
      if (0 < entries.length && this.enabled) {
        this.domResizeCallback?.()
      }
    })
    observer.observe(target)
    return observer
  }

  private get eventTarget() {
    return this.target ?? window
  }

  private addEvent(name: string, callback: Callback) {
    const cb = (e: any) => {
      if (this.enabled) {
        callback(e)
      }
    }
    this.callbacks[name] = cb
    this.eventTarget.addEventListener(name, cb)
  }

  set enable(v: boolean) {
    this.enabled = v
  }

  set resize(callback: Callback) {
    if (!this.resizeObserver) {
      this.addEvent('resize', callback)
    } else {
      this.domResizeCallback = callback
    }
  }

  set mousemove(callback: Callback) {
    this.addEvent('mousemove', callback)
  }

  set mousedown(callback: Callback) {
    this.addEvent('mousedown', callback)
  }

  set mouseup(callback: Callback) {
    this.addEvent('mouseup', callback)
  }

  set mouseout(callback: Callback) {
    this.addEvent('mouseout', callback)
  }

  set wheel(callback: Callback) {
    this.addEvent('wheel', callback)
  }

  set touchmove(callback: Callback) {
    this.addEvent('touchmove', callback)
  }

  set touchstart(callback: Callback) {
    this.addEvent('touchstart', callback)
  }

  set touchend(callback: Callback) {
    this.addEvent('touchend', callback)
  }

  remove() {
    Object.entries(this.callbacks).forEach(([name, callback]) => {
      this.eventTarget.removeEventListener(name, callback)
    })
    this.resizeObserver?.disconnect()
  }
}
