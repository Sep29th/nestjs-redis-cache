import { Inject, SetMetadata } from '@nestjs/common';
import { REDIS_SERVICE } from './cache.constants';

export const InjectCache = () => Inject(REDIS_SERVICE);
