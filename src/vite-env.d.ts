/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

import type { JSX as ReactJSX } from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements extends ReactJSX.IntrinsicElements {}
  }
}
