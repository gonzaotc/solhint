const assert = require('assert')
const path = require('path')
const { applyExtends, loadConfig } = require('../../lib/config/config-file')

// `require(esm)` is only available from Node 22.12 onwards.
const supportsRequireEsm = (() => {
  const [major, minor] = process.versions.node.split('.').map(Number)
  return major > 22 || (major === 22 && minor >= 12)
})()

describe('Config file', () => {
  it(`should throw an error if the config file doesn't exist`, () => {
    assert.throws(
      () => loadConfig('.solhint.json'),
      /^Error: The config file passed as a parameter does not exist$/,
    )
  })

  it(`should load the config file if exist`, () => {
    const loadedConfig = loadConfig('./test/helpers/solhint_config_test.json')

    const loadedConfigFileExpected = {
      extends: ['solhint:recommended'],
    }

    assert.deepStrictEqual(loadedConfig, loadedConfigFileExpected)
  })

  it('should load a CommonJS config file', () => {
    const loadedConfig = loadConfig('./test/helpers/cjs-config/solhint.config.js')

    assert.deepStrictEqual(loadedConfig, { extends: ['solhint:recommended'] })
  })

  it('should unwrap the default export of an ESM config file', function () {
    if (!supportsRequireEsm) this.skip()

    const loadedConfig = loadConfig('./test/helpers/esm-config/solhint.config.js')

    assert.deepStrictEqual(loadedConfig, { extends: ['solhint:recommended'] })
  })

  it('should extend a CommonJS shareable config', () => {
    const shareable = path.resolve('./test/helpers/cjs-shareable-config/index.js')
    const extended = applyExtends({ extends: [shareable] })

    assert.deepStrictEqual(extended.rules, { 'no-console': 'error' })
  })

  it('should extend an ESM shareable config', function () {
    if (!supportsRequireEsm) this.skip()

    const shareable = path.resolve('./test/helpers/esm-shareable-config/index.js')
    const extended = applyExtends({ extends: [shareable] })

    assert.deepStrictEqual(extended.rules, { 'no-console': 'error' })
    assert.ok(!('__esModule' in extended) && !('default' in extended))
  })
})
