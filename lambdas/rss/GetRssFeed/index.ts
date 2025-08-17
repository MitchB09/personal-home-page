//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import axios from "axios";
import { Context } from "aws-lambda";
import { XMLParser } from "fast-xml-parser";

const entityType = "RSS";

export const handler = async (event: any, context: Context) => {
  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const rssTable = process.env.RSS_TABLE as string;

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

  let triggerRefresh = false;
  if (
    event.queryStringParameters &&
    ['true', '1'].includes(event.queryStringParameters.refresh)
  ) {
    triggerRefresh = true;
  }

  const params = {
    TableName: rssTable,
    Key: { entityType: entityType, id: id },
    ProjectionExpression: "id, rssUrl, rssData, lastUpdated",
  };

  try {
    const data = await ddb.send(new GetCommand(params));
    if (data.Item) {
      let responseItem = data.Item;
      if (triggerRefresh) {
        const parser = new XMLParser();
        console.dir("Fetching: " + data.Item.rssUrl);

        const response = await axios.get(data.Item.rssUrl);
        const responseDatadata = parser.parse(response.data);

        const refreshedFeed = {
          id: id,
          title: responseDatadata["rss"]["channel"]["title"],
          rssUrl: data.Item.rssUrl,
          rssData: responseDatadata["rss"],
          lastUpdated: Date.now(),
        };

        var putParams = {
          TableName: rssTable,
          Item: {
            entityType: entityType,
            ...refreshedFeed,
          },
        };
        await ddb.send(new PutCommand(putParams));
        responseItem = refreshedFeed;
      }
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
