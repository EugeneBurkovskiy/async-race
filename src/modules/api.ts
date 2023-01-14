class API {
  async getCars() {
    const response = await fetch('http://127.0.0.1:3000/garage').then((data) => data.json());
    return response;
  }

  async patchEngine(id: number, status: string) {
    const response = await fetch(`http://127.0.0.1:3000/engine/?id=${id}&status=${status}`, {
      method: 'PATCH',
    }).then((data) => data.json());
    return response;
  }
}

export default API;
