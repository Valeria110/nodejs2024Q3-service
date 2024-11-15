export enum LogLevel {
  DEBUG,
  LOG,
  WARN,
  ERROR,
}

export type LogLevelType = keyof typeof LogLevel;
