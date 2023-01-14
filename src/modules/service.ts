import Page from '../pages/page';
import { IEngine } from '../types/types';
import API from './api';

class Service {
  page: Page;

  api: API;

  constructor() {
    this.page = new Page();
    this.api = new API();
  }

  async moveCar(target: HTMLElement) {
    const track = target.closest('.race__garage-list-item') as HTMLLIElement;
    const car = track.querySelector('#car') as HTMLDivElement;
    target.classList.add('carBtn-active');
    const trackLength = parseInt(window.getComputedStyle(track).width);
    const carLength = parseInt(window.getComputedStyle(car).width);
    const distance = trackLength - carLength;
    const id = +track.id;

    let currentX: number;
    let dx: number;
    let animId: number;

    const tick = () => {
      currentX += dx;
      car.style.transform = `translateX(${currentX}px)`;
      if (currentX < distance && target.classList.contains('carBtn-active')) {
        animId = window.requestAnimationFrame(tick);
      } else if (!target.classList.contains('carBtn-active')) {
        car.style.transform = `translateX(0px)`;
      }
    };
    await this.api.patchEngine(id, 'started').then((data: IEngine) => {
      const time = data.distance / data.velocity;
      const framesCount = (time / 1000) * 60;
      currentX = parseInt(window.getComputedStyle(car).transformOrigin);
      dx = (distance - parseInt(window.getComputedStyle(car).transformOrigin)) / framesCount;
      tick();
    });
    await this.api
      .patchEngine(id, 'drive')
      .then((data) => console.log(data, id))
      .catch(() => {
        window.cancelAnimationFrame(animId);
        console.log(new Error('Car has been stopped suddenly. It"s engine was broken down.'));
      });
  }
}

export default Service;
