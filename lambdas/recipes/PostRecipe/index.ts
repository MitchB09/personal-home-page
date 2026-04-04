//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";

const entityType = 'RECIPE';

export type AddRecieForm = {
  recipeUrl: string;
  title: string;
};

export const handler = async (event: any, context: Context) => {
  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const entityTable = process.env.ENTITY_TABLE;

  const payload = JSON.parse(event.body) as AddRecieForm;

  try {
    const item = {
      entityType: entityType,
      id: uuidv4(),
      title: payload.title,
      recipeUrl: payload.recipeUrl,
      lastUpdated: Date.now(),
    };

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
