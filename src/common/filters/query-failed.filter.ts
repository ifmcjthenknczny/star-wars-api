import { Catch, ConflictException, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

const formatErrorDetails = (details?: string, table?: string) => {
  if (!details) {
    return '';
  }
  const regex = /Key \((\w+)\)=\((\d+)\) already exists\./;
  const match = details.match(regex);

  if (match) {
    const field = match[1];
    const value = match[2];
    return `Row with "${field}" of value "${value}" already exists in the table${table ? ` "${table}"` : ''}.`;
  }

  return details;
};

@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: QueryFailedError) {
    const driverError = (exception as any).driverError;

    if (driverError?.code === '23505') {
      throw new ConflictException(
        formatErrorDetails(driverError?.detail, driverError?.table),
      );
    }

    throw new Error(driverError?.message || 'Internal server error');
  }
}
