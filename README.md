<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Yin_yang.svg/480px-Yin_yang.svg.png" width="200" alt="Logo" />
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center"> <span style="font-size: 20px;">☯</span> <a href="https://nestjs.com/" target="_blank">Nestjs</a> module to cache data with <a href="https://www.npmjs.com/package/redis" target="_blank">redis</a> uses the official <a href="https://github.com/redis/node-redis" target="_blank">node-redis</a> library of <a href="https://redis.io/" target="_blank">Redis</a>. <span style="font-size: 20px;">☯</span></p>
    <p align="center">

## ⋩ Installation

```bash
$ npm install nestjs-cache-redis
# OR
$ yarn add nestjs-cache-redis
# OR
$ pnpm add nestjs-cache-redis
```

## ⋩ Using

<p> <span style="font-size: 20px;">☯</span> The package has two main parts: </p>

### ⋫ Module

```typescript
@Module({
  imports: [CacheModule.register({})],
  controllers: [],
  providers: [],
})
export class AppModule {}

// OR

@Module({
  imports: [CacheModule.registerAsync({})],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

The `CacheModuleOptions` have default value:

```typescript
{
  isGlobal: false,
  url: "redis://localhost:6379",
  FIFO: {
    ttl: 60, // seconds
    max: 100, // max items was stored in cache
    resetExpires: false,
    hashKeyName: "FIFO",
    listKeyName: "FifoPriority"
  },
  LRU: {
    ttl: 60,
    max: 100,
    resetExpires: false,
    hashKeyName: "LRU",
    sortedSetKeyName: "LruPriority"
  },
  LFU: {
    ttl: 60,
    max: 100,
    resetExpires: false,
    hashKeyName: "LFU",
    sortedSetKeyName: "LfuPriority"
  }
}
```

#### For more options configuration, please [read it](https://github.com/redis/node-redis/blob/HEAD/docs/client-configuration.md).

#### Service usage:

```typescript
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectCache()
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  async getHello() {
    await this.cacheService.rPush('listKeyName', 'key');
    return this.appService.getHello();
  }
}
```

#### For more usage method, is [this](https://github.com/redis/node-redis/blob/dbf8f59a47573e6a1c75b78e566af8c493015d5d/packages/client/lib/client/commands.ts) union with [this](https://github.com/redis/node-redis/blob/dbf8f59a47573e6a1c75b78e566af8c493015d5d/packages/client/lib/cluster/commands.ts)

### ⋫ Note

The instance created by `CacheService` is the same instance returned by `createClient()` of <a href="https://github.com/redis/node-redis" target="_blank">node-redis</a>.

### ⋫ Interceptors

You can use it for `controller` or `method`

```typescript
// For controller
@Controller()
@UseInterceptors(CacheLruInterceptor)
export class AppController {
  ...
}

// For method
@Controller()
export class AppController {
  @Get()
  @UseInterceptors(CacheFifoInterceptor)
  getHello() {
    ...
  }
}
```

#### All interceptors (`CacheFifoInterceptor`, `CacheLruInterceptor` and `CacheLfuInterceptor`) is only support `GET` method

### FIFO

```
 ☯ Explanation: In the FIFO cache eviction strategy, items are removed from the cache based on the order they were added. The item that was added first will be removed first when the cache is full.

 ☯ Example: Suppose the cache can only hold 100 items and it's full. When a new item is added, it goes to the end of the list, and the item at the beginning of the list (the oldest item) will be evicted from the cache.
```

### LRU

```
 ☯ Explanation: In the LRU cache eviction strategy, items are removed from the cache based on the least recently used principle. The item that was accessed least recently will be evicted first when the cache is full.

 ☯ Example: Consider a scenario where the cache is full and can only store 100 items. When a new item is accessed, it is moved to the front of the list, and the item at the end of the list (the least recently accessed item) will be evicted from the cache.
```

### LFU

```
 ☯ Explanation: In the LFU cache eviction strategy, items are removed from the cache based on the least frequently used principle. The item that has been accessed the fewest number of times will be evicted first when the cache is full.

 ☯ Example: If an item has been accessed multiple times in the past, it will have a high access count and is less likely to be evicted. Conversely, an item that has been accessed infrequently will have a low access count and may be quickly evicted when the cache is full.
```

## ⋩ Support

nestjs-cache-redis is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [contact me](mailto://caulata1234@gmail.com).

## ⋩ Stay in touch

- Author - [Lê Hoàng Cầu](https://www.facebook.com/Sep29th)
- Github - [Sep29th](https://github.com/Sep29th)

## ⋩ License

nestjs-cache-redis is [MIT licensed](LICENSE).
