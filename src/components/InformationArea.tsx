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
  botAssistanceSelector,
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

const ChatArea: React.FC = () => {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isCurrentGameCoop = useSelector(is2PGCoopGameSelector);
  const socket = useSelector(socketSelector);
  const dispatch = useDispatch();
  const messageList = useSelector(messageSelector);
  const isBotAssisted = useSelector(botAssistanceSelector);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  const sendMessage = () => {
    if (messageInput.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send('CHAT ' + messageInput);
      dispatch(addMessage('ME', messageInput));
      setMessageInput('');
    } else if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn('Socket is not connected');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (!isCurrentGameCoop && !isBotAssisted) {
    return (
      <Box fill align="center" justify="center">
        <Text>Chat is only available in cooperative games and bot assisted games.</Text>
      </Box>
    );
  }

  return (
    <Box fill direction="column">
      {/* Message list that takes up available space */}
      <Box fill overflow="auto" pad="small" background="light-2">
        {messageList.map((msg, index) => (
          <Text key={index} margin={{ bottom: 'xsmall' }}>
            {msg.who}: {msg.text}
          </Text>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input message box with a fixed height */}
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
          onKeyDown={handleKeyPress}
        />
        <Button icon={<Send />} onClick={sendMessage} primary disabled={!messageInput.trim()} />
      </Box>
    </Box>
  );
};

const HistoryArea: React.FC = () => {
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const displaySerriesNo = useSelector(displaySeriesNoSelector);
  const workerId = useSelector(workerIdSelector);
  const id = displaySerriesNo + '-' + workerId;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Effect to measure container height
  useEffect(() => {
    if (containerRef.current) {
      const updateHeight = () => {
        if (containerRef.current) {
          const height = containerRef.current.clientHeight;
          setContainerHeight(height);
        }
      };

      // Initial measurement
      updateHeight();

      // Update on resize
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, []);

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

  const currentEpisodeScreenshots = getCurrentEpisodeScreenshots();
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

  // Calculate image height based on container size
  // Reserve space for navigation (30px) and padding (20px)
  const calculateImageHeight = () => {
    return Math.max(100, containerHeight - 50);
  };

  return (
    <Box
      ref={containerRef}
      fill
      overflow="hidden"
      style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
    >
      {!hasScreenshots ? (
        <Box align="center" justify="center" fill>
          <Text>No game history for current episode. Completed boards will appear here.</Text>
        </Box>
      ) : (
        <Box fill align="center" justify="between" overflow="hidden" pad="xsmall">
          {/* Dynamic image size based on parent container */}
          <Box
            align="center"
            justify="center"
            flex="grow"
            height={`${calculateImageHeight()}px`}
            width="100%"
            overflow="hidden"
          >
            {currentEpisodeScreenshots.length > 0 && (
              <img
                src={currentEpisodeScreenshots[currentScreenshotIndex]}
                alt={`Screenshot ${currentScreenshotIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            )}
          </Box>

          {/* Fixed-height navigation bar */}
          {currentEpisodeScreenshots.length > 1 && (
            <Box
              direction="row"
              justify="center"
              align="center"
              height="30px"
              width="100%"
              flex={false}
              margin={{ top: 'xsmall' }}
            >
              <Button
                icon={<Previous size="medium" />}
                onClick={goToPrevious}
                primary
                hoverIndicator
                style={{
                  borderRadius: '50%',
                  padding: '8px',
                  background: '#7D4CDB',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />

              <Text size="small" weight="bold" margin={{ horizontal: 'small' }}>
                {`${currentScreenshotIndex + 1}/${currentEpisodeScreenshots.length}`}
              </Text>

              <Button
                icon={<Next size="medium" />}
                onClick={goToNext}
                primary
                hoverIndicator
                style={{
                  borderRadius: '50%',
                  padding: '8px',
                  background: '#7D4CDB',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

const MovesArea: React.FC = () => {
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
  const infoBoxRef = useRef<HTMLDivElement | null>(null);

  const displaySerriesNo = useSelector(displaySeriesNoSelector);
  const workerId = useSelector(workerIdSelector);

  const isCurrentGameCoop = useSelector(is2PGCoopGameSelector);
  const socket = useSelector(socketSelector);

  useEffect(() => {
    const screenshotsData = localStorage.getItem('SCREENSHOTS');
    // TODO: check where to implement this
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
        const parts = event.data.split(' ');

        if (parts[0] === 'CHAT') {
          const messageText = parts.slice(1).join(' ');

          dispatch(addMessage('TEAMMATE', messageText));
        }
      };
    }
  }, [isCurrentGameCoop, socket]);

  useEffect(() => {
    if (infoBoxRef.current) {
      setTimeout(() => {
        if (infoBoxRef.current) {
          infoBoxRef.current.scrollTop = infoBoxRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [iLost, is2PGAdveGame, finishCode, isAchieved, numGoodMovesInARow, lastStretch, incentive]);

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

  return (
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
        ref={infoBoxRef}
      >
        {incentive === Incentive.LIKELIHOOD ? (
          justReachedX4 ? (
            <Text>
              Your play is{' '}
              {x4Likelihood == 1000000
                ? 'million'
                : x4Likelihood == 100000
                ? 'one hundred thousand'
                : x4Likelihood == 10000
                ? 'ten thousand'
                : x4Likelihood == 1000
                ? 'thousand'
                : ''}{' '}
              times better than chance. This has re-doubled your score. Please tell us what the rule
              is, and how you found it.
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
          ) : iLost && is2PGAdveGame ? (
            <Text>Your adversary has won this game. Press NEXT to continue</Text>
          ) : (
            <Text>Please keep trying...</Text>
          )
        ) : factorPromised === 4 ? (
          <Text>
            Your {numGoodMovesInARow} good moves in a row has <Text weight="bold">re-doubled</Text>{' '}
            your score. Please tell us what the hidden rule is.
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
          <Text>
            Your {numGoodMovesInARow} good moves in a row has <Text weight="bold">doubled</Text>{' '}
            your score. Now add <Text weight="bold">{x4After - lastStretch} more</Text> good moves
            to <Text weight="bold">double it again</Text>.
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
  );
};

const InformationArea: React.FunctionComponent = () => {
  // const dispatch = useDispatch();
  const board = useSelector(boardSelector); //-- everything else is in this structure --VM 2024-09-28
  // const numGoodMoves = useSelector(numGoodMovesMadeSelector);
  // const numFaces = useSelector(numFacesSelector);
  // const goodBadMoves = useSelector(facesSelector)!;
  // const myfaces = useSelector(myFacesSelector) ?? [];
  const is2PGCoopGame = useSelector(is2PGCoopGameSelector);
  const is2PGAdveGame = useSelector(is2PGAdveGameSelector);
  const is2PG = is2PGCoopGame || is2PGAdveGame;
  const lastStretch = useSelector(lastStretchSelector);
  const isBotAssisted = useSelector(botAssistanceSelector);
  const factorPromised: number = useSelector(factorPromisedSelector) ?? 1;
  const finishCode = useSelector(finishCodeSelector);
  const incentive = useSelector(incentiveSelector);
  const [activeTab, setActiveTab] = useState<number>(1);
  const firstRender = useRef(true);
  const displaySeriesNo = useSelector(displaySeriesNoSelector);
  const workerId = useSelector(workerIdSelector);
  const id = displaySeriesNo + '-' + workerId;

  useEffect(() => {
    if (finishCode === FinishCode.FINISH || finishCode === FinishCode.EARLY_WIN) {
      setActiveTab(0);
    } else {
      setActiveTab(1);
    }
  }, [finishCode]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

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

  const cfa: number = Math.max(factorPromised, board.factorAchieved ?? 1);
  // TODO: Screenshots only for 2PG games
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
      {is2PG || isBotAssisted ? (
        <Tabs activeIndex={activeTab} onActive={(index: number) => setActiveTab(index)} flex>
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
            <MovesArea />
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
            <Box fill height="100%">
              <ChatArea />
            </Box>
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
      ) : (
        <MovesArea />
      )}
    </Box>
  );
};

export default InformationArea;
