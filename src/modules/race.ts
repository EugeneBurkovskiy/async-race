import Page from '../pages/page';
import API from './api';

class Race {
  page: Page;

  api: API;

  body: HTMLElement;

  constructor() {
    this.page = new Page();
    this.api = new API();
    this.body = document.querySelector('body') as HTMLElement;
  }

  renderGarage() {
    this.api.getCars().then((data) => {
      const garage = this.page.createGarage(data);
      const main = this.page.createMain();
      main.append(this.page.createHeader(), this.page.createGenerator(), garage);
      this.body.append(main);
      this.startEvents();
    });
  }

  startEvents() {
    this.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('race__garage-list-item-start')) {
        const car = target.closest('.race__garage-list-item')?.querySelector('#car') as HTMLDivElement;
        this.startRide(500, 3000, car);
      }
    });
  }

  startRide(endX: number, duration: number, element: HTMLDivElement) {
    let currentX = parseInt(window.getComputedStyle(element).transformOrigin);
    const framesCount = (duration / 1000) * 60;
    const dx = (endX - parseInt(window.getComputedStyle(element).transformOrigin)) / framesCount;
    const tick = () => {
      currentX += dx;
      element.style.transform = `translateX(${currentX}px)`;
      if (currentX < endX) {
        window.requestAnimationFrame(tick);
      }
    };
    tick();
  }
}

export default Race;
