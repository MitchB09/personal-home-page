import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";

const entityType: string = "SETTINGS";

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

  const id = decodeURI(event.pathParameters.id);

  const params = {
    TableName: rssTable,
    Key: { entityType: entityType, id: id },
    ProjectionExpression: "id, homePageData, lastUpdated",
  };

  try {
    const data = await ddb.send(new GetCommand(params));
    if (data.Item) {
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data.Item),
        isBase64Encoded: false,
      };
    } else {
            return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          Error: `No settings found for id: ${id}`
        }),
        isBase64Encoded: false,
      };
    }
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
