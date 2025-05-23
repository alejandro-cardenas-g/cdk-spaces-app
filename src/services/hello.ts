import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
) => {
  console.log(event);
  const command = new ListBucketsCommand({});
  const listBucketsResult = await s3Client.send(command);
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from lambda" + v4(),
      tableName: process.env.TABLE_NAME,
      buckes: listBucketsResult.Buckets,
    }),
  };
  return response;
};
