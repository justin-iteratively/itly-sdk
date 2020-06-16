
/* eslint-disable no-unused-vars, class-methods-use-this */
import Ajv from 'ajv';
import {
  ItlyEvent,
  ItlyPluginBase,
  ValidationResponse,
} from '@itly/sdk-core';

export type ValidationResponseHandler = (
  validation: ValidationResponse,
  event: ItlyEvent,
  schema: any
) => any;

export type SchemaMap = { [schemaKey: string]: any };

const SYSTEM_EVENTS = ['identify', 'context', 'group', 'page'];
function isSystemEvent(name: string) {
  return SYSTEM_EVENTS.includes(name);
}

function isEmpty(obj: any) {
  return obj === undefined || Object.keys(obj).length === 0;
}

export default class SchemaValidatorPlugin extends ItlyPluginBase {
  static ID: string = 'schema-validator';

  private ajv?: Ajv.Ajv;

  private validators?: { [schemaKey: string]: Ajv.ValidateFunction };

  constructor(
    private schemas: SchemaMap,
    private validationErrorHandler: ValidationResponseHandler = () => {},
  ) {
    super();
  }

  id = () => SchemaValidatorPlugin.ID;

  load() {
    this.ajv = new Ajv();
    this.validators = {};
  }

  validate(event: ItlyEvent): ValidationResponse {
    const schemaKey = this.getSchemaKey(event);
    // Check that we have a schema for this event
    if (!this.schemas[schemaKey]) {
      if (isSystemEvent(schemaKey)) {
        // pass system events by default
        if (isEmpty(event.properties)) {
          return {
            valid: true,
            pluginId: this.id(),
          };
        }

        return {
          valid: false,
          message: `'${event.name}' schema is empty but properties were found. properties=${JSON.stringify(event.properties)}`,
          pluginId: this.id(),
        };
      }

      return {
        valid: false,
        message: `Event ${event.name} not found in tracking plan.`,
        pluginId: this.id(),
      };
    }

    // Compile validator for this event if needed
    const validators = this.validators!;
    if (!validators[schemaKey]) {
      validators[schemaKey] = this.ajv!.compile(this.schemas[schemaKey]);
    }

    const validator = validators[schemaKey]!;
    if (event.properties && !(validator(event.properties) === true)) {
      const errorMessage = validator.errors
        ? validator.errors.map((e: any) => {
          let extra = '';
          if (e.keyword === 'additionalProperties') {
            extra = ` (${e.params.additionalProperty})`;
          }
          return `\`properties${e.dataPath}\` ${e.message}${extra}.`;
        }).join(' ')
        : 'An unknown error occurred during validation.';

      return {
        valid: false,
        message: `Passed in ${event.name} properties did not validate against your tracking plan. ${errorMessage}`,
        pluginId: this.id(),
      };
    }

    return {
      valid: true,
      pluginId: this.id(),
    };
  }

  validationError(validation: ValidationResponse, event: ItlyEvent) {
    const schemaKey = this.getSchemaKey(event);
    this.validationErrorHandler(validation, event, this.schemas[schemaKey]);
  }

  getSchemaKey(event: ItlyEvent) {
    return event.name;
  }
}
