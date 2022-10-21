import React, { useEffect, useState } from "react";
import { Input, Label } from "reactstrap";

export default function UnitTable(props) {
  const ref = React.useRef();
  let baseUN = '';
  const [baseUnit, setbaseUnit] = useState([]);
  const [val, setVal] = useState();

  useEffect(() => {
    setbaseUnit(props.data);
    setVal('')    
  }, [props]);

  return (
    // baseUnit.length > 0 ?
    <div className="table-responsive" id="tblItemUnit">
      <table className="table table-bordered mb-0 table">
        <thead>
          <tr>
            <th> UnitName</th>
            <th>Conversion</th>
            <th>Base Unit</th>
            <th>default</th>
          </tr>
        </thead>
        <tbody>
          {baseUnit.map((unit, k) => {
            return (
              <tr>
                <td>{"1 " + unit.Name + " ="}</td>
                <td>
                  <div class="row">
                    <div class="col-md-8">
                      <input
                        type="text"
                        className="col-sm-3"
                        Value={unit.defaultValue}
                      />
                      {/* <input type="text" value={val} /> */}
                    </div>
                    <div class="col-md-4">
                      <Label>{unit.defaultValue}</Label>
                    </div>
                  </div>
                </td>
                <td>
                  <Input
                    type="checkbox"
                    readOnly="true"
                    checked={unit.defaultValue ===1? true : false}
                  ></Input>
                </td>
                <td>
                  <Input type="radio" Name="abc"></Input>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    // : <></>
  );
}
