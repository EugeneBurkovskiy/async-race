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
    this.body.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('race__garage-list-item-start')) {
        this.service.moveCar(target).then(() => target.classList.remove('carBtn-active'));
        target.nextElementSibling?.classList.remove('carBtn-active');
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
    });
  }
}

export default Race;
