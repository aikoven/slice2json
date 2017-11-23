export interface SliceSource {
  pragmaOnce?: boolean;
  includes?: string[];
  globalMetadata?: string[];
  modules: ModuleDeclaration[];
}

export interface ModuleDeclaration {
  type: 'module';
  name: string;
  doc?: string;
  metadata?: string[];
  content: ModuleChild[];
}

export type ModuleChild =
  | ModuleDeclaration
  | ClassForwardDeclaration
  | ClassDeclaration
  | InterfaceForwardDeclaration
  | InterfaceDeclaration
  | ExceptionDeclaration
  | StructDeclaration
  | EnumDeclaration
  | SequenceDeclaration
  | DictionaryDeclaration
  | ConstDeclaration;

export interface ClassForwardDeclaration {
  type: 'classForward';
  name: string;
  doc?: string;
  local?: boolean;
  extends?: string;
}

export interface ClassDeclaration {
  type: 'class';
  name: string;
  doc?: string;
  metadata?: string;
  local?: boolean;
  extends: string;
  content: ClassChild[];
}

export type ClassChild = ClassFieldDeclaration | OperationDeclaration;

export interface ClassFieldDeclaration {
  type: 'field';
  name: string;
  doc?: string;
  metadata?: string[];
  optional?: number;
  dataType: string;
  defaultValue?: string;
}

export interface InterfaceForwardDeclaration {
  type: 'interfaceForward';
  name: string;
  doc?: string;
  local?: boolean;
  extends?: string[];
}

export interface InterfaceDeclaration {
  type: 'interface';
  name: string;
  doc?: string;
  metadata?: string[];
  local?: boolean;
  extends?: string[];
  content: OperationDeclaration[];
}

export interface ExceptionDeclaration {
  type: 'exception';
  name: string;
  doc?: string;
  metadata?: string[];
  local?: boolean;
  extends?: string;
  content: ClassFieldDeclaration[];
}

export interface StructDeclaration {
  type: 'struct';
  name: string;
  doc?: string;
  metadata?: string[];
  local?: boolean;
  fields: StructFieldDeclaration[];
}

export interface StructFieldDeclaration {
  name: string;
  doc?: string;
  metadata?: string[];
  dataType: string;
  defaultValue?: string;
}

export interface EnumDeclaration {
  type: 'enum';
  name: string;
  doc?: string;
  metadata?: string[];
  enums: EnumElement[];
}

export interface EnumElement {
  doc?: string;
  name: string;
  value?: string;
}

export interface SequenceDeclaration {
  type: 'sequence';
  name: string;
  doc?: string;
  metadata?: string[];
  local?: boolean;
  dataType: string;
}

export interface DictionaryDeclaration {
  type: 'dictionary';
  name: string;
  doc?: string;
  metadata?: string;
  local?: boolean;
  keyType: string;
  valueType: string;
}

export interface ConstDeclaration {
  type: 'const';
  name: string;
  doc?: string;
  dataType: string;
  value: string;
}

export interface OperationDeclaration {
  type: 'operation';
  name: string;
  doc?: string;
  metadata?: string[];
  idempotent?: boolean;
  parameters: ParameterDeclaration[];
  throws?: string[];
}

export interface ParameterDeclaration {
  name: string;
  metadata?: string[];
  out?: boolean;
  optional?: number;
  dataType: string;
}
