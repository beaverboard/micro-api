import { Peripheral } from  "../microprocessor/index.js";

import { colors } from "./xTermColors"

const width = 256;
const height = 256;

export interface Pixel {
  colorId: number;
  hexString: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  },
  hsl: {
    h: number;
    s: number;
    l: number;
  },
  name: string;
};

export interface PixelDisplay {
  pixels: Pixel[];
  pixelUpdates: number;
}

export class PixelDisplayPeripheral implements Peripheral<PixelDisplay> {
  reset(state: PixelDisplay) {
    state.pixels = Array(width * height).fill(colors[0]);
    state.pixelUpdates = 0;
  }

  plot(state: PixelDisplay, x: number, y: number, value: number) {
    state.pixels[width * y + x] = colors[value];
    state.pixelUpdates++;
  }
}
