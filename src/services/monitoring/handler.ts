import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyResult, Context, SNSEvent } from "aws-lambda";

const ddbClient = new DynamoDBClient({});

export const handler = async (
  event: SNSEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  for (const record of event.Records) {
    console.log({
      msg: "We have a problem:" + record.Sns.Message,
    });
  }
  return {
    statusCode: 500,
    body: JSON.stringify({ msg: "Internal server error" }),
  };
};
