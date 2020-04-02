import { ProcessStatus, Process } from "@models/redux";
import { Record } from "@models/api";
import { API, Auth } from "aws-amplify";

import store from "@redux/store";
import * as AWS from "aws-sdk";
import * as _ from "lodash";

import * as config from "@config";

export const actionTypes = {
  SET_RECORDS_LIST: "SET_RECORDS_LIST",
  SET_UPDATED_RECORD: "SET_UPDATED_RECORD",
  SET_AUDIO_URL_FOR_RECORD: "SET_AUDIO_URL_FOR_RECORD",
  UPDATE_RECORD_TEXT: "UPDATE_RECORD_TEXT",
  UPSERT_PROCESS: "UPSERT_PROCESS",
  GET_RECORD_AUDIO_URL: "GET_RECORD_AUDIO_URL",
  RESET_RECORD_AUDIO_URL: "RESET_RECORD_AUDIO_URL",
  DELETE_RECORD: "DELETE_RECORD",
  UPDATE_RECORD_IMAGE: "UPDATE_RECORD_IMAGE",
  SET_UPDATED_IMAGES: "SET_UPDATED_IMAGES"
};

export const processes = {
  RECORDS_LOADING: "RECORDS_LOADING",
  RECORD_TEXT_UPDATING: "RECORD_TEXT_UPDATING",
  RECORD_DELETING: "RECORD_DELETING",
  GETTING_RECORD_AUDIO_URL: "GETTING_RECORD_AUDIO_URL",
  UPDATING_RECORD_IMAGE: "UPDATING_RECORD_IMAGE",
  DELETING_RECORD_IMAGE: "DELETING_RECORD_IMAGE",
  SECONDARY_NUMBER_UPDATING: "SECONDARY_NUMBER_UPDATING"
};

export const BACK_END_ERROR = `An unexpected error has been occurred.
 Please try again or contact an administrator`;

export const setInitialRecordsList = () => {
  return async (dispatch: any) => {
    dispatch(runProcess(processes.RECORDS_LOADING));
    return (API.get("dev", "/records/list", {
      headers: {
        Authorization: (await Auth.currentSession()).getIdToken().getJwtToken()
      }
    }) as Promise<any>)
      .then(
        (response: any) => {
          if (!!!response.errors) {
            dispatch(
              setRecordsList(_.sortBy(response.Items, "createdAt").reverse())
            );
            dispatch(
              finishProcess(
                processes.RECORDS_LOADING,
                undefined,
                response.Items
              )
            );
          } else {
            console.log("errors", JSON.stringify(response.errors));
            dispatch(finishProcess(processes.RECORDS_LOADING, BACK_END_ERROR));
          }
        },
        error => {
          console.log("errors", JSON.stringify(error));
          dispatch(finishProcess(processes.RECORDS_LOADING, BACK_END_ERROR));
        }
      )
      .catch(e => {
        console.log("errors", JSON.stringify(e));
      });
  };
};

export const updateRecordText = (record: Record) => {
  if (!!!record.id) {
    return () => {};
  }
  return async (dispatch: any) => {
    dispatch(runProcess(processes.RECORD_TEXT_UPDATING));
    return (API.post("dev", "/records/update", {
      body: record,
      headers: {
        Authorization: (await Auth.currentSession()).getIdToken().getJwtToken()
      }
    }) as Promise<any>)
      .then(
        (response: any) => {
          if (!!!response.errors) {
            dispatch(
              setUpdatedRecord(AWS.DynamoDB.Converter.unmarshall(
                response.Attributes
              ) as Record)
            );
            dispatch(
              finishProcess(
                processes.RECORD_TEXT_UPDATING,
                undefined,
                AWS.DynamoDB.Converter.unmarshall(response.Attributes) as Record
              )
            );
          } else {
            console.log("errors", JSON.stringify(response.errors));
            dispatch(
              finishProcess(processes.RECORD_TEXT_UPDATING, BACK_END_ERROR)
            );
          }
        },
        error => {
          console.log("errors", JSON.stringify(error));
          dispatch(
            finishProcess(processes.RECORD_TEXT_UPDATING, BACK_END_ERROR)
          );
        }
      )
      .catch(e => {
        console.log("errors", JSON.stringify(e));
      });
  };
};

export const updateRecordImage = (recordId: string, image: string) => {
  if (!!!recordId) {
    return () => {};
  }
  return async (dispatch: any) => {
    dispatch(runProcess(processes.UPDATING_RECORD_IMAGE));
    return (API.post("dev", `/records/update-image?id=${recordId}`, {
      body: {
        image
      },
      headers: {
        Authorization: (await Auth.currentSession()).getIdToken().getJwtToken()
      }
    }) as Promise<any>)
      .then(
        (response: any) => {
          if (!!!response.errors) {
            dispatch(setUpdatedImages(recordId, response.urls));
            dispatch(
              finishProcess(
                processes.UPDATING_RECORD_IMAGE,
                undefined,
                response.url
              )
            );
          } else {
            console.log("errors", JSON.stringify(response.errors));
            dispatch(
              finishProcess(processes.UPDATING_RECORD_IMAGE, BACK_END_ERROR)
            );
          }
        },
        error => {
          console.log("errors", JSON.stringify(error));
          dispatch(
            finishProcess(processes.UPDATING_RECORD_IMAGE, BACK_END_ERROR)
          );
        }
      )
      .catch(e => {
        console.log("errors", JSON.stringify(e));
      });
  };
};

export const updateSecondaryNumber = (secondaryNumber: string) => {
  return async (dispatch: any) => {
    dispatch(runProcess(processes.SECONDARY_NUMBER_UPDATING));
    return (API.post(
      "dev",
      `/accounts/update-secondary-number?secondaryNumber=${encodeURIComponent(
        secondaryNumber
      )}`,
      {
        headers: {
          Authorization: (await Auth.currentSession())
            .getIdToken()
            .getJwtToken()
        }
      }
    ) as Promise<any>)
      .then(
        (response: any) => {
          if (!!!response.errors) {
            dispatch(
              finishProcess(
                processes.SECONDARY_NUMBER_UPDATING,
                undefined,
                response.secondaryPhoneNumber
              )
            );
          } else {
            console.log("errors", JSON.stringify(response.errors));
            dispatch(
              finishProcess(processes.SECONDARY_NUMBER_UPDATING, BACK_END_ERROR)
            );
          }
        },
        error => {
          console.log("errors", JSON.stringify(error));
          dispatch(
            finishProcess(processes.SECONDARY_NUMBER_UPDATING, BACK_END_ERROR)
          );
        }
      )
      .catch(e => {
        console.log("errors", JSON.stringify(e));
      });
  };
};

export const deleteRecordImage = (recordId: string, imageUrl: string) => {
  if (!!!recordId) {
    return () => {};
  }
  return async (dispatch: any) => {
    dispatch(runProcess(processes.DELETING_RECORD_IMAGE));
    return (API.post(
      "dev",
      `/records/delete-image?id=${recordId}&imageUrl=${imageUrl}`,
      {
        headers: {
          Authorization: (await Auth.currentSession())
            .getIdToken()
            .getJwtToken()
        }
      }
    ) as Promise<any>)
      .then(
        (response: any) => {
          if (!!!response.errors) {
            dispatch(setUpdatedImages(recordId, response.urls));
            dispatch(
              finishProcess(
                processes.DELETING_RECORD_IMAGE,
                undefined,
                response.url
              )
            );
          } else {
            console.log("errors", JSON.stringify(response.errors));
            dispatch(
              finishProcess(processes.DELETING_RECORD_IMAGE, BACK_END_ERROR)
            );
          }
        },
        error => {
          console.log("errors", JSON.stringify(error));
          dispatch(
            finishProcess(processes.DELETING_RECORD_IMAGE, BACK_END_ERROR)
          );
        }
      )
      .catch(e => {
        console.log("errors", JSON.stringify(e));
      });
  };
};

export const deleteRecord = (record: Record) => {
  if (!!!record.id) {
    return () => {};
  }
  return async (dispatch: any) => {
    dispatch(runProcess(processes.RECORD_DELETING));
    return (API.post("dev", `/records/delete?id=${record.id}`, {
      headers: {
        Authorization: (await Auth.currentSession()).getIdToken().getJwtToken()
      }
    }) as Promise<any>)
      .then(
        (response: any) => {
          if (!!!response.errors) {
            dispatch(deleteRecordFromStore(record.id));
            dispatch(
              finishProcess(
                processes.RECORD_DELETING,
                undefined,
                AWS.DynamoDB.Converter.unmarshall(response.Attributes) as Record
              )
            );
          } else {
            console.log("errors", JSON.stringify(response.errors));
            dispatch(finishProcess(processes.RECORD_DELETING, BACK_END_ERROR));
          }
        },
        error => {
          console.log("errors", JSON.stringify(error));
          dispatch(
            finishProcess(processes.RECORD_TEXT_UPDATING, BACK_END_ERROR)
          );
        }
      )
      .catch(e => {
        console.log("errors", JSON.stringify(e));
      });
  };
};

export const getRecordAudioUrl = (id: string, phone: string) => {
  return async (dispatch: any) => {
    dispatch(resetRecordAudioUrl(id));
    dispatch(runProcess(processes.GETTING_RECORD_AUDIO_URL));
    return (API.post("dev", "/records/get-audio-url", {
      headers: {
        Authorization: (await Auth.currentSession()).getIdToken().getJwtToken()
      },
      body: {
        id,
        phone
      }
    }) as Promise<any>)
      .then(
        (response: any) => {
          if (!!!response.errors) {
            dispatch(
              setUpdatedRecord({ id, audioUrl: response.url } as Record)
            );
            dispatch(
              finishProcess(
                processes.GETTING_RECORD_AUDIO_URL,
                undefined,
                response.url
              )
            );
          } else {
            console.log("errors", JSON.stringify(response.errors));
            dispatch(
              finishProcess(processes.GETTING_RECORD_AUDIO_URL, BACK_END_ERROR)
            );
          }
        },
        error => {
          console.log("errors", JSON.stringify(error));
          dispatch(
            finishProcess(processes.GETTING_RECORD_AUDIO_URL, BACK_END_ERROR)
          );
        }
      )
      .catch(e => {
        console.log("errors", JSON.stringify(e));
      });
  };
};

export const setRecordsList = (records?: any) => {
  return {
    type: actionTypes.SET_RECORDS_LIST,
    records
  };
};

export const setUpdatedRecord = (record: Record) => {
  return {
    type: actionTypes.SET_UPDATED_RECORD,
    record
  };
};

export const setUpdatedImages = (recordId: string, imageUrls: string[]) => {
  return {
    type: actionTypes.SET_UPDATED_IMAGES,
    recordId,
    imageUrls
  };
};

export const resetRecordAudioUrl = (id: string) => {
  return {
    type: actionTypes.RESET_RECORD_AUDIO_URL,
    id
  };
};

export const deleteRecordFromStore = (id: string) => {
  return {
    type: actionTypes.DELETE_RECORD,
    id
  };
};

export const runProcess = (name: string) => {
  return {
    type: actionTypes.UPSERT_PROCESS,
    process: { name, status: ProcessStatus.RUNNING }
  };
};

export const finishProcess = (
  name: string,
  error?: string | Object,
  result?: string | Object | Array<any>
) => {
  return {
    type: actionTypes.UPSERT_PROCESS,
    process: { name, status: ProcessStatus.FINISHED, error, result } as Process
  };
};
