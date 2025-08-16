/** @jest-config-loader ts-node */
import type { Config } from "jest";
import {defaults} from 'jest-config';

const config: Config = {
  ...defaults,
  rootDir: './',
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  displayName: {
    name: 'PostRssFeed',
    color: 'blue',
  },
};

export default config;
