import {ClassInfo} from "./types/ClassInfo";
import {ClassBlock} from "./types/ClassBlock";

export class Editor {
  private rectangles: ClassBlock[] = [];
  private isDragging: boolean = false;
  private selectedRectangleIndex: number | null = null;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(private canvas: HTMLCanvasElement, private ctx: CanvasRenderingContext2D) {}

  handleMouseDown(event: MouseEvent) {
    const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;

    this.rectangles.forEach((rectangle, index) => {
      if (
        mouseX >= rectangle.x &&
        mouseX <= rectangle.x + rectangle.width &&
        mouseY >= rectangle.y &&
        mouseY <= rectangle.y + rectangle.height
      ) {
        this.isDragging = true;
        this.selectedRectangleIndex = index;
        this.offsetX = mouseX - rectangle.x;
        this.offsetY = mouseY - rectangle.y;
        this.draw();
      }
    });
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDragging && this.selectedRectangleIndex !== null) {
      const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;

      const rectangle = this.rectangles[this.selectedRectangleIndex];
      rectangle.x = mouseX - this.offsetX;
      rectangle.y = mouseY - this.offsetY;

      this.draw();
    }
  }

  handleMouseUp() {
    this.isDragging = false;
    this.selectedRectangleIndex = null;
  }

  addClass(classInfo: ClassInfo) {
    const classBlock = {
      x: Math.random() * (this.canvas.width - 150),
      y: Math.random() * (this.canvas.height - 150),
      width: 150,
      height: 150,
      classInfo,
    };

    this.rectangles.push(classBlock);
    this.draw();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.rectangles.forEach((classBlock) => {
      this.ctx.fillStyle = 'blue';
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 2;
      this.ctx.fillRect(classBlock.x, classBlock.y, classBlock.width, classBlock.height);
      this.ctx.strokeRect(classBlock.x - 1, classBlock.y - 1, classBlock.width + 2, classBlock.height + 2);

      this.ctx.fillStyle = 'white';
      this.ctx.font = '14px Arial';
      this.ctx.textAlign = 'center'
      const lineHeight = 20;

      let totalHeight = 0;
      let textY = classBlock.y + 20;

      this.ctx.fillText(classBlock.classInfo.name, classBlock.x + 10, textY);

      this.ctx.fillStyle = 'green';

      this.ctx.fillRect(classBlock.x, textY + 5, classBlock.width, 1);

      this.ctx.fillStyle = 'white';
      this.ctx.textAlign = 'left'

      for (const property in classBlock.classInfo.properties) {
        textY = classBlock.y + 40 + totalHeight;
        this.ctx.fillText(classBlock.classInfo.properties[property].name, classBlock.x + 10, textY);
        totalHeight += lineHeight;
      }

      this.ctx.fillRect(classBlock.x, textY + 5, classBlock.width, 1);

      for (const method in classBlock.classInfo.methods) {
        textY = classBlock.y + 40 + totalHeight;
        this.ctx.fillText(classBlock.classInfo.methods[method].name, classBlock.x + 10, textY);
        totalHeight += lineHeight;
      }
    });
  }
}
