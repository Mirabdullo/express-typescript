import App from "./app";
import PostRouter from "./routes/post.routes";
import UserRouter from "./routes/user.routes";

const app:App = new App([new UserRouter(), new PostRouter()])

app.listen()