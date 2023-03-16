import { Button } from "reactstrap"
import { loginUserID } from "./CommonFunction";
import * as mode from "../../routes/PageMode"

export function SaveButton(props) {

  const { pageMode = '', userAcc = {}, editCreatedBy = {}, } = props;
  const isCreated = (loginUserID() === editCreatedBy)

  if (pageMode === mode.edit) {
    if ((userAcc.RoleAccess_IsEdit) || ((userAcc.RoleAccess_IsEditSelf) && (isCreated))) {
      return <UpdateBtn {...props} />
    }

  }
  else if ((userAcc.RoleAccess_IsSave)&&(pageMode === mode.defaultsave
    || pageMode === mode.copy
    || pageMode === mode.modeSTPsave
    || pageMode === mode.dropdownAdd
    || pageMode === mode.assingLink)) {
    return <SaveBtn  {...props} />
  }
  return null
}
const SaveBtn = (props) => {
  const { module = '', onClick } = props;
  const btnId = `Save-${module.replace(/ /g, "")}`;
  return (
    <div>
      <button
        type="submit"
        id={btnId}
        title={`Save ${module}`}
        className="btn btn-primary w-md"
        onClick={onClick}
      > <i className="fas fa-save me-2"></i> Save
      </button>
    </div>
  )

}
const UpdateBtn = (props) => {
  const { module = '', onClick } = props;
  const btnId = `Update-${module.replace(/ /g, "")}`;

  return (
    <div>
      <button
        type="submit"
        id={btnId}
        title={`Update ${module}`}
        className="btn btn-success w-md"
        onClick={onClick}
      >
        <i class="fas fa-edit me-2"></i>Update
      </button >
    </div>
  )
}

export function Go_Button(props) {
  const { onClick, id } = props
  return <Button
    id={id} type="button"
    color="btn btn-outline-success border-1 font-size-12 mb-2 "
    onClick={onClick} > Go</Button>
}

export function Change_Button(props) {
  const { onClick, id } = props
  return <Button
    id={id} type="button"
    color="btn btn-outline-info border-1 font-size-12 "
    onClick={onClick}>Change</Button>

}