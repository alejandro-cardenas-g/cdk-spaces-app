import { App } from "aws-cdk-lib";
import { MonitoringStack } from "../../src/infraestructure/stacks/monitioring.stack";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";

describe("Monitor Stack Test Suite", () => {
  let monitorStackTemplate: Template;

  beforeAll(() => {
    const testApp = new App({
      outdir: "cdk.out",
    });

    const monitorStack = new MonitoringStack(testApp, "MonitorStack");

    monitorStackTemplate = Template.fromStack(monitorStack);
  });

  it("lambda proterties", () => {
    monitorStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "index.handler",
      Runtime: "nodejs22.x",
    });
  });

  it("sns topic proterties", () => {
    monitorStackTemplate.hasResourceProperties("AWS::SNS::Topic", {
      DisplayName: "AlarmTopic",
      TopicName: "AlarmTopic",
    });
  });

  it("Sns subscription properties - with matcher", () => {
    monitorStackTemplate.hasResourceProperties(
      "AWS::SNS::Subscription",
      Match.objectEquals({
        Protocol: "lambda",
        TopicArn: {
          Ref: Match.stringLikeRegexp("AlarmTopic"),
        },
        Endpoint: {
          "Fn::GetAtt": [Match.stringLikeRegexp("AlarmLambda"), "Arn"],
        },
      })
    );
  });

  it("Sns subscription properties - with exact values", () => {
    const snsTopic = monitorStackTemplate.findResources("AWS::SNS::Topic");
    const topicName = Object.keys(snsTopic)[0];

    const lambda = monitorStackTemplate.findResources("AWS::Lambda::Function");
    const lambdaName = Object.keys(lambda)[0];
    monitorStackTemplate.hasResourceProperties(
      "AWS::SNS::Subscription",
      Match.objectEquals({
        Protocol: "lambda",
        TopicArn: {
          Ref: topicName,
        },
        Endpoint: {
          "Fn::GetAtt": [lambdaName, "Arn"],
        },
      })
    );
  });

  it("Alarm actions", () => {
    const alarmActionsCapture = new Capture();
    monitorStackTemplate.hasResourceProperties("AWS::CloudWatch::Alarm", {
      AlarmActions: alarmActionsCapture,
    });

    expect(alarmActionsCapture.asArray()).toEqual([
      {
        Ref: expect.stringMatching(/^AlarmTopic/),
      },
    ]);
  });

  it("Monitor stack snapshot", () => {
    expect(monitorStackTemplate.toJSON()).toMatchSnapshot();
  });

  it("Lambda Monitor stack snapshot", () => {
    const lambda = monitorStackTemplate.findResources("AWS::Lambda::Function");
    expect(lambda).toMatchSnapshot();
  });
});
