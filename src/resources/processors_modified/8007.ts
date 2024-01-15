import { ProcessorState as State } from "../microprocessor/index.js";
import { P as Processor } from "../microprocessor/index.js";
import { Fire, FirePeripheral } from "../peripherals/fire.js";

import { Lcd, LcdPeripheral } from "../peripherals/lcd.js";
import { Speaker, SpeakerPeripheral } from "../peripherals/speaker.js";
import { emptyInstruction } from "./helper.js";


const lcd = new LcdPeripheral();
const fire = new FirePeripheral();



export const processor: Processor<Lcd & Fire> = {
  name: "QT8007",
  memoryBitSize: 8,
  registerBitSize: 8,
  numMemoryAddresses: 256,
  registerNames: ["IP", "IS", "R0", "R1", "FP", "SP"],
  defaultRegisters: [0, 0, 0, 0, 0, 255],
  peripherals: [
    lcd,

    fire,

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
      description: "Print R0 (Hex)",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const value = State.getRegister(ps, "R0");

        lcd.printString(peripherals, value.toString(16).toUpperCase());
      },
      ipIncrement: 1
    },
    {
      description: "Jump to address <data> if R0 != 0",
      execute: (ps) => {
        if (State.getRegister(ps, "R0") !== 0) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2
    },
    {
      description: "Jump to address <data> if R0 == 0",
      execute: (ps) => {
        if (State.getRegister(ps, "R0") === 0) {
          const address = State.getArgument(ps);
          State.setIp(ps, address);
        }
      },
      ipIncrement: 2
    },
    {
      description: "Load (direct) value <data> into R0",
      execute: (ps) => {
        const value = State.getArgument(ps);

        State.setRegister(ps, "R0", value);
      },
      ipIncrement: 2
    },
    {
      description: "Load (direct) value <data> into R1",
      execute: (ps) => {
        const value = State.getArgument(ps);

        State.setRegister(ps, "R1", value);
      },
      ipIncrement: 2
    },
    {
      description: "Copy the contents of R0 into the memory cell at <address>",
      execute: (ps) => {
        const address = State.getArgument(ps);

        State.setMemoryAddress(ps, address, State.getRegister(ps, "R0"));
      },
      ipIncrement: 2
    },
    {
      description: "Copy the contents of R1 into the memory cell at <address>",
      execute: (ps) => {
        const address = State.getArgument(ps);

        State.setMemoryAddress(ps, address, State.getRegister(ps, "R1"));
      },
      ipIncrement: 2
    },
    {
      description: "Swap the contents of R0 and memory cell at <address>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        const r0 = State.getRegister(ps, "R0");


        State.setRegister(ps, "R0", State.getMemoryAddress(ps, address))

        State.setMemoryAddress(ps, address, r0);
      },
      ipIncrement: 2
    },
    {
      description: "Swap the contents of R1 and memory cell at <address>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        const r1 = State.getRegister(ps, "R1");

        State.setRegister(ps, "R1", State.getMemoryAddress(ps, address))

        State.setMemoryAddress(ps, address, r1);
      },
      ipIncrement: 2
    },
    {
      description: "Ring Bell",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);

      },
      ipIncrement: 1
    },
    {
      description: "Print R0 as ASCII",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const value = State.getRegister(ps, "R0");

        lcd.printAscii(peripherals, value);
      },
      ipIncrement: 1
    },
    {
      description: "Load (direct) value <data> into FP",
      execute: (ps) => {
        const arg = State.getArgument(ps);


        State.setRegister(ps, "FP", arg)

      },
      ipIncrement: 2
    },
    {
      description: "Load FP with the contents of memory cell at <address>",
      execute: (ps) => {
        const address = State.getArgument(ps);


        State.setRegister(ps, "FP", State.getMemoryAddress(ps, address))

      },
      ipIncrement: 2
    },
    {
      description: "Load (direct) value <data> into IP",
      execute: (ps) => {
        const address = State.getArgument(ps);
        State.setIp(ps, address);
      },
      ipIncrement: 2
    },
    {
      description: "Load R0 with the contents of cell at address (FP+<data>)",
      execute: (ps) => {
        const offset = State.getArgument(ps);
        const FP = State.getRegister(ps, "FP");
        State.setRegister(ps, "R0", State.getMemoryAddress(ps, FP + offset))
      },
      ipIncrement: 2
    },
    {
      description: "Load R1 with the contents of cell at address (FP+<data>)",
      execute: (ps) => {
        const offset = State.getArgument(ps);
        const FP = State.getRegister(ps, "FP");
        State.setRegister(ps, "R1", State.getMemoryAddress(ps, FP + offset))
      },
      ipIncrement: 2
    },
    {
      description: "Load R0 with the contents of cell at address (FP-<data>)",
      execute: (ps) => {
        const offset = State.getArgument(ps);
        const FP = State.getRegister(ps, "FP");
        State.setRegister(ps, "R0", State.getMemoryAddress(ps, FP - offset))
      },
      ipIncrement: 2
    },
    {
      description: "Load R1 with the contents of cell at address (FP-<data>)",
      execute: (ps) => {
        const offset = State.getArgument(ps);
        const FP = State.getRegister(ps, "FP");
        State.setRegister(ps, "R1", State.getMemoryAddress(ps, FP - offset))
      },
      ipIncrement: 2
    },
    {
      description: "Copy R0 into cell at address (FP+<data>)",
      execute: (ps) => {
        const reg = State.getRegister(ps, "R0");
        const offset = State.getArgument(ps);
        const FP = State.getRegister(ps, "FP");
        State.setMemoryAddress(ps, FP + offset, reg)
      },
      ipIncrement: 2
    },
    {
      description: "Copy R1 into cell at address (FP+<data>)",
      execute: (ps) => {
        const reg = State.getRegister(ps, "R1");
        const offset = State.getArgument(ps);
        const FP = State.getRegister(ps, "FP");
        State.setMemoryAddress(ps, FP + offset, reg)
      },
      ipIncrement: 2
    },
    {
      description: "Copy R0 into cell at address (FP-<data>)",
      execute: (ps) => {
        const reg = State.getRegister(ps, "R0");
        const offset = State.getArgument(ps);
        const FP = State.getRegister(ps, "FP");
        State.setMemoryAddress(ps, FP - offset, reg)
      },
      ipIncrement: 2
    },
    {
      description: "Copy R1 into cell at address (FP-<data>)",
      execute: (ps) => {
        const reg = State.getRegister(ps, "R1");
        const offset = State.getArgument(ps);
        const FP = State.getRegister(ps, "FP");
        State.setMemoryAddress(ps, FP - offset, reg)
      },
      ipIncrement: 2
    },
    {
      description: "Push the value of R0 onto the stack",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        const reg = State.getRegister(ps, "R0");
        State.setMemoryAddress(ps, sp, reg)
        State.setRegister(ps, "SP", sp - 1)
      },
      ipIncrement: 1
    },
    {
      description: "Push the value of R1 onto the stack",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        const reg = State.getRegister(ps, "R1");
        State.setMemoryAddress(ps, sp, reg)

        State.setRegister(ps, "SP", sp - 1)
      },
      ipIncrement: 1
    },
    {
      description: "Push the value of FP onto the stack",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        const fp = State.getRegister(ps, "FP");
        State.setMemoryAddress(ps, sp, fp)

        State.setRegister(ps, "SP", sp - 1)
      },
      ipIncrement: 1
    },
    {
      description: "Push the value of IP onto the stack",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        const ip = State.getIp(ps);
        State.setMemoryAddress(ps, sp, ip)

        State.setRegister(ps, "SP", sp - 1)
      },
      ipIncrement: 1
    },
    {
      description: "Pop value and store it in R0",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        State.setRegister(ps, "SP", sp + 1)
        const val = State.getMemoryAddress(ps, State.getRegister(ps, "SP"));
        State.setRegister(ps, "R0", val)


      },
      ipIncrement: 1
    },
    {
      description: "Pop value and store it in R1",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        State.setRegister(ps, "SP", sp + 1)
        const val = State.getMemoryAddress(ps, State.getRegister(ps, "SP"));
        State.setRegister(ps, "R1", val)


      },
      ipIncrement: 1
    },
    {
      description: "Pop value and store it in FP",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        State.setRegister(ps, "SP", sp + 1)
        const val = State.getMemoryAddress(ps, State.getRegister(ps, "SP"));
        State.setRegister(ps, "FP", val)


      },
      ipIncrement: 1
    },
    {
      description: "Pop value and store it in IP",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        State.setRegister(ps, "SP", sp + 1)
        const val = State.getMemoryAddress(ps, State.getRegister(ps, "SP"));
        State.setIp(ps, val)


      },
      ipIncrement: 1
    },
    {
      description: "Copy value of SP into FP",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        State.setRegister(ps, "FP", sp)
      },
      ipIncrement: 1
    },
    {
      description: "SP=SP+<data>",
      execute: (ps) => {
        const arg = State.getArgument(ps)
        const sp = State.getRegister(ps, "SP");
        State.setRegister(ps, "SP", sp + arg)
      },
      ipIncrement: 2
    },
    {
      description: "SP=SP-<data>",
      execute: (ps) => {
        const arg = State.getArgument(ps)
        const sp = State.getRegister(ps, "SP");
        State.setRegister(ps, "SP", sp - arg)
      },
      ipIncrement: 2
    },
    {
      description: "CALL (push IP, IP=<data>)",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        const ip = State.getRegister(ps, "IP");
        State.setMemoryAddress(ps, sp, ip)

        State.setRegister(ps, "SP", sp - 1)

        const arg = State.getArgument(ps)
        State.setIp(ps, arg)
      },
      ipIncrement: 2
    },
    {
      description: "RET (pop value from stack into IP)",
      execute: (ps) => {
        const sp = State.getRegister(ps, "SP");
        State.setRegister(ps, "SP", sp + 1)
        const val = State.getMemoryAddress(ps, State.getRegister(ps, "SP"));
        State.setIp(ps, val)
      },
      ipIncrement: 1
    },

    ...new Array(6).fill(emptyInstruction),
    {
      description: "Get input and put into cell at address <data>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        const peripherals = State.getPeripherals(ps);


      },
      ipIncrement: 2
    },
    {
      description: "Get input and put into cell at <FP>",
      execute: (ps) => {
        const peripherals = State.getPeripherals(ps);
        const FP = State.getRegister(ps, "FP");





      },
      ipIncrement: 1
    },
    ...new Array(19).fill(emptyInstruction),


    {
      description: "Jump to <address> if R0 >= <value>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        const value = State.getArgument(ps, 2);

        if (State.getRegister(ps, "R0") >= value) {
          State.setIp(ps, address);
        }
      },
      ipIncrement: 3
    },
    {
      description: "Jump to <address> if R0 > <value>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        const value = State.getArgument(ps, 2);

        if (State.getRegister(ps, "R0") > value) {
          State.setIp(ps, address);
        }
      },
      ipIncrement: 3
    },
    {
      description: "Jump to <address> if R0 <= <value>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        const value = State.getArgument(ps, 2);

        if (State.getRegister(ps, "R0") <= value) {
          State.setIp(ps, address);
        }
      },
      ipIncrement: 3
    }, {
      description: "Jump to <address> if R0 < <value>",
      execute: (ps) => {
        const address = State.getArgument(ps);
        const value = State.getArgument(ps, 2);

        if (State.getRegister(ps, "R0") < value) {
          State.setIp(ps, address);
        }
      },
      ipIncrement: 3
    },
    ...new Array(20).fill(emptyInstruction),
    {
      description: "Send <instruction> <paramater 1> to synthensiser chip, 'man QT2808 to see commands'",
      execute: (ps) => {
        let increment = 3;
        const instruct = State.getMemoryAddress(ps, State.getIp(ps) + 1);
        const arg2: number = State.getMemoryAddress(ps, State.getIp(ps) + 2);
        console.log("hey")
        console.log(instruct)
        console.log(arg2)
        switch (instruct) {
          case 1: // PLAY
            // ps.state.peripherals.playing = true;
            // State.setIp(ps, State.getIp(ps)+1)
            // State.setRegister(ps, "IP", State.getIp(ps) + 1)

            break;

          case 2: // SET DEFAULT DURATION
            break;

          case 3: // SET INSTRUMENT
            break;

          case 4: // ADD NOTE
            break;
          case 5: // ADD NOTE FLEX
            const arg3 = State.getMemoryAddress(ps, State.getIp(ps) + 3)
            increment = 4;
            break;
          case 6: // ADD BLANK FLEX
            break;

          default:
            // console.log("AAAfoisjdsofijh")
            lcd.printString(State.getPeripherals(ps), "COMMAND NOT FOUND")
            increment = 2;

        }
        State.setIp(ps, State.getIp(ps) + increment)


      },
      ipIncrement: 3,
      increment: false

    }
















  ]
};