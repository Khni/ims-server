import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

    if (process.env.NODE_ENV !== "production") {
      // Add regex for any localhost with any port in development
      allowedOrigins.push(/^http:\/\/localhost:\d+$/ as unknown as string);
    }
    console.log(`Requested origin: ${origin}`);

    if (!origin) return callback(null, true); // Allow non-browser requests like Postman

    if (
      allowedOrigins.includes(origin as string) || // Exact match for domains in env
      allowedOrigins.some((regex) => {
        if (typeof regex === "string") {
          return regex === origin;
        }
        return (regex as unknown as RegExp).test(origin as string);
      })
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH"],
  credentials: true,
};
