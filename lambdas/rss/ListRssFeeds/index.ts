//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";

const entityType = 'RSS';

export const handler = async (event: any, context: Context) => {
  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const rssTable = process.env.RSS_TABLE;

  var params = {
    ExpressionAttributeValues: {
      ":entityType": entityType,
    },
    KeyConditionExpression: "entityType = :entityType",
    ProjectionExpression: "id, rssUrl, title, lastUpdated",
    TableName: rssTable,
  };

  try {
    const data = await ddb.send(new QueryCommand(params));
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data.Items),
      isBase64Encoded: false,
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
