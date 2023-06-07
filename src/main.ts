import App from "./app";
import UserRouter from "./routes/user.routes";

const app:App = new App([new UserRouter()])

app.listen()