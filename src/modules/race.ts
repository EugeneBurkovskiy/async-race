import Page from '../pages/page';
import API from './api';
import Service from './service';

class Race {
  page: Page;

  api: API;

  body: HTMLElement;

  service: Service;

  constructor() {
    this.page = new Page();
    this.api = new API();
    this.service = new Service();
    this.body = document.querySelector('body') as HTMLElement;
  }

  renderMain() {
    this.api.getCars(this.service.pageNumber).then((data) => {
      const garage = this.page.createGarage(data);
      const main = this.page.createMain();
      main.append(this.page.createHeader(), this.page.createGenerator(), garage);
      this.body.append(main);
      this.service.updateTotalCarsValue();
      this.startDriveEvents();
      this.startGeneratorEvents();
      this.startPaginationEvents();
      this.startRandomGeneration();
    });
  }

  startDriveEvents() {
    this.body.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('race__garage-list-item-start')) {
        this.service.startMove(target);
      }
      if (target && target.classList.contains('race__garage-list-item-stop')) {
        const track = target.closest('.race__garage-list-item') as HTMLLIElement;
        this.api.patchEngine(+track.id, 'stopped').then(() => {
          target.previousElementSibling?.classList.remove('carBtn-active');
          target.classList.add('carBtn-active');
          const car = track.querySelector('#car') as HTMLDivElement;
          car.style.transform = `translateX(0px)`;
        });
      }
      if (target && target.classList.contains('race__generator-start-race')) {
        this.service.moveAllCars(target);
        target.classList.add('carBtn-active');
        target.nextElementSibling?.classList.remove('carBtn-active');
      }
      if (target && target.classList.contains('race__generator-reset-race')) {
        this.service.stopAllCars(target);
        target.classList.add('carBtn-active');
        target.previousElementSibling?.classList.remove('carBtn-active');
      }
    });
  }

  startGeneratorEvents() {
    const nameCreateInput = document.querySelector('.race__generator-create-name') as HTMLInputElement;
    const colorCreateInput = document.querySelector('.race__generator-create-color') as HTMLInputElement;
    const nameUpdateInput = document.querySelector('.race__generator-update-name') as HTMLInputElement;
    const colorUpdateInput = document.querySelector('.race__generator-update-color') as HTMLInputElement;
    this.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('race__generator-create-button')) {
        this.service.createCar(target, nameCreateInput.value, colorCreateInput.value);
        nameCreateInput.value = '';
      }
      if (target && target.classList.contains('race__generator-update-button')) {
        this.service.updateCar(target, nameUpdateInput.value, colorUpdateInput.value, this.service.carId);
      }
      if (target && target.classList.contains('race__garage-list-item-select')) {
        const carTrack = target.closest('.race__garage-list-item') as HTMLLIElement;
        carTrack.classList.toggle('race-item-selected');
        this.service.carId = carTrack.id;
      }
      if (target && target.classList.contains('race__garage-list-item-remove')) {
        this.service.removeCar(target);
      }
    });
    nameCreateInput.addEventListener('input', () => {
      this.service.changeGeneratorBtnsStyle(nameCreateInput.value, '.race__generator-create-button');
    });
    nameUpdateInput.addEventListener('input', () => {
      this.service.changeGeneratorBtnsStyle(nameUpdateInput.value, '.race__generator-update-button');
    });
  }

  startPaginationEvents() {
    const prevBtn = document.querySelector('.race__garage-pages-prev') as HTMLButtonElement;
    const nextBtn = document.querySelector('.race__garage-pages-next') as HTMLButtonElement;
    prevBtn.addEventListener('click', () => {
      this.service.pageNumber -= 1;
      this.service.updatePage();
    });
    nextBtn.addEventListener('click', () => {
      this.service.pageNumber += 1;
      this.service.updatePage();
    });
  }

  startRandomGeneration() {
    const generationBtn = document.querySelector('.race__generator-generate-button') as HTMLButtonElement;
    generationBtn.addEventListener('click', () => {
      this.service.createRandomCars();
    });
  }
}

export default Race;
