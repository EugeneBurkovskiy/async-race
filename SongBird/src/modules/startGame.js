
function startGame() {
  const btnRow = document.querySelector('.game__header-wrapper'),
    btns = btnRow.querySelectorAll('.game__header-button'),
    gameWindow = document.querySelector('.game__window'),
    video = document.querySelector('.game__video'),
    score = document.querySelector('.game__score');

  btnRow.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('game__header-button')) {
      e.preventDefault();
      video.style.top = '-100%';
      score.style.display = 'block';
      gameWindow.style.display = 'block';
      btns.forEach(btn => {
        btn.style.cssText = '';
      });
      e.target.style.cssText = 'background-color: #10443d;';
      e.target.style.pointerEvents = 'none';
      if (window.screen.width <= 810) {
        btns.forEach(btn => {
          btn.style.cssText = 'width: 100%;';
        });
      }
    }
  });
}

export default startGame;