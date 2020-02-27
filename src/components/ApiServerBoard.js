import React, { Fragment } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone, PaginationTotalStandalone   } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import {Container, Row, Col, Form, Button, ListGroup} from 'react-bootstrap'
import Alert from 'react-bootstrap/Alert'
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


const ApiServerBoard = ({apiServerList, onClickAciton, onClickAddRow, addRows, onChangeAddRow, onClickRemove, onClickRowSubmit}) => {
    let newRows;
    if(addRows.length > 0){
        newRows =  (
            <Fragment>
                <Alert variant="danger" style={{marginTop:'10px'}}>
                    ※ 추가할 Migrate API서버 정보를 입력해주세요.
                </Alert>
                <Table  hover >
                <thead>
                    <tr>
                        <th width="2%"></th>
                        <th>소속</th>
                        <th>호스트</th>
                        {/* <th>도메인네임</th> */}
                        <th>계정</th>
                        <th>암호</th>
                    </tr>
                </thead>
                <tbody> 
                    {addRows.map((item, idx) => (
                    <tr id="row0" key ={idx}>
                        <td>{idx+1}</td>
                        <td>
                            <select className="form-control"
                                value={addRows[idx].companyName == null? "" : addRows[idx].companyName}
                                onChange={(e) => {(onChangeAddRow(e, idx))}}
                                name="companyName">
                                    {apiServerList.companyList.map((item2, indx) => (
                                    <option value={item2}>{item2}</option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <input className="form-control form-control-sm" type="text"
                                value={addRows[idx].serverHost == null? "" : addRows[idx].serverHost}
                                name="serverHost"
                                onChange={(e) => {(onChangeAddRow(e, idx))}}
                            />
                        </td>
                        {/* <td>
                            <input className="form-control form-control-sm" type="text"
                                value={addRows[idx].domainNameToAccessProtectServer == null? "" : addRows[idx].domainNameToAccessProtectServer}
                                name="domainNameToAccessProtectServer"
                                onChange={(e) => {(onChangeAddRow(e, idx))}}
                            />
                        </td> */}
                        <td>
                            <input className="form-control form-control-sm" type="text"
                                value={addRows[idx].userNameToAccessProtectServer == null? "" : addRows[idx].userNameToAccessProtectServer}
                                name="userNameToAccessProtectServer"
                                onChange={(e) => {(onChangeAddRow(e, idx))}}
                            />
                        </td>
                        <td>
                            <input className="form-control form-control-sm" type="text"
                                value={addRows[idx].passwordToAccessProtectServer == null? "" : addRows[idx].passwordToAccessProtectServer}
                                name="passwordToAccessProtectServer"
                                onChange={(e) => {(onChangeAddRow(e, idx))}}
                            />
                        </td>
                        <td>
                            <Button variant="outline-danger" onClick={() => {(onClickRemove(idx))}}>X</Button>
                        </td>
                    </tr>
                    ))}
                    </tbody>
                </Table>
                <div>
                    <Button variant="outline-info" onClick={onClickRowSubmit}>일괄등록</Button>
                </div>
            </Fragment>
        )
    }
    
    
    const companyList = [];
    apiServerList.companyList.forEach(company => {
        const companyValue = {};
        companyValue.value = company
        companyValue.label = company
        companyList.push(companyValue);
    });
    const products = apiServerList.data.content;
    const columns = [
        // {
        //     dataField: 'companyIdx',
        //     text: '번호',
        //     sort: true,
        //     searchable: false,
        //     editable: (cell, row, rowIndex, colIndex) => {
        //         // return true or false;
        //         return false;
        //     }
        // },
        {
            dataField: 'companyName',
            text: '소속',
            sort: true,
            // editorStyle: (cell, row, rowIndex, colIndex) =>{
            //     return {fontSize:12};
            // },
            editor: {
                type: Type.SELECT,
                options: companyList
            }
        }, 
        {
            dataField: 'serverHost',
            text: '호스트',
            sort: true
        }, 
        // {
        //     dataField: 'domainNameToAccessProtectServer',
        //     text: '도메인네임',
        //     sort: true,
        //     // editorStyle: (cell, row, rowIndex, colIndex) =>{
        //     //     return {fontSize:12};
        //     // },
        //     editable: (cell, row, rowIndex, colIndex) => {
        //         // return true or false;
                
        //         return true;
        //     }
        // }, 
        {
            dataField: 'userNameToAccessProtectServer',
            text: '계정',
            sort: true,
            // editorStyle: (cell, row, rowIndex, colIndex) =>{
            //     return {fontSize:12};
            // },
            editable: (cell, row, rowIndex, colIndex) => {
                // return true or false;
                
                return true;
            }
        }, 
        {
            dataField: 'passwordToAccessProtectServer',
            text: '암호',
            sort: true,
            // editorStyle: (cell, row, rowIndex, colIndex) =>{
            //     return {fontSize:12};
            // },
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
            text: '상태',
            sort: true,
            searchable: false,
            editor: {
                type: Type.CHECKBOX,
                value: 'Y:N'
            },
            onsort: (field, order) => {
            },
            formatter: (cell) => {
                if(cell == "N"){
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


    const selectRow = {
        mode: 'checkbox',
        clickToSelect: false,
        clickToEdit: true,
        // clickToExpand: true
      };
    const cellEdit = cellEditFactory({
            mode: 'click',
            blurToSave: true,
        }) 

    const customTotal = (from, to, size) => (
        <span className="react-bootstrap-table-pagination-total">
          Showing { from } to { to } of { size } Results
        </span>
      );

    const expandRow = {
        onlyOneExpanding: true,
        showExpandColumn: false,
        renderer: row => (
          <div>
            <p>{ `This Expand row is belong to rowKey ${row.id}` }</p>
            <p>You can render anything here, also you can add additional data on every row object</p>
            <p>expandRow.renderer callback will pass the origin row object to you</p>
          </div>
        )
      };

    const paginationOptions = {
        custom: true,
        paginationSize: 5,
        pageStartIndex: 1,
        withFirstAndLast: false,
        // alwaysShowAllBtns: true, // Always show next and previous button
        // withFirstAndLast: false, // Hide the going to First and Last page button
        // hideSizePerPage: true, // Hide the sizePerPage dropdown always
        // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: true,
        paginationTotalRenderer: customTotal,
        sizePerPageList: [{
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'All', value: products.length
        }] // A numeric array is also available. the purpose of above example is custom the text
      };

    const MySearch = (props) => {
        let input;
        const handleChange = () => {
          props.onSearch(input.value);
        };
        return (
            <input
              className="form-control"
              placeholder="검색어를 입력해주세요."
              size="15"
            //   style={ { backgroundColor: 'pink' } }
              ref={ n => input = n }
              type="text"
              onChange={handleChange}
            />
        );
      };
      
      return (
        <Fragment>
          <PaginationProvider
            pagination={
              paginationFactory(paginationOptions)
            }
          >
              {
                  ({
                      paginationProps,
                      paginationTableProps
                  }) => (
                    <div>
                    <ToolkitProvider
                      keyField="apiserverIdx"
                      columns={ columns }
                      data={ products }
                      search
                    >
                      {
                        toolkitprops => (
                          <div>
                              <div>
                                  {newRows}
                              </div>
                              <hr />
                              
                                  <Button variant="outline-info" onClick={onClickAddRow}>신규등록</Button>
                              <hr />
                              <div>
                            <MySearch { ...toolkitprops.searchProps } />
                            </div>
                            <hr />
                            <SizePerPageDropdownStandalone { ...paginationProps } />
                            <BootstrapTable classes="apiserver-table"
                                      bordered={false}
                                      cellEdit={cellEdit}
                                      selectRow={selectRow}
                              { ...toolkitprops.baseProps }
                              { ...paginationTableProps }
                              wrapperClasses="table-responsive"
                            //   expandRow = { expandRow }
                            />
                            <PaginationTotalStandalone { ...paginationProps }/>
                            
                            <PaginationListStandalone { ...paginationProps } />
                          </div>
                        )
                      }
                    </ToolkitProvider>
                    
                  </div>
                  )
              }
          </PaginationProvider>
        </Fragment>
      );
};
export default ApiServerBoard;