import axios from 'axios';

export const localApi = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000/'
      : 'https://rifenery-dao.herokuapp.com/', // TODO: remove this when `git rebase` or `git merge`
});
