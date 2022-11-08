import './scss/indexStyle.scss';
import startGame from './modules/startGame';
import generateGame from './modules/generateGame';
import chooseAnswer from './modules/chooseAnswer';

window.addEventListener('DOMContentLoaded', () => {
  startGame();
  generateGame();
  chooseAnswer();
});