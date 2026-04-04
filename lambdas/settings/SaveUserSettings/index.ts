import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";
import { jwtDecode } from "jwt-decode";

const entityType: string = "SETTINGS";

export type AppStateForm = {
  homePageData: Record<string, boolean>;
};

export const handler = async (event: any, context: Context) => {
  const userId = jwtDecode(event.headers.Authorization).sub;
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error: "No userId Found",
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      isBase64Encoded: false,
    };
  }

  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const entityTable = process.env.ENTITY_TABLE as string;

  const payload = JSON.parse(event.body) as AppStateForm;

  const item = {
    entityType: entityType,
    id: userId,
    homePageData: payload.homePageData,
    lastUpdated: Date.now(),
  };

  var params = {
    TableName: entityTable,
    Item: item,
  };

  try {
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
