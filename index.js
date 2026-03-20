'use strict';

const { DefaultDeviceProperty, DefaultWebSocketManagerOptions } = require('@discordjs/ws');

const DEFAULT_IDENTIFY_PROPERTIES = Object.freeze({
  ...DefaultWebSocketManagerOptions.identifyProperties,
});

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

function createMobileIdentifyProperties(platform = 'ios') {
  const mobileIdentifier = resolveMobileIdentifier(platform);

  return {
    ...DEFAULT_IDENTIFY_PROPERTIES,
    os: DEFAULT_IDENTIFY_PROPERTIES.os ?? '',
    browser: mobileIdentifier,
    device: mobileIdentifier,
    $os: '',
    $browser: mobileIdentifier,
    $device: mobileIdentifier,
    $referrer: '',
    $referring_domain: '',
  };
}

function patchMobileIdentifyProperties(platform = 'ios') {
  DefaultWebSocketManagerOptions.identifyProperties = createMobileIdentifyProperties(platform);

  return {
    os: DefaultWebSocketManagerOptions.identifyProperties.os,
    browser: DefaultWebSocketManagerOptions.identifyProperties.browser,
    device: DefaultWebSocketManagerOptions.identifyProperties.device,
    $os: DefaultWebSocketManagerOptions.identifyProperties.$os,
    $browser: DefaultWebSocketManagerOptions.identifyProperties.$browser,
    $device: DefaultWebSocketManagerOptions.identifyProperties.$device,
    $referrer: DefaultWebSocketManagerOptions.identifyProperties.$referrer,
    $referring_domain: DefaultWebSocketManagerOptions.identifyProperties.$referring_domain,
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
    ...DEFAULT_IDENTIFY_PROPERTIES,
    browser: DefaultDeviceProperty,
    device: DefaultDeviceProperty,
  };

  return {
    os: DefaultWebSocketManagerOptions.identifyProperties.os,
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
