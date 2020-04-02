export const ROUTES = {
  RECORDS: {
    LIST: "/records/list",
    UPDATE: "/records/update",
    DELETE: "/records/delete",
    GET_AUDIO_URL: "/records/get-audio-url",
    UPDATE_IMAGE: "/records/update-image",
    DELETE_IMAGE: "/records/delete-image"
  },
  TWILIO: {
    START: "/twilio/start-recording",
    CALLBACK: "/twilio/recording-callback"
  },
  ACCOUNTS: {
    UPDATE_SECONDARY_NUMBER: "/accounts/update-secondary-number"
  }
};

export const {
  STAGE,
  USER_POOl_ID,
  TOKEN_AUD,
  AWS_REGION,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  RECORDS_S3_BUCKET_NAME,
  TRANSCRIPTED_RECORDS_S3_BUCKET_NAME,
  RECORD_IMAGES_S3_BUCKET_NAME
} = process.env;

if (
  !!!STAGE ||
  !!!USER_POOl_ID ||
  !!!TOKEN_AUD ||
  !!!TWILIO_ACCOUNT_SID ||
  !!!TWILIO_AUTH_TOKEN ||
  !!!RECORDS_S3_BUCKET_NAME ||
  !!!TRANSCRIPTED_RECORDS_S3_BUCKET_NAME ||
  !!!RECORD_IMAGES_S3_BUCKET_NAME
) {
  throw new Error("All the env. variables should be provided!");
}

export const RECORDS_TABLE_NAME = `call-records-table-${STAGE}`;

export const TOKEN_ISS = `https://cognito-idp.${AWS_REGION}.amazonaws.com/${USER_POOl_ID}`;

export const PRE_RECORD_TEXT = "Hi, tell us your story after the beep";

export const RECORD_TIMEOUT = 600;
