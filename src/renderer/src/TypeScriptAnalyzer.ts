import ts from 'ts-morph'
import type { ClassAttribute, ClassInfo } from './types/ClassInfo'

export class TypeScriptAnalyzer {
  private readonly project = new ts.Project({ useInMemoryFileSystem: true })

  analyzeFile(fileContent: string): ClassInfo {
    const sourceFile = this.project.createSourceFile(`temp${new Date()}.ts`, fileContent)

    const classDeclaration = sourceFile.getClasses()[0]

    if (!classDeclaration) {
      throw new Error('No classes found in file')
    }

    const className = classDeclaration.getName()

    const methods: ClassAttribute[] = classDeclaration.getMethods().map((method) => {
      const methodName = method.getName()
      const returnType = method.getReturnType().getText()
      const accessModifier = method.getModifiers().map((modifier) => modifier.getText())

      // Extract method parameters
      const parameters: string[] = method.getParameters().map((parameter) => {
        return parameter.getType().getText()
      })

      return {
        name: methodName,
        type: returnType,
        accessModifier: accessModifier,
        parameters: parameters
      }
    })

    const properties: ClassAttribute[] = classDeclaration.getProperties().map((property) => {
      const propertyName = property.getName()
      const propertyType = property.getType().getText()
      const accessModifiers = property.getModifiers().map((modifier) => modifier.getText())

      return {
        name: propertyName,
        type: propertyType,
        accessModifier: accessModifiers,
        parameters: []
      }
    })

    return {
      name: className || '',
      methods: methods,
      properties: properties
    }
  }
}
