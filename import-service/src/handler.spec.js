import { Readable, Transform } from 'stream';
import csv from 'csv-parser';

import { successfulResponse } from '../../utils/helpers/response-helpers';
import { importProductsFile, importFileParser } from './handler';
import { moveObject, s3 } from './s3';
import { sqs } from './sqs';

jest.mock('csv-parser');
jest.mock('../../utils/helpers/response-helpers');
jest.mock('./s3');
jest.mock('./sqs');

describe('handler', () => {
  const envOriginal = process.env;

  beforeEach(() => {
    jest.resetModules();
    successfulResponse.mockReturnValue('successful-response');

    process.env = {
      ...envOriginal,
    };
  });

  afterAll(() => {
    process.env = envOriginal;
  });

  describe('importProductsFile', () => {
    it('should return signed url', async () => {
      process.env.S3_IMPORTS_BACKET = 'S3_IMPORTS_BACKET';

      const event = {
        queryStringParameters: {
          name: 'file.csv',
        },
      };

      s3.getSignedUrlPromise.mockResolvedValue('signed-url');
      
      const res = await importProductsFile(event);

      expect(s3.getSignedUrlPromise).toHaveBeenCalledWith('putObject', {
        Bucket: 'S3_IMPORTS_BACKET',
        Key: 'uploaded/file.csv',
        Expires: 60,
        ContentType: 'text/csv',
      });
      expect(successfulResponse).toHaveBeenCalledWith({ url: 'signed-url' });
      expect(res).toBe('successful-response');
    });
  });

  describe('importFileParser', () => {
    it('should parse imported file', async () => {
      const envOriginal = process.env;
      process.env = {
        ...envOriginal,
        SQS_URL: 'sqs-url',
      };
      
      const event = {
        Records: [{
          s3: {
            bucket: {
              name: 'bucket-name',
            },
            object: {
              key: 'uploaded/object-key',
            },
          },
        }],
      };

      moveObject.mockResolvedValue(null);
      sqs.sendMessage = jest.fn();
      s3.getObject = jest.fn().mockReturnValue({
        createReadStream: jest.fn().mockImplementation(() => {
          const readable = new Readable();
          readable.push(Buffer.from('prod-1'));
          readable.push(Buffer.from('prod-2'));
          readable.push(null);
  
          return readable;
        }),
      });

      csv.mockImplementation(() => new Transform({
        objectMode: true,
        transform: (chunk, encoding, done) => {
          done(null, { id: chunk.toString() });
        },
      }));

      await importFileParser(event);

      expect(sqs.sendMessage).toHaveBeenCalledTimes(2);

      expect(sqs.sendMessage).toHaveBeenNthCalledWith(1, {
        MessageBody: '{"id":"prod-1"}',
        QueueUrl: 'sqs-url',
      }, expect.anything());

      expect(sqs.sendMessage).toHaveBeenNthCalledWith(2, {
        MessageBody: '{"id":"prod-2"}',
        QueueUrl: 'sqs-url',
      }, expect.anything());

      expect(moveObject).toHaveBeenCalledWith('bucket-name', 'uploaded/object-key', 'parsed/object-key');

      process.env = envOriginal;
    });
  });
});
