import AWS from 'aws-sdk';

export const sns = new AWS.SNS({ region: process.env.REGION });
