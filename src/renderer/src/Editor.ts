import { ClassInfo } from './types/ClassInfo'
import { ClassBlock } from './types/ClassBlock'
import { ClassDrawer } from './ClassDrawer'

type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export class Editor {
  private classBlocks: ClassBlock[] = []
  private isDragging: boolean = false
  private selectedRectangleIndex: number | null = null
  private offsetX: number = 0
  private offsetY: number = 0
  private resizing: boolean = false
  private resizingHandle: ResizeHandle | null = null
  private cornerSize: number = 8

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {}

  handleMouseDown(event: MouseEvent): void {
    const mouseX = event.clientX - this.canvas.getBoundingClientRect().left
    const mouseY = event.clientY - this.canvas.getBoundingClientRect().top

    this.classBlocks.forEach((rectangle, index) => {
      if (
        mouseX >= rectangle.x &&
        mouseX <= rectangle.x + rectangle.width &&
        mouseY >= rectangle.y &&
        mouseY <= rectangle.y + rectangle.height
      ) {
        this.isDragging = true
        this.selectedRectangleIndex = index
        this.offsetX = mouseX - rectangle.x
        this.offsetY = mouseY - rectangle.y
        this.draw()
      }
    })
  }

  handleMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.selectedRectangleIndex !== null) {
      const mouseX = event.clientX - this.canvas.getBoundingClientRect().left
      const mouseY = event.clientY - this.canvas.getBoundingClientRect().top

      const rectangle = this.classBlocks[this.selectedRectangleIndex]
      rectangle.x = mouseX - this.offsetX
      rectangle.y = mouseY - this.offsetY

      this.draw()
    }

    if (this.resizing && this.selectedRectangleIndex !== null && this.resizingHandle) {
      const mouseX = event.clientX - this.canvas.getBoundingClientRect().left
      const mouseY = event.clientY - this.canvas.getBoundingClientRect().top
      const block = this.classBlocks[this.selectedRectangleIndex]

      this.handleResize(mouseX, mouseY, block)
      this.draw()
    }
  }

  handleMouseUp(): void {
    this.isDragging = false
    this.selectedRectangleIndex = null
    this.resizing = false
    this.resizingHandle = null
  }

  addClass(classInfo: ClassInfo): void {
    const classBlock: ClassBlock = {
      x: Math.random() * (this.canvas.width - 150),
      y: Math.random() * (this.canvas.height - 150),
      width: 150,
      height: 150,
      classInfo
    }

    this.classBlocks.push(classBlock)
    this.draw()
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.classBlocks.forEach((classBlock, index) => {
      const classDrawer = new ClassDrawer(this.ctx, classBlock)
      this.ctx.fillStyle = 'white'
      this.ctx.strokeStyle = this.selectedRectangleIndex === index ? '#cce5ff' : 'black'
      this.ctx.lineWidth = 1
      this.ctx.fillRect(classBlock.x, classBlock.y, classBlock.width, classBlock.height)
      this.ctx.strokeRect(
        classBlock.x - 1,
        classBlock.y - 1,
        classBlock.width + 2,
        classBlock.height + 2
      )

      if (this.selectedRectangleIndex === index) {
        this.drawCornerSquare(classBlock.x, classBlock.y, this.ctx.strokeStyle) // top-left
        this.drawCornerSquare(classBlock.x + classBlock.width, classBlock.y, this.ctx.strokeStyle) // top-right
        this.drawCornerSquare(classBlock.x, classBlock.y + classBlock.height, this.ctx.strokeStyle) // bottom-left
        this.drawCornerSquare(
          classBlock.x + classBlock.width,
          classBlock.y + classBlock.height,
          this.ctx.strokeStyle
        ) // bottom-right
      }

      this.ctx.fillStyle = 'black'
      this.ctx.font = '14px Arial'
      const lineHeight = 20

      classDrawer.drawClassName()
      classDrawer.drawProperties(lineHeight)
      classDrawer.drawMethods(lineHeight)
    })
  }

  private drawCornerSquare(x: number, y: number, color: string): void {
    const halfCornerSize = this.cornerSize / 2
    this.ctx.fillStyle = color
    this.ctx.fillRect(x - halfCornerSize, y - halfCornerSize, this.cornerSize, this.cornerSize)
  }

  private handleResize(mouseX: number, mouseY: number, block: ClassBlock): void {
    const handleMap: Record<
      ResizeHandle,
      (block: ClassBlock, mouseX: number, mouseY: number) => void
    > = {
      'top-left': (block, mouseX, mouseY) => {
        block.width += block.x - mouseX
        block.height += block.y - mouseY
        block.x = mouseX
        block.y = mouseY
      },
      'top-right': (block, mouseX, mouseY) => {
        block.width = mouseX - block.x
        block.height += block.y - mouseY
        block.y = mouseY
      },
      'bottom-left': (block, mouseX, mouseY) => {
        block.width += block.x - mouseX
        block.height = mouseY - block.y
        block.x = mouseX
      },
      'bottom-right': (block, mouseX, mouseY) => {
        block.width = mouseX - block.x
        block.height = mouseY - block.y
      }
    }

    if (this.resizingHandle && handleMap[this.resizingHandle]) {
      handleMap[this.resizingHandle](block, mouseX, mouseY)
    }
  }

  private getResizingHandle(
    mouseX: number,
    mouseY: number,
    block: ClassBlock
  ): ResizeHandle | null {
    const handles: ResizeHandle[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

    for (const handle of handles) {
      const handleX = handle.includes('left') ? block.x : block.x + block.width
      const handleY = handle.includes('top') ? block.y : block.y + block.height

      if (
        mouseX >= handleX - this.cornerSize / 2 &&
        mouseX <= handleX + this.cornerSize / 2 &&
        mouseY >= handleY - this.cornerSize / 2 &&
        mouseY <= handleY + this.cornerSize / 2
      ) {
        return handle
      }
    }

    return null
  }

  public handleResizeMouseDown(event: MouseEvent): void {
    const mouseX = event.clientX - this.canvas.getBoundingClientRect().left
    const mouseY = event.clientY - this.canvas.getBoundingClientRect().top

    this.classBlocks.forEach((block, index) => {
      const handle = this.getResizingHandle(mouseX, mouseY, block)
      if (handle) {
        this.resizing = true
        this.selectedRectangleIndex = index
        this.resizingHandle = handle
        this.offsetX = mouseX - block.x
        this.offsetY = mouseY - block.y
        this.draw()
      }
    })
  }

  handleResizeMouseMove(event: MouseEvent): void {
    if (this.resizing && this.selectedRectangleIndex !== null && this.resizingHandle) {
      const mouseX = event.clientX - this.canvas.getBoundingClientRect().left
      const mouseY = event.clientY - this.canvas.getBoundingClientRect().top
      const block = this.classBlocks[this.selectedRectangleIndex]

      this.handleResize(mouseX, mouseY, block)
      this.draw()
    }
  }

  public handleResizeMouseUp(): void {
    this.resizing = false
    this.resizingHandle = null
  }
}
