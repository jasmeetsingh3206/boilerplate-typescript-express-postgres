import { PoolClient, QueryResult } from 'pg';
import {
    commit,
    getTransaction,
    rollback,
    sqlExecMultipleRows,
    sqlExecSingleRow,
    sqlToDB,
} from './../utils/dbUtil';
import { ILogData, ILogSearchCriteria } from "../types/index";
import Knex from 'knex';
import knexConfig from '../knexfile';
const db = Knex(knexConfig);
// import { logger } from './../utils/logger';
const transactionSuccess = 'transaction success';



/**
 * sample query
 * @returns { Promise<QueryResult> }
 */
export const getQueryModel = async (terms:ILogSearchCriteria): Promise<QueryResult> => {
    // const sql = 'SELECT NOW() as now;';
    console.log(terms)
    const sql = `SELECT * FROM error_log LIMIT 10`;
    try {
        return await sqlToDB(sql);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getQueryModelKnex = async (terms:ILogSearchCriteria): Promise<unknown[]>=> {
    // const sql = 'SELECT NOW() as now;';
 
    try {
        console.log("inside     knex")
        const searchResults = await db('error_log')
        .select('*')
        .where((builder) => {
        //   if (terms.level) builder.where('level', terms.level);
          if (terms.message) builder.where('message', 'ilike', `%${terms.message}%`);
          if (terms.resourceId) builder.where('resourceid', terms.resourceId);
          // Add more conditions for other search criteria
        })
        .andWhere((builder) => {
          if (terms.startTime) builder.where('timestamp', '>=', terms.startTime);
          if (terms.endTime) builder.where('timestamp', '<=', terms.endTime);
        })
        .orderBy('timestamp', 'desc')
        .limit(100);
        return searchResults;
    } catch (error) {
        throw new Error(error.message);
    }
};

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
        console.error(`sampleTransactionModel error: ${error.message}`);
        throw new Error(error.message);
    }
};
