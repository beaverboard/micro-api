import { Instruction } from "../microprocessor/index.js";

export const emptyInstruction = { description: "", execute: (ps) => { }, ipIncrement: 1, undocumented: true } as Instruction<any>;