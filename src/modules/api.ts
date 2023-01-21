import { ICar, IEngine, IWinner } from '../types/types';

class API {
  adress: string;

  constructor() {
    this.adress = 'http://127.0.0.1:3000';
  }

  async getCars(page = 1, limit = 7) {
    const response: ICar[] = await fetch(`${this.adress}/garage/?_page=${page}&_limit=${limit}`).then((data) =>
      data.json()
    );
    return response;
  }

  async getTotalCars() {
    const response: ICar[] = await fetch(`${this.adress}/garage`).then((data) => data.json());
    return response;
  }

  async getCar(id: string) {
    const response: ICar = await fetch(`${this.adress}/garage/${id}`).then((data) => data.json());
    return response;
  }

  async patchEngine(id: number, status: string) {
    const response: IEngine = await fetch(`${this.adress}/engine/?id=${id}&status=${status}`, {
      method: 'PATCH',
    }).then((data) => data.json());
    return response;
  }

  async postCar(nameValue: string, colorValue: string) {
    const obj = {
      name: nameValue,
      color: colorValue,
    };
    const response: ICar = await fetch(`${this.adress}/garage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    }).then((data) => data.json());
    return response;
  }

  async putCar(nameValue: string, colorValue: string, id: string) {
    const obj = {
      name: nameValue,
      color: colorValue,
    };
    const response: ICar = await fetch(`${this.adress}/garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    }).then((data) => data.json());
    return response;
  }

  async deleteCar(id: string) {
    const response = await fetch(`${this.adress}/garage/${id}`, {
      method: 'DELETE',
    }).then((data) => data.json());
    return response;
  }

  async postWinner(id: number, wins: number, time: number) {
    const obj = {
      id: id,
      wins: wins,
      time: time,
    };
    const response: IWinner = await fetch(`${this.adress}/winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    }).then((data) => data.json());
    return response;
  }

  async getWinners(page: number, sort: string, order: string) {
    const response: IWinner[] = await fetch(
      `${this.adress}/winners/?_page=${page}&_sort=${sort}&_order=${order}&_limit=10`
    ).then((data) => data.json());
    return response;
  }

  async getTotalWinners() {
    const response: IWinner[] = await fetch(`${this.adress}/winners`).then((data) => data.json());
    return response;
  }

  async updateWinner(id: number, wins: number, time: number) {
    const obj = {
      wins: wins,
      time: time,
    };
    const response: IWinner = await fetch(`${this.adress}/winners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    }).then((data) => data.json());
    return response;
  }

  async getWinner(id: number) {
    const response: IWinner = await fetch(`${this.adress}/winners/${id}`).then((data) => data.json());
    return response;
  }

  async deleteWinner(id: string) {
    const response = await fetch(`${this.adress}/winners/${id}`, {
      method: 'DELETE',
    }).then((data) => data.json());
    return response;
  }
}

export default API;
