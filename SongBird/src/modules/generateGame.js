import birdsData from './birds';


let gameMode;
function generateGame() {
  const gameTypeRow = document.querySelector('.game__window-row'),
    answerBlock = document.querySelector('.game__answer'),
    qustionAudio = document.querySelector('.game__question-audio'),
    blockWindow = document.querySelector('.game__blocking');

  gameTypeRow.addEventListener('click', (e) => {
    if (e.target && e.target.value) {

      blockWindow.style.top = '-100%';
      gameMode = e.target.value;
      qustionAudio.src = birdsData[e.target.value - 1][Math.floor(Math.random() * 6)].audio;

      answerBlock.innerHTML = '';
      birdsData[e.target.value - 1].forEach(item => {
        const answerBtn = document.createElement('div');
        answerBtn.classList.add('game__answer-item');
        answerBtn.textContent = `${item.name}`;
        answerBlock.append(answerBtn);
      });

    }
  });

}

export default generateGame;
export { gameMode };