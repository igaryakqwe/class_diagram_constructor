import { ClassBlock } from './types/ClassBlock'

export class ClassDrawer {
  private readonly textY: number
  private totalHeight = 0
  constructor(
    private ctx: CanvasRenderingContext2D,
    private classBlock: ClassBlock,
    private cornerSize: number
  ) {
    this.textY = this.classBlock.y + 20
  }

  drawClassName(): void {
    const img = new Image()
    img.src = '../assets/typescript.svg'
    const iconWidth = 16
    const iconHeight = 16
    const iconY = this.textY - 15
    const textWidth = this.ctx.measureText(this.classBlock.classInfo.name).width
    const centerX = this.classBlock.x + this.classBlock.width / 2
    const combinedWidth = textWidth + iconWidth + 5
    const startX = centerX - combinedWidth / 2

    this.ctx.fillStyle = 'black'
    this.ctx.drawImage(img, startX, iconY, iconWidth, iconHeight)

    const textX = startX + iconWidth + 5
    this.ctx.fillStyle = '#6f42c1'
    this.ctx.fillText(this.classBlock.classInfo.name, textX, this.textY)

    this.ctx.fillStyle = '#cce5ff'

    this.ctx.fillRect(this.classBlock.x, this.textY + 5, this.classBlock.width, 1)
  }

  drawProperties(lineHeight): void {
    const iconWidth = 11
    const iconHeight = 16

    this.ctx.fillStyle = '#cce5ff'
    this.ctx.fillStyle = 'black'
    this.ctx.font = '14px Arial'

    for (const property in this.classBlock.classInfo.properties) {
      const propertyName = this.classBlock.classInfo.properties[property].name
      const propertyType = this.classBlock.classInfo.properties[property].type
      const propertyValue = `${propertyName}: ${propertyType}`
      const accessIcon = new Image()
      const permissionIcon = new Image()

      accessIcon.src = this.chooseAccessIcon(
        this.classBlock.classInfo.properties[property].accessModifier[0]
      )

      permissionIcon.src = this.choosePermissionIcon(
        this.classBlock.classInfo.properties[property].accessModifier
      )

      const textY = this.classBlock.y + 40 + this.totalHeight
      const iconX = this.classBlock.x + 5
      const textX = iconX + iconWidth * 2 + 12

      this.ctx.drawImage(permissionIcon, iconX, textY - iconHeight + 3, 16, 16)
      this.ctx.drawImage(
        accessIcon,
        iconX + iconWidth + 8,
        textY - iconHeight + 3,
        iconWidth,
        iconHeight
      )
      this.ctx.fillText(propertyValue, textX, textY)
      this.totalHeight += lineHeight
    }

    this.ctx.fillStyle = '#cce5ff'

    this.ctx.fillRect(
      this.classBlock.x,
      this.textY + this.totalHeight + 5,
      this.classBlock.width,
      1
    )
  }

  drawMethods(lineHeight): void {
    console.log(this.classBlock.classInfo)
    this.ctx.fillStyle = '#6f42c1'

    for (const method in this.classBlock.classInfo.methods) {
      const methodName = this.classBlock.classInfo.methods[method].name
      const methodType = this.classBlock.classInfo.methods[method].type
      const methodParameters = this.classBlock.classInfo.methods[method].parameters
      const methodParametersTypes = methodParameters?.join(', ') || ''
      const methodValue = `${methodName}(${methodParametersTypes}): ${methodType}`

      const methodIcon = new Image()
      const accessIcon = new Image()
      methodIcon.src = '../assets/method.png'
      accessIcon.src = this.chooseAccessIcon(
        this.classBlock.classInfo.methods[method].accessModifier[0]
      )

      const textY = this.classBlock.y + 40 + this.totalHeight
      const iconX = this.classBlock.x + 5
      const textX = iconX + 18 * 2

      this.ctx.drawImage(methodIcon, iconX, textY - 18 + 3, 19, 19)
      this.ctx.drawImage(accessIcon, iconX + 11 + 8, textY - 16 + 3, 11, 16)
      this.ctx.fillText(methodValue, textX, textY)
      this.totalHeight += lineHeight
    }
  }

  public drawClassBLock(
    classBlock: ClassBlock,
    index: number,
    selectedRectangleIndex: number | null
  ): void {
    this.ctx.fillStyle = 'white'
    this.ctx.strokeStyle = selectedRectangleIndex === index ? '#cce5ff' : 'black'
    this.ctx.lineWidth = 1
    this.ctx.fillRect(classBlock.x, classBlock.y, classBlock.width, classBlock.height)
    this.ctx.strokeRect(
      classBlock.x - 1,
      classBlock.y - 1,
      classBlock.width + 2,
      classBlock.height + 2
    )

    if (selectedRectangleIndex === index) {
      this.drawCornerSquare(classBlock.x, classBlock.y, this.ctx.strokeStyle)
      this.drawCornerSquare(classBlock.x + classBlock.width, classBlock.y, this.ctx.strokeStyle)
      this.drawCornerSquare(classBlock.x, classBlock.y + classBlock.height, this.ctx.strokeStyle)
      this.drawCornerSquare(
        classBlock.x + classBlock.width,
        classBlock.y + classBlock.height,
        this.ctx.strokeStyle
      )
    }

    this.ctx.fillStyle = 'black'
    this.ctx.font = '14px Arial'
    const lineHeight = 20

    this.drawClassName()
    this.drawProperties(lineHeight)
    this.drawMethods(lineHeight)
  }

  private drawCornerSquare(x: number, y: number, color: string): void {
    const halfCornerSize = this.cornerSize / 2
    this.ctx.fillStyle = color
    this.ctx.fillRect(x - halfCornerSize, y - halfCornerSize, this.cornerSize, this.cornerSize)
  }

  private chooseAccessIcon(accessModifier: string): string {
    const iconsMapper = {
      public: '../assets/public.svg',
      private: '../assets/private.svg',
      protected: '../assets/protected.svg'
    }

    if (!accessModifier) {
      return '../assets/public.svg'
    }

    return iconsMapper[accessModifier]
  }

  private choosePermissionIcon(accessModifiers: string[]): string {
    if (accessModifiers.includes('readonly')) {
      return '../assets/readonly.png'
    }
    return '../assets/default.png'
  }
}
