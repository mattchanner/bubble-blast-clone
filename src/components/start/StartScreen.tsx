import React from 'react';
import Game from '../../Game';
import "./StartScreen.css";
import { DifficultyLevel } from '../../model/DifficultyLevel';

export interface StartScreenProps {
    game: Game;
}

export default class StartScreen extends React.Component<StartScreenProps> {
    render() {
        const game = this.props.game;
        const boardArea = game.boardArea;
        return (
            <div style={{width: boardArea.getWidth(), height: boardArea.getHeight()}} className="start-screen">
                <div className="title">
                    <h1>Bubble Blast</h1>
                </div>
                <div className="difficulty">
                    <button className="spin-left" onClick={() => game.setDifficultyLevel(DifficultyLevel.Easy)}>Easy</button>
                    <button className="spin-right" onClick={() => game.setDifficultyLevel(DifficultyLevel.Medium)}>Medium</button>
                    <button className="spin-left" onClick={() => game.setDifficultyLevel(DifficultyLevel.Hard)}>Hard</button>
                </div>
            </div>);
    }
}