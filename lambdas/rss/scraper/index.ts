import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser();
const entityType = "RSS";

type Subscription = {
  id: string;
  rssUrl: string;
};

export const handler = async (_: any, context: Context) => {
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

  const { Items } = await ddb.send(new QueryCommand(params));
  if (!Items) {
    return;
  }

  const results = Items.map((result) => {
    const subscription = result as Subscription;
    console.dir("Fetching: " + subscription.rssUrl);

    return axios.get(subscription.rssUrl).then(async (response) => {
      const data = parser.parse(response.data);

      var params = {
        TableName: rssTable,
        Item: {
          entityType: entityType,
          id: subscription.id,
          title: data["rss"]["channel"]["title"],
          rssUrl: subscription.rssUrl,
          rssData: data["rss"],
          lastUpdated: Date.now(),
        },
      };

      await ddb.send(new PutCommand(params));
      return data["rss"];
    });
  });

  return await Promise.all(results)
    .then((results) => {
      return results;
    })
    .catch((error) => {
      return error;
    });
};
