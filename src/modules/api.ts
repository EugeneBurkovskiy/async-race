class API {
  adress: string;

  constructor() {
    this.adress = 'http://127.0.0.1:3000';
  }

  async getCars(page = 1, limit = 7) {
    const response = await fetch(`${this.adress}/garage/?_page=${page}&_limit=${limit}`).then((data) => data.json());
    return response;
  }

  async getTotalCars() {
    const response = await fetch(`${this.adress}/garage`).then((data) => data.json());
    return response;
  }

  async getCar(id: string) {
    const response = await fetch(`${this.adress}/garage/${id}`).then((data) => data.json());
    return response;
  }

  async patchEngine(id: number, status: string) {
    const response = await fetch(`${this.adress}/engine/?id=${id}&status=${status}`, {
      method: 'PATCH',
    }).then((data) => data.json());
    return response;
  }

  async postCar(nameValue: string, colorValue: string) {
    const obj = {
      name: nameValue,
      color: colorValue,
    };
    const response = await fetch(`${this.adress}/garage`, {
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
    const response = await fetch(`${this.adress}/garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    }).then((data) => data.json());
    console.log(response);
    return response;
  }

  async deleteCar(id: string) {
    const response = await fetch(`${this.adress}/garage/${id}`, {
      method: 'DELETE',
    }).then((data) => data.json());
    return response;
  }
}

export default API;
