import app from "./app.js";
import { config } from "./config/envSchema.js";
const env = config();
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT.toString()}`);
});
