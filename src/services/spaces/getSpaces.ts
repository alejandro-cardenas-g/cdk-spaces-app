import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const GetSpaces = async (
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> => {
  if (event.queryStringParameters) {
    if (!("id" in event.queryStringParameters)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          msg: "Bad request: id required",
        }),
      };
    }
    const spaceId = event.queryStringParameters.id;
    const getItemResponse = await ddbClient.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: marshall({ id: spaceId }),
      })
    );
    if (!getItemResponse.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          msg: "Space not found",
        }),
      };
    }

    const plainItem = unmarshall(getItemResponse.Item);

    return {
      statusCode: 200,
      body: JSON.stringify(plainItem),
    };
  }

  const command = new ScanCommand({
    TableName: process.env.TABLE_NAME,
  });

  const result = await ddbClient.send(command);

  const plainItems = result.Items.map((item) => unmarshall(item));

  console.log(result.Items);

  return {
    statusCode: 201,
    body: JSON.stringify(plainItems),
  };
};
