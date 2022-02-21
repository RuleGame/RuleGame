import { Box, Button, Form, Text, TextArea } from 'grommet';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SpecialShape } from '../constants';
import { submitDetails } from '../store/actions/board';
import {
  facesSelector,
  factorPromisedSelector,
  isSecondOrMoreTimeDoublingSelector,
  lastDoublingStreakCountSelector,
  lastStretchSelector,
  lostStreakSelector,
  numGoodMovesInARowSelector,
  numGoodMovesMadeSelector,
  numMovesMadeSelector,
  seriesNoSelector,
  x2AfterSelector,
  x4AfterSelector,
} from '../store/selectors/board';
import ShapeObject from './ShapeObject';

const InformationArea: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const numGoodMoves = useSelector(numGoodMovesMadeSelector);
  const numMoves = useSelector(numMovesMadeSelector);
  const goodBadMoves = useSelector(facesSelector)!;
  const lastStretch = useSelector(lastStretchSelector);
  const x4After = useSelector(x4AfterSelector)!;
  const factorPromised = useSelector(factorPromisedSelector);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [idea, setIdea] = useState('');
  const [how, setHow] = useState('');
  const numGoodMovesInARow = useSelector(numGoodMovesInARowSelector);
  const lostStreak = useSelector(lostStreakSelector);
  const isSecondOrMoreTimeDoubling = useSelector(isSecondOrMoreTimeDoublingSelector);
  const lastDoublingStreakCount = useSelector(lastDoublingStreakCountSelector);
  const x2After = useSelector(x2AfterSelector);
  const lastFaceRef = useRef<HTMLDivElement | null>(null);
  const seriesNo = useSelector(seriesNoSelector);
  useEffect(() => {
    lastFaceRef.current?.scrollIntoView();
  }, [goodBadMoves]);

  useEffect(() => {
    if (factorPromised === 4) {
      setShowDetailsForm(true);

      // TODO: Temporarily allow the player to clear the board after the factorPromised is at 4.
      // Eventually, disallow it to continue once the API can auto complete the board.
      // dispatch(pause());
    }
  }, [dispatch, factorPromised]);

  return (
    <Box background="steelblue" pad="medium" fill="vertical" border={{ color: 'black' }}>
      <Box background="darkseagreen" pad="xxsmall" border={{ color: 'black' }} style={{ flex: 1 }}>
        <Box margin={{ bottom: 'medium' }}>
          <Box margin={{ bottom: 'medium' }}>
            <Text weight="bold">
              <Text style={{ fontStyle: 'italic' }}>{numGoodMoves}</Text> good of{' '}
              <Text style={{ fontStyle: 'italic' }}>{numMoves}</Text>
            </Text>
          </Box>
          <Box margin={{ bottom: 'medium' }}>
            <Text>
              Good in a row:{' '}
              <Text weight="bold" style={{ fontStyle: 'italic' }}>
                {lastStretch}
              </Text>
            </Text>
          </Box>
        </Box>
        <Box direction="row" wrap overflow="auto">
          {goodBadMoves.map((move, index) => (
            <Box
              width="xxsmall"
              ref={index === goodBadMoves.length - 1 ? lastFaceRef : null}
              key={
                // There's no id but only the series and index to go off from.
                // eslint-disable-next-line react/no-array-index-key
                `${seriesNo}-${index}`
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
      <Box background="beige" pad="xxsmall" border={{ color: 'black' }} style={{ flex: 1 }}>
        {factorPromised === 4 ? (
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
        ) : (
          ''
        )}
        {showDetailsForm && (
          <Box margin={{ top: 'medium' }}>
            <Form
              onSubmit={() => {
                dispatch(submitDetails());
              }}
            >
              <TextArea
                placeholder="Explain your idea here"
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
              />
              <TextArea
                placeholder="(Optional) How did you figure it out?"
                value={how}
                onChange={(event) => setHow(event.target.value)}
              />
              <Button type="submit" label="Submit" primary />
            </Form>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InformationArea;
