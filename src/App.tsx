import React, { useState } from 'react';
import './App.css';
import { HandComponent, type SelectableCard } from './components/hand.component';
import { type Game } from './model/game';
import { type Card } from './model/card';
import { type Player } from './model/player';
import { type Row } from './model/row';
import { BoardComponent } from './components/board.component';
import { PlayersComponent } from './components/players.component';

interface AppState {
  rows: Row[];
  currentPlayer: Player | undefined;
  hand: SelectableCard[];
}

function App(props: { game: Game }): React.JSX.Element {
  const [state, setState] = useState<AppState>({
    rows: props.game.board.getRows(),
    currentPlayer: props.game.currentPlayer,
    hand: mapCards(props.game.currentPlayer?.hand)
  });
  const initialPlayer = props.game.currentPlayer;
  if (initialPlayer == null) {
    return <div>Game initializing</div>;
  }

  let selectedCard: SelectableCard;

  function playCard(): void {
    props.game.currentPlayer?.playCard(selectedCard.number);

    if (props.game.currentPlayer != null) {
      const handCards = mapCards(props.game.currentPlayer?.hand);
      console.log('Hand cards', handCards);
      if (handCards != null) {
        setState({
          currentPlayer: props.game.currentPlayer,
          hand: handCards,
          rows: props.game.board.getRows()
        });
      }
    }
  }

  const selectCard = (card: SelectableCard): void => {
    selectedCard = card;
  };

  return (
    <div className="app">
      <div className={'main-content'}>
        <h2>Six Takes Game</h2>
        <div>Game seed: {props.game.seed}</div>
        {<BoardComponent rows={state.rows} />}
        {<br />}
        <HandComponent
          key={state.currentPlayer?.name}
          selectCard={selectCard}
          playCard={playCard}
          cards={state.hand}
        ></HandComponent>
        <br />
      </div>
      <div className={'side-content'}>
        <PlayersComponent players={props.game.players} currentPlayer={state.currentPlayer?.name} />
      </div>
    </div>
  );
}

const mapCards = (cards: Card[] | undefined): SelectableCard[] => {
  if (cards == null) {
    return [];
  }
  return cards.map((c) => Object.assign(c, { selected: false }));
};

export default App;
