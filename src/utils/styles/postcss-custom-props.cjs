const valueParser = require('postcss-value-parser')

const DEFAULTS = {
  fromPrefix: '--tw-',
  toPrefix: '--lgk-tw-',
}

function renameVarName(varName, fromPrefix, toPrefix) {
  if (!varName.startsWith(fromPrefix))
    return varName
  return toPrefix + varName.slice(fromPrefix.length)
}

function rewriteValueVars(rawValue, fromPrefix, toPrefix) {
  const ast = valueParser(rawValue)

  const visit = (nodes) => {
    for (const node of nodes) {
      if (node.type === 'function') {
        if (node.value.toLowerCase() === 'var' && node.nodes.length) {
          const first = node.nodes.find(n => n.type === 'word')
          if (first) {
            const newName = renameVarName(first.value, fromPrefix, toPrefix)
            first.value = newName
          }
        }
        visit(node.nodes)
      }
    }
  }

  visit(ast.nodes)
  return ast.toString()
}

module.exports = (opts = {}) => {
  const { fromPrefix, toPrefix } = { ...DEFAULTS, ...opts }

  return {
    postcssPlugin: 'postcss-custom-props',
    Once(root) {
      root.walkAtRules((at) => {
        if (at.name === 'property') {
          const param = at.params.trim()
          if (param.startsWith(fromPrefix)) {
            at.params = renameVarName(param, fromPrefix, toPrefix)
          }
        }
      })

      root.walkDecls((decl) => {
        if (decl.prop.startsWith(fromPrefix)) {
          decl.prop = renameVarName(decl.prop, fromPrefix, toPrefix)
        }

        if (
          decl.value
          && decl.value.includes('var(')
          && decl.value.includes(fromPrefix)
        ) {
          decl.value = rewriteValueVars(decl.value, fromPrefix, toPrefix)
        }
      })
    },
  }
}

module.exports.postcss = true
