import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { describe, expect, beforeEach, it } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";

import { AppStateForm, handler } from "./index";
import {
  mockContext,
  mockEvent,
} from "../../mocks/mocks";

const testTableName = "TEST_RSS_TABLE_NAME";

describe("Index.js", () => {
  // Create a mock for S3 at the beginning of your describe block.
  const ddbMock = mockClient(DynamoDBDocumentClient);

  // Set table name env var
  process.env.RSS_TABLE = testTableName;

  // Make sure to reset your mocks before each test to avoid issues.
  beforeEach(() => {
    ddbMock.reset();
  });

  it("Returns 200 Success when item is found", async () => {
    const payload = {
      homePageData: {
        weather: true,
        news: false,
        nfl: true,
      },
    } as AppStateForm;

    console.dir(JSON.stringify(payload))

    ddbMock.on(PutCommand).resolves({});

    const response = await handler(
      {
        ...mockEvent,
        pathParameters: { id: "123" },
        body: JSON.stringify(payload),
      },
      mockContext
    );

    expect(response.statusCode).toBe(204);
  });

  it("Returns 404 Not Found when query params `id` is not found ", async () => {
    const response = await handler(
      { ...mockEvent, pathParameters: {} },
      mockContext
    );

    console.dir(response);

    expect(ddbMock.calls().length).toBe(0);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response?.body)).toStrictEqual({
      Error: "IDs not provided",
    });
  });
});
