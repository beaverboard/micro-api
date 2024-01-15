
import { SupportedPeripherals } from "./resources";
import { P, Processor, ProcessorState, PS } from "./resources/microprocessor/index.js";
import { processor as fi } from "./resources/processors_modified/4001.js"
import { processor as fii } from "./resources/processors_modified/4002.js"
import { processor as fiii } from "./resources/processors_modified/4003.js"
import { processor as fiv } from "./resources/processors_modified/4004.js"
import { processor as eiv } from "./resources/processors_modified/8004.js"
import { processor as ev } from "./resources/processors_modified/8005.js"

import { processor as evi } from "./resources/processors_modified/8006.js"
import { processor as evii } from "./resources/processors_modified/8007.js"
import { supportsFire } from "./resources/types";


import * as reducer from "./runtime/reducer.js"


const processors: { [id: string]: P<SupportedPeripherals>; } = {
    "4001": fi,
    "4002": fii,
    "4003": fiii,
    "4004": fiv,
    "8004": eiv,
    "8005": ev,
    "8006": evi,
    "8007": evii,
}

interface PacketReturned {
    peripherals: any,
    memory: number[],
    registers: Record<string, number>,
    steps: number,
    failed: boolean
}

export function getLength(memory: number[]): number {
    let x = memory.length - 1;
    let end = false;
    while (end == false && x > 0) {
        if (memory[x] != 0) {
            end = true
        } else {

            x -= 1;
        }
    }
    return x + 1;
}
export function runCode(memory: number[], registers: Record<string, number>, processorName: string, maxSteps: number): PacketReturned {
    let failed = false;
    const processor = processors[processorName];

    let ps = reducer.newProcessorState(processor);

    ps = reducer.reduceState(ps, { name: "setProgram", program: memory } as reducer.Action)


    Object.keys(registers).forEach((register) => {

        ps = reducer.reduceState(ps, { name: "setRegister", register: register, value: registers[register] });
        
    })
    // registers.forEach((register) => {
    //     const reg = Object.keys(register)[0];
    //     ps = reducer.reduceState(ps, { name: "setRegister", register: reg, value: register[reg] });

    // })


    while (ps.state.isHalted == false && ps.state.executionStep < maxSteps) {
        ps = reducer.reduceState(ps, { name: "step" })

    }

    if (ps.state.executionStep == maxSteps) {
        failed = true;

    }

    if (supportsFire(ps) && ps.state.peripherals.isOnFire) {
        failed = true;
    }

    const finalStuff = {
        peripherals: ProcessorState.getPeripherals(ps),
        memory: ProcessorState.getMemory(ps),
        registers: ProcessorState.getRegisters(ps),
        steps: ps.state.executionStep,
        failed
    } as PacketReturned;

    return finalStuff;
}