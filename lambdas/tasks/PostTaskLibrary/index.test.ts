import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
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
    ddbMock.on(PutCommand).resolves({});

    const response = await handler(
      createMockEvent({ body: payload, inludeAuth: true }),
      mockContext
    );

    expect(ddbMock.calls().length).toBe(1);
    expect(response.statusCode).toBe(204);

    expect(ddbMock.calls().length).toBe(1);
    expect(ddbMock.call(0).args[0]["input"]["RequestItems"]).toHaveProperty(
      testTableName
    );

    const tableUpdates =
      ddbMock.call(0).args[0]["input"]["RequestItems"][testTableName];
    expect(tableUpdates.length).toBe(3);

    tableUpdates.every((update) => {
      expect(update).toHaveProperty("PutRequest");
      const putRequest = update["PutRequest"];

      expect(putRequest).toHaveProperty("Item");
      const item = putRequest["Item"];

      expect(item.userId).toBe(mockUser);
      expect(item.date).toBeTruthy();
    });
  });
});
