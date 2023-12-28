export interface ClassAttribute {
  name: string
  type: string
  accessModifier: string[]
  parameters?: string[]
}

export interface ClassInfo {
  name: string
  methods: ClassAttribute[]
  properties: ClassAttribute[]
}
