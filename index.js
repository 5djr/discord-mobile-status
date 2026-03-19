'use strict';

const { DefaultDeviceProperty, DefaultWebSocketManagerOptions } = require('@discordjs/ws');

const MOBILE_IDENTIFIERS = Object.freeze({
  ios: 'Discord iOS',
  android: 'Discord Android',
});

function resolveMobileIdentifier(platform = 'ios') {
  if (typeof platform !== 'string') {
    throw new TypeError('The platform option must be a string.');
  }

  const normalizedPlatform = platform.toLowerCase();
  const mobileIdentifier = MOBILE_IDENTIFIERS[normalizedPlatform];

  if (!mobileIdentifier) {
    throw new RangeError(
      `Unsupported platform "${platform}". Supported platforms are: ${Object.keys(MOBILE_IDENTIFIERS).join(', ')}.`,
    );
  }

  return mobileIdentifier;
}

function patchMobileIdentifyProperties(platform = 'ios') {
  const mobileIdentifier = resolveMobileIdentifier(platform);

  DefaultWebSocketManagerOptions.identifyProperties = {
    ...DefaultWebSocketManagerOptions.identifyProperties,
    browser: mobileIdentifier,
    device: mobileIdentifier,
  };

  return {
    browser: DefaultWebSocketManagerOptions.identifyProperties.browser,
    device: DefaultWebSocketManagerOptions.identifyProperties.device,
  };
}

function enableMobileStatus(client, options = {}) {
  if (!client || typeof client !== 'object' || !('ws' in client)) {
    throw new TypeError('A discord.js Client instance is required.');
  }

  const identifyProperties = patchMobileIdentifyProperties(options.platform);

  if (client.ws?._ws) {
    throw new Error('Enable mobile status before calling client.login().');
  }

  return identifyProperties;
}

function disableMobileStatus() {
  DefaultWebSocketManagerOptions.identifyProperties = {
    ...DefaultWebSocketManagerOptions.identifyProperties,
    browser: DefaultDeviceProperty,
    device: DefaultDeviceProperty,
  };

  return {
    browser: DefaultWebSocketManagerOptions.identifyProperties.browser,
    device: DefaultWebSocketManagerOptions.identifyProperties.device,
  };
}

function getIdentifyProperties() {
  return { ...DefaultWebSocketManagerOptions.identifyProperties };
}

module.exports = patchMobileIdentifyProperties;
module.exports.patchMobileIdentifyProperties = patchMobileIdentifyProperties;
module.exports.enableMobileStatus = enableMobileStatus;
module.exports.disableMobileStatus = disableMobileStatus;
module.exports.getIdentifyProperties = getIdentifyProperties;
module.exports.MOBILE_IDENTIFIERS = MOBILE_IDENTIFIERS;
