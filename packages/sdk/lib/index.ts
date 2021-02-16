/* eslint-disable global-require, import/extensions, import/no-unresolved */
/* eslint-disable no-underscore-dangle */
import {
  Options,
  Environment,
  Event,
  Properties,
  Plugin,
  PluginLoadOptions,
  PluginLogger,
  ValidationOptions,
  ValidationResponse,
  Logger,
  LOGGERS,
} from './base';
import { Itly as ItlyBrowser } from './browser';
import { Itly as ItlyNode } from './node';

export {
  Options,
  Environment,
  Plugin,
  PluginLoadOptions,
  PluginLogger,
  Event,
  Properties,
  ValidationOptions,
  ValidationResponse,
  Logger,
  LOGGERS,
};

const p = typeof process === 'undefined'
  ? undefined
  : process as any;

const isBrowser = (!p
// Electron renderer / nwjs process
|| (p.type === 'renderer' || p.browser === true || p.__nwjs)
// Jest JSDOM
|| (typeof navigator === 'object' && navigator.userAgent && navigator.userAgent.includes('jsdom'))
// React Native
|| (typeof navigator === 'object' && navigator.product && navigator.product.includes('ReactNative')));

const Itly: any = isBrowser ? ItlyBrowser : ItlyNode;

export { Itly, ItlyBrowser, ItlyNode };
export default Itly;
