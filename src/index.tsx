import Game from './Game';
import ReactDOM from 'react-dom';
import CompletedScreen, { CompletedScreenProps } from './components/completed/CompletedScreen';
import StartScreen, { StartScreenProps } from './components/start/StartScreen';

import './index.css';
import Rect from './model/Rect';

const rootContainer = document.querySelector("#root") as HTMLElement;

const game = new Game(rootContainer, new Rect(0, 0, 600, 950));

game.addStartHandler(() => {
    ReactDOM.unmountComponentAtNode(rootContainer);
    game.start();    
});

game.addCompleteHandler(function () {
    const props = {game, onPlayAgain: showStartScreen} as CompletedScreenProps;
    var ele = new CompletedScreen(props)
    ReactDOM.render(ele.render(), rootContainer);
});

const showStartScreen = () => {
    const props = { game } as StartScreenProps;
    var ele = new StartScreen(props)
    ReactDOM.render(ele.render(), rootContainer);
};

showStartScreen();
