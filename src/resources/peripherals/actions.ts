import { Peripheral } from "../microprocessor/index.js";

export interface Action<T> {
  name: string;
  data: T;
}

export interface Actions<T> {
  actionLog: Action<T>[];
};

export class ActionsPeripheral<T> implements Peripheral<Actions<T>> {
  reset(state: Actions<T>) {
    state.actionLog = [];
  }

  performAction(state: Actions<T>, action: Action<T>) {
    state.actionLog.push(action);
  }
};
