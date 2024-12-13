import { Context, S3CreateEvent } from 'aws-lambda';
import { MediaConvert } from 'aws-sdk';

export const handler = async (event: S3CreateEvent, context: Context) => {
  // 環境変数 MEDIA_ROLE を取得
  const mediaRole = process.env.MEDIA_ROLE!;

  const s3Name = event.Records[0].s3.bucket.name;
  const s3Key = event.Records[0].s3.object.key;
  const mediaConvert = new MediaConvert();

  try {
    const ret = await mediaConvert.createJob(create_media_convert_setting(s3Name, s3Key, mediaRole)).promise();
    console.log('media convert: ', ret);
  } catch (e) {
    console.error('media convert error: ', e);
    return {
      statusCode: 500,
      body: JSON.stringify('media convert error'),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify('media convert success'),
  };
};

const create_media_convert_setting = (
  bucketName: string,
  targetName: string,
  iam: string,
): MediaConvert.Types.CreateJobRequest => {
  return {
    Role: iam,
    Settings: {
      Inputs: [
        {
          AudioSelectors: {
            'Audio Selector 1': {
              DefaultSelection: 'DEFAULT',
            },
          },
          VideoSelector: {},
          FileInput: `s3://${bucketName}/${targetName}`,
        },
      ],
      OutputGroups: [
        {
          Name: 'File Group',
          OutputGroupSettings: {
            Type: 'FILE_GROUP_SETTINGS',
            FileGroupSettings: {
              Destination: `s3://${bucketName}/output/`,
            },
          },
          Outputs: [
            {
              ContainerSettings: {
                Container: 'MP4',
                Mp4Settings: {},
              },
              VideoDescription: {
                Width: 640,
                Height: 360,
                CodecSettings: {
                  Codec: 'H_264',
                  H264Settings: {
                    RateControlMode: 'QVBR',
                    MaxBitrate: 5000000,
                  },
                },
              },
              AudioDescriptions: [
                {
                  AudioSourceName: 'Audio Selector 1',
                  CodecSettings: {
                    Codec: 'AAC',
                    AacSettings: {
                      Bitrate: 64000,
                      CodingMode: 'CODING_MODE_2_0',
                      SampleRate: 48000,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  };
};
