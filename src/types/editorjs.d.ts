// src/types/editorjs.d.ts
// Criar este arquivo para resolver problemas de types

declare module '@editorjs/link' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const LinkTool: ToolConstructable
  export default LinkTool
}

declare module '@editorjs/embed' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const Embed: ToolConstructable
  export default Embed
}

declare module '@editorjs/raw' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const Raw: ToolConstructable
  export default Raw
}

declare module '@editorjs/marker' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const Marker: ToolConstructable
  export default Marker
}

declare module '@editorjs/checklist' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const CheckList: ToolConstructable
  export default CheckList
}

declare module '@editorjs/header' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const Header: ToolConstructable
  export default Header
}

declare module '@editorjs/list' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const List: ToolConstructable
  export default List
}

declare module '@editorjs/code' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const Code: ToolConstructable
  export default Code
}

declare module '@editorjs/image' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const Image: ToolConstructable
  export default Image
}

declare module '@editorjs/quote' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const Quote: ToolConstructable
  export default Quote
}

declare module '@editorjs/delimiter' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const Delimiter: ToolConstructable
  export default Delimiter
}

declare module '@editorjs/inline-code' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const InlineCode: ToolConstructable
  export default InlineCode
}

declare module '@editorjs/table' {
  import { ToolConstructable } from '@editorjs/editorjs'
  const Table: ToolConstructable
  export default Table
}