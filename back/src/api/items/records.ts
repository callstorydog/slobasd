import {
  QueryOutput,
  PutItemInput,
  DeleteItemInput,
  GetItemInput
} from "aws-sdk/clients/dynamodb";

import {
  RECORDS_TABLE_NAME,
  RECORDS_S3_BUCKET_NAME,
  RECORD_IMAGES_S3_BUCKET_NAME,
  AWS_REGION
} from "../../config";
import { dynamo } from "../../aws";
import Record from "../../models/Record";
import { s3 } from "../../aws";
import uuidv4 from "uuid/v4";
import { ClientError } from "alagarr";

export const getAllRecordsForPhone = async (phoneNumber): Promise<any> => {
  if (!!!phoneNumber)
    return {
      Items: [],
      Count: 0
    };
  const results = await dynamo
    .query({
      TableName: RECORDS_TABLE_NAME,
      IndexName: "phoneNumber",
      KeyConditionExpression:
        "phoneNumber = :phoneNumber AND recordingStatus = :recordingStatus",
      ExpressionAttributeValues: {
        ":phoneNumber": phoneNumber,
        ":recordingStatus": "finished"
      }
    })
    .promise();
  return !!results
    ? results
    : {
        Items: [],
        Count: 0
      };
};

export const updateRecord = async record => {
  const params = {
    TableName: `${RECORDS_TABLE_NAME}`,
    Key: { id: record.id },
    UpdateExpression: "set messageText = :messageText, tags = :tags",
    ExpressionAttributeValues: {
      ":messageText": record.messageText,
      ":tags": record.tags
    },
    ReturnValues: "ALL_NEW"
  };
  return await dynamo.update(params).promise();
};

export const updateRecordImage = async (id: string, imageBase64: string) => {
  const existRecord = await getRecordByID(id);
  if(!!!existRecord || !!!existRecord.Item) throw new ClientError("Invalid record id!");
  const fileName = `${existRecord.Item.phoneNumber.slice(1)}/${id}/${uuidv4()}`;
  const uploadParams = {
    Bucket: `${RECORD_IMAGES_S3_BUCKET_NAME}`,
    Key: fileName,
    StorageClass: "STANDARD_IA",
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: "image/jpeg",
    Body: new Buffer(
      imageBase64.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    )
  };
  await s3.upload(uploadParams).promise();
  const imageUrl = `http://s3.${AWS_REGION}.amazonaws.com/${RECORD_IMAGES_S3_BUCKET_NAME}/${encodeURIComponent(
    fileName
  )}`;
  let { attachedImages } = existRecord.Item;
  if(!!attachedImages)
    attachedImages.push(imageUrl);
  else 
    attachedImages = [ imageUrl ];
  const params = {
    TableName: `${RECORDS_TABLE_NAME}`,
    Key: { id },
    UpdateExpression: "set attachedImages = :attachedImages",
    ExpressionAttributeValues: {
      ":attachedImages": attachedImages
    },
    ReturnValues: "ALL_NEW"
  };
  await dynamo.update(params).promise();
  return attachedImages;
};

export const deleteRecordImage = async (
  id: string,
  attachedImageUrl: string
) => {
  const existRecord = await getRecordByID(id);
  if(!!!existRecord || !!!existRecord.Item) throw new ClientError("Invalid record id!");
  let { attachedImages } = existRecord.Item;
  if(!!!attachedImages){
    return "";
  }
  const params = {
    TableName: `${RECORDS_TABLE_NAME}`,
    Key: { id },
    UpdateExpression: "set attachedImages = :attachedImages",
    ExpressionAttributeValues: {
      ":attachedImages": attachedImages.filter(image => decodeURIComponent(image)!==attachedImageUrl)
    },
    ReturnValues: "ALL_NEW"
  };
  await dynamo.update(params).promise();
  return attachedImages.filter(image => decodeURIComponent(image)!==attachedImageUrl);
};

export const updateRecordTextAndStatus = async (id, text, status) => {
  const params = {
    TableName: `${RECORDS_TABLE_NAME}`,
    Key: { id: id },
    UpdateExpression:
      "set originalMessageText = :originalMessageText, messageText = :messageText, recordingStatus = :recordingStatus",
    ExpressionAttributeValues: {
      ":recordingStatus": status,
      ":messageText": text,
      ":originalMessageText": text
    },
    ReturnValues: "ALL_NEW"
  };
  return await dynamo.update(params).promise();
};

export const putRecord = async (record: Record) => {
  const params = {
    TableName: `${RECORDS_TABLE_NAME}`,
    Item: record as any
  } as PutItemInput;
  return await dynamo.put(params).promise();
};

export const deleteRecord = async (id: string) => {
  const params = {
    TableName: `${RECORDS_TABLE_NAME}`,
    Key: {
      id
    }
  } as DeleteItemInput;
  return await dynamo.delete(params).promise();
};

export const getRecordUrlFromS3 = async (phoneNumber: string, recordId: string) => {
  const params = {
    Bucket: RECORDS_S3_BUCKET_NAME,
    Key: `${phoneNumber.slice(1)}/${recordId}.mp3`
  };
  return s3.getSignedUrl("getObject", params);
};


export const getRecordByID = async (recordId: string) => {
  const params = {
    TableName: `${RECORDS_TABLE_NAME}`,
    Key: {
      id: recordId
    }
  } as GetItemInput;
  return await dynamo.get(params).promise();
};
