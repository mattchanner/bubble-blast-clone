import React from 'react';
import Game from '../../Game';
import './CompletedScreen.css';

export interface CompletedScreenProps {
    game: Game;
    onPlayAgain: Function;
}

export default class CompletedScreen extends React.Component<CompletedScreenProps> {

    render() {

        const game = this.props.game;
        const boardArea = game.boardArea;

        return (
            <div style={{width: boardArea.getWidth(), height: boardArea.getHeight()}} className="completed-screen">
                <div className="completed-text">
                    Game Completed!
                </div>
                <div className="play-again">
                    <button className="play-again-button spin-right" onClick={() => this.props.onPlayAgain()}>
                        Play Again
                    </button>
                </div>
            </div>
        );
    }
}
