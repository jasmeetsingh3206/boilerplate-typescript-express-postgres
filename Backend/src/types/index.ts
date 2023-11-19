export interface Config {
    serviceName: string;
    port: number;
    loggerLevel: string;
    db: PgConfig;
}

export interface PgConfig {
    user: string;
    database: string;
    password: string;
    host: string;
    port: number;
    max: number;
    idleTimeoutMillis: number;
}

export interface ILogData {
    level: string;
    message: string;
    resourceId: string;
    timestamp: string;
    traceId: string;
    spanId: string;
    commit: string;
    metadata: {
        parentResourceId: string;
    };
}

export interface ILogSearchCriteria {
    level?: string;
    message?: string;
    resourceId?: string;
    startTime?: string;
    endTime?: string;
    traceId?: string;
    spanId?: string;
    commit?: string;
    parentResourceId?: string;
  }