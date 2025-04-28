import {
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

const formatErrorDetails = ({ detail, table }: DriverError) => {
  if (!detail) {
    return '';
  }

  const regex = /Key \((\w+)\)=\((\d+)\) already exists\./;
  const match = detail.match(regex);

  if (match) {
    const field = match[1];
    const value = match[2];
    return `Row with "${field}" of value "${value}" already exists in the table${table ? ` "${table}"` : ''}.`;
  }

  return detail;
};

const formatForeignKeyError = ({ detail, table }: DriverError) => {
  if (!detail) {
    return '';
  }
  const regex = /Key \((\w+)\)=\((.+?)\) is not present in table "(\w+)"/;
  const match = detail.match(regex);

  if (match) {
    const field = match[1];
    const value = match[2];
    return `Key "${field}" of value "${value}" is not present in table "${table}". Insert "${value}" value into ${table} first.`;
  }
  return detail;
};

type DriverError = Error & {
  code?: string;
  detail?: string;
  table?: string;
};

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: QueryFailedError) {
    const driverError: DriverError = exception.driverError;

    if (driverError?.code === '23505') {
      throw new ConflictException(formatErrorDetails(driverError));
    }

    if (driverError?.code === '23503') {
      throw new BadRequestException(formatForeignKeyError(driverError));
    }

    throw new Error(driverError?.message || 'Internal server error');
  }
}
