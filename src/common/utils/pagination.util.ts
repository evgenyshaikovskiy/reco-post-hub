import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export interface IPagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
}

const MAX_PAGE_SIZE = 100;



export const PaginationParams = createParamDecorator(
  (data, ctx: ExecutionContext): IPagination => {
    const req = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string);
    const size = parseInt(req.query.size as string);

    if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    if (size > MAX_PAGE_SIZE) {
      throw new BadRequestException(
        `Invalid pagination params: max page size is ${MAX_PAGE_SIZE}`,
      );
    }

    const limit = size;
    const offset = page * limit;
    return { page, limit, size, offset };
  },
);

export type PaginatedResource<T> = {
  totalItems: number;
  items: T[];
  page: number;
  size: number;
}
