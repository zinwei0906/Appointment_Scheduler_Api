import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { ApiLog } from '../../entities/api-log.entity';

export interface ApiLogData {
  apiKey: string;
  method: string;
  url: string;
  requestHeaders?: any;
  requestBody?: any;
  requestQuery?: any;
  statusCode: number;
  responseBody?: any;
  responseTime?: number;
  ipAddress?: string;
  userAgent?: string;
  language?: string;
}

@Injectable()
export class ApiLoggingService {
  constructor(
    @InjectRepository(ApiLog)
    private readonly apiLogRepository: EntityRepository<ApiLog>,
  ) {}

  // Helper method to get EntityManager from repository
  private get em(): EntityManager {
    return this.apiLogRepository.getEntityManager();
  }

  /**
   * Log an API request/response
   */
  async logRequest(logData: ApiLogData): Promise<void> {
    try {
      const apiLog = new ApiLog(
        logData.apiKey,
        logData.method,
        logData.url,
        logData.statusCode,
      );

      // Store JSON data as strings
      if (logData.requestHeaders) {
        apiLog.requestHeaders = JSON.stringify(logData.requestHeaders);
      }
      if (logData.requestBody) {
        apiLog.requestBody = JSON.stringify(logData.requestBody);
      }
      if (logData.requestQuery) {
        apiLog.requestQuery = JSON.stringify(logData.requestQuery);
      }
      if (logData.responseBody) {
        apiLog.responseBody = JSON.stringify(logData.responseBody);
      }

      apiLog.responseTime = logData.responseTime;
      apiLog.ipAddress = logData.ipAddress;
      apiLog.userAgent = logData.userAgent;
      apiLog.language = logData.language;

      this.em.persist(apiLog);
      await this.em.flush();
    } catch (error) {
      // Don't let logging errors crash the application
      console.error('Error logging API request:', error);
    }
  }

  /**
   * Get logs for a specific API key
   */
  async getLogsByApiKey(
    apiKey: string,
    limit: number = 100,
  ): Promise<ApiLog[]> {
    return this.apiLogRepository.find(
      { apiKey },
      {
        orderBy: { createdAt: 'DESC' },
        limit,
      },
    );
  }

  /**
   * Get recent logs
   */
  async getRecentLogs(limit: number = 100): Promise<ApiLog[]> {
    return this.apiLogRepository.find(
      {},
      {
        orderBy: { createdAt: 'DESC' },
        limit,
      },
    );
  }

  /**
   * Get logs by date range
   */
  async getLogsByDateRange(startDate: Date, endDate: Date): Promise<ApiLog[]> {
    return this.apiLogRepository.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
  }

  /**
   * Delete old logs (for maintenance)
   */
  async deleteOldLogs(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const oldLogs = await this.apiLogRepository.find({
      createdAt: { $lt: cutoffDate },
    });

    this.em.remove(oldLogs);
    await this.em.flush();
    return oldLogs.length;
  }
}
