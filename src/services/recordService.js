import Record from "../models/Record";

export async function getCurrentRecord(userid, type) {
    const validTypes = ["bodyweight", "squat", "bench", "deadlift"];
    if (!validTypes.includes(type)) {
        throw Error("Invalid type");
    }

    const record = await Record.findOne({
        attributes: ["weight"],
        where: {
            recordtype: type,
            userid: userid
        },
        order: [["recordid", "DESC"]]
    });

    if (record === null) {
        throw Error(`${type} record not found for user: ${userid}`);
    } else {
        return record;
    }
}