import csv from 'csv-parser';

import { successfulResponse } from '../../utils/helpers/response-helpers';
import { s3, moveObject } from './s3';
import { sqs } from './sqs';

export const importProductsFile = async (event) => {
  const { S3_IMPORTS_BACKET } = process.env;
  const { name } = event.queryStringParameters;

  const params = {
    Bucket: S3_IMPORTS_BACKET,
    Key: `uploaded/${name}`,
    Expires: 60,
    ContentType: 'text/csv',
  };

  const url = await s3.getSignedUrlPromise('putObject', params);

  return successfulResponse({ url });
};

export const importFileParser = async (event) => {
  console.log('event', JSON.stringify(event));
  
  const { SQS_URL } = process.env;
  const { Records } = event;
  
  const processedRecords = Records.map(async ({ s3: s3Item }) => {
    const { bucket, object } = s3Item;

    const params = {
      Bucket: bucket.name,
      Key: object.key,
    };

    const s3Stream = s3.getObject(params).createReadStream();

    s3Stream
      .pipe(csv())
      .on('data', (data) => {
        const sqsPayload = {
          MessageBody: JSON.stringify(data),
          QueueUrl: SQS_URL,
        };

        sqs.sendMessage(sqsPayload, () => {
          console.log('SQS: products have been sent');
        });
      });
      
    await new Promise((resolve, reject) => {
      s3Stream
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          resolve({ bucket, object });
        });
    });

    await moveObject(bucket.name, object.key, object.key.replace('uploaded', 'parsed'));
    
    return Promise.resolve({ bucket, object });
  });

  await Promise.all(processedRecords);
};
