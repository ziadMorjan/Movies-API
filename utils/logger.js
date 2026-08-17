import fs from 'fs';
import path from 'path';

const logDirectory = path.join(process.cwd(), 'logs');
try {
    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory, { recursive: true });
    }
} catch (e) {
    // ignore directory creation error in read-only environment
}

export const errorLogger = err => {
    console.error("❌ [Error]:", err);
    try {
        const logPath = path.join(logDirectory, 'error.log');
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${err?.statusCode || 500} - ${err?.message}\n${err?.stack}\n\n`;
        fs.appendFileSync(logPath, logMessage, 'utf8');
    } catch (fsErr) {
        // ignore filesystem write errors on cloud hosts
    }
};