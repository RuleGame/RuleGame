import { Button, Text } from 'grommet';
import React from 'react';
import { QueryResult } from 'react-query';
import Spinner from './Spinner';

function QueryComponent<T>({
  children,
  queryResult,
}: {
  queryResult: QueryResult<T, Error>;
  children: (data: T) => JSX.Element;
}) {
  return (
    <>
      {queryResult.data !== undefined ? (
        children(queryResult.data)
      ) : queryResult.error ? (
        <>
          <Text>An error ocurred: {queryResult.error.message}</Text>
          <Button onClick={queryResult.refetch}>Retry</Button>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
}

export default QueryComponent;
