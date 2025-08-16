import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { jest, describe, expect, test } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import axios from "axios";
import { readFileSync } from "fs";
import { v4 as uuidv4 } from 'uuid';

import { handler } from "./index";
import { mockContext, mockEvent, mockYCombinatorResult } from "../../mocks/mocks";

// Mock jest and set the type
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("uuid");
const mockedUuid = uuidv4 as jest.Mocked<typeof uuidv4>;

const testTableName = "TEST_RSS_TABLE_NAME";
const generatedUuid = '00000000-000a-0000-0000-00000000000a'

describe("Index.js", () => {
  // Create a mock for S3 at the beginning of your describe block.
  const ddbMock = mockClient(DynamoDBDocumentClient);

  mockedAxios.get.mockImplementation((url) => {
    switch (url) {
      case "https://news.ycombinator.com/":
        return Promise.resolve({
          data: readFileSync("../../mocks/hackerNews.rss"),
        });
      default:
        return Promise.reject(new Error("Unknown URL"));
    }
  });

  mockedUuid.mockImplementation(() => {
    return generatedUuid;
  })

  // Set table name env var
  process.env.RSS_TABLE = testTableName;

  // Make sure to reset your mocks before each test to avoid issues.
  beforeEach(() => {
    ddbMock.reset();
  });

  it("check response", async () => {
    ddbMock.on(PutCommand).resolves({});

    const body = {
      name: "Test Subscription",
      url: "https://news.ycombinator.com/",
    };

    const response = await handler(
      { ...mockEvent, body: JSON.stringify(body) },
      mockContext
    );

    expect(uuidv4).toHaveBeenCalled();

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).id).toBe(generatedUuid);
    expect(JSON.parse(response.body).rssUrl).toBe(body.url);
  });
});
