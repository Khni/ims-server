import app from "./app.js";
import { config } from "./config/envSchema.js";
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT.toString()}`);
});
