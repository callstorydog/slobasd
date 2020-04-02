import { cognitoidentityserviceprovider } from "../../aws";
import { USER_POOl_ID } from "../../config";

export const updateSecondaryNumber = async (
  cognitoUsername: string,
  secondaryNumber: string
) => {
  await cognitoidentityserviceprovider
    .adminUpdateUserAttributes({
      Username: cognitoUsername,
      UserPoolId: USER_POOl_ID as string,
      UserAttributes: [
        {
          Name: "custom:sec_phone_number",
          Value: secondaryNumber
        }
      ]
    })
    .promise();
  return secondaryNumber;
};

export const getSecondaryNumber = async (
  cognitoUsername: string
) => {
  const user = await cognitoidentityserviceprovider
    .adminGetUser({
      Username: cognitoUsername,
      UserPoolId: USER_POOl_ID as string
    })
    .promise();
  return !!user.UserAttributes && !!user.UserAttributes.find(attr=> attr.Name==="custom:sec_phone_number") ? (user.UserAttributes.find(attr=> attr.Name==="custom:sec_phone_number") as any).Value : "";
};
