import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { GetSuffixFromStack } from "../utils/getSuffixFromStack";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";

export class UIDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = GetSuffixFromStack(this);

    const deploymentBucket = new Bucket(this, "uiDeploymentBucket", {
      bucketName: `space-finder-frontend-${suffix}`,
    });

    const uiDir = join(__dirname, "../../../../space-finder-frontend/dist");

    if (!existsSync(uiDir)) {
      console.warn("Ui Directory doesn't exist");
      return;
    }

    new BucketDeployment(this, "SpaceFinderDeployment", {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)],
    });

    const originIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );

    deploymentBucket.grantRead(originIdentity);

    const distribution = new Distribution(this, "SpaceFinderDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessIdentity(deploymentBucket, {}),
      },
    });

    new CfnOutput(this, "SpaceFinderUrl", {
      value: distribution.distributionDomainName,
    });
  }
}
