// import Redis from 'ioredis';

// // Cấu hình Redis lấy từ biến môi trường
// const redisConfig = {
//   host: process.env.REDIS_HOST || 'localhost',
//   port: parseInt(process.env.REDIS_PORT, 10) || 6379,
// };

// // Hàm tạo client Redis với cấu hình trên
// export const createRedisClient = (): Redis => {
//   return new Redis(redisConfig);
// };

// // Export cấu hình để sử dụng ở nơi khác nếu cần
// export { redisConfig };

//server vps redis
import Redis from 'ioredis';

// Sử dụng REDIS_URL từ biến môi trường
const redisUrl = process.env.REDIS_URL;

// Khởi tạo Redis client với URL từ Render
export const createRedisClient = (): Redis => {
  return new Redis(redisUrl);
};

export { redisUrl };
