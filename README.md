# Breakpoints

This adds breakpoint support to your styles. It works through CSS styles and support SSR without any setup.

## Usage
```jsx sandbox
import { render } from 'react-dom'
import Box, { AmendableProvider } from '@amendable/core'
import breakpoints from '@amendable/breakpoints'
import inlineStyles from '@amendable/inline-styles'

render(
  <AmendableProvider
    resolvers={[
      breakpoints(),
      inlineStyles()
    ]}
  >
    <Box color={{ xs: 'red', lg: 'blue' }}>
      This will be red on small screens and blue on desktops+.
    </Box>
  </AmendableProvider>
)
```

## Supported props

It supports all props.
