module.exports = (movement, weight, reps, bodyweight) => {
    let total = 0;

    if (movement.indexOf("Dumbbell") >= 0 || movement.startsWith("Hammer")) {
        total += (2 * weight * reps);
        
    } else if (movement.indexOf("Assisted") >= 0) {
        //If an exercise is assisted and the user has bodyweight registered this adjusts xp and total accordingly
        if (bodyweight > 0) {
            total += ((bodyweight - weight) * reps);
        }
        
    } else if (movement == "Pull Up" || movement == "Chin Up" || movement == "Dip") {
        //If an exercise is a bodyweight exercise this adjusts xp and total accordingly
        if (bodyweight > 0) {
            total += ((bodyweight + weight) * reps);
        }

    } else {
        total += weight * reps;
    }

        return total;
}