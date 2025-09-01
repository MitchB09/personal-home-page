//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";
import { jwtDecode, JwtPayload } from "jwt-decode";

export type Task = {
  enabled: boolean;
  description: string;
};

export type TodoList = {
  userId: string;
  lastUpdated: Date;
  tasks: Task[];
};

export type CognitoJwt = {
  "cognito:username": string;
} & JwtPayload;


export const handler = async (event: any, context: Context) => {
  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const tasksTable = process.env.TASKS_TABLE;

  const decoded = jwtDecode(event.headers.Authorization) as CognitoJwt;
  const payload = JSON.parse(event.body) as Task[];

  try {
    const item = {
      userId: decoded["cognito:username"],
      date: 'LIBRARY',
      tasks: payload,
      lastUpdated: Date.now()
    }

    var params = {
      TableName: tasksTable,
      Item: item,
    };

    await ddb.send(new PutCommand(params));
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      isBase64Encoded: false,
    };
  } catch (error: unknown) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        Error: error,
      }),
      isBase64Encoded: false,
    };
  }
};
