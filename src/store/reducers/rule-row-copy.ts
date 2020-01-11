// import isEqual from 'lodash/isEqual';
// import { getType } from 'typesafe-actions';
// import { Atom, BoardObjectId, BoardObjectType, DropAttempt } from '../../@types';
// import randomObjectsCreator from '../epics/__helpers__/objects-creator';
// import { cols, rows } from '../../constants';
// import { RootAction } from '../actions';
// import { move, setNewRuleRow } from '../actions/rule-row';
//
// type State = {
//   atomsById: { [key: string]: Atom };
//   // Update atoms for every new row
//   atomsCountsById: { [key: string]: number };
//   // If there are no more board objects, then move on to next rule row.
//   // Atoms match by everything except for the function which needs to be invoked
//   // with the object passed in.
//   boardObjectToAtomIds: { [id: string]: Set<string> };
//   moveNum: number;
//   boardObjectsById: { [id: string]: BoardObjectType };
//   totalMoveHistory: DropAttempt[];
//   touchAttempts: BoardObjectId[];
//   dropAttempts: DropAttempt[];
// };
//
// const initialState: State = {
//   atomsById: {},
//   atomsCountsById: {},
//   boardObjectsById: {},
//   moveNum: 1,
//   boardObjectToAtomIds: {},
//   totalMoveHistory: [],
//   touchAttempts: [],
//   dropAttempts: [],
// };
//
// const reducer = (state: State = initialState, action: RootAction): State => {
//   switch (action.type) {
//     case getType(setNewRuleRow): {
//       const positionToXY = (position: number) => ({
//         x: position % rows,
//         y: Math.floor(position / cols),
//       });
//
//       // TODO: Use more effecient atom lookup method:
//       // const toAtomMapKey = (shape: Shape, color: Color, x: number, y: number) =>
//       //   `${shape}-${color}-${x}-${y}`;
//       //
//       // const atomsMap = action.payload.atoms.reduce(
//       //   (acc, atom) => ({
//       //     ...acc,
//       //     [toAtomMapKey(atom.shape, atom.color, ...positionToXY(atom.position))]: atom,
//       //   }),
//       //   {},
//       // );
//
//       return {
//         ...state,
//         atomsCountsById: action.payload.atomsByRowIndex.reduce(
//           (acc, curr) => ({
//             ...acc,
//             [curr.id]: curr.counter,
//           }),
//           {},
//         ),
//         boardObjectToAtomIds: Object.entries<string[]>(
//           Object.values(state.boardObjectsById).reduce(
//             (acc, curr) => ({
//               ...acc,
//               [curr.id]: action.payload.atomsByRowIndex
//                 .filter(
//                   (atom) =>
//                     atom.color === curr.color &&
//                     isEqual(positionToXY(atom.position), {
//                       x: curr.x,
//                       y: curr.y,
//                     }) &&
//                     atom.shape === curr.shape,
//                 )
//                 .map((atom) => atom.id),
//               // Filter board objects with empty atoms
//             }),
//             {},
//           ),
//         ).reduce(
//           (acc, [id, atoms]) => ({
//             ...acc,
//             ...(atoms.length > 0 ? { [id]: atoms } : {}),
//           }),
//           {},
//         ),
//         // There's likely less atoms than board objects
//         // atomsCountsById: action.payload.atoms.reduce(
//         //   (acc, curr) => ({
//         //     ...acc,
//         //     // Remove atoms as counter reaches 0 or boardObjectIds is empty
//         //     // Redux Observable needs to dispatch an action after the state update
//         //     // that there are no more atoms (It must dispatch setNewRuleRow).
//         //     [curr.id]: {
//         //       boardObjectIds: string[],
//         //       counter: curr.counter,
//         //       atomFns: curr.fns
//         //     },
//         //   }),
//         //   {},
//         // ),
//         moveNum: 0,
//       };
//     }
//
//     case getType(move): {
//       const { dragged } = action.payload.dropAttempt;
//
//       // No more valid atoms for this board object
//       if (!(dragged in state.boardObjectToAtomIds)) {
//         return state;
//       }
//
//       // 1. Decrement all atoms of that board object if that board object returns true
//       const boardObject = state.boardObjectsById[dragged];
//
//       const atoms = state.boardObjectToAtomIds[dragged].map((atomId) => state.atomsById[atomId]);
//
//       return {
//         ...state,
//         boardObjectsById: {
//           ...state.boardObjectsById,
//           [action.payload.dropSuccess.dragged]: {
//             ...state.boardObjectsById[action.payload.dropSuccess.dragged],
//           },
//         },
//       };
//     }
//     default:
//       return state;
//   }
// };
//
// export default reducer;

export default 1;
