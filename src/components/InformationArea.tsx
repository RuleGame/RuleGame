import { Box, Button, Form, Text, TextArea } from 'grommet';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SpecialShape } from '../constants';
import { pause, skipGuess, submitDetails } from '../store/actions/board';
import {
  boardSelector, //-- This one can replace the rest... --VM 2024-09-28
  displaySeriesNoSelector,
  facesSelector,
  factorPromisedSelector,
  finishCodeSelector,
  incentiveSelector,
  isSecondOrMoreTimeDoublingSelector,
  lastDoublingStreakCountSelector,
  lastStretchSelector,
  lastRSelector,
  lostStreakSelector,
  numFacesSelector,
  numGoodMovesInARowSelector,
  numGoodMovesMadeSelector,
  x2AfterSelector,
  x4AfterSelector,
  justReachedX2Selector,
  justReachedX4Selector,
  x2LikelihoodSelector,
  x4LikelihoodSelector,
} from '../store/selectors/board';
import { FinishCode, Incentive } from '../utils/api';
import ShapeObject from './ShapeObject';

const MG = 7;

function golden(): number {
  const lastR = useSelector(lastRSelector);
  const x2Likelihood = useSelector(x2LikelihoodSelector);
  const x4Likelihood = useSelector(x4LikelihoodSelector);
  let g =
    lastR && x2Likelihood && x4Likelihood
      ? lastR <= 1
        ? 0
        : lastR <= x2Likelihood
        ? (MG * Math.log(lastR)) / Math.log(x2Likelihood)
        : MG + (MG * Math.log(lastR / x2Likelihood)) / Math.log(x4Likelihood / x2Likelihood)
      : 0;
  //  g = 0.1 * Math.floor(g*10);
  return g;
}

const InformationArea: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const board = useSelector(boardSelector); //-- everything else is in this structure --VM 2024-09-28
  const numGoodMoves = useSelector(numGoodMovesMadeSelector);
  const numFaces = useSelector(numFacesSelector);
  const goodBadMoves = useSelector(facesSelector)!;
  const lastStretch = useSelector(lastStretchSelector);
  const lastR = useSelector(lastRSelector);
  const x4After = useSelector(x4AfterSelector)!;
  const factorPromised: number = useSelector(factorPromisedSelector) ?? 1;
  const [idea, setIdea] = useState('');
  const [how, setHow] = useState('');
  const numGoodMovesInARow = useSelector(numGoodMovesInARowSelector);
  const lostStreak = useSelector(lostStreakSelector);
  const isSecondOrMoreTimeDoubling = useSelector(isSecondOrMoreTimeDoublingSelector);
  const lastDoublingStreakCount = useSelector(lastDoublingStreakCountSelector);
  const x2After = useSelector(x2AfterSelector);
  const x2Likelihood = useSelector(x2LikelihoodSelector);
  const x4Likelihood = useSelector(x4LikelihoodSelector);
  const justReachedX2 = useSelector(justReachedX2Selector);
  const justReachedX4 = useSelector(justReachedX4Selector);
  const lastFaceRef = useRef<HTMLDivElement | null>(null);
  const finishCode = useSelector(finishCodeSelector);
  const isAchieved = finishCode === FinishCode.EARLY_WIN || factorPromised === 4;

  const displaySeriesNo = useSelector(displaySeriesNoSelector);
  const incentive = useSelector(incentiveSelector);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current && justReachedX4) {
      const container = containerRef.current;
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 300);
    }
  }, [justReachedX4]);

  useEffect(() => {
    lastFaceRef.current?.scrollIntoView();
  }, [goodBadMoves]);

  useEffect(() => {
    if (isAchieved) {
      // Disallow the player to continue for the server to auto complete the board.
      dispatch(pause());
      setIdea('');
      setHow('');
    }
  }, [dispatch, factorPromised, finishCode, isAchieved]);

  //-- current "factor achieved" (based on both previous and current episode)
  const cfa: number = Math.max(factorPromised, board.factorAchieved ?? 1);

  return (
    <Box background="steelblue" pad="medium" fill="vertical" border={{ color: 'black' }}>
      <Box
        background="darkseagreen"
        pad="xxsmall"
        border={{ color: 'black' }}
        style={{ flex: justReachedX4 ? 0.4 : 0.6, transition: 'flex 0.2s ease-in-out' }}
      >
        <Box margin={{ bottom: 'medium' }}>
          {
            //<Box margin={{ bottom: 'medium' }}>
            //<Text weight="bold">
            //  <Text style={{ fontStyle: 'italic' }}>{numGoodMoves}</Text> good of{' '}
            //  <Text style={{ fontStyle: 'italic' }}>{numFaces}</Text>
            //</Text>
            //</Box>
          }
          <Box margin={{ bottom: 'medium' }}>
            {incentive === Incentive.LIKELIHOOD ? (
              <Text>
                Golden string={Number(golden()).toFixed(1)}.
                {cfa === 4 ? (
                  ''
                ) : cfa === 2 ? (
                  <Text> To double your score again, reach {2 * MG}</Text>
                ) : (
                  <Text> To double your score, reach {MG}</Text>
                )}
              </Text>
            ) : (
              <Text>
                Good in a row:{' '}
                <Text weight="bold" style={{ fontStyle: 'italic' }}>
                  {lastStretch}
                </Text>
              </Text>
            )}
          </Box>
        </Box>
        <Box direction="row" wrap overflow="auto" ref={containerRef}>
          {/* was Box width="xxsmall" */}
          {goodBadMoves.map((move, index) => (
            <Box
              width="2em"
              ref={index === goodBadMoves.length - 1 ? lastFaceRef : null}
              key={
                // There's no id but only the series and index to go off from.
                // eslint-disable-next-line react/no-array-index-key
                `${displaySeriesNo}-${index}`
              }
            >
              {move ? (
                <ShapeObject shape={SpecialShape.HAPPY} />
              ) : (
                <Box background="red" round="large">
                  <ShapeObject shape={SpecialShape.UNHAPPY} />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        background="beige"
        pad="xxsmall"
        border={{ color: 'black' }}
        style={{ flex: justReachedX4 ? 0.6 : 0.4, transition: 'flex 0.2s ease-in-out' }}
      >
        {incentive === Incentive.LIKELIHOOD ? (
          justReachedX4 ? (
            <Text>
              Your play is a million times better than chance. This has re-doubled your score.
              Please tell us what the rule is, and how you found it.
            </Text>
          ) : justReachedX2 ? (
            <Text>
              Your golden string has doubled your score! Extend it to double again. Be careful.
            </Text>
          ) : cfa > 1 && lastR === 0 ? (
            <Text>Your golden string must start over. No points are lost.</Text>
          ) : numFaces == 0 ? (
            <Text>Welcome!</Text>
          ) : lastR > 1 && cfa <= 1 ? (
            <Text>You are making progress!</Text>
          ) : lastR > 1 && cfa > 1 ? (
            <Text>You are making more progress!</Text>
          ) : (
            <Text>Please keep trying...</Text>
          )
        ) : //----   DOUBLING
        factorPromised === 4 ? (
          <Text>
            Your {numGoodMovesInARow} good moves in a row has <Text weight="bold">re-doubled</Text>{' '}
            your score. Tell us below how you did it.
          </Text>
        ) : isSecondOrMoreTimeDoubling ? (
          <Text>
            Great. You did make <Text weight="bold">{lastDoublingStreakCount}</Text> good moves in a
            row before. Now that you&apos;ve got <Text weight="bold">{numGoodMovesInARow}</Text> in
            a row again, see if you can extend it to <Text weight="bold">{x4After}</Text> this time.
          </Text>
        ) : lostStreak ? (
          <Text>Too bad... please keep trying!</Text>
        ) : x2After !== undefined && numGoodMovesInARow >= x2After ? (
          // eslint-disable-next-line react/jsx-indent
          <Text>
            Your {numGoodMovesInARow} good moves in a row has <Text weight="bold">doubled</Text>{' '}
            your score. Now add <Text weight="bold">{x4After - lastStretch} more</Text> good moves
            to <Text weight="bold">double it again</Text>.
          </Text>
        ) : numFaces == 0 ? (
          <Text>Welcome!</Text>
        ) : (
          <Text>Please keep trying...</Text>
        )}
        {isAchieved && (
          <Box margin={{ top: 'small' }} overflow="auto">
            <Form
              onSubmit={() => {
                dispatch(submitDetails(idea, how));
              }}
            >
              <TextArea
                placeholder="Explain your idea here"
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
              />
              <TextArea
                placeholder="How did you figure it out?"
                value={how}
                onChange={(event) => setHow(event.target.value)}
              />
              <Button type="submit" label="Submit" primary />
            </Form>
          </Box>
        )}
        {finishCode === FinishCode.FINISH && !isAchieved && (
          <Button label="Next" primary onClick={() => dispatch(skipGuess())} />
        )}
      </Box>
    </Box>
  );
};

export default InformationArea;
