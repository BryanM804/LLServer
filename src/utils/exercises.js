import Exercise from "../models/Exercise";

export async function getAllExercises() {
    const exerciseList = await Exercise.findAll({
        attributes: ["movement"]
    });
    return exerciseList;
}

export async function getBodyweightExercises() {
    const bodyweightList = await Exercise.findAll({
        attributes: ["movement", "splittable"],
        where: {
            isbodyweight: true
        }
    });
    return bodyweightList;
}

export async function getSplittableExercises() {
    const splittableExercises = await Exercise.findAll({
        attributes: ["movement"],
        where: {
            splittable: true
        }
    });
    return splittableExercises;
}