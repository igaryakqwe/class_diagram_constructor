import { ClassInfo } from './types/ClassInfo'
import { ClassBlock } from './types/ClassBlock'
import { ClassDrawer } from './ClassDrawer'
import { ArrowDrawer } from './ArrowDrawer'

type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export class Editor {
  private classBlocks: ClassBlock[] = []
  private arrows: { startX: number; startY: number; endX: number; endY: number }[] = []
  private isDragging: boolean = false
  private selectedRectangleIndex: number | null = null
  private cornerSize: number = 8
  private offsetX: number = 0
  private offsetY: number = 0
  private resizing: boolean = false
  private resizingHandle: string | null = null
  private editCircleRadius: number = 5

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D
  ) {}

  handleMouseDown(event: MouseEvent): void {
    const mouseX = event.clientX - this.canvas.getBoundingClientRect().left
    const mouseY = event.clientY - this.canvas.getBoundingClientRect().top

    for (const arrow of this.arrows) {
      if (this.isInEditCircle(mouseX, mouseY, arrow.startX, arrow.startY)) {
        this.resizing = true
        this.selectedRectangleIndex = this.arrows.indexOf(arrow)
        this.resizingHandle = 'start'
        return
      } else if (this.isInEditCircle(mouseX, mouseY, arrow.endX, arrow.endY)) {
        this.resizing = true
        this.selectedRectangleIndex = this.arrows.indexOf(arrow)
        this.resizingHandle = 'end'
        return
      }
    }

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

      if (this.resizingHandle === 'start') {
        this.handleResizeStart(mouseX, mouseY, this.arrows[this.selectedRectangleIndex])
      } else if (this.resizingHandle === 'end') {
        this.handleResizeEnd(mouseX, mouseY, this.arrows[this.selectedRectangleIndex])
      }

      this.draw()
    }
  }

  handleMouseUp(): void {
    this.isDragging = false
    this.selectedRectangleIndex = null
    this.resizing = false
    this.resizingHandle = null
  }

  isInEditCircle(mouseX: number, mouseY: number, circleX: number, circleY: number): boolean {
    const distance = Math.sqrt((mouseX - circleX) ** 2 + (mouseY - circleY) ** 2)
    return distance <= this.editCircleRadius
  }

  addClassBlock(classInfo: ClassInfo): void {
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

  addArrow(): void {
    const startX: number = this.canvas.width / 2
    const startY: number = this.canvas.height / 2

    this.arrows.push({ startX, startY, endX: startX + 80, endY: startY })
    this.draw()
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.arrows.forEach((arrow) => {
      const arrowDrawer = new ArrowDrawer(this.ctx, this.editCircleRadius)
      arrowDrawer.drawArrow(arrow.startX, arrow.startY, arrow.endX, arrow.endY)
    })

    this.classBlocks.forEach((classBlock, index) => {
      const classDrawer = new ClassDrawer(this.ctx, classBlock, this.cornerSize)
      classDrawer.drawClassBLock(classBlock, index, this.selectedRectangleIndex)
    })
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

  private handleResizeStart(
    mouseX: number,
    mouseY: number,
    arrow: { startX: number; startY: number; endX: number; endY: number }
  ): void {
    arrow.startX = mouseX
    arrow.startY = mouseY
  }

  private handleResizeEnd(
    mouseX: number,
    mouseY: number,
    arrow: { startX: number; startY: number; endX: number; endY: number }
  ): void {
    arrow.endX = mouseX
    arrow.endY = mouseY
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
