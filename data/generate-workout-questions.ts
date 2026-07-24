export const workoutQuestions = [
    {
        question: "What is your primary fitness goal?",
        value: "goal",
        type: "single-choice",
        options: [
            {
                label: "Fat Loss",
                value: "fat_loss",
            }, {
                label: "Hypertrophy",
                value: "hypertrophy",
            }, {
                label: "Endurance",
                value: "endurance",
            }
        ]
    },
    {
        question: "What is your experience level?",
        value: "experienceLevel",
        type: "single-choice",
        options: [
            {
                label: "Beginner",
                value: "beginner",
                description: "< 1 year"
            }, {
                label: "Intermediate",
                value: "intermediate",
                description: "1-2 years"
            }, {
                label: "Advanced",
                value: "advanced",
                description: "> 2 years"
            }
        ]
    },
    {
        question: "What are your target muscle groups?",
        value: "targetMuscleGroups",
        type: "multi-choice",
        style: "grid",
        options: [
            {
                label: "Chest",
                value: "chest",
                image: ""
            }, {
                label: "Back",
                value: "back",
                image: ""
            }, {
                label: "Legs",
                value: "legs",
                image: ""
            }, {
                label: "Shoulders",
                value: "shoulders",
                image: ""
            }, {
                label: "Biceps",
                value: "biceps",
                image: ""
            },{
                label: "Triceps",
                value: "triceps",
                image: ""
            }, {
                label: "Core",
                value: "core",
                image: ""
            }
        ]
    },
    {
        question: "What is your preferred session duration?",
        value: "sessionDuration",
        type: "single-choice",
        options: [
        {
                label: "30 minutes",
                value: "30",
            }, {
                label: "1 hour",
                value: "60",
            }, {
                label: "1.5 hours",
                value: "90",
            }
        ]
    },
    {
        question: "What type of gym do you have access to?",
        value: "equipment",
        type: "single-choice",
        options: [
            {
                label: "None (Bodyweight only)",
                value: "body_weight_only"
            }, {
                label: "Garage gym",
                value: "garage_gym",
            }, {
                label: "Local gym",
                value: "local_gym",
            }, {
                label: "Fitness center",
                value: "fitness_center",
            }
        ]
    }
]