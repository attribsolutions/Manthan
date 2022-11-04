const SaveButton = (props) => {
  const { pageMode, userAcc, module,onClick} = props
  return (
    <div>
      {
        pageMode === "edit" ?
          (userAcc.RoleAccess_IsEdit) || (userAcc.RoleAccess_IsEditSelf) ?
            <button
              type="submit"
              data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Update ${module}`}
              className="btn btn-success w-md"
              onClick={onClick}
            >
              <i class="fas fa-edit me-2"></i>Update
            </button>
            :
            <></>
          : (
            userAcc.RoleAccess_IsSave ?
              <button
                type="submit"
                data-mdb-toggle="tooltip" data-mdb-placement="top" title={`Save ${module}`}
                className="btn btn-primary w-md"
                onClick={onClick}
              > <i className="fas fa-save me-2"></i> Save
              </button>
              :
              <></>
          )
      }
    </div>
  )
}
export default SaveButton