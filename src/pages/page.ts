import { ICar } from '../types/types';

class Page {
  createMain() {
    const mainPage = document.createElement('main');
    mainPage.classList.add('race');
    return mainPage;
  }

  createHeader() {
    const header = document.createElement('header');
    header.classList.add('race__header');
    header.innerHTML = `
    <header class="race__header">
      <button class="race__header-garage carBtn-active">To Garage</button>
      <button class="race__header-winners">To Winners</button>
    </header>
    `;
    return header;
  }

  createGenerator() {
    const generator = document.createElement('section');
    generator.classList.add('race__generator');
    generator.innerHTML = `
    <div class="race__generator-create">
      <input type="text" class="race__generator-create-name" placeholder="Car Name">
      <input type="color" class="race__generator-create-color" value="#0066ff">
      <button class="race__generator-create-button carBtn-active">CREATE</button>
    </div>
    <div class="race__generator-update">
      <input type="text" class="race__generator-update-name" placeholder="Car Name">
      <input type="color" class="race__generator-update-color" value="#fbff00">
      <button class="race__generator-update-button carBtn-active">UPDATE</button>
    </div>
    <div class="race__generator-controls-race">
      <button class="race__generator-start-race">RACE</button>
      <button class="race__generator-reset-race">RESET</button>
      <button class="race__generator-generate-button">GENERATE CARS</button>
    </div>
    `;
    return generator;
  }

  createGarage(data: ICar[]) {
    const garage = document.createElement('section');
    garage.classList.add('race__garage');
    let cars = '';
    const carsCount = data.length;
    data.forEach((car) => {
      cars += this.createCar(car.name, car.color, car.id);
    });
    garage.innerHTML = `
    <h2 class="race__garage-header">Garage(<span class="race__garage-header-count">${carsCount}</span>)</h2>
    <p class="race__garage-page">Page #<span class="race__garage-page-number">1</span></p>
    <ul class="race__garage-list">
      ${cars}
    </ul>
    <div class="race__garage-pages">
      <button class="race__garage-pages-prev">⟵</button>
      <button class="race__garage-pages-next">⟶</button>
    </div>
    <div class="race__champion">
      <h2 class="race__champion-title">Car #1 won!!!</h2>
    </div>
  `;
    return garage;
  }

  createWinners() {
    const winners = document.createElement('section');
    winners.classList.add('race__winners');
    winners.innerHTML = `
    <h2 class="race__winners-header">
    Winners(
    <span class="race__winners-header-count">Cars: 4 Pages: 1</span>
    )
    </h2>
    <p class="race__winners-page">
    Page #
    <span class="race__winners-page-number">1</span>
    </p>
    <div class="race__winners-heads">
      <p class="race__winners-heads-number">Number</p>
      <p class="race__winners-heads-car">Car</p>
      <p class="race__winners-heads-name">Name</p>
      <p class="race__winners-heads-wins">Wins <span class="race__winners-heads-wins-arrow"></span></p>
      <p class="race__winners-heads-time">Best time (seconds)<span class="race__winners-heads-time-arrow"></span></p>
    </div>
    <ul class="race__winners-list">
    </ul>
    <div class="race__winners-pages">
      <button class="race__winners-pages-prev">⟵</button>
      <button class="race__winners-pages-next">⟶</button>
    </div>
    `;
    return winners;
  }

  createCar(name: string, color: string, id: number) {
    const car = `
    <li class="race__garage-list-item" id=${id}>
    <div class="race__garage-list-item-header">
      <button class="race__garage-list-item-select"> SELECT </button>
      <button class="race__garage-list-item-remove "> REMOVE </button>
      <span span class="race__garage-list-item-name"> ${name} </span>
    </div>
    <div class="race__garage-list-item-controls">
      <button class="race__garage-list-item-start"> A </button>
      <button class="race__garage-list-item-stop carBtn-active"> B </button>
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 19" id="car" fill=${color}>
      <path
        d="M21.739 10.921c-1.347-.39-1.885-.538-3.552-.921 0 0-2.379-2.359-2.832-2.816-.568-.572-1.043-1.184-2.949-1.184h-7.894c-.511 0-.736.547-.07 1-.742.602-1.619 1.38-2.258 2.027-1.435 1.455-2.184 2.385-2.184 4.255 0 1.76 1.042 3.718 3.174 3.718h.01c.413 1.162 1.512 2 2.816 2 1.304 0 2.403-.838 2.816-2h6.367c.413 1.162 1.512 2 2.816 2s2.403-.838 2.816-2h.685c1.994 0 2.5-1.776 2.5-3.165 0-2.041-1.123-2.584-2.261-2.914zm-15.739 6.279c-.662 0-1.2-.538-1.2-1.2s.538-1.2 1.2-1.2 1.2.538 1.2 1.2-.538 1.2-1.2 1.2zm3.576-6.2c-1.071 0-3.5-.106-5.219-.75.578-.75.998-1.222 1.27-1.536.318-.368.873-.714 1.561-.714h2.388v3zm1-3h1.835c.882 0 1.428.493 2.022 1.105.452.466 1.732 1.895 1.732 1.895h-5.588v-3zm7.424 9.2c-.662 0-1.2-.538-1.2-1.2s.538-1.2 1.2-1.2 1.2.538 1.2 1.2-.538 1.2-1.2 1.2z" />
    </svg>
    <div class="race__garage-list-item-road"> </div>
  </li>
      `;
    return car;
  }

  createWinnerCar(color: string, name: string, wins: number, time: number, position: number) {
    const item = document.createElement('Li');
    item.classList.add('race__winners-item');
    item.innerHTML = `
      <p class="race__winners-item-number">${position}</p>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 19" id="car" fill=${color}>
        <path
          d="M21.739 10.921c-1.347-.39-1.885-.538-3.552-.921 0 0-2.379-2.359-2.832-2.816-.568-.572-1.043-1.184-2.949-1.184h-7.894c-.511 0-.736.547-.07 1-.742.602-1.619 1.38-2.258 2.027-1.435 1.455-2.184 2.385-2.184 4.255 0 1.76 1.042 3.718 3.174 3.718h.01c.413 1.162 1.512 2 2.816 2 1.304 0 2.403-.838 2.816-2h6.367c.413 1.162 1.512 2 2.816 2s2.403-.838 2.816-2h.685c1.994 0 2.5-1.776 2.5-3.165 0-2.041-1.123-2.584-2.261-2.914zm-15.739 6.279c-.662 0-1.2-.538-1.2-1.2s.538-1.2 1.2-1.2 1.2.538 1.2 1.2-.538 1.2-1.2 1.2zm3.576-6.2c-1.071 0-3.5-.106-5.219-.75.578-.75.998-1.222 1.27-1.536.318-.368.873-.714 1.561-.714h2.388v3zm1-3h1.835c.882 0 1.428.493 2.022 1.105.452.466 1.732 1.895 1.732 1.895h-5.588v-3zm7.424 9.2c-.662 0-1.2-.538-1.2-1.2s.538-1.2 1.2-1.2 1.2.538 1.2 1.2-.538 1.2-1.2 1.2z" />
      </svg>
      <p class="race__winners-item-name">${name}</p>
      <p class="race__winners-item-wins">${wins}</p>
      <p class="race__winners-item-time">${time}</p>
    `;
    return item;
  }

  addCar(name: string, color: string, id: number) {
    const carList = document.querySelector('.race__garage-list') as HTMLUListElement;
    const cars = carList.querySelectorAll('.race__garage-list-item') as NodeListOf<HTMLLIElement>;
    if (cars.length < 7) {
      carList.innerHTML += this.createCar(name, color, id);
    }
  }
}
export default Page;
