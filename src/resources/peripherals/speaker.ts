import { Peripheral } from  "../microprocessor/index.js";

export type Speaker = {
  audioBuffer: number[];
  playbackIndex: number;
};

export type AudioHandler = (pitch: number, length: number) => void;

const DEFAULT_PITCH = 1;

export class  SpeakerPeripheral implements Peripheral<Speaker> {
  reset(state: Speaker) {
    state.audioBuffer = [];
    state.playbackIndex = 0;
  }

  beep(state: Speaker) {
    state.audioBuffer.push(DEFAULT_PITCH);
  }

  sound(state: Speaker, pitch: number) {
    state.audioBuffer.push(pitch);
  }
}
