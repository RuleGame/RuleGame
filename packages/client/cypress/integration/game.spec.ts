// eslint-disable-next-line
/// <reference types="cypress" />
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { enterGame, loadGames } from '../../src/store/actions/games';
import { CY_GAME, CY_NO_MORE_MOVES, CyLayer } from '../../src/constants/data-cy';
import { cySelector, cyShapeObject } from '../../src/constants/data-cy-builders';
import { BucketPosition, Color, Shape } from '../../src/@types';
import { enableDebugMode, move } from '../../src/store/actions/rule-row';
import { FEEDBACK_DURATION } from '../../src/constants';

describe('basic', () => {
  let sagaMiddleware: SagaMiddleware;

  const checkMove = (
    object: string,
    isValid: boolean = true,
    bucket: BucketPosition = BucketPosition.BL,
  ) => {
    const sagaMiddleware = createSagaMiddleware();
    cy.addMiddleware(sagaMiddleware);
    cy.take(move({ dragged: object, dropped: bucket }), sagaMiddleware, move);
    cy.wait(1.25 * FEEDBACK_DURATION);
    cy.get(`${cySelector(cyShapeObject(object))}[data-shape="${Shape.CHECK}"]`).should(
      isValid ? 'be.visible' : 'not.be.visible',
    );
    cy.wait(1.25 * FEEDBACK_DURATION);
    cy.removeMiddleware(sagaMiddleware);
  };
  //
  // const checkMove = (object: string, isValid: boolean = true) => {
  //   cy.take(move({ dragged: object, dropped: BucketPosition.BL }), sagaMiddleware, move);
  //   cy.wait(1.25 * FEEDBACK_DURATION);
  //   cy.get(`${cySelector(cyShapeObject(object))}[data-shape="${Shape.CHECK}"]`).should(
  //     isValid ? 'be.visible' : 'not.be.visible',
  //   );
  // };
  before(() => {
    cy.visit('/');
    sagaMiddleware = createSagaMiddleware();
    cy.addMiddleware(sagaMiddleware);
    cy.fixture('basics.json').then((s) => {
      cy.take(
        loadGames.request(new File([JSON.stringify(s)], 'temp')),
        sagaMiddleware,
        loadGames.success,
      );
    });
    cy.dispatch(enableDebugMode());
  });

  it('orders from least to greatest', () => {
    const checkOrder = (greaterObject: string, lesserObject: string) => {
      checkMove(lesserObject, false);
      checkMove(greaterObject, true);
      checkMove(lesserObject, true);

      cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
    };

    cy.dispatch(enterGame('jVF1D_0s'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkOrder('1', '2');

    cy.dispatch(enterGame('mlA01o-P'));
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('not.be.visible');

    checkOrder('2', '1');
  });

  it('orders work after every move and rule row', () => {
    cy.addAndEnterGame(
      `(1,*,*,*,[0])
(*,*,*,*,[(p+1)%4])`,
      [
        { id: '1', color: Color.BLUE, x: 2, y: 6, shape: Shape.STAR },
        { id: '2', color: Color.BLUE, x: 3, y: 6, shape: Shape.TRIANGLE },
        { id: '3', color: Color.BLACK, x: 4, y: 5, shape: Shape.SQUARE },
        { id: '4', color: Color.BLUE, x: 5, y: 1, shape: Shape.SQUARE },
      ],
      undefined,
      false,
      '[31,32,33,34,35,36,25,26,27,28,29,30,19,20,21,22,23,24,13,14,15,16,17,18,7,8,9,10,11,12,1,2,3,4,5,6]',
    );

    checkMove('1', true, BucketPosition.TL);
    checkMove('2', true, BucketPosition.TR);
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('not.be.visible');

    checkMove('4', false, BucketPosition.BR);
    checkMove('3', true, BucketPosition.BR);
    checkMove('4', true, BucketPosition.BL);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for counters', () => {
    cy.dispatch(enterGame('counter'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('yellow-square-1', true);
    checkMove('red-square-6', true);
    checkMove('red-square-36', true);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for 2 counters in same row', () => {
    cy.addAndEnterGame(
      `(1,*,*,*,[0,1]) (1,*,*,*,[2,3])`,
      [
        { id: '1', color: Color.RED, x: 3, y: 6, shape: Shape.CIRCLE },
        { id: '2', color: Color.BLUE, x: 5, y: 4, shape: Shape.STAR },
      ],
      undefined,
      false,
    );

    checkMove('1', true, BucketPosition.TR);
    checkMove('2', false, BucketPosition.TR);
    checkMove('2', true, BucketPosition.BR);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for shapes', () => {
    cy.dispatch(enterGame('shape'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('yellow-square-1', true);
    checkMove('red-square-6', true);
    checkMove('red-square-36', false);
    checkMove('blue-circle-31', true);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for colors', () => {
    cy.dispatch(enterGame('color'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('blue-circle-31', false);
    checkMove('red-square-36', false);
    checkMove('yellow-square-1', true);
    checkMove('blue-circle-31', false);
    checkMove('red-square-36', true);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for position', () => {
    cy.dispatch(enterGame('position'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('red-square-36', false);
    checkMove('yellow-square-1', true);
    checkMove('red-square-6', true);
    checkMove('blue-circle-31', true);
    checkMove('red-square-36', true);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('drops for left position', () => {
    cy.addAndEnterGame(
      `(*,*,*,L,*)`,
      [
        { id: '1', color: Color.RED, x: 1, y: 1, shape: Shape.CIRCLE },
        { id: '2', color: Color.BLUE, x: 1, y: 2, shape: Shape.STAR },
        { id: '3', color: Color.BLUE, x: 1, y: 3, shape: Shape.STAR },
        { id: '4', color: Color.BLUE, x: 1, y: 4, shape: Shape.STAR },
        { id: '5', color: Color.BLUE, x: 1, y: 5, shape: Shape.STAR },
        { id: '6', color: Color.BLUE, x: 1, y: 6, shape: Shape.STAR },
        { id: '7', color: Color.BLUE, x: 6, y: 1, shape: Shape.STAR },
        { id: '8', color: Color.BLUE, x: 6, y: 6, shape: Shape.STAR },
      ],
      undefined,
      false,
    );

    checkMove('8', false, BucketPosition.BR);
    checkMove('7', false, BucketPosition.BR);
    checkMove('1', true, BucketPosition.TR);
    checkMove('2', true, BucketPosition.TR);
    checkMove('3', true, BucketPosition.BR);
    checkMove('4', true, BucketPosition.BR);
    checkMove('5', true, BucketPosition.BR);
    checkMove('6', true, BucketPosition.BR);
    checkMove('7', true, BucketPosition.BR);
    checkMove('8', true, BucketPosition.BR);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('drops for right position', () => {
    cy.addAndEnterGame(
      `(*,*,*,R,*)`,
      [
        { id: '1', color: Color.RED, x: 6, y: 1, shape: Shape.CIRCLE },
        { id: '2', color: Color.BLUE, x: 6, y: 2, shape: Shape.STAR },
        { id: '3', color: Color.BLUE, x: 6, y: 3, shape: Shape.STAR },
        { id: '4', color: Color.BLUE, x: 6, y: 4, shape: Shape.STAR },
        { id: '5', color: Color.BLUE, x: 6, y: 5, shape: Shape.STAR },
        { id: '6', color: Color.BLUE, x: 6, y: 6, shape: Shape.STAR },
        { id: '7', color: Color.BLUE, x: 1, y: 1, shape: Shape.STAR },
        { id: '8', color: Color.BLUE, x: 1, y: 6, shape: Shape.STAR },
      ],
      undefined,
      false,
    );

    checkMove('8', false, BucketPosition.BR);
    checkMove('7', false, BucketPosition.BR);
    checkMove('1', true, BucketPosition.TR);
    checkMove('2', true, BucketPosition.TR);
    checkMove('3', true, BucketPosition.BR);
    checkMove('4', true, BucketPosition.BR);
    checkMove('5', true, BucketPosition.BR);
    checkMove('6', true, BucketPosition.BR);
    checkMove('7', true, BucketPosition.BR);
    checkMove('8', true, BucketPosition.BR);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('drops for top position', () => {
    cy.addAndEnterGame(
      `(*,*,*,T,*)`,
      [
        { id: '1', color: Color.RED, x: 1, y: 6, shape: Shape.CIRCLE },
        { id: '2', color: Color.BLUE, x: 2, y: 6, shape: Shape.STAR },
        { id: '3', color: Color.BLUE, x: 3, y: 6, shape: Shape.STAR },
        { id: '4', color: Color.BLUE, x: 4, y: 6, shape: Shape.STAR },
        { id: '5', color: Color.BLUE, x: 5, y: 6, shape: Shape.STAR },
        { id: '6', color: Color.BLUE, x: 6, y: 6, shape: Shape.STAR },
        { id: '7', color: Color.BLUE, x: 6, y: 1, shape: Shape.STAR },
        { id: '8', color: Color.BLUE, x: 1, y: 1, shape: Shape.STAR },
      ],
      undefined,
      false,
    );

    checkMove('8', false, BucketPosition.BR);
    checkMove('7', false, BucketPosition.BR);
    checkMove('1', true, BucketPosition.TR);
    checkMove('2', true, BucketPosition.TR);
    checkMove('3', true, BucketPosition.BR);
    checkMove('4', true, BucketPosition.BR);
    checkMove('5', true, BucketPosition.BR);
    checkMove('6', true, BucketPosition.BR);
    checkMove('7', true, BucketPosition.BR);
    checkMove('8', true, BucketPosition.BR);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('drops for bottom position', () => {
    cy.addAndEnterGame(
      `(*,*,*,B,*)`,
      [
        { id: '1', color: Color.RED, x: 1, y: 1, shape: Shape.CIRCLE },
        { id: '2', color: Color.BLUE, x: 2, y: 1, shape: Shape.STAR },
        { id: '3', color: Color.BLUE, x: 3, y: 1, shape: Shape.STAR },
        { id: '4', color: Color.BLUE, x: 4, y: 1, shape: Shape.STAR },
        { id: '5', color: Color.BLUE, x: 5, y: 1, shape: Shape.STAR },
        { id: '6', color: Color.BLUE, x: 6, y: 1, shape: Shape.STAR },
        { id: '7', color: Color.BLUE, x: 6, y: 6, shape: Shape.STAR },
        { id: '8', color: Color.BLUE, x: 1, y: 6, shape: Shape.STAR },
      ],
      undefined,
      false,
    );

    checkMove('8', false, BucketPosition.BR);
    checkMove('7', false, BucketPosition.BR);
    checkMove('1', true, BucketPosition.TR);
    checkMove('2', true, BucketPosition.TR);
    checkMove('3', true, BucketPosition.BR);
    checkMove('4', true, BucketPosition.BR);
    checkMove('5', true, BucketPosition.BR);
    checkMove('6', true, BucketPosition.BR);
    checkMove('7', true, BucketPosition.BR);
    checkMove('8', true, BucketPosition.BR);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('drops for farthest position', () => {
    cy.addAndEnterGame(
      `(*,*,*,Farthest,*)`,
      [
        {
          color: Color.BLUE,
          id: '0',
          shape: Shape.TRIANGLE,
          x: 4,
          y: 3,
        },
        {
          color: Color.RED,
          id: '1',
          shape: Shape.SQUARE,
          x: 2,
          y: 2,
        },
        {
          color: Color.RED,
          id: '2',
          shape: Shape.SQUARE,
          x: 5,
          y: 6,
        },
        {
          color: Color.RED,
          id: '3',
          shape: Shape.SQUARE,
          x: 1,
          y: 6,
        },
        {
          color: Color.RED,
          id: '4',
          shape: Shape.SQUARE,
          x: 1,
          y: 1,
        },
      ],
      undefined,
      false,
    );

    checkMove('1', false, BucketPosition.BR);
    checkMove('0', true, BucketPosition.BR);
    checkMove('1', true, BucketPosition.BR);
    checkMove('2', true, BucketPosition.TR);
    checkMove('3', true, BucketPosition.TR);
    checkMove('4', true, BucketPosition.BR);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it.only('drops for nearest position', () => {
    cy.addAndEnterGame(
      `(*,*,*,Nearest,*)`,
      [
        {
          color: Color.BLUE,
          id: '0',
          shape: Shape.TRIANGLE,
          x: 4,
          y: 3,
        },
        {
          color: Color.RED,
          id: '1',
          shape: Shape.SQUARE,
          x: 2,
          y: 2,
        },
        {
          color: Color.RED,
          id: '2',
          shape: Shape.SQUARE,
          x: 5,
          y: 6,
        },
        {
          color: Color.RED,
          id: '3',
          shape: Shape.SQUARE,
          x: 1,
          y: 6,
        },
        {
          color: Color.RED,
          id: '4',
          shape: Shape.SQUARE,
          x: 1,
          y: 1,
        },
      ],
      undefined,
      false,
    );

    checkMove('2', false, BucketPosition.BR);
    checkMove('4', true, BucketPosition.BR);
    checkMove('3', true, BucketPosition.TR);
    checkMove('2', true, BucketPosition.TR);
    checkMove('1', true, BucketPosition.BR);
    checkMove('0', true, BucketPosition.BR);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });
});

describe('basic', () => {
  let sagaMiddleware: SagaMiddleware;

  const checkMove = (
    object: string,
    isValid: boolean,
    bucket: BucketPosition = BucketPosition.BL,
  ) => {
    cy.take(move({ dragged: object, dropped: bucket }), sagaMiddleware, move);
    cy.wait(1.25 * FEEDBACK_DURATION);
    cy.get(`${cySelector(cyShapeObject(object))}[data-shape="${Shape.CHECK}"]`).should(
      isValid ? 'be.visible' : 'not.be.visible',
    );
  };

  before(() => {
    cy.visit('/');
    sagaMiddleware = createSagaMiddleware();
    cy.addMiddleware(sagaMiddleware);
    cy.fixture('basics.json').then((s) => {
      cy.take(
        loadGames.request(new File([JSON.stringify(s)], 'temp')),
        sagaMiddleware,
        loadGames.success,
      );
    });
    cy.dispatch(enableDebugMode());
  });

  it('orders from least to greatest', () => {
    const checkOrder = (greaterObject: string, lesserObject: string) => {
      checkMove(lesserObject, false);
      checkMove(greaterObject, true);
      checkMove(lesserObject, true);

      cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
    };

    cy.dispatch(enterGame('jVF1D_0s'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkOrder('1', '2');

    cy.dispatch(enterGame('mlA01o-P'));
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('not.be.visible');

    checkOrder('2', '1');
  });

  it('works for counters', () => {
    cy.dispatch(enterGame('counter'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('yellow-square-1', true);
    checkMove('red-square-6', true);
    checkMove('red-square-36', true);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for shapes', () => {
    cy.dispatch(enterGame('shape'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('yellow-square-1', true);
    checkMove('red-square-6', true);
    checkMove('red-square-36', false);
    checkMove('blue-circle-31', true);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for colors', () => {
    cy.dispatch(enterGame('color'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('blue-circle-31', false);
    checkMove('red-square-36', false);
    checkMove('yellow-square-1', true);
    checkMove('blue-circle-31', false);
    checkMove('red-square-36', true);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for position', () => {
    cy.dispatch(enterGame('position'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('red-square-36', false);
    checkMove('yellow-square-1', true);
    checkMove('red-square-6', true);
    checkMove('blue-circle-31', true);
    checkMove('red-square-36', true);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  // TODO: We will ignore this in the meanwhile because
  // we expect proper rule arrays.
  // This test is to check whether any object can be dropped
  // with a bucket function containing a previous something.
  // This was to enable to use to proceed at least past the first
  // row.
  // it('works for first previous...', () => {
  //   const testGame = (game: string) => {
  //     cy.dispatch(enterGame(game));
  //     cy.get(cySelector(CY_GAME)).should('be.visible');

  //     checkMove('red-square-36', true, BucketPosition.BL);
  //     cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  //   };

  //   testGame('first-previous');
  //   testGame('first-previous-shape');
  //   testGame('first-previous-color');
  //   testGame('first-previous-color-shape');
  // });

  it('works for previous', () => {
    cy.dispatch(enterGame('previous'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('red-square-36', true, BucketPosition.BL);
    checkMove('blue-circle-31', false, BucketPosition.TR);
    checkMove('blue-circle-31', false, BucketPosition.TL);
    checkMove('blue-circle-31', false, BucketPosition.BR);
    checkMove('blue-circle-31', true, BucketPosition.BL);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  // TODO: The following do not work because of logic related to no previous matching not found.
  it('works for previous shape', () => {
    cy.dispatch(enterGame('previous-shape'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('red-square-36', true, BucketPosition.BL);
    checkMove('yellow-square-1', false, BucketPosition.BR);
    checkMove('yellow-square-1', true, BucketPosition.BL);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for previous color', () => {
    cy.dispatch(enterGame('previous-color'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('red-square-36', true, BucketPosition.BL);
    checkMove('red-square-6', false, BucketPosition.BR);
    checkMove('red-square-6', true, BucketPosition.BL);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for previous color shape', () => {
    cy.dispatch(enterGame('previous-color-shape'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('red-square-36', true, BucketPosition.BL);
    checkMove('red-square-6', false, BucketPosition.BR);
    checkMove('red-square-6', true, BucketPosition.BL);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for simple bucket function arithmetic', () => {
    cy.dispatch(enterGame('clockwise'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('red-square-36', true, BucketPosition.TL);
    checkMove('yellow-square-1', false, BucketPosition.TL);
    checkMove('yellow-square-1', true, BucketPosition.TR);
    checkMove('red-square-6', true, BucketPosition.BR);
    checkMove('blue-circle-31', true, BucketPosition.BL);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for nearest', () => {
    cy.addAndEnterGame(
      `(*,*,*,*,[Nearby])`,
      [
        { id: '1', color: Color.RED, x: 3, y: 3, shape: Shape.CIRCLE },
        { id: '2', color: Color.BLUE, x: 3, y: 4, shape: Shape.STAR },
        { id: '3', color: Color.BLUE, x: 4, y: 3, shape: Shape.STAR },
        { id: '4', color: Color.BLUE, x: 4, y: 4, shape: Shape.STAR },
      ],
      undefined,
      false,
    );

    checkMove('1', false, BucketPosition.TL);
    checkMove('1', false, BucketPosition.TR);
    checkMove('1', false, BucketPosition.BR);
    checkMove('1', true, BucketPosition.BL);

    checkMove('2', false, BucketPosition.BR);
    checkMove('2', false, BucketPosition.BL);
    checkMove('2', false, BucketPosition.TR);
    checkMove('2', true, BucketPosition.TL);

    checkMove('3', false, BucketPosition.BL);
    checkMove('3', false, BucketPosition.TL);
    checkMove('3', false, BucketPosition.TR);
    checkMove('3', true, BucketPosition.BR);

    checkMove('4', false, BucketPosition.BL);
    checkMove('4', false, BucketPosition.TL);
    checkMove('4', false, BucketPosition.BR);
    checkMove('4', true, BucketPosition.TR);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for remotest', () => {
    cy.addAndEnterGame(
      `(*,*,*,*,[Remotest])`,
      [
        { id: '1', color: Color.RED, x: 3, y: 3, shape: Shape.CIRCLE },
        { id: '2', color: Color.BLUE, x: 3, y: 4, shape: Shape.STAR },
        { id: '3', color: Color.BLUE, x: 4, y: 3, shape: Shape.STAR },
        { id: '4', color: Color.BLUE, x: 4, y: 4, shape: Shape.STAR },
      ],
      undefined,
      false,
    );

    checkMove('1', false, BucketPosition.TL);
    checkMove('1', false, BucketPosition.BL);
    checkMove('1', false, BucketPosition.BR);
    checkMove('1', true, BucketPosition.TR);

    checkMove('2', false, BucketPosition.TL);
    checkMove('2', false, BucketPosition.BL);
    checkMove('2', false, BucketPosition.TR);
    checkMove('2', true, BucketPosition.BR);

    checkMove('3', false, BucketPosition.BL);
    checkMove('3', false, BucketPosition.BR);
    checkMove('3', false, BucketPosition.TR);
    checkMove('3', true, BucketPosition.TL);

    checkMove('4', false, BucketPosition.TR);
    checkMove('4', false, BucketPosition.TL);
    checkMove('4', false, BucketPosition.BR);
    checkMove('4', true, BucketPosition.BL);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });
});

describe('Guess Prompt', () => {
  before(() => {
    cy.visit('/');
    cy.dispatch(enableDebugMode());
  });

  const makeMove = (object: string, bucket: BucketPosition = BucketPosition.BL) => {
    const sagaMiddleware = createSagaMiddleware();
    cy.addMiddleware(sagaMiddleware);
    cy.take(move({ dragged: object, dropped: bucket }), sagaMiddleware, move);
    cy.wait(1.25 * FEEDBACK_DURATION);
    cy.removeMiddleware(sagaMiddleware);
  };

  it('shows guess prompt after 1 move', () => {
    cy.addAndEnterGame(
      '(*,*,*,*,*)',
      [
        { id: '1', color: Color.BLACK, x: 1, y: 1, shape: Shape.SQUARE },
        { id: '2', color: Color.BLACK, x: 2, y: 1, shape: Shape.SQUARE },
      ],
      1,
    );
    makeMove('1');
    cy.get(cySelector(CyLayer.GUESS_PROMPT)).should('be.visible');

    cy.get(cySelector(CyLayer.GUESS_PROMPT))
      .contains('Continue Playing')
      .click();
  });

  it('shows guess prompt after 2 moves', () => {
    cy.addAndEnterGame(
      '(*,*,*,*,*)',
      [
        { id: '1', color: Color.BLACK, x: 1, y: 1, shape: Shape.SQUARE },
        { id: '2', color: Color.BLACK, x: 2, y: 1, shape: Shape.SQUARE },
      ],
      2,
    );
    makeMove('1');
    cy.get(cySelector(CyLayer.GUESS_PROMPT)).should('not.be.visible');
    makeMove('2');
    cy.get(cySelector(CyLayer.GUESS_PROMPT)).should('be.visible');

    cy.get(cySelector(CyLayer.GUESS_PROMPT))
      .contains('Continue Playing')
      .click();
  });

  it('does not show guess prompt if not provided', () => {
    cy.addAndEnterGame(
      '(*,*,*,*,*)',
      [
        { id: '1', color: Color.BLACK, x: 1, y: 1, shape: Shape.SQUARE },
        { id: '2', color: Color.BLACK, x: 2, y: 1, shape: Shape.SQUARE },
        { id: '3', color: Color.BLACK, x: 3, y: 1, shape: Shape.SQUARE },
      ],
      undefined,
    );
    makeMove('1');
    cy.get(cySelector(CyLayer.GUESS_PROMPT)).should('not.be.visible');
    makeMove('2');
    cy.get(cySelector(CyLayer.GUESS_PROMPT)).should('not.be.visible');
    makeMove('3');
    cy.get(cySelector(CyLayer.GUESS_PROMPT)).should('not.be.visible');
  });
});

describe('history', () => {
  before(() => {
    cy.visit('/');
    cy.dispatch(enableDebugMode());
  });

  const checkMove = (
    object: string,
    isValid: boolean,
    bucket: BucketPosition = BucketPosition.BL,
  ) => {
    const sagaMiddleware = createSagaMiddleware();
    cy.addMiddleware(sagaMiddleware);
    cy.take(move({ dragged: object, dropped: bucket }), sagaMiddleware, move);
    cy.wait(1.25 * FEEDBACK_DURATION);
    cy.get(`${cySelector(cyShapeObject(object))}[data-shape="${Shape.CHECK}"]`).should(
      isValid ? 'be.visible' : 'not.be.visible',
    );
    cy.wait(1.25 * FEEDBACK_DURATION);
    cy.removeMiddleware(sagaMiddleware);
  };

  it('does not allow any bucket to be dropped into if no buckets functions return valid bucket in history', () => {
    cy.addAndEnterGame('(*,*,*,*,[pcs])', [
      { id: '1', color: Color.BLACK, x: 1, y: 1, shape: Shape.SQUARE },
      { id: '2', color: Color.BLUE, x: 2, y: 1, shape: Shape.STAR },
      { id: '3', color: Color.RED, x: 3, y: 1, shape: Shape.CIRCLE },
    ]);

    checkMove('1', false, BucketPosition.BL);
    checkMove('2', false, BucketPosition.BR);
    checkMove('3', false, BucketPosition.TL);
  });
});

describe('restart', () => {
  before(() => {
    cy.visit('/');
    cy.dispatch(enableDebugMode());
  });

  const checkMove = (
    object: string,
    isValid: boolean = true,
    bucket: BucketPosition = BucketPosition.BL,
  ) => {
    const sagaMiddleware = createSagaMiddleware();
    cy.addMiddleware(sagaMiddleware);
    cy.take(move({ dragged: object, dropped: bucket }), sagaMiddleware, move);
    cy.wait(1.25 * FEEDBACK_DURATION);
    cy.get(`${cySelector(cyShapeObject(object))}[data-shape="${Shape.CHECK}"]`).should(
      isValid ? 'be.visible' : 'not.be.visible',
    );
    cy.wait(1.25 * FEEDBACK_DURATION);
    cy.removeMiddleware(sagaMiddleware);
  };

  it('restarts', () => {
    cy.addAndEnterGame(
      '(1,*,*,*,*)',
      [
        { id: '1', color: Color.BLACK, x: 1, y: 1, shape: Shape.SQUARE },
        { id: '2', color: Color.BLUE, x: 2, y: 1, shape: Shape.STAR },
        { id: '3', color: Color.RED, x: 3, y: 1, shape: Shape.CIRCLE },
      ],
      undefined,
      true,
    );

    checkMove('1');
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('not.be.visible');
    checkMove('2');
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('not.be.visible');
    checkMove('3');
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('restarts advanced', () => {
    cy.addAndEnterGame(
      `(1,*,green,*,[0])
(1,*,red,*,[1])
(1,*,black,*,[2])
(1,*,yellow,*,[3])`,
      [
        { id: '1', color: Color.BLACK, x: 2, y: 6, shape: Shape.STAR },
        { id: '2', color: Color.RED, x: 5, y: 6, shape: Shape.CIRCLE },
        { id: '3', color: Color.BLACK, x: 5, y: 5, shape: Shape.STAR },
        { id: '4', color: Color.RED, x: 1, y: 3, shape: Shape.CIRCLE },
        { id: '5', color: Color.BLACK, x: 2, y: 4, shape: Shape.SQUARE },
        { id: '6', color: Color.BLACK, x: 3, y: 4, shape: Shape.STAR },
        { id: '7', color: Color.YELLOW, x: 4, y: 4, shape: Shape.STAR },
        { id: '8', color: Color.YELLOW, x: 4, y: 2, shape: Shape.STAR },
        { id: '9', color: Color.RED, x: 6, y: 3, shape: Shape.STAR },
        { id: '10', color: Color.BLACK, x: 6, y: 1, shape: Shape.SQUARE },
        { id: '11', color: Color.BLACK, x: 5, y: 4, shape: Shape.TRIANGLE },
      ],
      undefined,
      true,
    );

    checkMove('2', true, BucketPosition.TR);
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('not.be.visible');
    checkMove('1', true, BucketPosition.BR);
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('not.be.visible');
    checkMove('8', true, BucketPosition.BL);
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('not.be.visible');
  });

  it('restarts simple', () => {
    cy.addAndEnterGame(
      `(1,*,red,*,[0])
(1,*,blue,*,[1])
(1,*,black,*,[2])
(1,*,yellow,*,[3])`,
      [
        { id: '1', color: Color.RED, x: 6, y: 1, shape: Shape.TRIANGLE },
        { id: '2', color: Color.BLUE, x: 1, y: 4, shape: Shape.SQUARE },
        { id: '3', color: Color.BLACK, x: 5, y: 6, shape: Shape.SQUARE },
        { id: '4', color: Color.RED, x: 6, y: 6, shape: Shape.TRIANGLE },
        { id: '5', color: Color.BLACK, x: 2, y: 3, shape: Shape.SQUARE },
      ],
      undefined,
      true,
    );

    checkMove('1', true, BucketPosition.TL);
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('not.be.visible');
    checkMove('2', true, BucketPosition.TR);
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('not.be.visible');
    checkMove('3', true, BucketPosition.BR);
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('not.be.visible');
    checkMove('4', true, BucketPosition.TL);
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('not.be.visible');
    checkMove('5', true, BucketPosition.BR);
    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });
});
