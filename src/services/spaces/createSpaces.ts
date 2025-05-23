import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { CreateRandomId, ParseJson } from "../shared/utils";
import { validateAsSpaceEntry } from "../shared/validator";

export const CreateSpaces = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  const spaceId = CreateRandomId();

  const item = ParseJson(event.body);

  item.id = spaceId;

  const isValid = validateAsSpaceEntry(item);

  if (!isValid) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "RequiredFields",
      }),
    };
  }

  const putItemCommand = new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: marshall(item),
  });

  const result = await ddbClient.send(putItemCommand);

  return {
    statusCode: 201,
    body: JSON.stringify(result),
  };
};

export const CreateSpacesWithDoc = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
  const spaceId = v4();

  const item = JSON.parse(event.body);

  item.id = spaceId;

  const putItemCommand = new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: item,
  });

  const result = await ddbDocClient.send(putItemCommand);

  return {
    statusCode: 201,
    body: JSON.stringify(item),
  };
};
