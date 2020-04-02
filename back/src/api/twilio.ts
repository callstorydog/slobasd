import twilio from "twilio";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import got from "got";
import { ClientError } from "alagarr";
import RecordingStatusCallback from "../models/twilio/recordingStatusCallback";
import TwilioBaseRequest from "../models/twilio/base";
import { putRecord, getRecordByID } from "./items/records";
import { s3 } from "../aws";
import {
  RECORDS_S3_BUCKET_NAME,
  STAGE,
  PRE_RECORD_TEXT,
  RECORD_TIMEOUT
} from "../config";

export const startIncomeCallRecording = async (
  twilioRequest: TwilioBaseRequest
) => {
  const twiml = new twilio.twiml.VoiceResponse();
  console.log("twilioRequest", JSON.stringify(twilioRequest));
  if (
    twilioRequest.Direction === "inbound" &&
    twilioRequest.CallStatus === "ringing"
  ) {
    twiml.say(PRE_RECORD_TEXT);
    twiml.record({
      recordingStatusCallback: `/${STAGE}/twilio/recording-callback`,
      recordingStatusCallbackEvent: "completed" as any,
      timeout: RECORD_TIMEOUT
    });
    twiml.hangup();
    await putRecord({
      id: twilioRequest.CallSid,
      createdAt: new Date().getTime(),
      phoneNumber: twilioRequest.To,
      recordingStatus: "in progress"
    });
  }
  return twiml.toString();
};

export const onRecordingFinished = async (input: RecordingStatusCallback) => {
  if (input.RecordingStatus === "completed") {
    const recordStream = await got(`${input.RecordingUrl}.mp3`, {
      isStream: true
    });
    const dbRecord = (await getRecordByID(input.CallSid)).Item;
    if(!!!dbRecord) throw new ClientError("Invalid record id!");
    const params = {
      Bucket: RECORDS_S3_BUCKET_NAME,
      Key: `${dbRecord.phoneNumber.slice(1)}/${input.CallSid}.mp3`,
      ContentType: "audio/mpeg",
      Body: recordStream
    } as PutObjectRequest;
    await s3.upload(params).promise();
    return "";
  }
};
