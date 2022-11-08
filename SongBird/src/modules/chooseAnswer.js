import birdsData from './birds';
import { gameMode } from './generateGame';

function chooseAnswer() {
  const answerRow = document.querySelector('.game__answer'),
    aboutBlock = document.querySelector('.game__about');

  answerRow.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('game__answer-item')) {
      birdsData[gameMode - 1].forEach(bird => {
        if (bird.name === e.target.textContent) {
          aboutBlock.innerHTML = `
      <div class="game__about-img"><img src=${bird.image} alt="incognito"></div>
            <div class="game__about-info">
              <div class="game__about-name">${bird.name}</div>
              <hr class="game__about-divider">
              <div class="game__about-subname">${bird.species}</div>
              <hr class="game__about-divider">
              <audio class="game__about-audio" src=${bird.audio} controls></audio>
            </div>
            <div class="game__about-descr">${bird.description}
            </div>
      `;
        }
      });
    }
  });
}

export default chooseAnswer;