export interface ClassInfo {
  name: string;
  methods: ClassAttribute[];
  properties: ClassAttribute[];
}

export interface ClassAttribute {
  name: string;
  type: string;
  accessModifier: string[];
}
