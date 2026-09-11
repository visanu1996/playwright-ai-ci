export const SDCreds = {
  users: {
    std: process.env.SD_STANDARD_USER,
    lck: process.env.SD_LOCKED_OUT_USER,
  },
  password: process.env.SD_PASSWORD,
};