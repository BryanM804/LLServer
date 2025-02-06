import * as profile from "./controllers/profile.js"
import * as history from "./controllers/history.js"
import * as log from "./controllers/log.js"

export const attachRoutes = (app) => {
    app.get("/profile/:userid", profile.getUserStats)
    app.post("/newUser/:userid", profile.createNewProfile)
    app.post("/changepass", profile.changePassword)

    app.get("/history", history.getHistoryFromDate)
    app.get("/last", history.findLastOccurence)

    app.post("/log", log.addSet)
    app.delete("/log", log.removeSet)
}