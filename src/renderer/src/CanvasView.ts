export class CanvasView {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rectangles: { x: number; y: number; width: number; height: number }[] = [];
  private isDragging: boolean = false;
  private isResizing: boolean = false;
  private selectedRectangleIndex: number | null = null;
  private selectedCorner: string | null = null;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupButton();
    this.setupEventListeners();
  }

  private setupButton() {
    const addRectangleBtn = document.getElementById('addRectangleBtn');
    if (addRectangleBtn) {
      addRectangleBtn.addEventListener('click', () => this.addRectangle());
    }

    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
  }

  private setupEventListeners() {
    this.canvas.addEventListener('mousedown', (event) => this.handleMouseDown(event));
    this.canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
    this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Delete' && this.selectedRectangleIndex !== null) {
      this.rectangles.splice(this.selectedRectangleIndex, 1);
      this.selectedRectangleIndex = null;
      this.draw();
    }
  }

  private handleMouseDown(event: MouseEvent) {
    const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;

    this.rectangles.forEach((rectangle, index) => {
      const cornerSize = 8;
      const corners = [
        { x: rectangle.x, y: rectangle.y },
        { x: rectangle.x + rectangle.width, y: rectangle.y },
        { x: rectangle.x, y: rectangle.y + rectangle.height },
        { x: rectangle.x + rectangle.width, y: rectangle.y + rectangle.height },
      ];

      for (let i = 0; i < corners.length; i++) {
        const corner = corners[i];
        const distance = Math.sqrt((mouseX - corner.x) ** 2 + (mouseY - corner.y) ** 2);

        if (distance < cornerSize) {
          this.isResizing = true;
          this.selectedRectangleIndex = index;
          this.selectedCorner = i.toString();
          this.offsetX = mouseX - rectangle.x;
          this.offsetY = mouseY - rectangle.y;
          return;
        }
      }

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

  private handleMouseMove(event: MouseEvent) {
    if (this.isDragging && this.selectedRectangleIndex !== null) {
      const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;

      const rectangle = this.rectangles[this.selectedRectangleIndex];
      rectangle.x = mouseX - this.offsetX;
      rectangle.y = mouseY - this.offsetY;

      this.draw();
    } else if (this.isResizing && this.selectedRectangleIndex !== null && this.selectedCorner !== null) {
      const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;

      const rectangle = this.rectangles[this.selectedRectangleIndex];

      if (this.selectedCorner === '0') {
        rectangle.width = rectangle.x + rectangle.width - mouseX;
        rectangle.height = rectangle.y + rectangle.height - mouseY;
        rectangle.x = mouseX;
        rectangle.y = mouseY;
      } else if (this.selectedCorner === '1') {
        rectangle.width = mouseX - rectangle.x;
        rectangle.height = rectangle.y + rectangle.height - mouseY;
        rectangle.y = mouseY;
      } else if (this.selectedCorner === '2') {
        rectangle.width = rectangle.x + rectangle.width - mouseX;
        rectangle.height = mouseY - rectangle.y;
        rectangle.x = mouseX;
      } else if (this.selectedCorner === '3') {
        rectangle.width = mouseX - rectangle.x;
        rectangle.height = mouseY - rectangle.y;
      }

      this.draw();
    }
  }

  private handleMouseUp() {
    this.isDragging = false;
    this.isResizing = false;
    this.selectedRectangleIndex = null;
    this.selectedCorner = null;
  }

  private addRectangle() {
    const rectangle = {
      x: Math.random() * (this.canvas.width - 50),
      y: Math.random() * (this.canvas.height - 50),
      width: 50,
      height: 50,
    };

    this.rectangles.push(rectangle);
    this.draw();
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.rectangles.forEach((rectangle, index) => {
      this.ctx.fillStyle = 'blue';

      if (index === this.selectedRectangleIndex) {
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2; // Adjust the width as needed
        this.ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        this.ctx.strokeRect(rectangle.x - 1, rectangle.y - 1, rectangle.width + 2, rectangle.height + 2);

        this.drawCornerHandle(rectangle.x, rectangle.y);
        this.drawCornerHandle(rectangle.x + rectangle.width, rectangle.y);
        this.drawCornerHandle(rectangle.x, rectangle.y + rectangle.height);
        this.drawCornerHandle(rectangle.x + rectangle.width, rectangle.y + rectangle.height);
      } else {
        this.ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
      }

      this.ctx.fillStyle = 'black';
      this.ctx.font = '14px Arial';
      const text = `Rect ${index + 1}`;
      const textX = rectangle.x + rectangle.width / 2 - this.ctx.measureText(text).width / 2;
      const textY = rectangle.y + rectangle.height / 2 + 5;
      this.ctx.fillText(text, textX, textY);
    });
  }

  private drawCornerHandle(x: number, y: number) {
    const handleSize = 6;
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
  }
}
