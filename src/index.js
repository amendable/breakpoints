import _ from 'lodash'
import hash from '@amendable/hash'
import defaultBreakpoints from './defaultBreakpoints'
import newCss from './newCss'

export default ({
  breakpoints = defaultBreakpoints,
  variableScope = '\:root'
} = {
  breakpoints: defaultBreakpoints,
  variableScope: '\:root',
}) => ({
  match: ({ value }) => {
    if (!_.isPlainObject(value)) return

    return !_.isEmpty(_.intersection(_.keys(value), _.keys(breakpoints)))
  },
  resolve: ({
    key,
    value,
    props,
    applyResolvers,
  }) => {
    const variableName = `--responsive-${hash(JSON.stringify({ [key]: value }))}`

    return {
      [key]: `var(${variableName})`,
      css: newCss({ key, value, props, variableName, applyResolvers, variableScope, breakpoints })
    }
  },
})
