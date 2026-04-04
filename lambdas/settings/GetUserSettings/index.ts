import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";
import { jwtDecode } from "jwt-decode"
const entityType: string = "SETTINGS";

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

  const params = {
    TableName: entityTable,
    Key: { entityType: entityType, id: userId },
    ProjectionExpression: "homePageData, lastUpdated",
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
          Error: `No settings found for user`,
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
