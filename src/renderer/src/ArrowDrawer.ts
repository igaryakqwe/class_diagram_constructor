import { AnchorCircle } from './AnchorCircle'

export class ArrowDrawer {
  private anchorCircles: AnchorCircle[] = []
  private isArrowSelected: boolean = false
  private selectedArrowIndex: number | null = null

  constructor(
    private ctx: CanvasRenderingContext2D,
    private editCircleRadius
  ) {}

  drawArrow(startX: number, startY: number, endX: number, endY: number): void {
    this.ctx.beginPath()
    this.ctx.moveTo(startX, startY)
    this.ctx.lineTo(endX, endY)
    this.ctx.stroke()

    // Стрілка
    const angle = Math.atan2(endY - startY, endX - startX)
    this.ctx.beginPath()
    this.ctx.moveTo(endX, endY)
    this.ctx.lineTo(
      endX - 10 * Math.cos(angle - Math.PI / 6),
      endY - 10 * Math.sin(angle - Math.PI / 6)
    )
    this.ctx.lineTo(
      endX - 10 * Math.cos(angle + Math.PI / 6),
      endY - 10 * Math.sin(angle + Math.PI / 6)
    )
    this.ctx.closePath()
    this.ctx.fill()

    this.drawEditCircles(startX, startY, endX, endY)
  }

  private drawEditCircles(startX: number, startY: number, endX: number, endY: number): void {
    this.anchorCircles.forEach((circle) => {
      circle.draw(this.ctx)
    })

    // Додавання кружечків на початок та кінець стрілки
    this.addAnchorCircle(startX, startY)
    this.addAnchorCircle(endX, endY)
  }

  private addAnchorCircle(x: number, y: number): void {
    const circle = new AnchorCircle(x, y, this.editCircleRadius)
    this.anchorCircles.push(circle)
  }

  public handleArrowMouseDown(
    event: MouseEvent,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): void {
    const mouseX = event.clientX - this.ctx.canvas.getBoundingClientRect().left
    const mouseY = event.clientY - this.ctx.canvas.getBoundingClientRect().top

    this.anchorCircles.forEach((circle) => {
      const distance = Math.sqrt((mouseX - circle.x) ** 2 + (mouseY - circle.y) ** 2)
      if (distance <= this.editCircleRadius) {
        // Обробка натискання на кружечок
        circle.attachedBlockIndex = null // Знімаємо прикріплення
        // Додаткова логіка, яку ви хочете виконати при натисканні на кружечок
      }
    })

    // Перевірка, чи натискання відбулося на стрілку
    const distanceToArrow = this.getDistanceToArrow(mouseX, mouseY, startX, startY, endX, endY)
    if (distanceToArrow <= this.editCircleRadius) {
      this.isArrowSelected = true
      this.selectedArrowIndex = this.anchorCircles.length - 1 // Індекс кружечка на кінці стрілки
    }
  }

  handleArrowMouseMove(event: MouseEvent): void {
    if (this.isArrowSelected && this.selectedArrowIndex !== null) {
      const mouseX = event.clientX - this.ctx.canvas.getBoundingClientRect().left
      const mouseY = event.clientY - this.ctx.canvas.getBoundingClientRect().top
      this.moveArrow(mouseX, mouseY)
    }
  }

  handleArrowMouseUp(): void {
    this.isArrowSelected = false
    this.selectedArrowIndex = null
  }

  private moveArrow(mouseX: number, mouseY: number): void {
    if (this.selectedArrowIndex !== null) {
      this.anchorCircles[this.selectedArrowIndex].x = mouseX
      this.anchorCircles[this.selectedArrowIndex].y = mouseY
    }
  }

  private getDistanceToArrow(
    mouseX: number,
    mouseY: number,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): number {
    const distanceToStart = Math.sqrt((mouseX - startX) ** 2 + (mouseY - startY) ** 2)
    const distanceToEnd = Math.sqrt((mouseX - endX) ** 2 + (mouseY - endY) ** 2)
    return Math.min(distanceToStart, distanceToEnd)
  }
}
