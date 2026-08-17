const assert = require('assert')
const { loadConfig } = require('../../lib/config/config-file')

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

  it('should unwrap the default export of an ESM config file', function () {
    if (!supportsRequireEsm) this.skip()

    const loadedConfig = loadConfig('./test/helpers/esm-config/solhint.config.js')

    assert.deepStrictEqual(loadedConfig, { extends: ['solhint:recommended'] })
  })
})
