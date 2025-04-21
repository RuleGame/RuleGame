import { Box, Button, Form, Text, TextInput, TextArea, Tabs, Tab, Grommet } from 'grommet';
import React, { useEffect, useRef, useState } from 'react';
import { Previous, Next } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { SpecialShape } from '../constants';
import { pause, skipGuess, submitDetails } from '../store/actions/board';
import { addMessage, removeAllMessages } from '../store/actions/message';
import {
  boardSelector,
  displaySeriesNoSelector,
  facesSelector,
  factorPromisedSelector,
  factorAchievedSelector,
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
  myFacesSelector,
  is2PGAdveGameSelector,
  is2PGCoopGameSelector,
  episodeIdSelector,
  workerIdSelector,
} from '../store/selectors/board';
import { socketSelector } from '../store/selectors/socket';
import { messageSelector } from '../store/selectors/message';
import { FinishCode, Incentive } from '../utils/api';
import ShapeObject from './ShapeObject';
import html2canvas from 'html2canvas';
import { WebSocketService } from '../middleware/socket';
import { Send } from 'grommet-icons';
import { dispatch } from 'rxjs/internal/observable/pairs';
import { add } from 'lodash';

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
  return g;
}

// New Chat component
const ChatArea: React.FC = () => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isCurrentGameCoop = useSelector(is2PGCoopGameSelector);
  const socket = useSelector(socketSelector);
  const dispatch = useDispatch();
  const messageList = useSelector(messageSelector);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const handleKeyPress = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send('CHAT ' + messageInput);
      dispatch(addMessage('ME', messageInput));
      setMessageInput('');
    } else {
      console.warn('Socket is not connected');
    }
  };

  if (!isCurrentGameCoop) {
    return (
      <Box fill align="center" justify="center">
        <Text>Chat is only available in cooperative games.</Text>
      </Box>
    );
  }

  return (
    <Box fill direction="column">
      <Box
        flex
        overflow="auto"
        pad="small"
        background="light-2"
        style={{ maxHeight: 'calc(100% - 60px)' }}
      >
        {messageList.map((msg, index) => (
          <Text key={index} margin={{ bottom: 'xsmall' }}>
            {msg.who}: {msg.text}
          </Text>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box
        direction="row"
        align="center"
        pad="small"
        gap="small"
        border={{ side: 'top', color: 'light-4' }}
      >
        <TextInput
          placeholder="Type a message..."
          value={messageInput}
          onChange={(event) => setMessageInput(event.target.value)}
          style={{ flex: 1 }}
        />
        <Button icon={<Send />} onClick={handleKeyPress} primary disabled={!messageInput.trim()} />
      </Box>
    </Box>
  );
};

const HistoryArea: React.FC = () => {
  const finishCode = useSelector(finishCodeSelector);
  const episodeId = useSelector(episodeIdSelector);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const displaySerriesNo = useSelector(displaySeriesNoSelector);
  const workerId = useSelector(workerIdSelector);
  const id = displaySerriesNo + '-' + workerId;

  // Function to get current episode screenshots directly from localStorage
  const getCurrentEpisodeScreenshots = (): string[] => {
    const screenshotsData = localStorage.getItem('SCREENSHOTS');
    if (screenshotsData) {
      try {
        const parsedData = JSON.parse(screenshotsData);
        return parsedData[id] || [];
      } catch (e) {
        console.error('Error parsing screenshots from localStorage:', e);
        return [];
      }
    }
    return [];
  };

  // Get current episode screenshots for rendering
  const currentEpisodeScreenshots = getCurrentEpisodeScreenshots();
  console.log('length', currentEpisodeScreenshots.length);
  const hasScreenshots = currentEpisodeScreenshots.length > 0;
  // Navigation handlers
  const goToPrevious = () => {
    setCurrentScreenshotIndex((prev) =>
      prev > 0 ? prev - 1 : currentEpisodeScreenshots.length - 1,
    );
  };

  const goToNext = () => {
    setCurrentScreenshotIndex((prev) =>
      prev < currentEpisodeScreenshots.length - 1 ? prev + 1 : 0,
    );
  };

  return (
    <Box fill direction="column" overflow="hidden" height="100%">
      {!hasScreenshots ? (
        <Box align="center" justify="center" fill>
          <Text>No game history for current episode. Completed games will appear here.</Text>
        </Box>
      ) : (
        <Box
          border={{ color: 'brand', size: 'small' }}
          round="small"
          overflow="hidden"
          margin={{ bottom: 'xsmall' }}
          elevation="small"
          fill
          pad="small"
        >
          {/* Container that fills its parent */}
          <Box fill style={{ position: 'relative', maxHeight: '100%' }}>
            {/* Image container */}
            <Box fill pad="xsmall" align="center" justify="center">
              <Box fill align="center" justify="center" overflow="hidden">
                {currentEpisodeScreenshots.length > 0 && (
                  <img
                    src={currentEpisodeScreenshots[currentScreenshotIndex]}
                    alt={`Episode ${id} screenshot ${currentScreenshotIndex + 1}`}
                    style={{
                      width: '80%',
                      height: '80%',
                      objectFit: 'contain', // use "contain" if you want the whole image visible without cropping
                      display: 'block',
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Navigation buttons (only show if more than one screenshot) */}
            {currentEpisodeScreenshots.length > 1 && (
              <Box
                direction="row"
                justify="between"
                align="center"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  right: 0,
                  transform: 'translateY(-50%)',
                }}
                pad={{ horizontal: 'small' }}
              >
                <Button
                  icon={<Previous size="medium" />}
                  onClick={goToPrevious}
                  plain
                  hoverIndicator
                  a11yTitle="Previous screenshot"
                />
                <Button
                  icon={<Next size="medium" />}
                  onClick={goToNext}
                  plain
                  hoverIndicator
                  a11yTitle="Next screenshot"
                />
              </Box>
            )}
          </Box>

          {/* Pagination dots */}
          {currentEpisodeScreenshots.length > 1 && (
            <Box direction="row" justify="center" pad={{ vertical: 'xsmall' }} gap="xsmall">
              {currentEpisodeScreenshots.map((_, index) => (
                <Box
                  key={index}
                  background={index === currentScreenshotIndex ? 'brand' : 'light-4'}
                  width="8px"
                  height="8px"
                  round="full"
                  onClick={() => setCurrentScreenshotIndex(index)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

const InformationArea: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const board = useSelector(boardSelector); //-- everything else is in this structure --VM 2024-09-28
  const numGoodMoves = useSelector(numGoodMovesMadeSelector);
  const numFaces = useSelector(numFacesSelector);
  const goodBadMoves = useSelector(facesSelector)!;
  const myfaces = useSelector(myFacesSelector) ?? [];
  const is2PGCoopGame = useSelector(is2PGCoopGameSelector);
  const is2PGAdveGame = useSelector(is2PGAdveGameSelector);
  const lastStretch = useSelector(lastStretchSelector);
  const lastR = useSelector(lastRSelector);
  const x4After = useSelector(x4AfterSelector)!;
  const factorPromised: number = useSelector(factorPromisedSelector) ?? 1;
  const factorAchieved: number = useSelector(factorAchievedSelector) ?? 1;
  const [idea, setIdea] = useState<string>('');
  const [how, setHow] = useState<string>('');
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
  const isAchieved = finishCode === FinishCode.EARLY_WIN && factorAchieved === 4;
  const iLost = finishCode === FinishCode.EARLY_WIN && factorAchieved < 4;

  const displaySeriesNo = useSelector(displaySeriesNoSelector);
  const incentive = useSelector(incentiveSelector);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const firstRender = useRef(true);

  // State for active tab
  const [activeTab, setActiveTab] = useState<number>(0);
  const displaySerriesNo = useSelector(displaySeriesNoSelector);
  const workerId = useSelector(workerIdSelector);
  const id = displaySerriesNo + '-' + workerId;
  const isCurrentGameCoop = useSelector(is2PGCoopGameSelector);
  const socket = useSelector(socketSelector);

  useEffect(() => {
    const screenshotsData = localStorage.getItem('SCREENSHOTS');
    // dispatch(removeAllMessages());
    if (screenshotsData) {
      try {
        const prevSeries = displaySerriesNo - 1;
        const idOld = prevSeries + '-' + workerId;
        const parsedData = JSON.parse(screenshotsData);
        if (parsedData.hasOwnProperty(idOld)) {
          delete parsedData[idOld];
          localStorage.setItem('SCREENSHOTS', JSON.stringify(parsedData));
        } else {
          console.log('No old ss');
        }
      } catch (e) {
        console.error('Error parsing screenshots from localStorage:', e);
      }
    }
  }, [displaySeriesNo]);

  useEffect(() => {
    if (isCurrentGameCoop && socket) {
      socket.onmessage = (event: MessageEvent) => {
        console.log('Received message:');
        const parts = event.data.split(' ');

        if (parts[0] === 'CHAT') {
          const messageText = parts.slice(1).join(' ');

          dispatch(addMessage('TEAMMATE', messageText));
        }
      };
    }
  }, [isCurrentGameCoop, socket]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    console.log('finishCode:', finishCode);
    if (finishCode === FinishCode.FINISH || finishCode === FinishCode.EARLY_WIN) {
      const rightSideElement = document.querySelector('[data-cy="game"]');

      if (rightSideElement) {
        setTimeout(() => {
          html2canvas(rightSideElement as HTMLElement).then((canvas) => {
            const screenshotUrl = canvas.toDataURL('image/png');

            // Get existing screenshots dictionary from localStorage
            const existingData = localStorage.getItem('SCREENSHOTS');
            let screenshotsDict: { [id: string]: string[] } = {};

            if (existingData) {
              const parsedData = JSON.parse(existingData);
              if (parsedData.hasOwnProperty(id)) {
                console.log('found existing screenshots data for current episode in localStorage');
                parsedData[id].push(screenshotUrl);
              } else {
                console.log(
                  'No existing screenshots data found for current episode in localStorage',
                );
                parsedData[id] = [screenshotUrl];
              }
              localStorage.setItem('SCREENSHOTS', JSON.stringify(parsedData));
            } else {
              console.log('No existing screenshots data found in localStorage');
              screenshotsDict[id] = [screenshotUrl];
              localStorage.setItem('SCREENSHOTS', JSON.stringify(screenshotsDict));
            }
          });
        }, 1);
      }
    }
  }, [finishCode]);

  useEffect(() => {
    if (finishCode === FinishCode.FINISH || finishCode === FinishCode.EARLY_WIN) {
      setActiveTab(0);
    }
  }, [finishCode]);

  useEffect(() => {
    if (containerRef.current && isAchieved) {
      const container = containerRef.current;
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 300);
    }
  }, [isAchieved]);

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
  // remove undrline from tabs

  return (
    <Box
      background="steelblue"
      pad="small"
      fill="vertical"
      border={{ color: 'black' }}
      height="100%"
    >
      <Box style={{ height: '32px', alignItems: 'center' }}>
        <Box margin={{ bottom: '3px' }}>
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
      <Tabs activeIndex={activeTab} onActive={(index: number) => setActiveTab(index)} flex="grow">
        <Tab
          plain={true}
          title={
            <span
              style={{
                color: activeTab === 0 ? 'black' : 'white',
                padding: '10px 20px',
                display: 'inline-block',
              }}
            >
              Info
            </span>
          }
        >
          <Box fill={true} direction="column" overflow="hidden" height="100%">
            <Box
              background="darkseagreen"
              pad="xxsmall"
              border={{ color: 'black' }}
              style={{
                flex: justReachedX4 ? '0 0 auto' : '0 0 80%',
                height:
                  justReachedX4 && containerRef.current
                    ? (() => {
                        const containerWidth = containerRef.current.clientWidth;
                        const moveWidth = 32; // 2em in pixels
                        const movesPerRow = Math.floor(containerWidth / moveWidth);
                        const totalMoves = goodBadMoves.length;
                        // x is the number of rows/scrolls
                        const x = totalMoves % movesPerRow;

                        if (movesPerRow < 10) {
                          const y = Math.ceil(10 / movesPerRow);
                          return `${y * moveWidth + 32}px`;
                        } else if (movesPerRow === 10) {
                          return `64px`;
                        } else {
                          // movesPerRow > 10
                          return `64px`;
                        }
                      })()
                    : 'auto',
                overflow: 'auto',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Box direction="row" wrap overflow="auto" ref={containerRef}>
                {goodBadMoves.map((move, index) => (
                  <Box
                    width="2em"
                    ref={index === goodBadMoves.length - 1 ? lastFaceRef : null}
                    key={`${displaySeriesNo}-${index}`}
                    style={{
                      padding: '1px',
                    }}
                  >
                    {move ? (
                      <ShapeObject shape={SpecialShape.HAPPY} size={myfaces[index] ? 1 : 0.6} />
                    ) : (
                      <ShapeObject
                        shape={SpecialShape.UNHAPPY}
                        size={myfaces[index] ? 1 : 0.6}
                        backgroundColor="red"
                        round="full"
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box
              background="beige"
              pad="xxsmall"
              border={{ color: 'black' }}
              style={{
                flex: justReachedX4 ? '1 1 auto' : '1 1 20%',
                transition: 'all 0.2s ease-in-out',
              }}
              overflow={'auto'}
            >
              {incentive === Incentive.LIKELIHOOD ? (
                justReachedX4 ? (
                  <Text>
                    Your play is a{' '}
                    {x4Likelihood == 1000000
                      ? 'million'
                      : x4Likelihood == 100000
                      ? 'one hundred thousand'
                      : x4Likelihood == 10000
                      ? 'ten thousand'
                      : x4Likelihood == 1000
                      ? 'thousand'
                      : ''}{' '}
                    times better than chance. This has re-doubled your score. Please tell us what
                    the rule is, and how you found it.
                  </Text>
                ) : justReachedX2 ? (
                  <Text>
                    Your golden string has doubled your score! Extend it to double again. Be
                    careful.
                  </Text>
                ) : cfa > 1 && lastR === 0 ? (
                  <Text>Your golden string must start over. No points are lost.</Text>
                ) : numFaces == 0 ? (
                  <Text>Welcome!</Text>
                ) : lastR > 1 && cfa <= 1 ? (
                  <Text>You are making progress!</Text>
                ) : lastR > 1 && cfa > 1 ? (
                  <Text>You are making more progress!</Text>
                ) : iLost && is2PGAdveGame ? (
                  <Text>Your adversary has won this game. Press NEXT to continue</Text>
                ) : (
                  <Text>Please keep trying...</Text>
                )
              ) : factorPromised === 4 ? (
                <Text>
                  Your {numGoodMovesInARow} good moves in a row has{' '}
                  <Text weight="bold">re-doubled</Text> your score. Please tell us what the hidden
                  rule is.
                </Text>
              ) : isSecondOrMoreTimeDoubling ? (
                <Text>
                  Great. You did make <Text weight="bold">{lastDoublingStreakCount}</Text> good
                  moves in a row before. Now that you&apos;ve got{' '}
                  <Text weight="bold">{numGoodMovesInARow}</Text> in a row again, see if you can
                  extend it to <Text weight="bold">{x4After}</Text> this time.
                </Text>
              ) : lostStreak ? (
                <Text>Too bad... please keep trying!</Text>
              ) : x2After !== undefined && numGoodMovesInARow >= x2After ? (
                <Text>
                  Your {numGoodMovesInARow} good moves in a row has{' '}
                  <Text weight="bold">doubled</Text> your score. Now add{' '}
                  <Text weight="bold">{x4After - lastStretch} more</Text> good moves to{' '}
                  <Text weight="bold">double it again</Text>.
                </Text>
              ) : numFaces == 0 ? (
                <Text>Welcome!</Text>
              ) : iLost && is2PGAdveGame ? (
                <Text>Your adversary has won this game. Press NEXT to continue</Text>
              ) : (
                <Text>Please keep trying...</Text>
              )}
              {isAchieved && (
                <Box margin={{ top: 'small' }} overflow="auto">
                  <Form
                    onSubmit={() => {
                      dispatch(submitDetails(idea, how));
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4%',
                      height: '100%',
                    }}
                  >
                    <TextArea
                      placeholder="Explain your idea here"
                      value={idea}
                      onChange={(event) => setIdea(event.target.value)}
                      style={{
                        flex: '48%',
                        minHeight: 0,
                        resize: 'none',
                      }}
                    />
                    <TextArea
                      placeholder="How did you figure it out?"
                      value={how}
                      onChange={(event) => setHow(event.target.value)}
                      style={{
                        flex: '48%',
                        minHeight: 0,
                        resize: 'none',
                      }}
                    />
                    <Button type="submit" label="Submit" primary />
                  </Form>
                </Box>
              )}

              {((iLost && is2PGAdveGame) || (finishCode === FinishCode.FINISH && !isAchieved)) && (
                <Button label="Next" primary onClick={() => dispatch(skipGuess())} />
              )}
            </Box>
          </Box>
        </Tab>
        <Tab
          plain={true}
          title={
            <span
              style={{
                color: activeTab === 1 ? 'black' : 'white',
                padding: '10px 20px',
                display: 'inline-block',
              }}
            >
              Chat
            </span>
          }
        >
          <ChatArea />
        </Tab>
        <Tab
          plain={true}
          title={
            <span
              style={{
                color: activeTab === 2 ? 'black' : 'white',
                padding: '10px 20px',
                display: 'inline-block',
              }}
            >
              History
            </span>
          }
        >
          <HistoryArea />
        </Tab>
      </Tabs>
    </Box>
  );
};

export default InformationArea;
