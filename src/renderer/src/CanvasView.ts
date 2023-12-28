import { Editor } from './Editor'

export class CanvasView {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private ratio = window.devicePixelRatio || 1 // Ensure a default value if devicePixelRatio is undefined
  readonly editor: Editor

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')!
    this.setupButton()
    this.setupEventListeners()
    this.setCanvasSize()
    this.editor = new Editor(this.canvas, this.ctx)
  }

  private setCanvasSize(): void {
    const { canvas, ctx, ratio } = this

    const canvasWidth = 1120
    const canvasHeight = 620

    canvas.width = canvasWidth * ratio
    canvas.height = canvasHeight * ratio

    canvas.style.width = canvasWidth + 'px'
    canvas.style.height = canvasHeight + 'px'

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  }

  private setupButton(): void {
    const addRectangleBtn = document.getElementById('addRectangleBtn')
    if (addRectangleBtn) {
      addRectangleBtn.addEventListener('click', () =>
        this.editor.addClass({
          name: 'Test',
          properties: [],
          methods: []
        })
      )
    }

    document.addEventListener('keydown', (event) => this.editor.handleKeyDown(event))
  }

  private setupEventListeners(): void {
    this.canvas.addEventListener('mousedown', (event) => this.editor.handleMouseDown(event))
    this.canvas.addEventListener('mousemove', (event) => this.editor.handleMouseMove(event))
    this.canvas.addEventListener('mouseup', () => this.editor.handleMouseUp())

    this.canvas.addEventListener('mousedown', (event) => this.editor.handleResizeMouseDown(event))
    this.canvas.addEventListener('mousemove', (event) => this.editor.handleResizeMouseMove(event))
    this.canvas.addEventListener('mouseup', () => this.editor.handleResizeMouseUp())
  }
}
