import { ClassInfo } from './types/ClassInfo'
import { ClassBlock } from './types/ClassBlock'
import { ClassDrawer } from './ClassDrawer'

export class Editor {
  private classBlocks: ClassBlock[] = []
  private isDragging: boolean = false
  private selectedRectangleIndex: number | null = null
  private offsetX: number = 0
  private offsetY: number = 0

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

      this.draw() // Redraw all classBlocks after updating the dragged rectangle
    }
  }

  handleMouseUp(): void {
    this.isDragging = false
    this.selectedRectangleIndex = null
  }

  addClass(classInfo: ClassInfo): void {
    const classBlock = {
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

    this.classBlocks.forEach((classBlock) => {
      const classDrawer = new ClassDrawer(this.ctx, classBlock)
      this.ctx.fillStyle = 'white'
      this.ctx.strokeStyle = '#cce5ff'
      this.ctx.lineWidth = 1
      this.ctx.fillRect(classBlock.x, classBlock.y, classBlock.width, classBlock.height)
      this.ctx.strokeRect(
        classBlock.x - 1,
        classBlock.y - 1,
        classBlock.width + 2,
        classBlock.height + 2
      )

      this.ctx.fillStyle = 'black'
      this.ctx.font = '14px Arial'
      const lineHeight = 20

      classDrawer.drawClassName()
      classDrawer.drawProperties(lineHeight)
      classDrawer.drawMethods(lineHeight)
    })
  }
}
