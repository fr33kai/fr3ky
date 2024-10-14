
// src/services/LoggingService.ts

type LogEntry = {
    id: number;
    timestamp: Date;
    prompt: string;
    response: string;
    model: string;
    duration: number; // in milliseconds
};

class LoggingService {
    private logs: LogEntry[] = [];

    addLog(prompt: string, response: string, model: string, duration: number) {
        const newLog: LogEntry = {
            id: this.logs.length + 1,
            timestamp: new Date(),
            prompt,
            response,
            model,
            duration,
        };
        this.logs.push(newLog);
        console.log('Log added:', newLog);
    }

    getAllLogs(): LogEntry[] {
        return this.logs;
    }

    clearLogs() {
        this.logs = [];
    }
}

const loggingService = new LoggingService();
export default loggingService;
