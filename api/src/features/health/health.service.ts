import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  checkHealth(): string {
    this.logger.log('Health check requested');
    return 'API is up and running!';
  }
}
