import { Process, ReduxState, ProcessStatus } from "@models/redux";

import { Record } from "@models/api";
import { actionTypes, processes } from "@redux/actions";

const initialState: ReduxState = {
  records: [],
  processes: [
    {
      name: processes.RECORDS_LOADING,
      status: ProcessStatus.RUNNING
    }
  ] as Process[]
};

export const appReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.SET_RECORDS_LIST:
      return Object.assign({}, state, {
        records: action.records
      });
    case actionTypes.SET_UPDATED_RECORD:
      if (!!state.records && !!state.records.length) {
        const records: Record[] = JSON.parse(JSON.stringify(state.records));
        const recordToUpdate = records.find(
          record => record.id === action.record.id
        );
        if (!!recordToUpdate) {
          Object.keys(action.record).map(key => {
            (recordToUpdate as any)[key] = action.record[key];
          });
          return Object.assign({}, state, {
            records
          });
        }
      }
      return state;
    case actionTypes.SET_UPDATED_IMAGES:
      const records: Record[] = JSON.parse(JSON.stringify(state.records));
      const recordToUpdate = records.find(
        record => record.id === action.recordId
      );
      if (!!recordToUpdate) {
        recordToUpdate.attachedImages = action.imageUrls;
        return Object.assign({}, state, {
          records
        });
      }
      return state;
    case actionTypes.DELETE_RECORD:
      if (!!state.records && !!state.records.length) {
        const records: Record[] = JSON.parse(JSON.stringify(state.records));
        state.records = records.filter(item => item.id !== action.id);
      }
      return state;
    case actionTypes.RESET_RECORD_AUDIO_URL:
      if (!!state.records && !!state.records.length) {
        const records: Record[] = JSON.parse(JSON.stringify(state.records));
        const recordToUpdate = records.find(record => record.id === action.id);
        if (!!recordToUpdate) {
          recordToUpdate.audioUrl = "";
        }
      }
      return state;
    case actionTypes.UPSERT_PROCESS:
      return Object.assign({}, state, {
        processes: JSON.parse(JSON.stringify(state.processes))
          .filter((proc: any) => proc.name !== action.process.name)
          .concat([action.process])
      });
    default:
      return state;
  }
};
