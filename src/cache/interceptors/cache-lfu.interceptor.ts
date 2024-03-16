import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheModuleOptions, CacheService } from '../cache.interface';
import { CacheModule } from '../cache.module';
import { InjectCache } from '../inject-cache.decorator';

@Injectable()
export class CacheLfuInterceptor implements NestInterceptor {
  private cacheModuleOptions: CacheModuleOptions = CacheModule.getInstance();

  constructor(
    @InjectCache()
    private cacheService: CacheService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const host = context.switchToHttp();
    const request = host.getRequest<Request>();
    const { method, url } = request;
    if (method !== 'GET') return next.handle();
    const {
      ttl,
      max,
      resetExpires = false,
      hashKeyName = `LFU`,
      sortedSetKeyName = `LfuPriority`,
    } = this.cacheModuleOptions.LFU;
    const key = `${hashKeyName}:${url}`;
    const cachedResult = await this.cacheService.hGet(hashKeyName, key);
    if (cachedResult) {
      resetExpires &&
        this.cacheService.expire(hashKeyName, ttl) &&
        this.cacheService.expire(sortedSetKeyName, ttl);
      this.cacheService.zIncrBy(sortedSetKeyName, 1, key);
      return of(JSON.parse(cachedResult));
    } else {
      return next.handle().pipe(
        tap(async (data) => {
          const length = await this.cacheService.zCard(sortedSetKeyName);
          if (length >= max)
            this.cacheService.hDel(
              hashKeyName,
              (await this.cacheService.zPopMin(sortedSetKeyName)).value,
            );
          this.cacheService.zIncrBy(sortedSetKeyName, 1, key);
          this.cacheService.hSet(hashKeyName, key, JSON.stringify(data));
          (resetExpires || length == 0) &&
            this.cacheService.expire(hashKeyName, ttl) &&
            this.cacheService.expire(sortedSetKeyName, ttl);
        }),
      );
    }
  }
}
