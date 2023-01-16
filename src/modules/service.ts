import Page from '../pages/page';
import { ICar, IEngine } from '../types/types';
import API from './api';

class Service {
  page: Page;

  api: API;

  constructor() {
    this.page = new Page();
    this.api = new API();
  }

  async startMove(target: HTMLElement) {
    const track = target.closest('.race__garage-list-item') as HTMLLIElement;
    const car = track.querySelector('#car') as HTMLDivElement;
    target.nextElementSibling?.classList.remove('carBtn-active');
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

    const time = await this.api.patchEngine(id, 'started').then((data: IEngine) => {
      const duration = data.distance / data.velocity;
      const framesCount = (duration / 1000) * 60;
      currentX = parseInt(window.getComputedStyle(car).transformOrigin);
      dx = (distance - parseInt(window.getComputedStyle(car).transformOrigin)) / framesCount;
      tick();
      return duration;
    });
    const res = await this.api
      .patchEngine(id, 'drive')
      .then(() => [id, time])
      .catch(() => {
        window.cancelAnimationFrame(animId);
        throw new Error(`Car has been stopped suddenly. It's engine was broken down.`);
      });
    return res;
  }

  async moveAllCars(target: HTMLElement) {
    const pedals = [...(document.querySelectorAll('.race__garage-list-item-start') as NodeListOf<HTMLDivElement>)];
    target.classList.add('carBtn-active');
    const winner = await Promise.any(pedals.map((pedal) => this.startMove(pedal)));
    this.getWinner(winner);
  }

  stopAllCars(target: HTMLElement) {
    const pedals = document.querySelectorAll('.race__garage-list-item-stop') as NodeListOf<HTMLDivElement>;
    target.classList.add('carBtn-active');
    pedals.forEach((pedal) => {
      pedal.click();
    });
  }

  getWinner(args: number[]) {
    console.log(args);
    this.api.getCar(`${args[0]}`).then((data: ICar) => {
      const champion = document.querySelector('.race__champion-title') as HTMLHeadElement;
      const championBlock = document.querySelector('.race__champion') as HTMLDivElement;
      const time = (args[1] / 1000).toFixed(3);
      champion.textContent = `Winner: ${data.name} (${time})s`;
      championBlock.style.display = 'flex';
      setTimeout(() => (championBlock.style.display = 'none'), 3000);
    });
  }
}

export default Service;
