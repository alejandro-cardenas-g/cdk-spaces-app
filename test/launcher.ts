import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../src/services/spaces/handler";

handler(
  {
    httpMethod: "POST",
    body: JSON.stringify({
      location: "Serumbia23",
    }),
    queryStringParameters: {
      id: "dba06f08-859b-40e9-b19f-7db813568628",
    },
  } as Partial<APIGatewayProxyEvent> as APIGatewayProxyEvent,
  {} as any
);
