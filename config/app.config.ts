export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGO_URI,
  port: process.env.PORT || '4000',
  jwtSecret: process.env.JWT_SECRET,
});
