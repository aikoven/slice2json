export interface SliceSource {
  type: 'source',
  pragmaOnce?: boolean;
  includes?: string[];
  globalMetadata?: string[];
  modules: ModuleDeclaration[];
}

export type Location = {
  start: number;
  end: number;
}

export interface ModuleDeclaration {
  type: 'module';
  location: Location;
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
  location: Location;
  name: string;
  doc?: string;
  local?: boolean;
  extends?: string;
}

export interface ClassDeclaration {
  type: 'class';
  location: Location;
  name: string;
  compactTypeId?: number;
  doc?: string;
  metadata?: string[];
  local?: boolean;
  extends?: string;
  content: ClassChild[];
}

export type ClassChild = ClassFieldDeclaration | OperationDeclaration;

export interface ClassFieldDeclaration {
  type: 'field';
  location: Location;
  name: string;
  doc?: string;
  metadata?: string[];
  optional?: number;
  dataType: string;
  defaultValue?: string;
}

export interface InterfaceForwardDeclaration {
  type: 'interfaceForward';
  location: Location;
  name: string;
  doc?: string;
  local?: boolean;
  extends?: string[];
}

export interface InterfaceDeclaration {
  type: 'interface';
  location: Location;
  name: string;
  doc?: string;
  metadata?: string[];
  local?: boolean;
  extends?: string[];
  content: OperationDeclaration[];
}

export interface ExceptionDeclaration {
  type: 'exception';
  location: Location;
  name: string;
  doc?: string;
  metadata?: string[];
  local?: boolean;
  extends?: string;
  content: ClassFieldDeclaration[];
}

export interface StructDeclaration {
  type: 'struct';
  location: Location;
  name: string;
  doc?: string;
  metadata?: string[];
  local?: boolean;
  fields: StructFieldDeclaration[];
}

export interface StructFieldDeclaration {
  type: 'structField';
  location: Location;
  name: string;
  doc?: string;
  metadata?: string[];
  dataType: string;
  defaultValue?: string;
}

export interface EnumDeclaration {
  type: 'enum';
  location: Location;
  name: string;
  doc?: string;
  metadata?: string[];
  local?: boolean;
  enums: EnumElement[];
}

export interface EnumElement {
  type: 'enumElement';
  location: Location;
  doc?: string;
  name: string;
  value?: string;
}

export interface SequenceDeclaration {
  type: 'sequence';
  location: Location;
  name: string;
  doc?: string;
  metadata?: string[];
  local?: boolean;
  dataTypeMetadata?: string[];
  dataType: string;
}

export interface DictionaryDeclaration {
  type: 'dictionary';
  location: Location;
  name: string;
  doc?: string;
  metadata?: string[];
  local?: boolean;
  keyTypeMetadata?: string[];
  keyType: string;
  valueTypeMetadata?: string[];
  valueType: string;
}

export interface ConstDeclaration {
  type: 'const';
  location: Location;
  name: string;
  doc?: string;
  dataType: string;
  value: string;
}

export interface OperationDeclaration {
  type: 'operation';
  location: Location;
  name: string;
  doc?: string;
  metadata?: string[];
  idempotent?: boolean;
  returnOptional?: number;
  returnType: string;
  parameters: ParameterDeclaration[];
  throws?: string[];
}

export interface ParameterDeclaration {
  type: 'parameter';
  location: Location;
  name: string;
  metadata?: string[];
  out?: boolean;
  optional?: number;
  dataType: string;
}
