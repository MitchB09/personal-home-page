import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { describe, expect, it, beforeEach } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";
import axios from "axios";

import { handler } from "./index";
import { mockContext, mockEvent } from "../../mocks/mocks";

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

  it("check response", async () => {
    ddbMock.on(DeleteCommand).resolves({});

    const pathParameters = {
      id: 1,
    };

    const response = await handler(
      { ...mockEvent, pathParameters },
      mockContext
    );

    expect(ddbMock.calls().length).toBe(1)
    expect(response.statusCode).toBe(204);
  });
});
