class API {
  async getCars(page: number, limitQuery = `&_limit${7}`) {
    const response = await fetch(`http://127.0.0.1:3000/garage/?_page${page}${limitQuery}`).then((data) => data.json());
    return response;
  }

  async getCar(id: string) {
    const response = await fetch(`http://127.0.0.1:3000/garage/${id}`).then((data) => data.json());
    return response;
  }

  async patchEngine(id: number, status: string) {
    const response = await fetch(`http://127.0.0.1:3000/engine/?id=${id}&status=${status}`, {
      method: 'PATCH',
    }).then((data) => data.json());
    return response;
  }

  async postCar(nameValue: string, colorValue: string) {
    const obj = {
      name: nameValue,
      color: colorValue,
    };
    const response = await fetch('http://127.0.0.1:3000/garage', {
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
    const response = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
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
    const response = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
      method: 'DELETE',
    }).then((data) => data.json());
    return response;
  }
}

export default API;
