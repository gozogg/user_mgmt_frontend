import { useParams } from "react-router-dom"

export default function ClientDetailPage() {
  const { id } = useParams()

  return (
    <section>
      <h1>Client {id}</h1>
    </section>
  )
}
