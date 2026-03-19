import type { Client } from 'discord.js';

export interface MobileStatusOptions {
  platform?: 'ios' | 'android';
}

export interface IdentifyProperties {
  browser: string;
  device: string;
  [key: string]: string;
}

export const MOBILE_IDENTIFIERS: Readonly<{
  ios: 'Discord iOS';
  android: 'Discord Android';
}>;

export function patchMobileIdentifyProperties(
  platform?: MobileStatusOptions['platform'],
): IdentifyProperties;

export function enableMobileStatus(client: Client, options?: MobileStatusOptions): IdentifyProperties;

export function disableMobileStatus(): IdentifyProperties;

export function getIdentifyProperties(): IdentifyProperties;

declare const defaultExport: typeof patchMobileIdentifyProperties;

export default defaultExport;
