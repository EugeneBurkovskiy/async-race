import Page from '../pages/page';
import API from './api';
import carNamesArr from './carsNameList';

class Service {
  page: Page;

  api: API;

  carId: string;

  pageNumber: number;

  totalPageNumber: number;

  order: string;

  sort: string;

  totalWinnersPageNumber: number;

  winnersPageNumber: number;

  carNumber: number;

  constructor() {
    this.page = new Page();
    this.api = new API();
    this.carId = '';
    this.pageNumber = 1;
    this.totalPageNumber = 1;
    this.winnersPageNumber = 1;
    this.totalWinnersPageNumber = 1;
    this.carNumber = 1;
    this.sort = '';
    this.order = '';
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

    const time = await this.api.patchEngine(id, 'started').then((data) => {
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
        throw new Error(`Car has been stopped suddenly. It's engine was broken down.`);
      });
  }

  async moveAllCars(target: HTMLElement) {
    const pedals = [...(document.querySelectorAll('.race__garage-list-item-start') as NodeListOf<HTMLDivElement>)];
    target.classList.add('carBtn-active');
    Promise.any(pedals.map((pedal) => this.startMove(pedal)))
      .then((data) => {
        this.showWinner(data);
        target.classList.remove('carBtn-active');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  stopAllCars() {
    const pedals = document.querySelectorAll('.race__garage-list-item-stop') as NodeListOf<HTMLDivElement>;
    pedals.forEach((pedal) => {
      pedal.click();
    });
  }

  async showWinner(args: number[]) {
    const champion = document.querySelector('.race__champion-title') as HTMLHeadElement;
    const championBlock = document.querySelector('.race__champion') as HTMLDivElement;
    this.api.getCar(`${args[0]}`).then(async (data) => {
      const time = parseFloat((args[1] / 1000).toFixed(2));
      champion.textContent = `Winner: ${data.name} (${time})s`;
      championBlock.style.display = 'flex';
      setTimeout(() => (championBlock.style.display = 'none'), 5000);

      await this.api.postWinner(data.id, 1, time).catch(async () => {
        const winnerObj = await this.api.getWinner(data.id);
        const bestTime = winnerObj.time;
        if (bestTime > time) {
          winnerObj.time = time;
        }
        winnerObj.wins += 1;
        await this.api.updateWinner(winnerObj.id, winnerObj.wins, winnerObj.time);
      });
    });
  }

  async createCar(btn: HTMLElement, name: string, color: string) {
    await this.api
      .postCar(name, color)
      .then((data) => {
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
    await this.api.deleteWinner(carTrack.id);
    await this.api.deleteCar(carTrack.id).then(() => carTrack.remove());
    await this.updateTotalCarsValue();
    this.updateGaragePage();
  }

  async updateTotalCarsValue() {
    const container = document.querySelector('.race__garage-header-count') as HTMLSpanElement;
    const carsCount = await this.api.getTotalCars().then((data) => data.length);
    this.totalPageNumber = Math.ceil(carsCount / 7);
    container.textContent = `Cars: ${carsCount} Pages: ${this.totalPageNumber}`;
  }

  changeGeneratorBtnsStyle(value: string, btnSelector: string) {
    const btn = document.querySelector(btnSelector) as HTMLElement;
    if (value.length > 2) {
      btn.classList.remove('carBtn-active');
    } else {
      btn.classList.add('carBtn-active');
    }
  }

  async updateGaragePage() {
    const carList = document.querySelector('.race__garage-list') as HTMLUListElement;
    const page = document.querySelector('.race__garage-page-number') as HTMLSpanElement;
    const data = await this.api.getCars(this.pageNumber);
    carList.innerHTML = '';
    data.forEach((item) => {
      carList.innerHTML += `${this.page.createCar(item.name, item.color, item.id)}`;
    });
    page.textContent = `${this.pageNumber}`;
  }

  async createRandomCars() {
    const randomCarsArr = [];
    for (let i = 0; i < 100; i++) {
      const brand = carNamesArr[0][Math.floor(Math.random() * carNamesArr[0].length)];
      const model = carNamesArr[1][Math.floor(Math.random() * carNamesArr[1].length)];
      const color = '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase();
      const name = `${brand} ${model}`;
      randomCarsArr.push([name, color]);
    }
    await Promise.all(
      randomCarsArr.map((item) =>
        this.api.postCar(item[0], item[1]).then((data) => {
          this.page.addCar(data.name, data.color, data.id);
        })
      )
    );
    await this.updateTotalCarsValue();
  }

  async updateWinnersTable() {
    const list = document.querySelector('.race__winners-list') as HTMLUListElement;
    const totalCount = document.querySelector('.race__winners-header-count') as HTMLSpanElement;
    const pageNumberContainer = document.querySelector('.race__winners-page-number') as HTMLSpanElement;
    const totalWinersArr = await this.api.getTotalWinners();
    const winersArr = await this.api.getWinners(this.winnersPageNumber, this.sort, this.order);
    this.totalWinnersPageNumber = Math.ceil(totalWinersArr.length / 10);
    totalCount.textContent = `Cars: ${totalWinersArr.length} Pages: ${this.totalWinnersPageNumber}`;
    const carsPropsArr = await Promise.all(winersArr.map((item) => this.api.getCar(`${item.id}`)));
    pageNumberContainer.textContent = `${this.winnersPageNumber}`;
    list.innerHTML = '';
    this.carNumber = this.winnersPageNumber * 10 - 10;
    winersArr.forEach((item) => {
      const carPropsObj = carsPropsArr.find((car) => car.id === item.id);
      if (carPropsObj) {
        this.carNumber += 1;
        list.append(
          this.page.createWinnerCar(carPropsObj.color, carPropsObj.name, item.wins, item.time, this.carNumber)
        );
      }
    });
  }

  sortByWins() {
    const winsArrow = document.querySelector('.race__winners-heads-wins-arrow') as HTMLSpanElement;
    const timeArrow = document.querySelector('.race__winners-heads-time-arrow') as HTMLSpanElement;
    timeArrow.innerHTML = '';
    this.sort = 'wins';
    if (winsArrow.textContent === '') {
      winsArrow.textContent = '↑';
      this.order = 'ASC';
    } else if (winsArrow.textContent === '↑') {
      winsArrow.textContent = '↓';
      this.order = 'DESC';
    } else if (winsArrow.textContent === '↓') {
      winsArrow.textContent = '↑';
      this.order = 'ASC';
    }
    this.updateWinnersTable();
  }

  sortByTime() {
    const winsArrow = document.querySelector('.race__winners-heads-wins-arrow') as HTMLSpanElement;
    const timeArrow = document.querySelector('.race__winners-heads-time-arrow') as HTMLSpanElement;
    winsArrow.innerHTML = '';
    this.sort = 'time';
    if (timeArrow.textContent === '') {
      timeArrow.textContent = '↑';
      this.order = 'ASC';
    } else if (timeArrow.textContent === '↑') {
      timeArrow.textContent = '↓';
      this.order = 'DESC';
    } else if (timeArrow.textContent === '↓') {
      timeArrow.textContent = '↑';
      this.order = 'ASC';
    }
    this.updateWinnersTable();
  }
}

export default Service;
