import React from 'react';
import { useSelector } from 'react-redux';
import Game from '../components/Game';
import HUD from '../components/HUD';
//-- Using an alternative comp is probably unnecessary. (VM, 2024-09-05)
//-- import GameIncentiveScheme from '../components/IncentiveScheme/Game';
import HUDIncentiveScheme from '../components/IncentiveScheme/HUD';
import { incentiveSelector } from '../store/selectors/board';
import { Incentive } from '../utils/api';

export default () => {
  const incentive = useSelector(incentiveSelector);

  return incentive === Incentive.DOUBLING ? (
    <HUDIncentiveScheme>
      <Game />
    </HUDIncentiveScheme>
  ) : incentive === Incentive.LIKELIHOOD ? (
    <HUDIncentiveScheme>
      <Game />
    </HUDIncentiveScheme>
  ) : (
    <HUD>
      <Game />
    </HUD>
  );
};
