import _ from 'lodash'

export default ({
  key,
  value,
  props: {
    css = '',
  },
  variableName,
  variableScope,
  applyResolvers,
  breakpoints,
}) => {
  const sortedValues = _.reduce(breakpoints, (memo, val, key) => {
    if (_.isUndefined(value[key])) return memo

    memo[key] = value[key]
    return memo
  }, {})

  const resolve = (value) => (
    _.get(
      applyResolvers({ [key]: value }),
      ['style', key],
    )
  )

  const result = _.map(sortedValues, (val, key) => {
    if (_.isUndefined(breakpoints[key])) {
      console.warn(`Responsive resolver: ${key} breakpoint missing from config`)
    }

    return (
      `@media (min-width: ${breakpoints[key]}) {
  ${variableScope} {
    ${variableName}: ${resolve(val) || val};
  }
}`
    )
  })

  return [
    css,
    result.join("\n"),
  ].join("\n")
}
