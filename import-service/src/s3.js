import AWS from 'aws-sdk';

const { REGION } = process.env;
export const s3 = new AWS.S3({ region: REGION });

export const moveObject = async (bucket, sourceObject, targetObject) => {
  await s3.copyObject({
    Bucket: bucket,
    CopySource: `${bucket}/${sourceObject}`,
    Key: targetObject,
  }).promise();

  await s3.deleteObject({
    Bucket: bucket,
    Key: sourceObject,
  }).promise();
};
