import axios from 'axios';

export const getBlogs = async () => {
  try {
    const { data } = await axios.get('https://botswap.app/api/v1/blog/'); // dev https://dev-botdex.rocknblock.io/api/v1/blog/
    return data;
  } catch (err) {
    console.log(err);
    return '';
  }
};
