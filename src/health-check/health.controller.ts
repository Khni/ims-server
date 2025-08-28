import { Get, Route, SuccessResponse, Tags } from "tsoa";

@Route("health-check")
@Tags("Health")
export class HealthController {
  /**
   * Simple health check endpoint
   */
  @Get("/")
  @SuccessResponse("200", "OK")
  public async healthCheck(): Promise<string> {
    return "Express is working successfully";
  }
}
