export class ArrowDrawer {
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

    this.drawEditCircle(startX, startY)
    this.drawEditCircle(endX, endY)
  }

  private drawEditCircle(x: number, y: number): void {
    this.ctx.beginPath()
    this.ctx.arc(x, y, this.editCircleRadius, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'blue'
    this.ctx.fill()
    this.ctx.stroke()
  }
}
