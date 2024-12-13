sample-aws-media-converter
===============

AWS media converter を使ってみた

## Requirements

* [devbox](https://www.jetify.com/devbox)

## Usage

[devbox.json](./devbox.json) 内にある `AWS_ACCESS_KEY_ID` と `AWS_SECRET_ACCESS_KEY` に AWS のアクセスキーを設定してください。

```json
"env": {
  "AWS_ACCESS_KEY_ID": "${YOUR_AWS_ACCESS_KEY_ID}",
  "AWS_SECRET_ACCESS_KEY": "${YOUR_AWS_SECRET_ACCESS_KEY}",

},
```

以下のコマンドを実行して 仮想環境を起動。

```bash
$ devbox init
$ devbox shell
```

[common.ts](./app/common/common.ts) 内にある `PROJECT` と `ADMIN_NAME` をお好みに変更してください。

```typescript
const PROJECT = '${お好みに変更}';
const ADMIN_NAME = '${お好みに変更}';
```

以下のコマンドを実行して AWS リソースをデプロイ。

```bash
$ cd app
$ cdk deploy
```
