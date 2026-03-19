'use strict';

const assert = require('node:assert/strict');
const discordIOS = require('..');

const iosProperties = discordIOS('ios');
assert.equal(iosProperties.browser, 'Discord iOS');
assert.equal(iosProperties.device, 'Discord iOS');

const androidProperties = discordIOS.enableMobileStatus({ ws: {} }, { platform: 'android' });
assert.equal(androidProperties.browser, 'Discord Android');
assert.equal(androidProperties.device, 'Discord Android');

const restoredProperties = discordIOS.disableMobileStatus();
assert.notEqual(restoredProperties.browser, 'Discord Android');
assert.notEqual(restoredProperties.device, 'Discord Android');

console.log('smoke test passed');
