import { useParams } from "react-router-dom"

function WordbookPage() {
  const { id } = useParams()

  return (
    <div>
      ワードブックID: {id}
    </div>
  )
}

export default WordbookPage