import type { FunctionComponent } from 'react';

import { observer } from 'mobx-react-lite';

import { Paper, Divider, Button } from 'components';
import { useStore } from 'store';
import type { HomeSocketLobbyCard } from 'store/Sockets/HomeSocket/types';

import { LobbyCard } from './LobbyCard';

import classes from './HomeLobbiesSection.module.css';

const cardsMock: HomeSocketLobbyCard[] = [
  {
    id: '1',
    maximumOfPlayers: 3,
    name: 'Киевская русь',
    type: 'История',
    players: [
      {
        id: '1.1',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'gogsh',
      },
      {
        id: '1.2',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'iZrajkee',
      },
    ],
  },
  {
    id: '1',
    maximumOfPlayers: 3,
    name: 'Какие-то длинное название пака',
    type: 'История',
    players: [
      {
        id: '1.1',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'gogsh',
      },
      {
        id: '1.2',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'iZrajkee',
      },
    ],
  },
  {
    id: '1',
    maximumOfPlayers: 4,
    name: 'Киевская русь',
    type: 'Какое-то длинное название тематики',
    players: [
      {
        id: '1.1',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'gogsh',
      },
      {
        id: '1.2',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'iZrajkee',
      },
    ],
  },
  {
    id: '1',
    maximumOfPlayers: 4,
    name: 'Киевская русь',
    type: 'История',
    players: [
      {
        id: '1.1',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'gogsh',
      },
      {
        id: '1.2',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'iZrajkee',
      },
    ],
  },
  {
    id: '1',
    maximumOfPlayers: 2,
    name: 'Киевская русь',
    type: 'История',
    players: [
      {
        id: '1.1',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'gogsh',
      },
    ],
  },
  {
    id: '1',
    maximumOfPlayers: 4,
    name: 'Киевская русь',
    type: 'История',
    players: [
      {
        id: '1.1',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'gogsh',
      },
      {
        id: '1.2',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'iZrajkee',
      },
    ],
  },
  {
    id: '1',
    maximumOfPlayers: 3,
    name: 'Киевская русь',
    type: 'История',
    players: [
      {
        id: '1.1',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'gogsh',
      },
      {
        id: '1.2',
        avatar:
          'https://imya-sonnik.ru/wp-content/uploads/2019/10/s1200-86-1.jpg',
        name: 'iZrajkee',
      },
    ],
  },
];

export const HomeLobbiesSection: FunctionComponent = observer(() => {
  const { home } = useStore();
  return (
    <Paper className={classes.lobbies}>
      <div className={classes.lobbiesContainer}>
        {cardsMock.map((card) => (
          <LobbyCard key={card.id} {...card} />
        ))}
      </div>
      <Divider className={classes.divider} />
      <Button
        className={classes.createLobbiesButton}
        type="primary"
        onClick={home.setIsCreateLobbyModalOpen}
      >
        Создать лобби
      </Button>
    </Paper>
  );
});

HomeLobbiesSection.displayName = 'HomeLobbiesSection';
