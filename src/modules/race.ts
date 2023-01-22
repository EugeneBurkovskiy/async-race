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
      main.append(this.page.createHeader(), this.page.createGenerator(), garage, this.page.createWinners());
      this.body.append(main);
      this.service.updateTotalCarsValue();
      this.startDriveEvents();
      this.startGeneratorEvents();
      this.startPaginationEvents();
      this.startGaragePaginationEvents();
      this.startRandomGeneration();
      this.startSorting();
      this.startWinnersPaginationEvents();
    });
  }

  startDriveEvents() {
    this.body.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('race__garage-list-item-start')) {
        this.service
          .startMove(target)
          .catch(() => console.log(`Car has been stopped suddenly. It's engine was broken down.`));
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
      }
      if (target && target.classList.contains('race__generator-reset-race')) {
        this.service.stopAllCars();
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
        nameUpdateInput.value = '';
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
    const garageBtn = document.querySelector('.race__header-garage') as HTMLButtonElement;
    const winnersBtn = document.querySelector('.race__header-winners') as HTMLButtonElement;
    const genertator = document.querySelector('.race__generator') as HTMLElement;
    const garage = document.querySelector('.race__garage') as HTMLElement;
    const winners = document.querySelector('.race__winners') as HTMLElement;
    garageBtn.addEventListener('click', () => {
      garageBtn.classList.add('carBtn-active');
      winnersBtn.classList.remove('carBtn-active');
      genertator.style.display = 'block';
      garage.style.display = 'block';
      winners.style.display = 'none';
    });
    winnersBtn.addEventListener('click', () => {
      winnersBtn.classList.add('carBtn-active');
      garageBtn.classList.remove('carBtn-active');
      genertator.style.display = 'none';
      garage.style.display = 'none';
      winners.style.display = 'block';
      this.service.updateWinnersTable();
    });
  }

  startRandomGeneration() {
    const generationBtn = document.querySelector('.race__generator-generate-button') as HTMLButtonElement;
    generationBtn.addEventListener('click', () => {
      this.service.createRandomCars();
    });
  }

  startSorting() {
    const winsBtn = document.querySelector('.race__winners-heads-wins') as HTMLParagraphElement;
    const timeBtn = document.querySelector('.race__winners-heads-time') as HTMLParagraphElement;
    winsBtn.addEventListener('click', () => {
      this.service.sortByWins();
    });
    timeBtn.addEventListener('click', () => {
      this.service.sortByTime();
    });
  }

  startGaragePaginationEvents() {
    const prevBtn = document.querySelector('.race__garage-pages-prev') as HTMLButtonElement;
    const nextBtn = document.querySelector('.race__garage-pages-next') as HTMLButtonElement;
    prevBtn.addEventListener('click', () => {
      if (this.service.pageNumber > 1) {
        this.service.pageNumber -= 1;
        this.service.updateGaragePage();
      } else {
        this.service.pageNumber = this.service.totalPageNumber;
        this.service.updateGaragePage();
      }
    });
    nextBtn.addEventListener('click', () => {
      if (this.service.pageNumber < this.service.totalPageNumber) {
        this.service.pageNumber += 1;
        this.service.updateGaragePage();
      } else {
        this.service.pageNumber = 1;
        this.service.updateGaragePage();
      }
    });
  }

  startWinnersPaginationEvents() {
    const prevBtn = document.querySelector('.race__winners-pages-prev') as HTMLButtonElement;
    const nextBtn = document.querySelector('.race__winners-pages-next') as HTMLButtonElement;
    prevBtn.addEventListener('click', () => {
      if (this.service.winnersPageNumber > 1) {
        this.service.winnersPageNumber -= 1;
        this.service.updateWinnersTable();
      } else {
        this.service.winnersPageNumber = this.service.totalWinnersPageNumber;
        this.service.updateWinnersTable();
      }
    });
    nextBtn.addEventListener('click', () => {
      if (this.service.winnersPageNumber < this.service.totalWinnersPageNumber) {
        this.service.winnersPageNumber += 1;
        this.service.updateWinnersTable();
      } else {
        this.service.winnersPageNumber = 1;
        this.service.updateWinnersTable();
      }
    });
  }
}

export default Race;
