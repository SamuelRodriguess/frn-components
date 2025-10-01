declare module 'vtex.render-runtime' {
  import type { FunctionComponent } from 'react'

  interface ExtensionPointProps {
    id: string
    [key: string]: unknown
  }

  export const ExtensionPoint: FunctionComponent<ExtensionPointProps>
}
