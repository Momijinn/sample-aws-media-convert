import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { S3Bucket } from './resource/s3Bucket/s3-bucket';
import { Lambda } from './resource/lambda/lambda';
import { Iam } from './resource/iam/iam';

export class AppTokyoStack extends cdk.Stack {
  public readonly mediaS3Bucket: cdk.aws_s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create S3 bucket
    const s3 = new S3Bucket(this);
    this.mediaS3Bucket = s3.createResources('media');

    // iam の作成
    const iam = new Iam(this);

    // mediaConvert iam
    const mediaConvertRole = iam.createResources(
      'media_convert',
      new cdk.aws_iam.ServicePrincipal('mediaconvert.amazonaws.com'),
    );

    // S3 にアクセスできるようにする
    this.mediaS3Bucket.grantReadWrite(mediaConvertRole);

    // create Lambda
    const lambda = new Lambda(this);
    const mediaConverterLambda = lambda.createResources('media_convert', 'lambda/mediaConverter', {
      MEDIA_ROLE: mediaConvertRole.roleArn,
    });

    // Lambda に iam:PassRole と mediaconvert の権限を付与
    mediaConverterLambda.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        actions: ['iam:PassRole', 'mediaconvert:CreateJob'],
        resources: ['*'],
      }),
    );

    // S3 のアップロードイベントを Lambda に紐付け
    this.mediaS3Bucket.addEventNotification(
      cdk.aws_s3.EventType.OBJECT_CREATED,
      new cdk.aws_s3_notifications.LambdaDestination(mediaConverterLambda),
      { prefix: 'input/' },
    );
    // Lambda が S3 のイベントをもらえるようにする
    this.mediaS3Bucket.grantRead(mediaConverterLambda);
  }
}
