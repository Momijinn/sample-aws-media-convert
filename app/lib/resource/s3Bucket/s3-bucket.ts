import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PREFIX } from '../../../common/common';

export class S3Bucket {
  private scope: Construct;

  constructor(scope: Construct) {
    this.scope = scope;
  }

  private createBucketPolicy(bucektArn: string): cdk.aws_iam.PolicyStatement {
    // cloudfront と mediaconvert からのアクセスを許可
    const policyStatement = new cdk.aws_iam.PolicyStatement({
      actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
      resources: [`${bucektArn}/*`, `${bucektArn}`],
      effect: cdk.aws_iam.Effect.ALLOW,
      principals: [
        new cdk.aws_iam.ServicePrincipal('cloudfront.amazonaws.com'),
        new cdk.aws_iam.ServicePrincipal('mediaconvert.amazonaws.com'),
      ],
    });

    return policyStatement;
  }

  private createBucket(bucketName: string): cdk.aws_s3.Bucket {
    const id = `${PREFIX}_${bucketName}_bucket`;

    const bucket = new cdk.aws_s3.Bucket(this.scope, id, {
      bucketName: id.replace(/_/g, '-'),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: true,
      eventBridgeEnabled: true,
    });

    // バケットポリシーの設定
    bucket.addToResourcePolicy(this.createBucketPolicy(bucket.bucketArn));

    return bucket;
  }

  public createResources(name: string): cdk.aws_s3.Bucket {
    return this.createBucket(name);
  }
}
