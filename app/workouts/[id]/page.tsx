
const WorkoutPage = async({params}: {params: Promise<{ id: string }>}) => {
  const workoutId = (await params).id

  return (
    <div>{workoutId}</div>
  )
}

export default WorkoutPage