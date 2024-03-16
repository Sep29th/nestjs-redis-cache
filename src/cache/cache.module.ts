import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  CacheModuleAsyncOptions,
  CacheModuleOptions,
  CacheService,
} from './cache.interface';
import { REDIS_SERVICE } from './cache.constants';
import { createClient } from 'redis';

@Module({})
export class CacheModule {
  private static instanceCacheModuleOptions: CacheModuleOptions;

  private static defaultCacheModuleOptions: CacheModuleOptions = {
    url: 'redis://localhost:6379',
    LFU: { ttl: 60, max: 100 },
    LRU: { ttl: 60, max: 100 },
    FIFO: { ttl: 60, max: 100 },
  };

  static register(cacheModuleOption: CacheModuleOptions): DynamicModule {
    cacheModuleOption = {
      ...this.defaultCacheModuleOptions,
      ...cacheModuleOption,
    };
    this.instanceCacheModuleOptions = cacheModuleOption;
    return {
      global: cacheModuleOption.isGlobal ?? false,
      module: CacheModule,
      providers: [
        {
          provide: REDIS_SERVICE,
          useFactory: async (): Promise<CacheService> =>
            await createClient(cacheModuleOption)
              .on('error', (err) => {
                throw new Error(err);
              })
              .connect(),
        } as Provider,
      ],
      exports: [REDIS_SERVICE],
    };
  }

  static registerAsync(
    cacheModuleAsyncOption: CacheModuleAsyncOptions,
  ): DynamicModule {
    const providers: Provider[] = [
      {
        provide: REDIS_SERVICE,
        useFactory: async (...args: any[]): Promise<CacheService> => {
          const options = {
            ...this.defaultCacheModuleOptions,
            ...(await cacheModuleAsyncOption.useFactory?.(...args)),
          };
          this.instanceCacheModuleOptions = options;
          const client = createClient(options);
          await client
            .on('error', (err) => {
              throw new Error(err);
            })
            .connect();
          return client;
        },
        inject: cacheModuleAsyncOption.injects || [],
      },
    ];

    if (cacheModuleAsyncOption.extraProviders)
      providers.push(...cacheModuleAsyncOption.extraProviders);

    return {
      global: cacheModuleAsyncOption.isGlobal ?? false,
      module: CacheModule,
      imports: cacheModuleAsyncOption.imports || [],
      providers,
      exports: [REDIS_SERVICE],
    };
  }

  static getInstance(): CacheModuleOptions {
    return this.instanceCacheModuleOptions;
  }
}
