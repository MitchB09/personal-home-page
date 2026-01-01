import "@testing-library/jest-dom/vitest"


// Required for RTK queries in tests
import nodeFetch, { Request, Response } from "node-fetch";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
Object.assign(global, { fetch: nodeFetch, Request, Response });
