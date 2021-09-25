import csv from 'csv-parser';

import { successfulResponse } from '../../utils/helpers/response-helpers';
import { s3 } from './s3';
import { importProductsFile, importFileParser } from './handler';

jest.mock('csv-parser');
jest.mock('../../utils/helpers/response-helpers');
jest.mock('./s3');

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
});
