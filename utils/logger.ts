import axios from 'axios';
import { CONSTANTS } from '../constants';
import { LogBody } from '../types';

export default async function logger(data: LogBody) {
    try {
        await axios.request({ ...CONSTANTS.LOG_OPTIONS, data });
    } catch (error) {
        console.error(error);
    }
}
