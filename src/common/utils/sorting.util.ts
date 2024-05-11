import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export interface ISorting {
  property: string;
  direction: string;
}

export const SortingParams = createParamDecorator(
  (validParams, ctx: ExecutionContext): ISorting => {
    const req = ctx.switchToHttp().getRequest();
    const sort = req.query.sort as string;
    if (!sort) return null;

    if (typeof validParams != 'object') {
      throw new BadRequestException('Invalid sort parameters');
    }

    const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
    if (!sort.match(sortPattern)) {
      throw new BadRequestException('Invalid sort parameters.');
    }

    const [property, direction] = sort.split(':');
    if (!validParams.includes(property)) {
      throw new BadRequestException(`Invalid sort property: ${property}`);
    }

    return { property, direction };
  },
);
