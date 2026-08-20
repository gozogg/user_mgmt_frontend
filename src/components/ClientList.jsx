import ClientOccuranceBlock from "./ClientOccuranceBlock"

export default function ClientList({ clients }) {
  if (!clients.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <i className="fa-solid fa-users mb-3 text-2xl text-slate-400"></i>
        <p className="text-slate-600">No clients yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Add your first client to get started.
        </p>
      </div>
    )
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <li key={client.id}>
          <ClientOccuranceBlock client={client} />
        </li>
      ))}
    </ul>
  )
}
