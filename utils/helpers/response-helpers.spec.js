import {
  successfulResponse, badRequestRespose, notFoundResponse, internalErrorResponse,
} from './response-helpers';

describe('response-utils', () => {
  describe('successfulResponse', () => {
    it('should return successful response', () => {
      const res = successfulResponse('some-message', 200, { custom: 'header' });

      expect(res).toEqual({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          custom: 'header',
        },
        body: 'some-message',
      });
    });

    it('should return successful JSON response', () => {
      const res = successfulResponse({ foo: 'bar' }, 200, { custom: 'header' });

      expect(res).toEqual({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Content-Type': 'application/json',
          custom: 'header',
        },
        body: '{"foo":"bar"}',
      });
    });
  });

  it('should return bad request response', () => {
    const res = badRequestRespose('invalid request');

    expect(res).toEqual({
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
      body: '{"message":"invalid request"}',
    });
  });

  it('should return not found response', () => {
    const res = notFoundResponse('smth-not-found');

    expect(res).toEqual({
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json',
      },
      body: '{"message":"smth-not-found"}',
    });
  });

  it('should return internal error response', () => {
    const res = internalErrorResponse();

    expect(res).toEqual({
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: 'Oops, something went wrong :(',
    });
  });
});
