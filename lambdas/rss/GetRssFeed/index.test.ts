import { BatchGetCommand, DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { describe, expect, beforeEach, it } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";

import { handler } from "./index";
import { mockContext, mockEvent, mockYCombinatorResult } from "../../mocks/mocks";

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
    ddbMock.on(GetCommand).resolves({ Item: mockYCombinatorResult });

    const response = await handler(mockEvent, mockContext);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toStrictEqual(mockYCombinatorResult);
  });

  it("Returns 404 Not Found when query params `id` is not found ", async () => {
    const response = await handler(
      { ...mockEvent, pathParameters: {} },
      mockContext
    );

    expect(ddbMock.calls().length).toBe(0);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toStrictEqual({
      Error: "ID not provided",
    });
  });
});
