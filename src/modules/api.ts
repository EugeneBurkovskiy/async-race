class API {
  async getCars() {
    const response = await fetch('http://127.0.0.1:3000/garage').then((data) => data.json());
    return response;
  }
}

export default API;
