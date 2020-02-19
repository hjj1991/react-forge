import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import {Container, Row, Col, Form, Button, ListGroup} from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import loding from 'images/ajax-loader.gif';
import complete from 'images/complete2.png';
import cancelImg from 'images/cancel.png'
import Table from 'react-bootstrap/Table'

const GetActionFormat = (onClickAciton, cell, row) => {
        return (
            <div>
                <button type="button" className="btn btn-outline-primary btn-sm ts-buttom" size="sm" onClick={(e) => onClickAciton(e, row)}>
                    수정
                </button>
            </div>
        )
}


const CompanyBoard = ({companyList, onClickAciton, onClickAddRow, addRows, onChangeAddRow, onClickRemoveButton}) => {

    const selectRow = {
        mode: 'checkbox',
        clickToSelect: false,
        clickToEdit: true
      };
    const cellEdit = cellEditFactory({
            mode: 'click',
            blurToSave: true,
        }) 

    let newRows;
        console.log(addRows);
    if(addRows.length > 0){
        newRows =  (
            <Table striped bordered hover>
            <thead>
                <tr>
                    <th width="2%"></th>
                    <th>회사ID</th>
                    <th>회사명</th>
                    <th></th>
                </tr>
            </thead>
            <tbody> 
                {addRows.map((item, idx) => (
                <tr id="row0" key ={idx}>
                    <td>{idx}</td>
                    <td>
                        <input className="form-control form-control-sm" type="text"
                            value={addRows[idx].companyId == null? "" : addRows[idx].companyId}
                            name="companyId"
                            onChange={(e) => {(onChangeAddRow(e, idx))}}
                        />
                    </td>
                    <td>
                        <input className="form-control form-control-sm" type="text"
                            value={addRows[idx].companyName == null? "" : addRows[idx].companyName}
                            name="companyName"
                            onChange={(e) => {(onChangeAddRow(e, idx))}}
                        />
                    </td>
                    <td>
                        <Button variant="outline-danger" onClick={() => {(onClickRemoveButton(idx))}}>삭제</Button>
                    </td>
                </tr>
                ))}
                </tbody>
            </Table>
        )
    }
    
    
    console.log(companyList);
    const { SearchBar } = Search;
    const products = companyList;
    const columns = [{
            dataField: 'companyIdx',
            text: '번호',
            sort: true,
            searchable: false,
            editable: (cell, row, rowIndex, colIndex) => {
                // return true or false;
                return false;
            }
        },
        {
            dataField: 'companyId',
            text: '회사ID',
            sort: true,
            validator: (newValue, row, column) => {
                
                var checkVal = /^[a-zA-Z0-9_]{2,20}$/
                console.log(!checkVal.test(newValue));
                if (!checkVal.test(newValue)) {
                  return {
                    valid: false,
                    message: '2 ~ 20자리 숫자, 영문, _ 문자만 사용가능합니다.'
                  };
                }
                return true;
              }
        }, 
        {
            dataField: 'companyName',
            text: '회사명',
            sort: true,
            editable: (cell, row, rowIndex, colIndex) => {
                // return true or false;
                
                return true;
            }
        }, 
        {
            dataField: 'createdDate',
            text: '생성일자',
            sort: true,
            searchable: false,
            editable: (cell, row, rowIndex, colIndex) => {
                // return true or false;
                return false;
            },
            formatter: (cell, row, index, extraData) => (
                    cell.substring(0, 10)
            )
        }, 
        {
            dataField: 'deletedYn',
            text: '삭제여부',
            sort: true,
            searchable: false,
            editor: {
                type: Type.CHECKBOX,
                value: 'Y:N'
            },
            onsort: (field, order) => {
            },
            formatter: (cell) => {
                if(cell == "Y"){
                    return <img width="24px" alt="삭제됨" src={complete}/>
                }else{
                    return <img width="24px" alt="정상" src={cancelImg}/>
                }
                }
        },
        {
            text: 'action',
            dataField: '',
            formatter: (cell, row) => (
                GetActionFormat(onClickAciton, cell, row)
            ),            
            editable: (cell, row, rowIndex, colIndex) => {
                
                return false;
            },
        }
    ];

    return (
        <ToolkitProvider
            keyField="companyIdx"
            data={ products }
            columns={ columns }
            search
        >
            {
                props => (
                <div>
                    <div>
                        {newRows}
                    </div>
                    <hr />
                <Button variant="outline-info" onClick={onClickAddRow}>행 추가</Button>
                    <SearchBar { ...props.searchProps } />
                    <hr />
                    <BootstrapTable 
                        { ...props.baseProps } 
                        cellEdit={cellEdit}
                        selectRow={selectRow} />
                    </div>
                )
            }
        </ToolkitProvider>
            )
};

export default CompanyBoard;