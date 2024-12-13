import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PREFIX } from '../../../common/common';
import { LogGroup, LogGroupRecouceProps } from '../logGroup/log-group';

export class Lambda {
  private scope: Construct;

  constructor(scope: Construct) {
    this.scope = scope;
  }

  private createLambdaFunction(
    lambdaName: string,
    src: string,
    environment?: { [key: string]: string },
  ): cdk.aws_lambda_nodejs.NodejsFunction {
    const id = `${PREFIX}_${lambdaName}_lambda`;

    const logGroup = new LogGroup(this.scope);

    const lambda = new cdk.aws_lambda_nodejs.NodejsFunction(this.scope, id, {
      functionName: id,
      runtime: cdk.aws_lambda.Runtime.NODEJS_22_X,
      entry: `${src}/index.ts`,
      handler: 'index.handler',
      logGroup: logGroup.createResources(LogGroupRecouceProps.Lambda, id),
      environment: environment,
    });

    return lambda;
  }

  public createResources(
    name: string,
    src: string,
    environment?: { [key: string]: string },
  ): cdk.aws_lambda_nodejs.NodejsFunction {
    return this.createLambdaFunction(name, src, environment);
  }
}
