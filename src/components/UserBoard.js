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


let newUserForm = (newUserFormView, companyList, onClickNewUserForm, checkUserValue, signUpCheckValues, onClickSignUp) => {
    if(newUserFormView){
        return(
                <Fragment>
                    <Form onSubmit={onClickSignUp}>
                        <Form.Group controlId="userId" onBlur={checkUserValue}  >
                            <Form.Label>아이디</Form.Label>
                            <Form.Control type="text" placeholder="아이디를 입력하세요" required />
                            <div style={{"color": signUpCheckValues.idFontColor}}>
                                {signUpCheckValues.idCheckMessage}
                            </div>
                        </Form.Group>
                        <Form.Group controlId="userPw" onChange={checkUserValue} >
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control type="password" placeholder="비밀번호를 입력하세요." required />
                            <div style={{"color": signUpCheckValues.pwFontColor}}>
                                {signUpCheckValues.pwCheckMessage}
                            </div>
                        </Form.Group>
                        <Form.Group controlId="userPw2" onChange={checkUserValue} >
                            <Form.Label>비밀번호확인</Form.Label>
                            <Form.Control type="password" placeholder="비밀번호를 입력하세요." required />
                            <div style={{"color": signUpCheckValues.pw2FontColor}}>
                                {signUpCheckValues.pw2CheckMessage}
                            </div>
                        </Form.Group>
                        <Form.Group controlId="name" onChange={checkUserValue} >
                            <Form.Label>이름</Form.Label>
                            <Form.Control type="text" placeholder="이름을 입력하세요" required />
                            <div style={{"color": signUpCheckValues.nameFontColor}}>
                                {signUpCheckValues.nameCheckMessage}
                            </div>
                        </Form.Group>
                        <Form.Group controlId="userTel" onChange={checkUserValue} >
                            <Form.Label>연락처</Form.Label>
                            <Form.Control type="text" placeholder="연락처를 입력하세요" />
                        </Form.Group>
                        <Form.Group controlId="userPhone" >
                            <Form.Label>핸드폰번호</Form.Label>
                            <Form.Control type="text" placeholder="휴대폰번호를 입력하세요" />
                        </Form.Group>
                        <Form.Group controlId="userEmail">
                            <Form.Label>이메일 주소</Form.Label>
                            <Form.Control type="email" placeholder="name@example.com" required />
                        </Form.Group>
                        <Form.Group controlId="companyIdx" onChange={checkUserValue}>
                            <Form.Label>소속</Form.Label>
                            <Form.Control as="select" required>
                                    <option value="">---회사목록---</option>
                                {companyList.map((value) =>(
                                    <option value={value.companyIdx}>{value.companyName}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="userRole" onChange={checkUserValue}>
                            <Form.Label>권한</Form.Label>
                            <Form.Control as="select" required>
                                <option value="">---권한목록---</option>
                                <option value="일반 사용자">일반 사용자</option>
                                <option value="전체 관리자">전체 관리자</option>
                            </Form.Control>
                        </Form.Group>
                        <Button variant="outline-secondary" type="submit" size="lg" block>
                            회원가입
                        </Button>
                    </Form>
                    <hr/>
                    <Button variant="outline-info" onClick={onClickNewUserForm}>닫기</Button>
                </Fragment>
            )
    }else{
        return <Button variant="outline-info" onClick={onClickNewUserForm}>신규등록</Button>
    }
}
const UserBoard = ({userList, companyList, newUserFormView, checkUserValue, onClickAciton, onClickNewUserForm, signUpCheckValues, modifyCheckValues, onClickSignUp, onClickModify}) => {


    

    const products = userList.data.content;
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
                <Form onSubmit={(e) => {onClickModify(e, row.userId)}}>
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">아이디</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents" id="abcd">{row.userId}</div>  
                    </Row>
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">비밀번호</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">
                            <input type="password" id="userPw" className="form-control" onChange={(e) => {checkUserValue(e, true);}} />
                            <div style={{"color": modifyCheckValues.pwFontColor}}>
                                {modifyCheckValues.pwCheckMessage}
                            </div>
                        </div>  
                    </Row>   
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">비밀번호확인</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">
                            <input type="password" id="userPw2" className="form-control" onChange={(e) => {checkUserValue(e, true);}} />
                            <div style={{"color": modifyCheckValues.pw2FontColor}}>
                                {modifyCheckValues.pw2CheckMessage}
                            </div>
                        </div>  
                    </Row>               
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">이름</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">
                            <input type="text" id="name" className="form-control" defaultValue={row.name} onChange={(e) => {checkUserValue(e, true)}} required />
                            <div style={{"color": modifyCheckValues.nameFontColor}}>
                                {modifyCheckValues.nameCheckMessage}
                            </div>
                        </div>  
                        
                    </Row>        
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">연락처</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">
                            <input type="text" id="userTel" className="form-control" defaultValue={row.userTel} />
                        </div>  
                    </Row>
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">핸드폰번호</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">
                            <input type="text" id="userPhone" className="form-control" defaultValue={row.userPhone} />
                        </div>  
                    </Row>
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">이메일 주소</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">
                            <input type="email" id="userEmail" className="form-control" defaultValue={row.userEmail}  required />
                        </div>
                    </Row>
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">소속</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">
                            <select id="companyIdx" className="form-control" defaultValue={row.companyIdx.companyIdx} required>
                                <option value="">---회사목록---</option>
                                {userList.companyList.map((value) => 
                                <option value={value.companyIdx}>{value.companyName}</option>
                                )}
                            </select>
                        </div>
                    </Row>
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">권한</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">
                            <select id="userRole" className="form-control" defaultValue={row.userRoles[0]} required>
                                <option value="">---권한목록---</option>
                                <option value="일반 사용자">일반 사용자</option>
                                <option value="전체 관리자">전체 관리자</option>
                            </select>
                        </div>           
                    </Row>
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">삭제여부</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">
                            {row.deletedYn === "Y"?
                                <Form.Check 
                                onChange={(e) => {checkUserValue(e, true)}}
                                defaultChecked
                                style={{"color": "red"}}
                                type="switch"
                                id="deletedYn"
                                name="deletedYn"
                                label="삭제하려면 체크하세요"
                            />:
                            <Form.Check 
                                onChange={(e) => {checkUserValue(e, true)}}
                                style={{"color": "red"}}
                                type="switch"
                                id="deletedYn"
                                name="deletedYn"
                                label="삭제하려면 체크하세요"
                            />
                            }
                            
                        </div>           
                    </Row>
                    <Row>
                        <div className="col-5 col-md-3 col-lg-2 info-title">생성일자</div>
                        <div className="col-7 col-md-9 col-lg-10 info-contents">{row.createdDate.substring(0, 10)}</div>
                    </Row>
                    <Button variant="outline-secondary" type="submit" size="lg" block>수정</Button>
                </Form>
            </Container>
        )
      };

    const paginationOptions = {
        custom: true,
        paginationSize: 10,
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
        sizePerPageList: [
        {
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
                                    {newUserForm(newUserFormView, companyList, onClickNewUserForm, checkUserValue, signUpCheckValues, onClickSignUp)}
                                    
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
                    
                  )
              }
          </PaginationProvider>
        </Fragment>
      );
};
export default UserBoard;