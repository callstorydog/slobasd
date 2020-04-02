import { Record } from "@models/api";

export enum ProcessStatus {
  RUNNING,
  FINISHED
}

export interface ResultObject {
  [key: string]: any;
}

export interface Process {
  name: string;
  status: ProcessStatus;
  error?: string | Object;
  result?: string | ResultObject | Array<any>;
}

export interface ReduxState {
  records: Record[];
  processes: Process[];
}
