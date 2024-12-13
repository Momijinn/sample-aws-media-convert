import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { PREFIX } from '../../../common/common';

export class Iam {
  private scope: Construct;
  constructor(scope: Construct) {
    this.scope = scope;
  }

  private createRole(name: string, assumedBy: cdk.aws_iam.IPrincipal): cdk.aws_iam.Role {
    const id = `${PREFIX}_${name}_role`;

    const role = new cdk.aws_iam.Role(this.scope, id, {
      description: id,
      roleName: id,
      assumedBy: assumedBy,
    });

    return role;
  }

  public createResources(name: string, assumedBy: cdk.aws_iam.IPrincipal) {
    return this.createRole(name, assumedBy);
  }
}
