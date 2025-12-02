import fs from 'fs';
import path from 'path';

const logDirectory = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

export const errorLogger = err => {
    if (process.env.NODE_ENV === "development") {
        console.error(err);
        return;
    }
    const logPath = path.join(logDirectory, 'error.log');
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${err.statusCode || 500} - ${err.message}\n${err.stack
        }\n\n`;
    fs.appendFileSync(logPath, logMessage, 'utf8');
}