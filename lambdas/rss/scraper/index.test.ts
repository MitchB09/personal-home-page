import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";
import axios from "axios";
import { readFileSync } from "fs";

import { handler } from "./index";
import {
  mockCbcResult,
  mockContext,
  mockListResult,
  mockYCombinatorResult,
} from "../../mocks/mocks";

// Mock jest and set the type
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const testTableName = "TEST_RSS_TABLE_NAME";

describe("Index.js", () => {
  // Create a mock for S3 at the beginning of your describe block.
  const ddbMock = mockClient(DynamoDBDocumentClient);

  mockedAxios.get.mockImplementation((url) => {
    switch (url) {
      case "https://news.ycombinator.com/rss":
        return Promise.resolve({
          data: readFileSync("../../mocks/hackerNews.rss"),
        });
      case "https://www.cbc.ca/webfeed/rss/rss-canada-newbrunswick":
        return Promise.resolve({
          data: readFileSync("../../mocks/canada-newbrunswick.rss"),
        });
      default:
        return Promise.reject(new Error("Unknown URL"));
    }
  });

  // Set table name env var
  process.env.RSS_TABLE = testTableName;

  // Make sure to reset your mocks before each test to avoid issues.
  beforeEach(() => {
    ddbMock.reset();
  });

  it("check response", async () => {
    ddbMock.on(QueryCommand).resolves({
      Items: mockListResult,
    });

    ddbMock.on(PutCommand).resolves({});

    const response = await handler(undefined, mockContext);

    console.dir(response);
    expect(response).toHaveLength(2);

    expect(response[0].channel.title).toBe("Hacker News");
    expect(response[1].channel.title).toBe("CBC | New Brunswick News");

    expect(ddbMock.calls().length).toBe(3);
    expect(ddbMock.call(1).args[0]["clientCommand"]["input"]["TableName"]).toBe(
      testTableName
    );
    expect(
      ddbMock.call(1).args[0]["clientCommand"]["input"]["Item"]["id"]
    ).toBe("1");

    expect(
      ddbMock.call(2).args[0]["clientCommand"]["input"]["Item"]["id"]
    ).toBe("2");
  });
});
