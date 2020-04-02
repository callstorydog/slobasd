import { InterfaceRequest, InterfaceResponse } from "alagarr";
import { jsonResponse } from "./index";

export default function defaultErrorHandler(
  request: InterfaceRequest,
  response: InterfaceResponse,
  error: any
): any {
  console.log("error", error.statusCode, error.name, error.message);
  const { requestId } = request.requestContext;

  const errorName =
    error.name && typeof error.name === "string"
      ? error.name.replace(
          /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g,
          "$1$4 $2$3$5"
        )
      : "Error";
  const errorMessage = error.message || "";

  return error.name === "ClientError" ||
    (error.statusCode >= 400 && error.statusCode < 500)
    ? jsonResponse(
        {
          error: error.name,
          message: errorMessage,
          requestId
        },
        !!error.statusCode ? Number(error.statusCode) : 400
      )
    : jsonResponse(
        {
          error: "Internal server error",
          message: "An internal server error occurred",
          requestId
        },
        500
      );
}
