/* eslint-disable no-unused-vars, class-methods-use-this */
import {
  Event,
  Properties,
  Plugin,
} from '@itly/sdk';
import Amplitude, { AmplitudeOptions } from 'amplitude';

export { AmplitudeOptions };

export default class AmplitudeNodePlugin extends Plugin {
  private amplitude?: Amplitude;

  constructor(
    private apiKey: string,
    private options?: AmplitudeOptions,
  ) {
    super('amplitude');
  }

  // TODO: Allow passing in an instance rather than adding
  // TODO: destination specific configuration to Options
  // constructor(instanceOrApiKey: Amplitude | string, options?: AmplitudeOptions) {
  //     if(typeof instanceOrApiKey === 'string') {
  //         this.amplitude = new Amplitude(instanceOrApiKey, options);
  //     }
  //     else {
  //         this.amplitude = instanceOrApiKey;
  //     }
  // }

  load() {
    this.amplitude = new Amplitude(this.apiKey, this.options);
  }

  identify(userId: string, properties?: Properties) {
    this.amplitude!.identify({
      user_id: userId,
      user_properties: properties,
    });
  }

  track(userId: string, event: Event) {
    this.amplitude!.track({
      event_type: event.name,
      user_id: userId,
      event_properties: event.properties,
    });
  }
}
