import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import { corsOptions } from "./config/coreOptions.js";
import { RegisterRoutes } from "./routes.js";
import { errHandler } from "./core/error-handler/index.js";

const app: Express = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet());

app.use("/docs", swaggerUi.serve, async (req: Request, res: Response) => {
  res.send(swaggerUi.generateHTML(await import("../swagger.json")));
});
RegisterRoutes(app);

app.use(errHandler);

export default app;
