//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";

const entityType = "RSS";

export const handler = async (event: any, context: Context) => {
  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const rssTable = process.env.RSS_TABLE;

  const id = event.pathParameters.id;

  var params = {
    Key: {
      entityType: entityType,
      id: id,
    },
    TableName: rssTable,
  };

  try {
    await ddb.send(new DeleteCommand(params));

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
