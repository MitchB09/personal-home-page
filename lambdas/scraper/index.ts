//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { Context } from "aws-lambda";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser();

export const handler = async (_: any, context: Context) => {
  const subscriptions = [
    "https://news.ycombinator.com/rss",
    "https://www.cbc.ca/webfeed/rss/rss-canada-newbrunswick",
  ];

  //const client = new DynamoDBClient({});
  //const docClient = DynamoDBDocumentClient.from(client);

  const results = subscriptions.map((subscription) => {
    return axios
      .get(subscription)
      .then((response) => {
        const data = parser.parse(response.data);
        return data['rss'];
        //console.dir(jObj);

        //console.dir(jObj["rss"]["channel"]);
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
