import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  AttributeType,
  Table as DynamoDbTable,
  ITable,
} from "aws-cdk-lib/aws-dynamodb";
import {
  Bucket,
  HttpMethods,
  IBucket,
  ObjectOwnership,
} from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { GetSuffixFromStack } from "../utils/getSuffixFromStack";

export class DataStack extends Stack {
  public readonly spacesTable: ITable;
  public readonly spacesPhotosBucket: IBucket;

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

    this.spacesPhotosBucket = new Bucket(this, "SpacesPhotosBucket", {
      bucketName: `spaces-finder-photos-${suffix}`,
      cors: [
        {
          allowedMethods: [HttpMethods.GET, HttpMethods.PUT, HttpMethods.HEAD],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
      //accessControl: BucketAccessControl.PUBLIC_READ,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
    });

    new CfnOutput(this, "SpaceFinderPhotosBucketName", {
      value: this.spacesPhotosBucket.bucketName,
    });
  }
}
