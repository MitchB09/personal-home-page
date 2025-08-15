import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { handler } from "../index";
import { mockContext, mockEvent, mockGetResult } from "../../mocks";

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
    ddbMock
      .on(GetCommand, {
        TableName: testTableName,
        Key: { id: "1" },
      })
      .resolves({
        Item: mockGetResult,
      });

    const response = await handler(mockEvent, mockContext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toStrictEqual(mockGetResult);
  });

  it("Returns 404 Not Found when path params `id` is not found ", async () => {
    const response = await handler(
      { ...mockEvent, pathParameters: {} },
      mockContext
    );

    expect(ddbMock.calls().length).toBe(0);
    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toStrictEqual({ Error: "No ID Found" });
  });
});
