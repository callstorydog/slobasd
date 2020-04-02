import alagarr, { ClientError, ServerError } from "alagarr";
import * as api from "./api";
import { ROUTES } from "./config";
import { checkUserToken } from "./utils/validation";
import errorHandler from "./utils/error_handler";
import { jsonResponse, xmlResponse } from "./utils";
import { S3Event } from "aws-lambda";
import {
  startTranscribeJob,
  saveTranscribeJobResults
} from "./api/aws-transcribe";
import { getSecondaryNumber } from "./api/items/accounts";

export const recordsRouter = alagarr(
  async (req, res) => {
    const path = req.path;
    const userPayload = await checkUserToken(req.headers["authorization"]);
    console.log("userPayload", JSON.stringify(userPayload));
    const userPhone = userPayload.phone_number;
    const username = userPayload["cognito:username"];
    const secondaryPhoneNumber = await getSecondaryNumber(username);
    console.log("secondaryPhoneNumber", secondaryPhoneNumber);
    if (!!!userPhone) {
      throw new ClientError("User doesn't exist");
    }
    let results: any;
    try {
      switch (path) {
        case ROUTES.RECORDS.LIST:
          results = {
            Items: (await api.records.getAllRecordsForPhone(
              userPhone
            )).Items.concat(
              (await api.records.getAllRecordsForPhone(secondaryPhoneNumber)).Items
            )
          };
          break;
        case ROUTES.RECORDS.UPDATE:
          results = await api.records.updateRecord(req.body);
          break;
        case ROUTES.RECORDS.DELETE:
          results = await api.records.deleteRecord(req.query.id);
          break;
        case ROUTES.RECORDS.GET_AUDIO_URL:
          results = {
            url: await api.records.getRecordUrlFromS3(req.body.phone, req.body.id)
          };
          break;
        case ROUTES.RECORDS.UPDATE_IMAGE:
          results = {
            urls: await api.records.updateRecordImage(
              req.query.id,
              req.body.image
            )
          };
          break;
        case ROUTES.RECORDS.DELETE_IMAGE:
          results = {
            urls: await api.records.deleteRecordImage(
              req.query.id,
              req.query.imageUrl
            )
          };
          break;
        default:
          throw new ClientError("Not Found!");
      }
      return jsonResponse(results);
    } catch (e) {
      console.log(e);
      if (e instanceof ClientError || e instanceof ServerError) {
        throw e;
      } else throw new ServerError();
    }
  },
  {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers": "*"
    },
    errorHandler
  }
);

export const accountsRouter = alagarr(
  async (req, res) => {
    const path = req.path;
    const userPayload = await checkUserToken(req.headers["authorization"]);
    console.log("userPayload", JSON.stringify(userPayload));
    const userPhone = userPayload.phone_number;
    const username = userPayload["cognito:username"];
    if (!!!userPhone) {
      throw new ClientError("User doesn't exist");
    }
    let results: any;
    try {
      switch (path) {
        case ROUTES.ACCOUNTS.UPDATE_SECONDARY_NUMBER:
          results = {
            secondaryPhoneNumber: await api.accounts.updateSecondaryNumber(
              username,
              req.query.secondaryNumber
            )
          };
          break;
        default:
          throw new ClientError("Not Found!");
      }
      return jsonResponse(results);
    } catch (e) {
      console.log(e);
      if (e instanceof ClientError || e instanceof ServerError) {
        throw e;
      } else throw new ServerError();
    }
  },
  {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers": "*"
    },
    errorHandler
  }
);

export const twilioRouter = alagarr(
  async (req, res) => {
    const path = req.path;
    let results: any;
    try {
      switch (path) {
        case ROUTES.TWILIO.START:
          results = await api.twilio.startIncomeCallRecording(req.body);
          break;
        case ROUTES.TWILIO.CALLBACK:
          results = await api.twilio.onRecordingFinished(req.body);
          break;
        default:
          throw new ClientError("Not Found!");
      }
      return xmlResponse(results);
    } catch (e) {
      console.log(e);
      if (e instanceof ClientError || e instanceof ServerError) {
        throw e;
      } else throw new ServerError();
    }
  },
  {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers": "*"
    },
    errorHandler
  }
);

export const onRecordUploadedToS3Handler = async (req: S3Event) => {
  const { Records } = req;
  for (const record of Records) {
    const { s3 } = record;
    await startTranscribeJob(
      decodeURIComponent(s3.object.key).replace(/\+/g, " ")
    );
  }
  return true;
};

export const onTranscribeJobResultUploadedToS3Handler = async (
  req: S3Event
) => {
  const { Records } = req;
  for (const record of Records) {
    const { s3 } = record;
    if (s3.object.key.endsWith(".json")) {
      await saveTranscribeJobResults(s3.object.key);
    }
  }
  return true;
};
