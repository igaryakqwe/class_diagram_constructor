export class ArrowDrawer {
  constructor(private ctx: CanvasRenderingContext2D) {}

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
  }
}
