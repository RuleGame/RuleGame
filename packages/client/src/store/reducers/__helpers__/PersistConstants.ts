export enum PersistKeys {
  GAMES = 'GAMES_0',
  RULE_ARRAYS = 'RULE_ARRAYS_0',
  BOARD_OBJECTS_ARRAYS = 'BOARD_OBJECTS_ARRAYS_0',
  HISTORY = 'HISTORY_0',
}

export const PersistVersions: { [key in PersistKeys]: number } = {
  [PersistKeys.GAMES]: 0,
  [PersistKeys.RULE_ARRAYS]: 0,
  [PersistKeys.BOARD_OBJECTS_ARRAYS]: 0,
  [PersistKeys.HISTORY]: 0,
};
