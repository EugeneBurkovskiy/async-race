import './index.html';
import Race from './modules/race';
import './scss/style.scss';

function main() {
  const race = new Race();
  race.renderGarage();
}
main();
