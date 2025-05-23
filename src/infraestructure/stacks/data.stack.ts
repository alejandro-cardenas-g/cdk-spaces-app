import { Stack, StackProps } from "aws-cdk-lib";
import {
  AttributeType,
  Table as DynamoDbTable,
  ITable,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { GetSuffixFromStack } from "../utils/getSuffixFromStack";

export class DataStack extends Stack {
  public readonly spacesTable: ITable;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const suffix = GetSuffixFromStack(this);
    const spacesTable = new DynamoDbTable(this, "SpacesTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: `SpacesTable-${suffix}`,
    });
    this.spacesTable = spacesTable;
  }
}
