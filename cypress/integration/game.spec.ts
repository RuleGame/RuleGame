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

  const checkMove = (object: string, isValid: boolean = true) => {
    cy.take(move({ dragged: object, dropped: BucketPosition.BL }), sagaMiddleware, move);
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
    checkMove('blue-circle-31', false, BucketPosition.BL);
    checkMove('yellow-square-1', true, BucketPosition.BL);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for previous color', () => {
    cy.dispatch(enterGame('previous-color'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('red-square-36', true, BucketPosition.BL);
    checkMove('yellow-square-1', false, BucketPosition.BL);
    checkMove('red-square-6', true, BucketPosition.BL);

    cy.get(cySelector(CY_NO_MORE_MOVES)).should('be.visible');
  });

  it('works for previous color shape', () => {
    cy.dispatch(enterGame('previous-color-shape'));
    cy.get(cySelector(CY_GAME)).should('be.visible');

    checkMove('red-square-36', true, BucketPosition.BL);
    checkMove('yellow-square-1', false, BucketPosition.BL);
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
});

describe.only('Guess Prompt', () => {
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
      .contains('close')
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
      .contains('close')
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
