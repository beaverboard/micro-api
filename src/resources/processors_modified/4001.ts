import { ProcessorState as State } from "../microprocessor/index.js";
import { P as Processor } from "../microprocessor/index.js";
import { Fire, FirePeripheral } from "../peripherals/fire.js";

import { Lcd, LcdPeripheral } from "../peripherals/lcd.js";
import { Speaker, SpeakerPeripheral } from "../peripherals/speaker.js";
const lcd = new LcdPeripheral();

const fire = new FirePeripheral();

export const processor: Processor<Lcd  & Fire> = {
  name: "QT4001",
  memoryBitSize: 4,
  registerBitSize: 4,
  numMemoryAddresses: 16,
  maxSteps: 42,
  registerNames: ["IP", "IS", "R"],
  registerPermenance: [false, false, false], 
  peripherals: [
    lcd,
    fire
  ],
  getUndocumentedInstruction: (_instruction: number) => {
    return {
      description: "Undefined",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        fire.catchFire(peripherals);
      },
      ipIncrement: 1
    }
  },
  instructions: [
    {
      description: "Halt",
      execute: (ps) => {
        ps.state.isHalted = true;
      },
      ipIncrement: 1
    },
    {
      description: "Increment R (R = R + 1)",
      execute: (ps) => {
        const r = State.getRegister(ps, "R");
        State.setRegister(ps, "R", r + 1);
      },
      ipIncrement: 1
    },
    {
      description: "Increment R (R = R + 2)",
      execute: (ps) => {
        const r = State.getRegister(ps, "R");
        State.setRegister(ps, "R", r + 2);
      },
      ipIncrement: 1
    },
    {
      description: "Increment R (R = R + 4)",
      execute: (ps) => {
        const r = State.getRegister(ps, "R");
        State.setRegister(ps, "R", r + 4);
      },
      ipIncrement: 1
    },
    {
      description: "Increment R (R = R + 8)",
      execute: (ps) => {
        const r = State.getRegister(ps, "R");
        State.setRegister(ps, "R", r + 8);
      },
      ipIncrement: 1
    },
    {
      description: "",
      execute: (ps) => {
      },
      ipIncrement: 1
    },
    {
      description: "",
      execute: (ps) => {
      },
      ipIncrement: 1
    },
    {
      description: "Beep",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
      },
      ipIncrement: 1
    },
    {
      description: "Print R (Decimal)",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const value = State.getRegister(ps, "R");

        lcd.printString(peripherals, value.toString());
      },
      ipIncrement: 1
    },
    {
      description: "Print R (Hex)",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const value = State.getRegister(ps, "R");

        lcd.printString(peripherals, value.toString(16).toUpperCase());
      },
      ipIncrement: 1
    },
    
    
  ]
};

