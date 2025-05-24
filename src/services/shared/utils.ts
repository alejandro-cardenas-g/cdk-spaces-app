import { v4 } from "uuid";
import { JsonError } from "./validator";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const ParseJson = (arg: string) => {
  try {
    return JSON.parse(arg);
  } catch (e) {
    throw new JsonError("");
  }
};

export const CreateRandomId = () => {
  return v4();
};

export const HasAdminGroup = (event: APIGatewayProxyEvent) => {
  const groups = event.requestContext.authorizer?.claims["cognito:groups"];
  if (groups) {
    return (groups as string).includes("admins");
  }
  return false;
};

export const AddCorsHeaders = (response: APIGatewayProxyResult) => {
  {
    if (!response.headers) {
      response.headers = {};
    }

    response.headers["Access-Control-Allow-Origin"] = "*";
    response.headers["Access-Control-Allow-Methods"] = "*";
  }
};
