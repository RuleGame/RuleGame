import { createSelector } from 'reselect';
import { RootState } from '../reducers';

export const ruleArraysByIdSelector = (state: RootState) => state.ruleArrays.byId;

export const ruleArraysIdsSelector = (state: RootState) => state.ruleArrays.allIds;

export const ruleArraysSelector = createSelector(
  [ruleArraysByIdSelector, ruleArraysIdsSelector],
  (ruleArraysById, ruleArraysIds) => ruleArraysIds.map((id) => ruleArraysById[id]),
);
