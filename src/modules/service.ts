import Page from '../pages/page';
import { ICar, IEngine } from '../types/types';
import API from './api';

class Service {
  page: Page;

  api: API;

  carId: string;

  pageNumber: number;

  constructor() {
    this.page = new Page();
    this.api = new API();
    this.carId = '';
    this.pageNumber = 1;
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
    return this.api
      .patchEngine(id, 'drive')
      .then(() => [id, time])
      .catch(() => {
        window.cancelAnimationFrame(animId);
        throw new Error(`${id}Car has been stopped suddenly. It's engine was broken down.`);
      });
  }

  async moveAllCars(target: HTMLElement) {
    const pedals = [...(document.querySelectorAll('.race__garage-list-item-start') as NodeListOf<HTMLDivElement>)];
    target.classList.add('carBtn-active');
    Promise.any(pedals.map((pedal) => this.startMove(pedal))).then((data) => this.getWinner(data));
  }

  stopAllCars(target: HTMLElement) {
    const pedals = document.querySelectorAll('.race__garage-list-item-stop') as NodeListOf<HTMLDivElement>;
    target.classList.add('carBtn-active');
    pedals.forEach((pedal) => {
      pedal.click();
    });
  }

  getWinner(args: number[]) {
    this.api.getCar(`${args[0]}`).then((data: ICar) => {
      const champion = document.querySelector('.race__champion-title') as HTMLHeadElement;
      const championBlock = document.querySelector('.race__champion') as HTMLDivElement;
      const time = (args[1] / 1000).toFixed(2);
      champion.textContent = `Winner: ${data.name} (${time})s`;
      championBlock.style.display = 'flex';
      setTimeout(() => (championBlock.style.display = 'none'), 3000);
    });
  }

  async createCar(btn: HTMLElement, name: string, color: string) {
    await this.api
      .postCar(name, color)
      .then((data: ICar) => {
        this.page.addCar(data.name, data.color, data.id);
      })
      .then(() => btn.classList.add('carBtn-active'));
    await this.updateTotalCarsValue();
  }

  updateCar(btn: HTMLElement, name: string, color: string, id: string) {
    if (this.carId) {
      this.api.putCar(name, color, id).then(() => {
        btn.classList.add('carBtn-active');
        const carTrack = document.getElementById(id) as HTMLLIElement;
        const carTitle = carTrack.querySelector(`.race__garage-list-item-name`) as HTMLSpanElement;
        const carColor = carTrack.querySelector(`#car`) as HTMLElement;
        carTitle.textContent = name;
        carColor.style.fill = color;
        carTrack.classList.remove('race-item-selected');
      });
    }
  }

  async removeCar(target: HTMLElement) {
    const carTrack = target.closest('.race__garage-list-item') as HTMLLIElement;
    await this.api.deleteCar(carTrack.id).then(() => carTrack.remove());
    await this.updateTotalCarsValue();
  }

  async updateTotalCarsValue() {
    const container = document.querySelector('.race__garage-header-count') as HTMLSpanElement;
    const carsCount = await this.api.getTotalCars().then((data) => data.length);
    container.textContent = `${carsCount}`;
  }

  changeGeneratorBtnsStyle(value: string, btnSelector: string) {
    const btn = document.querySelector(btnSelector) as HTMLElement;
    if (value.length > 2) {
      btn.classList.remove('carBtn-active');
    } else {
      btn.classList.add('carBtn-active');
    }
  }

  async updatePage() {
    const carList = document.querySelector('.race__garage-list') as HTMLUListElement;
    const page = document.querySelector('.race__garage-page-number') as HTMLSpanElement;
    carList.innerHTML = '';
    const data: ICar[] = await this.api.getCars(this.pageNumber);
    data.forEach((item) => {
      carList.innerHTML += `${this.page.createCar(item.name, item.color, item.id)}`;
    });
    page.textContent = `${this.pageNumber}`;
  }
}

export default Service;
