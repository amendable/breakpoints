import _ from 'lodash'

export default ({ breakpoints = {} }) => ({
  match: ({ value }) => {
    if (!_.isPlainObject(value)) return

    return !_.isEmpty(_.intersection(_.keys(value), _.concat(_.keys(breakpoints), 'default')))
  },
  options: ({ key, value, hashStr }) => ({
    variableName: `--responsive-${hashStr(JSON.stringify({ [key]: value }))}`,
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
  globalCss: ({
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

    const result = _.map(_.omit(value, 'default'), (val, key) => {
      if (_.isUndefined(breakpoints[key])) {
        console.warn(`Responsive resolver: ${key} breakpoint missing from config`)
      }

      return (
        `@media (max-width: ${breakpoints[key]}) {
          :root {
            ${variableName}: ${resolve(val) || val};
          }
        }`
      )
    })

    if (!_.isUndefined(value.default)) {
      result.unshift(`
        :root {
          ${variableName}: ${resolve(value.default) || value.default};
        }
      `)
    }

    return result.join("\n")
  }
})
