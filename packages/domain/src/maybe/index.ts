// https://github.com/kofno/maybeasy

// Re-export Maybe and its related functions
export { Maybe, just, maybe, nothing } from './Maybe.ts';

// Re-export functions from functions.ts
export {
  andThen,
  ap,
  cata,
  exists,
  filter,
  fromEmpty,
  fromNullable,
  getOrElse,
  getOrElseValue,
  isJust,
  isNothing,
  map,
  sequence,
  traverse,
  type Emptyable,
  type Nullable,
} from './functions.ts';
