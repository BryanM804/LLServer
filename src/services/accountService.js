import Account from "../models/Account";

export function createAccount(username, password) {
    
}

export async function changeXp(userid, xpAmount) {
    const userAccount = await Account.findOne({
        where: {
            id: userid
        }
    });

    if (userAccount === null) {
        throw Error("Account not found");
    }
    if (xpAmount > 0) {
        await userAccount.addXp(xpAmount);
    } else {
        await userAccount.removeXp(xpAmount);
    }
    await userAccount.save();
    return;
}

export async function getStats(userid) {
    const userAccount = await Account.findOne({
        attributes: ["username", "xp", "level", "creationdate", "totalweight", "totalsets", "splitsmovements"],
        where: {
            userID: userid
        }
    });

    if (userAccount === null) {
        throw Error("Account not found");
    }

    return userAccount;
}