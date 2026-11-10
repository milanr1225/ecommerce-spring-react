interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <button onClick={() => onChange(page - 1)} disabled={page === 0}>
        Previous
      </button>
      <span>
        Page {page + 1} of {totalPages}
      </span>
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages - 1}>
        Next
      </button>
    </div>
  )
}