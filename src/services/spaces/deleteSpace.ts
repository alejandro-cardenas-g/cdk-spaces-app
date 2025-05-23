import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const DeleteSpace = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  if (!event.queryStringParameters?.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        msg: "Bad request: id required",
      }),
    };
  }

  const spaceId = event.queryStringParameters.id;

  const deleteResult = await ddbClient.send(
    new DeleteItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: marshall({ id: spaceId }),
      ReturnValues: "ALL_OLD",
    })
  );

  if (!deleteResult.Attributes) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        msg: "Item not deleted",
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      msg: "Item deleted successfuly",
    }),
  };
};
