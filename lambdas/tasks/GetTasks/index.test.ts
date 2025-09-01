import { DeleteCommand, DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { describe, expect, it, beforeEach } from "@jest/globals";
import { mockClient } from "aws-sdk-client-mock";

import { handler } from "./index";
import {
  createMockEvent,
  mockAuthHeader,
  mockContext,
  mockEvent,
  mockUser,
} from "../../mocks/mocks";

const testTableName = "TEST_RSS_TABLE_NAME";

const payload = {
  "2025-08-31": {
    date: "2025-08-31",
    lastUpdated: "2025-09-01T14:25:19.508Z",
    tasks: [],
  },
  "2025-09-01": {
    date: "2025-09-01",
    lastUpdated: "2025-09-01T14:25:19.508Z",
    tasks: [
      {
        completed: false,
        current: 6,
        description: "10 Pullups",
        goal: 10,
      },
      {
        completed: false,
        current: 0,
        description: "2 Walks",
        goal: 2,
      },
      {
        completed: false,
        description: "Clean something",
      },
    ],
  },
  "2025-09-02": {
    date: "2025-09-02",
    lastUpdated: "2025-09-01T14:25:19.508Z",
    tasks: [],
  },
};

describe("Index.js", () => {
  // Create a mock for S3 at the beginning of your describe block.
  const ddbMock = mockClient(DynamoDBDocumentClient);

  // Set table name env var
  process.env.TASKS_TABLE = testTableName;

  // Make sure to reset your mocks before each test to avoid issues.
  beforeEach(() => {
    ddbMock.reset();
  });

  it("check response", async () => {
    ddbMock.on(QueryCommand).resolves({});

    const response = await handler(
      createMockEvent({ inludeAuth: true }),
      mockContext
    );

    expect(ddbMock.calls().length).toBe(1);
    expect(response.statusCode).toBe(200);

    expect(ddbMock.calls().length).toBe(1);
  });
});
