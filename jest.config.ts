import fs from 'fs';
import os from 'os';
import path from 'path';

let tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docker-metadata-action-'));

process.env = Object.assign({}, process.env, {
  TEMP: tmpDir,
  GITHUB_REPOSITORY: 'docker/metadata-action',
  RUNNER_TEMP: path.join(tmpDir, 'runner-temp'),
  RUNNER_TOOL_CACHE: path.join(tmpDir, 'runner-tool-cache')
}) as {
  [key: string]: string;
};

module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  setupFiles: ['dotenv/config'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  moduleNameMapper: {
    '^csv-parse/sync': '<rootDir>/node_modules/csv-parse/dist/cjs/sync.cjs'
  },
  collectCoverageFrom: ['src/**/{!(main.ts),}.ts'],
  coveragePathIgnorePatterns: ['lib/', 'node_modules/', '__mocks__/', '__tests__/'],
  verbose: true
};
