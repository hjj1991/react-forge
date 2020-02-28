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

const UserBoard = ({userList, onClickAciton, onClickAddRow, addRows, onChangeAddRow, onClickRemove, onClickRowSubmit}) => {
    

    const products = userList.data.content;
    console.log(products);
    const columns = [
        {
            dataField: 'companyIdx.companyName',
            text: '소속',
            sort: true,
        }, 
        {
            dataField: 'userId',
            text: '계정',
            sort: true
        }, 
        {
            dataField: 'name',
            text: '이름',
            sort: true,
        }, 
        {
            dataField: 'userEmail',
            text: '이메일',
            sort: true,
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
        clickToExpand: true
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
            <Container>
                <Row>
                    <Col>
                        소속: {row.companyIdx.companyName}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        이메일: {row.userEmail}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        전화번호: {row.userTel}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        휴대폰번호: {row.userTel}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        생성일자: {row.createdDate.substring(0, 10)}
                    </Col>
                </Row>
            </Container>
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
                      keyField="userIdx"
                      columns={ columns }
                      data={ products }
                      search
                    >
                      {
                        toolkitprops => (
                          <div>
                              <hr />
                              
                                  <Button variant="outline-info" onClick={onClickAddRow}>신규등록</Button>
                              <hr />
                              <div>
                            <MySearch { ...toolkitprops.searchProps } />
                            </div>
                            <hr />
                            <SizePerPageDropdownStandalone { ...paginationProps } />
                            <BootstrapTable classes="user-table"
                                      bordered={false}
                                    //   cellEdit={cellEdit}
                                    //   selectRow={selectRow}
                              { ...toolkitprops.baseProps }
                              { ...paginationTableProps }
                              wrapperClasses="table-responsive"
                              expandRow = { expandRow }
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
export default UserBoard;