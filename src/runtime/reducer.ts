
import { ProcessorState, Processor, P, PS } from "../resources/microprocessor/index.js";
import { SupportedPeripherals, supportsAudio } from "../resources/types.js";

export interface Action {
  name: "step" | "reset" | "setRegister" | "setMemoryAddress" | "setProgram" | "setPS" | "next" | "hardReset";
  register?: string;
  address?: number;
  value?: number;
  program?: Array<number>;
  steps?: number;
  processor?: P<SupportedPeripherals>,
  ps?: PS<SupportedPeripherals>,
  bpm?: number,
}

export const newProcessorState = (processor: P<SupportedPeripherals>) => ({
  processor,
  state: ProcessorState.newState(processor)
});

export const reduceState = (state: PS<SupportedPeripherals>, action: Action | string) => {
  const ps = state;
  if (typeof action === "string") {
    action = {
      name: action as "step" | "reset"
    };
  }

  if (action.name == "setPS") {
    // console.log(ps)
    // console.log(action.ps)
    ProcessorState.setState(ps, action.ps);
    // console.log(ps)
  }

  if (action.name === "step") {


    if (action.steps) {

      for (let i = 0; i < action.steps; i++) {

        Processor.step(ps);

      }
    } else {
      Processor.step(ps);

    }
  } else if (action.name === "reset") {
    if (action.processor) {
      const newPs = newProcessorState(action.processor);

      ps.processor = newPs.processor;
      ps.state = newPs.state;

    } else {
      let prevReg = ProcessorState.getRegisters(ps);
      let regVals: Array<number> = [];

      Object.keys(prevReg).forEach((reg, index) => {
        if (ps.processor.registerPermenance) {
          if (ps.processor.registerPermenance[index]) {
            regVals.push(prevReg[reg])

          } else {
            if (ps.processor.defaultRegisters) {
              regVals.push(ps.processor.defaultRegisters[index])
            } else {
              regVals.push(0)

            }

          }


        } else {
          if (ps.processor.defaultRegisters) {
            regVals.push(ps.processor.defaultRegisters[index])
          } else {
            regVals.push(0)

          }

        }

      })


      ProcessorState.reset(ps);
      ProcessorState.setMemory(ps, action.program);
      ProcessorState.setRegisters(ps, regVals)
    }
  } else if (action.name == "hardReset") {
    ProcessorState.reset(ps);

  } else if (action.name === "setRegister") {
    ProcessorState.setRegister(ps, action.register, action.value);
  } else if (action.name === "setMemoryAddress") {
    ProcessorState.setMemoryAddress(ps, action.address, action.value);
  } else if (action.name === "setProgram") {
    let prevReg = ProcessorState.getRegisters(ps);
    let regVals: Array<number> = [];

    Object.keys(prevReg).forEach((reg, index) => {
      if (ps.processor.registerPermenance) {
        if (ps.processor.registerPermenance[index]) {
          regVals.push(prevReg[reg])

        } else {
          if (ps.processor.defaultRegisters) {
            regVals.push(ps.processor.defaultRegisters[index])
          } else {
            regVals.push(0)

          }

        }


      } else {
        if (ps.processor.defaultRegisters) {
          regVals.push(ps.processor.defaultRegisters[index])
        } else {
          regVals.push(0)

        }

      }

    })



    ProcessorState.reset(ps);

    ProcessorState.setMemory(ps, action.program);
    ProcessorState.setRegisters(ps, regVals);

  } else if (action.name === "next") {
    do {
      const audioLength = supportsAudio(state) ? state.state.peripherals.audioBuffer.length : 0;
      Processor.step(ps);
     
    } while (ps.state.pipelineStep !== 0);
  }

  return { ...ps };
};
