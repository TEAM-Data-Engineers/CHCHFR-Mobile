// logger.js
import * as FileSystem from 'expo-file-system';

const LOG_DIR = FileSystem.documentDirectory + 'logs/';

const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(LOG_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(LOG_DIR, { intermediates: true });
    }
};

const getLogFilePath = () => {
    const date = new Date();
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return `${LOG_DIR}log-${dateString}.txt`;
};

const logToFile = async (message) => {
    await ensureDirExists();
    const logFilePath = getLogFilePath();
    const logMessage = `${new Date().toISOString()} - ${message}\n`;
    await FileSystem.writeAsStringAsync(logFilePath, logMessage, { encoding: FileSystem.EncodingType.UTF8, append: true });
};

export const log = async (message) => {
    console.log(message);
    await logToFile(message);
};

export const viewLogFiles = async () => {
    try {
        const files = await FileSystem.readDirectoryAsync(LOG_DIR);
        console.log('Files in log directory:', files);
        
        // Optionally read each log file content
        for (const file of files) {
            const content = await FileSystem.readAsStringAsync(LOG_DIR + file);
            console.log(`Content of ${file}:`, content);
        }
    } catch (error) {
        console.error('Error reading log directory:', error);
    }
};
