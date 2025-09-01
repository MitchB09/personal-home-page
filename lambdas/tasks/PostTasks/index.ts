//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";
import { jwtDecode, JwtPayload } from "jwt-decode";

const entityType = "TASKS";

export type Task = {
  completed: boolean;
  description: string;
};

export type TodoList = {
  userId: string;
  date: string;
  lastUpdated: Date;
  tasks: Task[];
};

export type CognitoJwt = {
  "cognito:username": string;
} & JwtPayload;

export type Week = {} & Record<string, TodoList>;

export const handler = async (event: any, context: Context) => {
  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const tasksTable = process.env.TASKS_TABLE;

  const decoded = jwtDecode(event.headers.Authorization) as CognitoJwt;
  const payload = JSON.parse(event.body) as Week;
  const username = decoded["cognito:username"];

  const data = Object.values(payload).map((value) => {
    const item = {
      ...value,
      userId: username,
    };
    return {
      PutRequest: {
        Item: item,
      },
    };
  });

  try {
    const input = {
      RequestItems: {
        [`${tasksTable}`]: data,
      },
    };

    await ddb.send(new BatchWriteCommand(input));

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
