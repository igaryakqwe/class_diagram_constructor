import { CanvasView } from './CanvasView';
import { FileManager } from "./FileReader";

export function init(): void {
  window.addEventListener('DOMContentLoaded', () => {
    doAThing()
  })
}

function doAThing(): void {
  const versions = window.electron.process.versions
  replaceText('.electron-version', `Electron v${versions.electron}`)
  replaceText('.chrome-version', `Chromium v${versions.chrome}`)
  replaceText('.node-version', `Node v${versions.node}`)
  replaceText('.v8-version', `V8 v${versions.v8}`)
}

function replaceText(selector: string, text: string): void {
  const element = document.querySelector<HTMLElement>(selector)
  if (element) {
    element.innerText = text
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  const analyzeButton = document.getElementById('analyze-button') as HTMLButtonElement;
  const resultContainer = document.getElementById('result-container') as HTMLDivElement;
  const canvasView = new CanvasView(canvas);
  const fileManager = new FileManager(canvasView.editor);

  analyzeButton.addEventListener('click', () => fileManager.renderClassInfo(fileInput, resultContainer));


});

init()
