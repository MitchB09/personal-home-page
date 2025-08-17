import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";

const entityType: string = "SETTINGS";

export type AppStateForm = {
  homePageData: Record<string, boolean>;
};

export const handler = async (event: any, context: Context) => {
  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const rssTable = process.env.RSS_TABLE as string;

  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error: "IDs not provided",
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      isBase64Encoded: false,
    };
  }

  const id = event.pathParameters.id;
  const payload = JSON.parse(event.body) as AppStateForm;

  const item = {
    entityType: entityType,
    id: id,
    homePageData: payload.homePageData,
    lastUpdated: Date.now(),
  };

  var params = {
    TableName: rssTable,
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
