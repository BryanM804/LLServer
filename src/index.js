import express from "express"
import cors from "cors"
import { attachRoutes } from "./routes.js"
import { sqlz } from "./sqlz.js";
import Cardio from "./models/Cardio.js";
import Label from "./models/Label.js";
import Lift from "./models/Lift.js";
import Account from "./models/Account.js";

const app = express();

app.use(cors());
app.use(express.json());

attachRoutes(app);

try {
    await sqlz.authenticate();
    await sqlz.sync({ alter: true });
    // ^ this is supposed to sync all of these below but it does not do that
    await Account.sync({ alter: true });
    await Cardio.sync({ alter: true });
    await Label.sync({ alter: true });
    await Lift.sync({ alter: true });

    app.listen(5000, () => {
        console.log("Server online listening on port 5000...");
    });
} catch (error) {
    console.log("Unable to connect to database: " + error);
}