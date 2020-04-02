import {
  DynamoDB,
  S3,
  TranscribeService,
  CognitoIdentityServiceProvider
} from "aws-sdk";
export const dynamo = new DynamoDB.DocumentClient({
  maxRetries: 5,
  retryDelayOptions: { base: 1000 }
});

export const s3 = new S3();

export const transcribeservice = new TranscribeService();

export const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider();
