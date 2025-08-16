//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { v4 as uuidv4 } from 'uuid';

const parser = new XMLParser();
const entityType = "RSS";

export type AddFeedForm = {
  name: string;
  url: string;
};

export const handler = async (event: any, context: Context) => {
  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const rssTable = process.env.RSS_TABLE;

  console.dir(event.body);
  const payload = JSON.parse(event.body) as AddFeedForm;

  try {
const item = await axios.get(payload.url).then(async (response) => {
    console.dir("Fetching: " + payload.url);
    const data = parser.parse(response.data);

    const item = {
      entityType: entityType,
      id: uuidv4(),
      title: data["rss"]["channel"]["title"],
      rssUrl: payload.url,
      rssData: data["rss"],
      lastUpdated: Date.now(),
    };

    var params = {
      TableName: rssTable,
      Item: item,
    };

    await ddb.send(new PutCommand(params));
    return item;
  });

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      id: item.id,
      title: item.title,
      rssUrl: item.rssUrl,
      rssData: item.rssData,
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
