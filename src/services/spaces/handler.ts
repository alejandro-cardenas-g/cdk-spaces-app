import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { CreateSpaces } from "./createSpaces";
import { GetSpaces } from "./getSpaces";
import { UpdateSpace } from "./updateSpace";
import { DeleteSpace } from "./deleteSpace";
import { JsonError } from "../shared/validator";
import { AddCorsHeaders } from "../shared/utils";
import { captureAWSv3Client, getSegment } from "aws-xray-sdk-core";

const ddbClient = captureAWSv3Client(new DynamoDBClient({}));

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  let response: APIGatewayProxyResult;

  const subSeg = getSegment().addNewSubsegment("MyLongCall");

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve({});
    }, 1000);
  });
  subSeg.close();

  try {
    switch (event.httpMethod) {
      case "GET":
        const getSpaceResponse = await GetSpaces(event, ddbClient);
        response = getSpaceResponse;
        break;
      case "POST":
        const createSpaceResponse = await CreateSpaces(event, ddbClient);
        response = createSpaceResponse;
        break;
      case "PUT":
        const updateSpaceResponse = await UpdateSpace(event, ddbClient);
        response = updateSpaceResponse;
        break;
      case "DELETE":
        const deleteSpaceResponse = await DeleteSpace(event, ddbClient);
        response = deleteSpaceResponse;
        break;
      default:
        break;
    }

    AddCorsHeaders(response);

    return response;
  } catch (exception) {
    console.error(exception);

    if (exception instanceof JsonError) {
      {
        return {
          statusCode: 400,
          body: JSON.stringify({ msg: "body must be application/json" }),
        };
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ msg: "Internal server error" }),
    };
  }
};
