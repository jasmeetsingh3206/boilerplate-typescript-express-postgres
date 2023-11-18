import { PoolClient, QueryResult } from 'pg';
import {
    commit,
    getTransaction,
    rollback,
    sqlExecMultipleRows,
    sqlExecSingleRow,
    sqlToDB,
} from './../utils/dbUtil';
import {ILogData} from "../types/index";
import { logger } from './../utils/logger';
const transactionSuccess = 'transaction success';

/**
 * sample query
 * @returns { Promise<QueryResult> }
 */
export const getTimeModel = async (): Promise<QueryResult> => {
    // const sql = 'SELECT NOW() as now;';
    const sql = 'SELECT * from error_log where id=1050';

    try {
        return await sqlToDB(sql);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const insertErrorLog = async (log: ILogData): Promise<QueryResult> => {
    const {
      level,
      message,
      resourceId,
      timestamp,
      traceId,
      spanId,
      commit,
      metadata: { parentResourceId },
    } = log;
  
    const sql = `
      SELECT insert_error_log(
        $1, $2, $3, $4::TIMESTAMPTZ, $5, $6, $7, $8,
        $9::JSONB
      )`;
  
    const values = [
      level,
      message,
      resourceId,
      timestamp,
      traceId,
      spanId,
      commit,
      parentResourceId,
      JSON.stringify(log.metadata), // Convert metadata object to JSON string
    ];
  
    try {
      return await sqlToDB(sql, values);
    } catch (error) {
      throw new Error(error.message);
    }
  };

/**
 * sample query using transactions
 * @returns { Promise<string> } transaction success
 */
export const sampleTransactionModel = async (): Promise<string> => {
    const singleSql = 'DELETE FROM TEST;';
    const singleData = undefined;
    const multiSql = 'INSERT INTO TEST (testcolumn) VALUES ($1);';
    const multiData: string[][] = [['typescript'], ['is'], ['fun']];
    const client: PoolClient = await getTransaction();
    try {
        await sqlExecSingleRow(client, singleSql, singleData);
        await sqlExecMultipleRows(client, multiSql, multiData);
        await commit(client);
        return transactionSuccess;
    } catch (error) {
        await rollback(client);
        logger.error(`sampleTransactionModel error: ${error.message}`);
        throw new Error(error.message);
    }
};
