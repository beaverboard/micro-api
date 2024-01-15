export type ExecutionFunction<T> = (ps: ProcessorState<T>) => void;

export type PipelineStep<T> = (ps: ProcessorState<T>) => void;


export interface Instruction<T> {
  description: string;
  ipIncrement?: number;
  increment?: boolean;
  execute: ExecutionFunction<T>;
  mnemonic?: string;
  code?: string;
  undocumented?: boolean;
}

export interface State<T> {
  memory: number[];
  registers: Record<string, number>;
  isHalted: boolean;
  peripherals: T;
  pipelineStep: number;
  executionStep: number;
}

export interface Processor<T> {
  memoryBitSize: number;
  registerBitSize: number;
  numMemoryAddresses: number;
  instructions: Array<Instruction<T>>;
  registerNames: Array<string>;
  peripherals: Array<Peripheral<T>>;
  registerPermenance?: Array<boolean>;
  defaultRegisters?: Array<number>;
  name?: string;
  pipeline?: Array<PipelineStep<T>>;
  ipName?: string;
  isName?: string;
  maxSteps?: number;
  getUndocumentedInstruction?: (instruction: number) => Instruction<T>;
  columns?: Array<"number" | "mnemonic" | "increment" | "description" | "code">;
}

export interface ProcessorState<T> {
  processor: Processor<T>;
  state: State<T>;
}

export interface Peripheral<T> {
  reset(peripheralState: T): void;
}
