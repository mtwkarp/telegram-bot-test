import dotenv from 'dotenv'
class EnvLoader {
    public static load(): void {
        dotenv.config();

        if(process.env.mode === 'development') this.loadDevEnvVariables();

        if(process.env.mode === 'production') this.loadProdEnvVariables();
    }

    private static loadDevEnvVariables(): void {
        process.env.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN_DEVELOPMENT as string;
        process.env.TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID_DEVELOPMENT as string;
        process.env.SCHEDULE_SPREADSHEET_ID = process.env.SCHEDULE_SPREADSHEET_ID_DEVELOPMENT as string;
    }
    private static loadProdEnvVariables(): void {
        process.env.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN_PRODUCTION as string;
        process.env.TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID_PRODUCTION as string;
        process.env.SCHEDULE_SPREADSHEET_ID = process.env.SCHEDULE_SPREADSHEET_ID_PRODUCTION as string;
    }
}

export default EnvLoader