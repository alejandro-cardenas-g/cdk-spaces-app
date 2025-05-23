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

const ddbClient = new DynamoDBClient({});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  let message: string = "Default";

  try {
    switch (event.httpMethod) {
      case "GET":
        const getSpaceResponse = await GetSpaces(event, ddbClient);
        return getSpaceResponse;
      case "POST":
        const createSpaceResponse = await CreateSpaces(event, ddbClient);
        return createSpaceResponse;
      case "PUT":
        const updateSpaceResponse = await UpdateSpace(event, ddbClient);
        return updateSpaceResponse;
      case "DELETE":
        const deleteSpaceResponse = await DeleteSpace(event, ddbClient);
        return deleteSpaceResponse;
      default:
        break;
    }

    const response: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({
        message,
      }),
    };
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
