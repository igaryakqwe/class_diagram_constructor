export class AnchorCircle {
  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public attachedBlockIndex: number | null = null
  ) {}

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    ctx.fillStyle = this.attachedBlockIndex !== null ? 'red' : 'blue'
    ctx.fill()
    ctx.stroke()
  }
}
