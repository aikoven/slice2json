import {readFileSync} from 'fs';
import {grammar, Node} from 'ohm-js';

import * as types from './types';
import {findDocString} from './findDocString';
import {stripDirectives} from './stripDirectives';

const sliceGrammar = grammar(
  readFileSync(require.resolve('./slice.ohm'), 'utf-8'),
);

function getType(node: Node) {
  return {type: node.ctorName};
}

const sliceSemantics = sliceGrammar.createSemantics().addOperation('toJson', {
  SliceSource(
    directivesNode: Node,
    moduleDeclarationsNode: Node,
  ): types.SliceSource {
    const globalMetadata = [];
    const includes = [];
    let pragmaOnce = undefined;

    const [directives] = directivesNode.toJson();

    if (directives) {
      for (const res of directives) {
        if (res.type === 'pragmaDirective') {
          pragmaOnce = true;
        } else if (res.type === 'include') {
          includes.push(res.module);
        } else if (res.type === 'GlobalMetadata') {
          globalMetadata.push(...res.data);
        }
      }
    }
    return {
      pragmaOnce,
      includes: includes.length > 0 ? includes : undefined,
      globalMetadata: globalMetadata.length > 0 ? globalMetadata : undefined,
      modules: moduleDeclarationsNode.toJson(),
    };
  },

  pragmaDirective(this: Node, node) {
    return getType(this);
  },
  includeDirective(t1, module, t2) {
    return {
      type: 'include',
      module: module.sourceString,
    };
  },
  GlobalMetadata(t1, data, t2) {
    return {
      type: 'GlobalMetadata',
      data: data.toJson(),
    };
  },
  Metadata(t1, data, t2) {
    return {
      type: 'Metadata',
      data: data.toJson(),
    };
  },
  metadataPart(t1, data, t2) {
    return data.sourceString;
  },
  NonemptyListOf(first, t1, rest) {
    return [first.toJson(), ...rest.toJson()];
  },
  EmptyListOf() {
    return [];
  },

  ModuleDeclaration(
    this: Node,
    metadataNode,
    t1,
    identifierNode,
    t2,
    bodyNode,
    t3,
  ): types.ModuleDeclaration {
    const [metadata] = metadataNode.toJson();
    return {
      type: 'module',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      metadata: metadata ? metadata.data : undefined,
      content: bodyNode.toJson(),
    };
  },

  ClassForwardDeclaration(
    this: Node,
    localModifierNode,
    t1,
    identifierNode,
    extendsNode,
    t2,
  ): types.ClassForwardDeclaration {
    const [local] = localModifierNode.toJson();
    const [extends_] = extendsNode.toJson();

    return {
      type: 'classForward',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      local: local ? true : undefined,
      extends: extends_ ? extends_.data : undefined,
    };
  },
  ClassDeclaration(
    this: Node,
    metadataNode,
    localModifierNode,
    t1,
    identifierNode,
    extendsNode,
    t2,
    bodyNode,
    t3,
  ): types.ClassDeclaration {
    const [metadata] = metadataNode.toJson();
    const [local] = localModifierNode.toJson();
    const [extends_] = extendsNode.toJson();

    return {
      type: 'class',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      metadata: metadata ? metadata.data : undefined,
      local: local ? true : undefined,
      extends: extends_ ? extends_.data : undefined,
      content: bodyNode.toJson(),
    };
  },
  ClassExtendsDeclaration(t1, node) {
    return {
      type: 'ClassExtends',
      data: node.toJson(),
    };
  },
  ClassFieldDeclaration(
    this: Node,
    metadataNode,
    optionalModifierNode,
    dataTypeNode,
    identifierNode,
    defaultValueNode,
    t1,
  ): types.ClassFieldDeclaration {
    const [metadata] = metadataNode.toJson();
    const [optional] = optionalModifierNode.toJson();
    const [defaultValue] = defaultValueNode.toJson();

    return {
      type: 'field',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      metadata: metadata ? metadata.data : undefined,
      optional: optional ? optional.tag : undefined,
      dataType: dataTypeNode.sourceString,
      defaultValue: defaultValue ? defaultValue.data : undefined,
    };
  },

  InterfaceForwardDeclaration(
    this: Node,
    localModifierNode,
    t1,
    identifierNode,
    extendsNode,
    t2,
  ): types.InterfaceForwardDeclaration {
    const [local] = localModifierNode.toJson();
    const [extends_] = extendsNode.toJson();

    return {
      type: 'interfaceForward',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      local: local ? true : undefined,
      extends: extends_ ? extends_.data : undefined,
    };
  },
  InterfaceDeclaration(
    this: Node,
    metadataNode,
    localModifierNode,
    t1,
    identifierNode,
    extendsNode,
    t2,
    bodyNode,
    t3,
  ): types.InterfaceDeclaration {
    const [metadata] = metadataNode.toJson();
    const [local] = localModifierNode.toJson();
    const [extends_] = extendsNode.toJson();

    return {
      type: 'interface',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      metadata: metadata ? metadata.data : undefined,
      local: local ? true : undefined,
      extends: extends_ ? extends_.data : undefined,
      content: bodyNode.toJson(),
    };
  },
  InterfaceExtendsDeclaration(t1, node) {
    return {
      type: 'InterfaceExtends',
      data: node.toJson(),
    };
  },

  ExceptionDeclaration(
    this: Node,
    metadataNode,
    localModifierNode,
    t1,
    identifierNode,
    extendsNode,
    t2,
    bodyNode,
    t3,
  ): types.ExceptionDeclaration {
    const [metadata] = metadataNode.toJson();
    const [local] = localModifierNode.toJson();
    const [extends_] = extendsNode.toJson();

    return {
      type: 'exception',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      metadata: metadata ? metadata.data : undefined,
      local: local ? true : undefined,
      extends: extends_ ? extends_.data : undefined,
      content: bodyNode.toJson(),
    };
  },

  StructDeclaration(
    this: Node,
    metadataNode,
    localModifierNode,
    t1,
    identifierNode,
    t2,
    bodyNode,
    t3,
  ): types.StructDeclaration {
    const [metadata] = metadataNode.toJson();
    const [local] = localModifierNode.toJson();

    return {
      type: 'struct',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      metadata: metadata ? metadata.data : undefined,
      local: local ? true : undefined,
      fields: bodyNode.toJson(),
    };
  },

  StructFieldDeclaration(
    this: Node,
    metadataNode,
    dataTypeNode,
    identifierNode,
    defaultValueNode,
    t1,
  ): types.StructFieldDeclaration {
    const [metadata] = metadataNode.toJson();
    const [defaultValue] = defaultValueNode.toJson();

    return {
      name: identifierNode.toJson(),
      doc: findDocString(this),
      metadata: metadata ? metadata.data : undefined,
      dataType: dataTypeNode.sourceString,
      defaultValue: defaultValue ? defaultValue.data : undefined,
    };
  },

  EnumDeclaration(
    this: Node,
    metadataNode,
    localModifierNode,
    t1,
    identifierNode,
    t2,
    bodyNode,
    t3,
  ): types.EnumDeclaration {
    const [metadata] = metadataNode.toJson();

    return {
      type: 'enum',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      metadata: metadata ? metadata.data : undefined,
      enums: bodyNode.toJson(),
    };
  },
  EnumBody(elementsListNode, t1) {
    return elementsListNode.toJson();
  },
  EnumElement(this: Node, identifierNode, enumValueNode): types.EnumElement {
    const [value] = enumValueNode.toJson();
    return {
      doc: findDocString(this),
      name: identifierNode.toJson(),
      value: value ? value.data : undefined,
    };
  },
  EnumValue(t1, valueNode) {
    return valueNode.sourceString;
  },

  SequenceDeclaration(
    this: Node,
    metadataNode,
    localModifierNode,
    t1,
    t2,
    dataTypeNode,
    t3,
    identifierNode,
    t4,
  ): types.SequenceDeclaration {
    const [metadata] = metadataNode.toJson();
    const [local] = localModifierNode.toJson();
    const dataType = dataTypeNode.toJson();

    return {
      type: 'sequence',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      metadata: metadata ? metadata.data : undefined,
      local: local ? true : undefined,
      dataTypeMetadata: dataType.metadata,
      dataType: dataType.dataType,
    };
  },

  DictionaryDeclaration(
    this: Node,
    metadataNode,
    localModifierNode,
    t1,
    t2,
    keyTypeNode,
    t3,
    valueTypeNode,
    t4,
    identifierNode,
    t5,
  ): types.DictionaryDeclaration {
    const [metadata] = metadataNode.toJson();
    const [local] = localModifierNode.toJson();
    const keyType = keyTypeNode.toJson();
    const valueType = valueTypeNode.toJson();

    return {
      type: 'dictionary',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      metadata: metadata ? metadata.data : undefined,
      local: local ? true : undefined,
      keyTypeMetadata: keyType.metadata,
      keyType: keyType.dataType,
      valueTypeMetadata: valueType.metadata,
      valueType: valueType.dataType,
    };
  },

  CollectionDataType(metadataNode, dataTypeNode) {
    const [metadata] = metadataNode.toJson();

    return {
      metadata: metadata ? metadata.data : undefined,
      dataType: dataTypeNode.sourceString,
    };
  },

  ConstDeclaration(
    this: Node,
    t1,
    dataTypeNode,
    identifierNode,
    valueNode,
    t2,
  ): types.ConstDeclaration {
    return {
      type: 'const',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      dataType: dataTypeNode.sourceString,
      value: valueNode.toJson().data,
    };
  },

  OperationDeclaration(
    this: Node,
    metadataNode,
    idempotentModifierNode,
    optionalModifierNode,
    returnTypeNode,
    identifierNode,
    t1,
    parameterListNode,
    t2,
    throwsDeclarationNode,
    t3,
  ): types.OperationDeclaration {
    const [metadata] = metadataNode.toJson();
    const [idempotent] = idempotentModifierNode.toJson();
    const [optional] = optionalModifierNode.toJson();
    const [throws] = throwsDeclarationNode.toJson();

    return {
      type: 'operation',
      name: identifierNode.toJson(),
      doc: findDocString(this),
      metadata: metadata ? metadata.data : undefined,
      idempotent: idempotent ? true : undefined,
      returnOptional: optional ? optional.tag : undefined,
      returnType: returnTypeNode.sourceString,
      parameters: parameterListNode.toJson(),
      throws: throws ? throws.data : undefined,
    };
  },
  ParameterDeclaration(
    metadataNode,
    outModifierNode,
    optionalModifierNode,
    dataTypeNode,
    identifierNode,
  ): types.ParameterDeclaration {
    const [metadata] = metadataNode.toJson();
    const [out] = outModifierNode.toJson();
    const [optional] = optionalModifierNode.toJson();

    return {
      name: identifierNode.toJson(),
      metadata: metadata ? metadata.data : undefined,
      out: out ? true : undefined,
      optional: optional ? optional.tag : undefined,
      dataType: dataTypeNode.sourceString,
    };
  },
  ThrowsDeclaration(t1, typeIdsListNode) {
    return {
      type: 'throws',
      data: typeIdsListNode.toJson(),
    };
  },

  localModifier(this: Node, t1) {
    return getType(this);
  },

  outModifier(this: Node, t1) {
    return getType(this);
  },
  idempotentModifier(this: Node, t1) {
    return getType(this);
  },

  optionalModifier(t1, tagNode, t2) {
    return {
      type: 'optional',
      tag: +tagNode.sourceString,
    };
  },

  objectType(node) {
    return node.sourceString;
  },
  typeId(first, t1, rest) {
    return this.sourceString;
  },

  DefaultValue(t1, literalNode) {
    return {
      type: 'DefaultValue',
      data: literalNode.sourceString,
    };
  },

  identifier(this: Node, node) {
    const str = this.sourceString;

    if (str.startsWith('\\')) {
      return str.substring(1);
    }
    return str;
  },
});


export function parse(source: string): types.SliceSource {
  const res = sliceGrammar.match(stripDirectives(source));
  if (res.failed()) {
    throw new Error(`Failed to parse slice file:\n${res.message}`);
  }

  return sliceSemantics(res).toJson();
}
