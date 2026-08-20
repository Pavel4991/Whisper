import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <div>
      <h1>Page not found</h1>
      <Link to="/">Go to chat</Link>
    </div>
  )
}

export default NotFoundPage
