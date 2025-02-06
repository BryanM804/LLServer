import Label from "../models/Label";

export async function createLabel(userid, label, date) {
    const newLabel = await Label.create({
        userid: userid,
        label: label,
        date: date
    });

    return newLabel;
}

export async function getLabel(userid, date) {
    const returnLabel = await Label.findOne({
        attributes: ["label"],
        where: {
            userID: userid,
            date: date,
        },
        order: [
            ["labelid", "DESC"]
        ]
    });
    return returnLabel;
}