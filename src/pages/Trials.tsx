import React from 'react';
import { useSelector } from 'react-redux';
import Game from '../components/Game';
import HUD from '../components/HUD';
import GameIncentiveScheme from '../components/IncentiveScheme/Game';
import HUDIncentiveScheme from '../components/IncentiveScheme/HUD';
import { incentiveSelector } from '../store/selectors/board';
import { Incentive } from '../utils/api';

export default () => {
  const incentive = useSelector(incentiveSelector);

  return incentive === Incentive.DOUBLING ? (
    <HUDIncentiveScheme>
      <GameIncentiveScheme />
    </HUDIncentiveScheme>
  ) : (
    <HUD>
      <Game />
    </HUD>
  );
};
