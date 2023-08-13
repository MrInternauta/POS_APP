import { ErrorModel } from '../models';

/** Marks a special case of error that should be ignored because it has already been handled */
export const IGNORE_ERROR: ErrorModel = Object.freeze({ error: '' });
