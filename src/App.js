import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import paginateStyle from './App.module.scss'

function App() {

  const [comments, setComments] = useState([])
  const [isPending, setIsPending] = useState(false)
  const [pageLimit, setPageLimit] = useState(0)

  const fetchComments = async () => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=1&_limit=12`)
    const data = await res.json()
    const totalResponse = res.headers.get('x-total-count')
    let totalPartialResponse = Math.ceil(totalResponse / 12)
    setComments(data)
    setPageLimit(totalPartialResponse)
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const HandlePerPage = useCallback( async (currentPage) => {
    setIsPending(true)
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=12`)
    const data = await res.json()
    return data
  }, [])

  const handlePageClick = async (count) => {
    let newCount = parseInt(count.selected) + 1
    const fetchPerPage = await HandlePerPage(newCount)
    setComments(fetchPerPage)
    setIsPending(false)
  }

  return (
    <div className="App">
      <div className={paginateStyle.container}>
          <h2>Comments</h2>
          {isPending && <p>Loading..</p>}
          <div className={paginateStyle.grid}>
            {comments && comments.map(comment => 
              <div className={paginateStyle.grid_item} key={comment.id}> 
                  <h2>{comment.title}</h2>
                  <p>{comment.body}</p>
              </div>
            )}
          </div>
      </div>

      <ReactPaginate 
        previousLabel={''} 
        previousClassName={'fa-solid fa-angles-left'}
        nextLabel={''}
        nextClassName={'fa-solid fa-angles-right'}
        breakLabel={'...'}
        pageCount={pageLimit}
        marginPagesDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={paginateStyle.ul_container}
        pageClassName={paginateStyle.btn}
        pageLinkClassName={'link'}
        activeClassName={paginateStyle.active}
        disabledClassName={paginateStyle.disabled}
      />
    </div>
  );
}

export default App;
