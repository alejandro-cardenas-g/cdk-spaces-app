import { SNSEvent } from "aws-lambda";
import { handler } from "../../../src/services/monitoring/handler";

describe("Monitor handler lambda", () => {
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Makes log for records", async () => {
    const entries = [
      {
        Sns: {
          Message: "",
        },
      },
    ] as SNSEvent["Records"];

    await handler(
      {
        Records: entries,
      },
      {} as any
    );

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith({
      msg: expect.any(String),
    });
  });

  it("Makes no log for records", async () => {
    const entries = [] as SNSEvent["Records"];

    await handler(
      {
        Records: entries,
      },
      {} as any
    );

    expect(console.log).toHaveBeenCalledTimes(0);
  });
});
