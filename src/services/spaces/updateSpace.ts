import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const UpdateSpace = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  if (!event.queryStringParameters?.id || !event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "Bad request: id required",
      }),
    };
  }

  const spaceId = event.queryStringParameters.id;
  const body = JSON.parse(event.body);
  const location = body.location;

  const updateResult = await ddbClient.send(
    new UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: marshall({ id: spaceId }),
      UpdateExpression: "SET #zzzNew = :new",
      ExpressionAttributeValues: {
        ":new": {
          S: location,
        },
      },
      ExpressionAttributeNames: {
        "#zzzNew": "location",
      },
      ReturnValues: "ALL_NEW",
    })
  );

  if (!updateResult.Attributes) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        msg: "Space not processed",
      }),
    };
  }

  const plainItem = unmarshall(updateResult.Attributes);

  return {
    statusCode: 200,
    body: JSON.stringify(plainItem),
  };
};
