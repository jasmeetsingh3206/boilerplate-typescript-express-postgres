import { Request, Response } from 'express';
// import { logger } from './../utils/logger';
import { getTimeModel, sampleTransactionModel , insertErrorLog, 
    // getQueryModel ,
    getQueryModelKnex} from './../models/model-sample';
import { QueryResult } from 'pg';
import { ILogData, ILogSearchCriteria } from '../types';

/**
 * sample controller
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const getTime = async (req: Request, res: Response): Promise<void> => {
    let result: QueryResult;
    try {
        result = await getTimeModel();
        res.status(200).json({
            status: 'ok',
            message: result.rows,
            statusCode: 200,
        });
    } catch (error) {
        console.error(`getTime error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: error.message,
            statusCode: 500,
        });
    }
};


export const getQuertData = async (req: Request, res: Response): Promise<void> => {
    // let result: QueryResult;
    let result: unknown[];

    try {
        console.log(req.body);
        // result = await getQueryModel(req.body as ILogSearchCriteria);
        result = await getQueryModelKnex(req.body as ILogSearchCriteria);
        res.status(200).json({
            // result: result.rows
            result: result
        });
    } catch (error) {
        console.error(`getTime error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: error.message,
            statusCode: 500,
        });
    }
};

/**
 * Inserts a log into the database based on the request body.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} - a promise that resolves to void
 */
export const insertLog = async (req: Request, res: Response): Promise<void> => {
    // let result: QueryResult;
    try {
        // console.info(req.body);
        // console.log(req.body);
        insertErrorLog(req.body as ILogData);
        res.status(200).json({
            
        });
    } catch (error) {
        console.error(`InsertData error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: error.message,
            statusCode: 500,
        });
    }
};

/**
 * sample controller using transaction
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<void> }
 */
export const sampleTransaction = async (
    req: Request,
    res: Response
): Promise<void> => {
    let result: string;
    try {
        result = await sampleTransactionModel();
        res.status(200).json({
            status: 'ok',
            message: result,
            statusCode: 200,
        });
    } catch (error) {
        console.error(`sampleTransaction error: ${error.message}`);
        res.status(500).json({
            status: 'error',
            message: error.message,
            statusCode: 500,
        });
    }
};
