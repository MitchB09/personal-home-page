//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";
import { jwtDecode, JwtPayload } from "jwt-decode";

export type CognitoJwt = {
  "cognito:username": string;
} & JwtPayload;

export const handler = async (event: any, context: Context) => {
  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const tasksTable = process.env.TASKS_TABLE;

  const decoded = jwtDecode(event.headers.Authorization) as CognitoJwt;
  const username = decoded["cognito:username"];

  var params = {
    ExpressionAttributeNames: {
      "#date": "date",
    },
    ExpressionAttributeValues: {
      ":userId": username,
    },
    KeyConditionExpression: "userId = :userId",
    ProjectionExpression: "userId, #date, lastUpdated, tasks",
    TableName: tasksTable,
  };

  try {
    const data = await ddb.send(new QueryCommand(params));
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data.Items),
      isBase64Encoded: false,
    };
  } catch (error: unknown) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        Error: error,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      isBase64Encoded: false,
    };
  }
};
