import { useParams } from "react-router-dom"

export default function JobDetailPage() {
  const { id } = useParams()

  return (
    <section>
      <h1>Job {id}</h1>
    </section>
  )
}
