export const AppConfig = () => ({
    ENVIROMENT: process.env.NODE_ENV || 'dev',
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT || 3001,
    DEFAULT_LIMIT: process.env.DEFAULT_LIMIT || 10
})