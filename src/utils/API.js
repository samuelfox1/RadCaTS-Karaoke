const axios = require("axios");

const API_URL = process.env.REACT_APP_API_URL; // radcats heroku
// const API_URL = 'https://radcatskaraokeapi.herokuapp.com' // radcats heroku
// const API_URL = 'https://radcats-karaoke-api.herokuapp.com' // chomie heroku
// const API_URL = 'https://radcats-karaoke-backend.herokuapp.com' // rita heroku
// const API_URL = 'http://localhost:8080';

const API = {
  signup: (userData) => {
    return axios.post(`${API_URL}/api/signup`, userData);
  },
  login: (userData) => {
    return axios.post(`${API_URL}/api/login`, userData);
  },
  searchNewSong: (query) => {
    return axios.post(`${API_URL}/api/download`, query);
  },
  getAllSongs: () => {
    return axios.get(`${API_URL}/api/song`);
  },
  createSession: (data) => {
    return axios.post(`${API_URL}/api/session`, data);
  },
  startSession: (id) => {
    return axios.get(`${API_URL}/api/session/${id}`);
  },
  finishSession: (id, data) => {
    return axios.put(`${API_URL}/api/session/${id}`, data);
  },
  checkWebToken: (token) => {
    return axios.get(`${API_URL}/`, {
      headers: {
        authorization: `Bearer: ${token}`,
      },
    });
  },
  getLyricsBySong: (songId) => {
    return axios.get(`${API_URL}/api/lyrics/${songId}`);
  },
  getLyricsById: (id) => {
    return axios.get(`${API_URL}/api/lyric/${id}`);
  },
  uploadLyrics: (lyrics) => {
    return axios.post(`${API_URL}/api/lyrics`, lyrics);
  },
  updateLyrics: (lyrics) => {
    return axios.put(`${API_URL}/api/lyrics`, lyrics);
  },
  addLyricsToSession: (data) => {
    return axios.put(`${API_URL}/api/session/lyrics/${data.sessionId}`, data);
  },
  updateProfilePicture: (data) => {
    return axios.put(`${API_URL}/api/pfp/${data.id}`, data);
  },
};

export default API;
