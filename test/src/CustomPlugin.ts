/* eslint-disable class-methods-use-this, no-unused-vars, import/no-unresolved, import/extensions */
import {
  ItlyOptions,
  ItlyEvent,
  ItlyProperties,
  ItlyPluginBase,
  ValidationResponse,
} from '../../packages/sdk-core/lib';

export default class CustomPlugin extends ItlyPluginBase {
  LOG_TAG = 'CustomPlugin';

  // eslint-disable-next-line no-console
  private log = (...messages: any[]) => console.log(`${this.LOG_TAG}: `, ...messages);

  private stringify = (object: any) => JSON.stringify(object);

  id(): string {
    return 'custom';
  }

  alias(userId: string, previousId: string | undefined): void {
    this.log(`alias() userId='${userId}' previousId='${previousId}'`);
  }

  group(userId: string | undefined, groupId: string, properties: ItlyProperties | undefined): void {
    this.log(`group() userId='${userId}' groupId='${groupId}' properties=${this.stringify(properties)}`);
  }

  identify(userId: string | undefined, properties: ItlyProperties | undefined): void {
    this.log(`identify() userId='${userId}' properties=${this.stringify(properties)}`);
  }

  load(options: ItlyOptions): void {
    this.log(`load() \
environment='${options.environment}' \
disabled=${options.disabled} \
plugins=[${options.plugins ? options.plugins.map((p) => p.id()).join(', ') : ''}] \
context=${this.stringify(options.context)} \
validationOptions=${this.stringify(options.validationOptions)}`);
  }

  page(userId?: string, category?: string, name?: string, properties?: ItlyProperties): void {
    this.log(`page() userId='${userId}' category='${category}' name='${name}' properties=${this.stringify(properties)}`);
  }

  reset(): void {
    this.log('reset()');
  }

  track(userId: string | undefined, event: ItlyEvent): void {
    this.log(`track() userId='${userId}' event='${event.name}' properties=${this.stringify(event.properties)}`);
  }

  validationError(validation: ValidationResponse, event: ItlyEvent) {
    this.log(`validationError() event='${event.name}' plugin=${validation.pluginId} message=${validation.message}`);
  }
}
