import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PREFIX } from '../../../common/common';
import { Lambda } from 'aws-cdk-lib/aws-ses-actions';

export enum LogGroupRecouceProps {
  'Lambda' = 'Lambda',
  'S3' = 'S3',
}

export class LogGroup {
  private scope: Construct;

  constructor(scope: Construct) {
    this.scope = scope;
  }

  public createResources(recouce: LogGroupRecouceProps, _id: string) {
    const id = `${PREFIX}_${_id}_loggroup`;
    const logGroupName = `${PREFIX}/${recouce}/${id}`;

    return new cdk.aws_logs.LogGroup(this.scope, id, {
      logGroupName: logGroupName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
