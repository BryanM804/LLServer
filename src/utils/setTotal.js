export const getSetXp = (movment, weight, reps, bodyweight=0) => {
    let xpAmount = 100;

    if (movement.indexOf("Dumbbell") >= 0 || movement.startsWith("Hammer Curl") || movement.startsWith("Zottman Curl")) {
        xpAmount += (2 * weight * reps);
    } else if (movement.indexOf("Assisted") >= 0) {
        // If an exercise is assisted and the user has bodyweight registered this adjusts xp and total accordingly
        if (bodyweight > 0) {
            xpAmount += ((bodyweight - weight) * reps);
        }
        
    } else if (movement == "Pull Up" || movement == "Chin Up" || movement == "Dip") {
        // If an exercise is a bodyweight exercise this adjusts xp and total accordingly
        if (bodyweight > 0) {
            xpAmount += ((bodyweight + weight) * reps);
        }
    } else {
        xpAmount += weight * reps;
    }

    return xpAmount;
}

export const getSetTotal = (movement, weight, reps, bodyweight=0) => {
    return getSetXp(movement, weight, reps, bodyweight) - 100;
}