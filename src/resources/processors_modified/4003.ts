import { ProcessorState as State } from "../microprocessor/index.js";
import { P as Processor } from "../microprocessor/index.js";
import { Fire, FirePeripheral } from "../peripherals/fire.js";

import { Lcd, LcdPeripheral } from "../peripherals/lcd.js";
import { Speaker, SpeakerPeripheral } from "../peripherals/speaker.js";

const lcd = new LcdPeripheral();
const fire = new FirePeripheral();

export const processor: Processor<Lcd & Fire> = {
  name: "QT4003",
  memoryBitSize: 4,
  registerBitSize: 4,
  numMemoryAddresses: 16,
  registerNames: ["IP", "IS", "R0", "R1"],
  maxSteps: 42,
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
      description: "Increment R0",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        State.setRegister(ps, "R0", r0 + 1);
      },
      ipIncrement: 1
    },
    {
      description: "Decrement R0",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        State.setRegister(ps, "R0", r0 - 1);
      },
      ipIncrement: 1
    },
    {
      description: "Increment R1",
      execute: (ps) => {
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R1", r1 + 1);
      },
      ipIncrement: 1
    },
    {
      description: "Decrement R1",
      execute: (ps) => {
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R1", r1 - 1);
      },
      ipIncrement: 1
    },
    {
      description: "Compute R0 + R1 and put the result in R0",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 + r1);
      },
      ipIncrement: 1
    },
    {
      description: "Compute R0 - R1 and put the result in R0",
      execute: (ps) => {
        const r0 = State.getRegister(ps, "R0");
        const r1 = State.getRegister(ps, "R1");
        State.setRegister(ps, "R0", r0 - r1);
      },
      ipIncrement: 1
    },
    {
      description: "Print R0 (Hex) and ring bell",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const value = State.getRegister(ps, "R0");

        lcd.printString(peripherals, value.toString(16).toUpperCase());
      },
      ipIncrement: 1
    },
    {
      description: "Jump forward to address <data> if R0 != 0",
      execute: (ps) => {
        const address = State.getArgument(ps);
        if (State.getRegister(ps, "R0") !== 0 && address >= State.getIp(ps)) {
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2
    },
    {
      description: "Jump forward to address <data> if R0 == 0",
      execute: (ps) => {
        const address = State.getArgument(ps);
        if (State.getRegister(ps, "R0") == 0  && address >= State.getIp(ps)) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2
    },
    {
      description: "Load <data> into R0",
      execute: (ps) => {
        const address = State.getArgument(ps);

        State.setRegister(ps, "R0",address);
      },
      ipIncrement: 2
    },
    {
      description: "Load <data> into R1",
      execute: (ps) => {
        const address = State.getArgument(ps);

        State.setRegister(ps, "R1", address);
      },
      ipIncrement: 2
    },

  ]
};
