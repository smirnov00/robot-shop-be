const COMMON_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const standardResponse = (statusCode, headers = {}, body = null) => {
  const isBodyAnObject = typeof body === 'object';

  const res = {
    statusCode,
    headers: {
      ...COMMON_HEADERS,
      ...headers,
      ...(isBodyAnObject ? {
        'Content-Type': 'application/json',
      } : {}),
    },
  };

  return body ? {
    ...res,
    body: isBodyAnObject ? JSON.stringify(body) : body,
  } : res;
};

export const successfulResponse = (body, statusCode = 200, headers = {}) => standardResponse(statusCode, headers, body);

export const badRequestRespose = (message, statusCode = 400, headers = {}) => standardResponse(statusCode, headers, { message });

export const notFoundResponse = (message, headers = {}) => badRequestRespose(message, 404, headers);

export const internalErrorResponse = (statusCode = 500, headers = {}) => standardResponse(statusCode, headers, 'Oops, something went wrong :(');