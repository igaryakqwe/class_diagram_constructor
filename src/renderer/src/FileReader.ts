import { TypeScriptAnalyzer } from "./TypeScriptAnalyzer";
import { Editor } from "./Editor";

export class FileManager {
  public readonly analyzer = new TypeScriptAnalyzer();

  constructor(private readonly editor: Editor) {}

  renderClassInfo(
    fileInput: HTMLInputElement,
    resultContainer: HTMLDivElement
  ) {
    const file = fileInput.files!![0];

    if (!file) {
      resultContainer.innerHTML = 'Please choose a file';
      return;
    }

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const fileContent = event.target?.result as string;
        const analysisResult = this.analyzer.analyzeFile(fileContent);
        this.editor.addClass(analysisResult);
      } catch (error) {
        resultContainer.innerHTML = `Error reading file: ${error.message}`;
      }
    };

    reader.readAsText(file);
  }
}