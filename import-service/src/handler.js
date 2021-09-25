import csv from 'csv-parser';

import { successfulResponse } from '../../utils/helpers/response-helpers';
import { s3, moveObject } from './s3';

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

export const importFileParser = (event, context, callback) => {
  console.log('event', JSON.stringify(event));

  const { Records } = event;
  
  Records.forEach(async ({ s3: s3Item }) => {
    const { bucket, object } = s3Item;

    const params = {
      Bucket: bucket.name,
      Key: object.key,
    };

    const s3Stream = s3.getObject(params).createReadStream();

    s3Stream
      .pipe(csv())
      .on('data', (data) => {
        console.log(data);
      });
      
    await new Promise((resolve, reject) => {
      s3Stream
        .on('error', (err) => {
          reject(err);
        })
        .on('end', () => {
          resolve();
        });
    });

    await moveObject(bucket.name, object.key, object.key.replace('uploaded', 'parsed'));
    callback(null, null);
  });
};
