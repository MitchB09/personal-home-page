//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";

const entityType = 'RECIPE';

export const handler = async (event: any, context: Context) => {
  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const entityTable = process.env.ENTITY_TABLE as string;

  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error: "ID not provided",
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      isBase64Encoded: false,
    };
  }

  const id = decodeURI(event.pathParameters.id);

  const params = {
    TableName: entityTable,
    Key: { entityType: entityType, id: id },
    ProjectionExpression: "id, recipeUrl, title, notes, tags, lastUpdated",
  };

  try {
    const data = await ddb.send(new GetCommand(params));
    if (data.Item) {
      let responseItem = data.Item;
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(responseItem),
        isBase64Encoded: false,
      };
    } else {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          Error: `No settings found for id: ${id}`,
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
