import React from "react"
import { StaticContext, } from "react-router"
import { RouteComponentProps, } from "react-router-dom"

export default (props: RouteComponentProps<{}, StaticContext, { text: string }>) => {
  return (
    <div className="container">
      <div className="row mb-3">
        <h1>Check your writing</h1>
      </div>
      <div className="row">
        <div className="col-lg-4 col-12">
          <p>
            Modi temporibus esse dolorem quasi dolorem doloremque ipsum similique. Non laudantium temporibus rerum. Assumenda blanditiis aut quo sed ratione non culpa error. Quis dolores sunt harum. Et rerum minima voluptatem eveniet quia cumque commodi.
          </p>
        </div>
        <div className="col-lg-8 col-12">
          <textarea className="form-control" rows={6}>
            {props.location.state.text}
          </textarea>
        </div>
      </div>
    </div>
  )
}
