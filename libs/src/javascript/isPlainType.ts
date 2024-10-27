export enum BASIC_TYPES {
  Null = 'Null',
  Undefined = 'Undefined',
  String = 'String',
  Number = 'Number',
  Boolean = 'Boolean',
  Array = 'Array',
  Date = 'Date',
  Function = 'Function',
  RegExp = 'RegExp',
  Object = 'Object',
}

export const isPlainType = <T>(tar: unknown, type: BASIC_TYPES): tar is T =>
  Object.prototype.toString.call(tar).slice(8, -1) === type

