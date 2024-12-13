#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { STACK } from '../common/common';
import { AppTokyoStack } from '../lib/app-tokyo-stack';

const app = new cdk.App();

const appTokyoStack = new AppTokyoStack(app, `${STACK}TokyoStack`, {
  env: {
    region: 'ap-northeast-1',
  },
});
