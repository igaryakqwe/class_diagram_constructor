import { ClassAttribute, ClassInfo } from './types/ClassInfo'
import { Editor } from './Editor'

export class SidePanel {
  private curClassInfo: ClassInfo

  constructor(
    private editor: Editor,
    private curIndex: number
  ) {
    this.curClassInfo = this.editor.classBlocks[this.curIndex].classInfo
  }

  private getAccessModifiersHtml(accessModifiers: string[]): string {
    return `<h4>
              Access Modifiers: ${accessModifiers.length > 0 ? accessModifiers[0] : 'public'} ${
                accessModifiers[1] ? accessModifiers[1] : ''
              }
            </h4>`
  }

  private getPropertyHtml(property: ClassAttribute, index: number): string {
    const accessModifiersHtml = this.getAccessModifiersHtml(property.accessModifier)
    return `<div>
              ${accessModifiersHtml}
              <h4>Name: ${property.name}</h4>
              <h4>Type: ${property.type}</h4>
              <button class="delete-button" data-type="property" data-index="${index}">Delete</button>
            </div>`
  }

  private getMethodHtml(method: ClassAttribute, index: number): string {
    const accessModifiersHtml = this.getAccessModifiersHtml(method.accessModifier)
    const parameters = method.parameters.join(', ')
    return `<div>
              ${accessModifiersHtml}
              <h4>Name: ${method.name}(${parameters})</h4>
              <h4>Type: ${method.type}</h4>
              <button class="delete-button" data-type="method" data-index="${index}">Delete</button>
            </div>`
  }

  public drawClassName(): void {
    const className = document.getElementById('className')
    if (className) {
      className.innerText = `Class name: ${this.curClassInfo.name}`
    }
  }

  public drawProperties(): void {
    const properties = document.getElementById('propertiesList') as HTMLElement
    const head = '<h3>Properties</h3>'
    const propertyElements = this.curClassInfo.properties.map((property, index) => {
      return this.getPropertyHtml(property, index)
    })
    properties.innerHTML = head + propertyElements.join('')
    this.addDeleteButtonListeners('property')
  }

  public drawMethods(): void {
    const methods = document.getElementById('methodsList') as HTMLElement
    const head = '<h3>Methods</h3>'
    const methodElements = this.curClassInfo.methods.map((method, index) => {
      return this.getMethodHtml(method, index)
    })
    methods.innerHTML = head + methodElements.join('')
    this.addDeleteButtonListeners('method')
  }

  public draw(): void {
    this.drawClassName()
    this.drawProperties()
    this.drawMethods()
  }

  private addDeleteButtonListeners(type: 'property' | 'method'): void {
    const buttons = document.querySelectorAll(`.delete-button[data-type="${type}"]`)
    buttons.forEach((button) => {
      button.addEventListener('click', () => this.handleDeleteButtonClick(button))
    })
  }

  private handleDeleteButtonClick(button: Element): void {
    const type = button.getAttribute('data-type')
    const index = Number(button.getAttribute('data-index'))

    if (type === 'property' && index < this.curClassInfo.properties.length) {
      this.curClassInfo.properties.splice(index, 1)
    } else if (type === 'method' && index < this.curClassInfo.methods.length) {
      this.curClassInfo.methods.splice(index, 1)
    }

    this.draw()
    this.editor.draw()
  }
}
