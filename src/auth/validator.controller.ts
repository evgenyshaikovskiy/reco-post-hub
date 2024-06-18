import { Controller, Get, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('validator')
export class ValidatorController {
  constructor(private readonly authService: AuthService) {}

  @Get('/email/:email')
  public async checkIfEmailExists(@Param() params) {
    return await this.authService.checkEmailExists(params.email);
  }
}