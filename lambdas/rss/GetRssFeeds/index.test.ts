import { BatchGetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { DynamicObject, handler } from "./index";
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
    const result = { Responses: {} as DynamicObject };
    result.Responses[testTableName] = [mockYCombinatorResult];

    ddbMock.on(BatchGetCommand).resolves(result);

    const response = await handler(mockEvent, mockContext);
    console.dir(response);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toStrictEqual([mockYCombinatorResult]);
  });

  it("Returns 404 Not Found when query params `id` is not found ", async () => {
    const response = await handler(
      { ...mockEvent, multiValueQueryStringParameters: {} },
      mockContext
    );

    expect(ddbMock.calls().length).toBe(0);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toStrictEqual({
      Error: "IDs not provided",
    });
  });
});
