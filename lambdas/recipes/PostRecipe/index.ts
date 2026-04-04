//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";
import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";

const entityType = 'RECIPE';

export type AddRecieForm = {
  recipeUrl: string;
  title: string;
};

export const handler = async (event: any, context: Context) => {
  const userId = jwtDecode(event.headers.Authorization).sub;

  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const entityTable = process.env.ENTITY_TABLE;
  const payload = JSON.parse(event.body);

  try {
    const item = {
      entityType: entityType,
      userId: userId,
      lastUpdated: Date.now(),
      ...payload,
    };

    if (!item.id) {
      item.id = uuidv4();
    }

    var params = {
      TableName: entityTable,
      Item: item,
    };

    await ddb.send(new PutCommand(params));

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        id: item.id,
        title: item.title,
        recipeUrl: item.recipeUrl,
        lastUpdated: item.lastUpdated,
      }),
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
