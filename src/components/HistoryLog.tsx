import React from 'react';
import { Log } from '../@types';

export type HistoryLogProps = {
  logs: Log[];
};

const HistoryLog = ({ logs }: HistoryLogProps) => {
  return (
    <div>
      <h2>History Log (Testing Only):</h2>
      {logs.map((log) => (
        <React.Fragment key={log.id}>
          <div>{JSON.stringify(log)}</div>
          <br />
        </React.Fragment>
      ))}
    </div>
  );
};

export default HistoryLog;
