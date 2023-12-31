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

    this.drawAll()
    this.editor.draw()
  }

  private drawFieldForm(type: 'property' | 'method'): void {
    const form = document.getElementById('form') as HTMLFormElement
    form.innerHTML = `
      <h3>Add ${type === 'property' ? 'Property' : 'Method'}</h3>
      <label for="accessModifier">Access Modifier:</label>
      <select id="accessModifier">
        <option value="public">public</option>
        <option value="private">private</option>
        <option value="protected">protected</option>
      </select>
      <label for="modifier">Modifier:</label>
      <select id="modifier">
        <option value="none">none</option>
        <option value="readonly">readonly</option>
      </select>
      <label for="name">Name:</label>
      <input type="text" id="name">
      <label for="type">Type:</label>
      <input type="text" id="type">
      <button id="submitForm">Add ${type}</button>
    `

    const submitFormBtn = document.getElementById('submitForm') as HTMLButtonElement
    submitFormBtn.addEventListener('click', () => this.submitForm(type, form))
  }

  private drawEditNameForm(): void {
    const editNameInput = document.createElement('input')
    editNameInput.id = 'editNameInput'
    editNameInput.type = 'text'
    editNameInput.value = this.curClassInfo.name

    const saveButton = document.createElement('button')
    saveButton.id = 'save'
    saveButton.innerText = 'Save'

    saveButton.addEventListener('click', () => {
      this.curClassInfo.name = editNameInput.value
      this.drawAll()
      this.editor.draw()
    })

    const className = document.getElementById('className') as HTMLHeadingElement
    className.innerHTML = 'Class name: '
    className.appendChild(editNameInput)
    className.appendChild(saveButton)
  }

  public drawClassName(): void {
    const className = document.getElementById('className') as HTMLHeadingElement
    className.innerHTML = `Class name: ${this.curClassInfo.name} <button id="editName">Edit</button>`

    const editNameBtn = document.getElementById('editName') as HTMLButtonElement
    editNameBtn.addEventListener('click', () => this.drawEditNameForm())
  }

  public drawProperties(): void {
    const properties = document.getElementById('propertiesList') as HTMLElement
    const head = '<h3>Properties <button id="addProperty">+</button></h3>'
    const propertyElements = this.curClassInfo.properties.map((property, index) => {
      return this.getPropertyHtml(property, index)
    })
    properties.innerHTML = head + propertyElements.join('')
    const addPropertyBtn = document.getElementById('addProperty') as HTMLButtonElement
    addPropertyBtn.addEventListener('click', () => this.addField('property'))

    this.addDeleteButtonListeners('property')
  }

  public drawMethods(): void {
    const methods = document.getElementById('methodsList') as HTMLElement
    const head = '<h3>Methods <button id="addMethod">+</button></h3>'
    const methodElements = this.curClassInfo.methods.map((method, index) => {
      return this.getMethodHtml(method, index)
    })
    methods.innerHTML = head + methodElements.join('')

    const addMethodBtn = document.getElementById('addMethod') as HTMLButtonElement
    addMethodBtn.addEventListener('click', () => this.addField('method'))
    this.addDeleteButtonListeners('method')
  }

  public drawAll(): void {
    this.drawClassName()
    this.drawProperties()
    this.drawMethods()
  }

  public addField(type: 'property' | 'method'): void {
    this.drawFieldForm(type)
  }

  public submitForm(type: 'property' | 'method', form: HTMLFormElement): void {
    const accessModifier = (document.getElementById('accessModifier') as HTMLSelectElement).value
    const modifier = (document.getElementById('modifier') as HTMLSelectElement).value
    const name = (document.getElementById('name') as HTMLInputElement).value
    const fieldtype = (document.getElementById('type') as HTMLInputElement).value

    const newField: ClassAttribute = {
      name,
      type: fieldtype,
      accessModifier: [accessModifier, modifier]
    }

    if (type === 'property') {
      this.curClassInfo.properties.push(newField)
    } else if (type === 'method') {
      this.curClassInfo.methods.push(newField)
    }
    form.innerText = ''
    this.drawAll()
    this.editor.draw()
  }
}
