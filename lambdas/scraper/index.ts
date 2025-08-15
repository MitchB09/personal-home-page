//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser();
const entityType = "RSS";

export const handler = async (_: any, context: Context) => {
  const subscriptions = [
    { id: "1", rssUrl: "https://news.ycombinator.com/rss" },
    {
      id: "2",
      rssUrl: "https://www.cbc.ca/webfeed/rss/rss-canada-newbrunswick",
    },
  ];

  const dynamodb = new DynamoDBClient({});
  const ddb = DynamoDBDocumentClient.from(dynamodb);
  const rssTable = process.env.RSS_TABLE;

  const results = subscriptions.map((subscription) => {
    return axios.get(subscription.rssUrl).then(async (response) => {
      console.dir("Fetching: " + subscription.rssUrl);
      const data = parser.parse(response.data);

      var params = {
        TableName: rssTable,
        Item: {
          entityType: entityType,
          id: subscription.id,
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
