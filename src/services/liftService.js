import Lift from "../models/Lift";
import { BONUS_SET_XP } from "../utils/constants";
import { getBodyweightExercises } from "../utils/exercises";
import { changeXp, giveXp } from "./accountService";
import { getCurrentRecord } from "./recordService";

export async function addSet(userid, movement, weight, reps, date=null) {
    let dateString;
    let time = null;

    if (date == null) {
        dateString = new Date().toDateString();
        time = new Date().toLocaleTimeString("en-US");
    } else {
        dateString = new Date(Date.parse(date)).toDateString();
    }

    const newSet = Lift.build({
        userID: userid,
        movement: movement,
        weight: weight,
        reps: reps,
        date: dateString,
        time: time
    })

    const bodyweightExercises = await getBodyweightExercises();

    if (bodyweightExercises.includes(movement)) {
        const bodyweight = await getCurrentRecord(userid, "bodyweight");
        newSet.setSetTotal(bodyweight);
    } else {
        newSet.setSetTotal();
    }

    await newSet.save();
    await changeXp(userid, newSet.settotal + BONUS_SET_XP);

    return;
}

export async function removeSet(userid, setid) {
    const removedSet = await Lift.findOne({
        where: {
            userID: userid,
            setid: setid
        }
    });

    if (removedSet === null) {
        throw Error("Set not found");
    }

    await changeXp(userid, removedSet.settotal + BONUS_SET_XP)

    await removedSet.destroy();
}