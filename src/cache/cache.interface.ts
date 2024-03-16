import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import {
  RedisClientOptions,
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';

export type CacheOptions = { ttl: number; max: number };

export interface CacheModuleOptions extends RedisClientOptions {
  isGlobal?: boolean;
  LFU?: CacheOptions & {
    resetExpires?: boolean;
    hashKeyName?: string;
    sortedSetKeyName?: string;
  };
  LRU?: CacheOptions & {
    resetExpires?: boolean;
    hashKeyName?: string;
    sortedSetKeyName?: string;
  };
  FIFO?: CacheOptions & {
    resetExpires?: boolean;
    hashKeyName?: string;
    listKeyName?: string;
  };
}
export interface CacheOptionFactory {
  createCacheOptions(): Promise<CacheModuleOptions> | CacheModuleOptions;
}
export interface CacheModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  injects?: any[];
  useExisting?: Type<CacheOptionFactory>;
  useClass?: Type<CacheOptionFactory>;
  extraProviders?: Provider[];
  useFactory?: (
    ...args: any[]
  ) => Promise<CacheModuleOptions> | CacheModuleOptions;
}
export type CacheService = RedisClientType<
  RedisModules,
  RedisFunctions,
  RedisScripts
>;
