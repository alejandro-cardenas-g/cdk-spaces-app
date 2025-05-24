import { SNSEvent } from "aws-lambda";
import { handler } from "../src/services/monitoring/handler";

const snsEvent: SNSEvent = {
  Records: [
    {
      Sns: {
        Message: "testing msg",
      },
    },
  ] as SNSEvent["Records"],
};

handler(snsEvent, {} as any);
