//
import { DynamoDBClient, KeysAndAttributes } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, BatchGetCommand } from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";

export interface DynamicObject {
  [key: string]: any; // Allows any string key with any value type
}

export const handler = async (event: any, context: Context) => {
  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const rssTable = process.env.RSS_TABLE as string;

  if (
    !event.multiValueQueryStringParameters ||
    !event.multiValueQueryStringParameters.id
  ) {
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

  const ids = event.multiValueQueryStringParameters.id as string[];

  const getParams = {
    RequestItems: {} as DynamicObject,
  };

  getParams.RequestItems[rssTable] = {
    Keys: ids.map((id) => {
      return {
        entityType: "RSS",
        id: id,
      };
    }),
    ProjectionExpression: "id, rssUrl, rssData, lastUpdated",
  };

  try {
    const data = await ddb.send(new BatchGetCommand(getParams));
    const result = data?.Responses && data.Responses[rssTable] ? data.Responses[rssTable] : []
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result),
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
