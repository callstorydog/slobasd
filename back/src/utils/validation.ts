import { Validator } from "cognito-jwt-token-validator";
import { ClientError } from "alagarr";
import { USER_POOl_ID, TOKEN_ISS, TOKEN_AUD } from "../config";

export const isArrayOrEmpty = field => !!!field || field[0];
export const checkUserToken = async token => {
  const validator = new Validator(TOKEN_ISS, TOKEN_AUD as string);
  try {
    const payload = await validator.validate(token);
    return payload;
  } catch (err) {
    console.log("Failed to validate the token");
    throw new ClientError("Access Denied!", "Access Denied!", 403);
  }
};

export const checkUserIsAdmin = async token => {
  const payload = await checkUserToken(token);
  if (
    !!!payload ||
    !!!payload["cognito:groups"] ||
    !!!payload["cognito:groups"].includes("super-admin")
  )
    throw new ClientError("Access Denied!", "Access Denied!", 403);
  return payload;
};
