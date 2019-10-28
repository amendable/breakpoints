import _ from 'lodash'
import hash from '@amendable/hash'
import defaultBreakpoints from './defaultBreakpoints'

export default ({ breakpoints = defaultBreakpoints } = { breakpoints: defaultBreakpoints }) => ({
  match: ({ value }) => {
    if (!_.isPlainObject(value)) return

    return !_.isEmpty(_.intersection(_.keys(value), _.keys(breakpoints)))
  },
  options: ({ key, value }) => ({
    variableName: `--responsive-${hash(JSON.stringify({ [key]: value }))}`,
  }),
  resolve: ({
    key,
    value,
    options: {
      variableName,
    }
  }) => ({
    [key]: `var(${variableName})`,
  }),
  css: ({
    key,
    value,
    options: {
      variableName,
    },
    applyResolvers,
  }) => {
    const resolve = (value) => (
      _.get(
        applyResolvers({ [key]: value }),
        ['style', key],
      )
    )

    const sortedValues = _.reduce(breakpoints, (memo, val, key) => {
      if (_.isUndefined(value[key])) return memo

      memo[key] = value[key]
      return memo
    }, {})

    const result = _.map(sortedValues, (val, key) => {
      if (_.isUndefined(breakpoints[key])) {
        console.warn(`Responsive resolver: ${key} breakpoint missing from config`)
      }

      return (
        `@media (min-width: ${breakpoints[key]}) {
          ${variableName}: ${resolve(val) || val};
        }`
      )
    })

    return result.join("\n")
  }
})
