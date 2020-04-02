import { s3, transcribeservice } from "../aws";
import {
  RECORDS_S3_BUCKET_NAME,
  TRANSCRIPTED_RECORDS_S3_BUCKET_NAME,
  AWS_REGION
} from "../config";
import { StartTranscriptionJobRequest } from "aws-sdk/clients/transcribeservice";
import { updateRecordTextAndStatus } from "./items/records";

export const startTranscribeJob = async filename => {
  const params = {
    LanguageCode: "en-US",
    Media: {
      MediaFileUri: `https://s3.${AWS_REGION}.amazonaws.com/${RECORDS_S3_BUCKET_NAME}/${filename}`
    },
    TranscriptionJobName: `record-${filename.split("/")[1]}`,
    MediaFormat: "mp3",
    OutputBucketName: TRANSCRIPTED_RECORDS_S3_BUCKET_NAME
  } as StartTranscriptionJobRequest;
  await transcribeservice.startTranscriptionJob(params).promise();
};

export const saveTranscribeJobResults = async (filename: string) => {
  const json = (await s3
    .getObject({
      Bucket: TRANSCRIPTED_RECORDS_S3_BUCKET_NAME as string,
      Key: filename
    })
    .promise()).Body as Buffer;
  const parsedJson = JSON.parse(json.toString());
  const text = parsedJson.results.transcripts.reduce(
    (acc, item) => (acc += item.transcript),
    ""
  );
  await updateRecordTextAndStatus(filename.slice(7, -9), text, "finished");
};
