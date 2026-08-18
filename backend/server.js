import app from "./src/app.js";
import config from "./src/config/config.js";

app.listen(config.port, () => console.log(`Server is Running on ${config.port}`));