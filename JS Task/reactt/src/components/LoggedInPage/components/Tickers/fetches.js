export default class Main {
  constructor() {
    this.currentFetch = null;
  }

  async GET_ticker(headers) {
    try {
      if (this.currentFetch) {
        this.currentFetch.abort();
      }

      const abortController = new AbortController();
      this.currentFetch = abortController;

      const response = await fetch(process.env.REACT_APP_RESTAPI_HOST + '/ticker', {
        signal: abortController.signal,
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        },
      });
      const result = (await response.json()).result;
      return result;
    } catch (error) {
      console.dir(error);
    } finally {
      this.currentFetch = null;
    }
  }

  async GET_userTicker(headers) {
    try {
      if (this.currentFetch) {
        this.currentFetch.abort();
      }

      const abortController = new AbortController();
      this.currentFetch = abortController;

      const response = await fetch(process.env.REACT_APP_RESTAPI_HOST + '/user/ticker', {
        signal: abortController.signal,
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        },
      });
      const result = (await response.json()).result;
      return result;
    } catch (error) {
      console.dir(error);
    } finally {
      this.currentFetch = null;
    }
  }

  async POST_userTicker(tickerId, headers) {
    try {
      const result = await fetch(process.env.REACT_APP_RESTAPI_HOST + '/ticker/' + tickerId, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (result.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.dir(error);
    }
  }

  async DELETE_userTicker(tickerId, headers) {
    try {
      const result = await fetch(process.env.REACT_APP_RESTAPI_HOST + '/ticker/' + tickerId, {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          ...headers,
        },
      });

      if (result.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.dir(error);
    }
  }
}
