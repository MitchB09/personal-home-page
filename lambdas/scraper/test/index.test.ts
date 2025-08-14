import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import axios from "axios";
import { readFileSync } from "fs";

import { handler } from "../index";

// Mock jest and set the type
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockContext = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "",
  functionVersion: "",
  invokedFunctionArn: "",
  memoryLimitInMB: "",
  awsRequestId: "",
  logGroupName: "",
  logStreamName: "",
  getRemainingTimeInMillis: function (): number {
    throw new Error("Function not implemented.");
  },
  done: function (error?: Error, result?: any): void {
    throw new Error("Function not implemented.");
  },
  fail: function (error: Error | string): void {
    throw new Error("Function not implemented.");
  },
  succeed: function (messageOrObject: any): void {
    throw new Error("Function not implemented.");
  },
};

describe("Index.js", () => {
  // Create a mock for S3 at the beginning of your describe block.
  const dynamoDBMock = mockClient(DynamoDBClient);

  mockedAxios.get.mockImplementation((url) => {
    switch (url) {
      case "https://news.ycombinator.com/rss":
        return Promise.resolve({ data: readFileSync("test/hackerNews.rss") });
      case "https://www.cbc.ca/webfeed/rss/rss-canada-newbrunswick":
        return Promise.resolve({
          data: readFileSync("test/canada-newbrunswick.rss"),
        });
      default:
        return Promise.reject(new Error("Unknown URL"));
    }
  });

  // Make sure to reset your mocks before each test to avoid issues.
  beforeEach(() => {
    dynamoDBMock.reset();
  });

  it("check response", async () => {
    const response = await handler(undefined, mockContext);

    console.dir(response);
    expect(response).toHaveLength(2);

    expect(response[0].channel.title).toBe("Hacker News");
    expect(response[1].channel.title).toBe("CBC | New Brunswick News");
  });
});
