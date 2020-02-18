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




const CompanyBoard = (companyList) => {

    const { SearchBar } = Search;
    console.log(companyList);
    const products = companyList.companyList;
    const columns = [{
            dataField: 'companyIdx',
            text: '번호',
            sort: true,
            searchable: false
        },
        {
            dataField: 'companyId',
            text: '회사ID',
            sort: true
        }, 
        {
            dataField: 'companyName',
            text: '회사이름',
            sort: true
        }, 
        {
            dataField: 'createdDate',
            text: '생성일자',
            sort: true,
            searchable: false,
            formatter: (cell, row, index, extraData) => (
                    cell.substring(0, 10)
            )
        }, 
        {
            dataField: 'deletedYn',
            text: '삭제여부',
            sort: true,
            searchable: false,
            formatter: (cell) => {
                if(cell == "Y"){
                    return <img width="24px" alt="삭제됨" src={complete}/>
                }else{
                    return <img width="24px" alt="정상" src={cancelImg}/>
                }
                }
        }];

    return (
        <ToolkitProvider
            keyField="id"
            data={ products }
            columns={ columns }
            search
        >
            {
                props => (
                <div>
                    <SearchBar { ...props.searchProps } />
                    <hr />
                    <BootstrapTable { ...props.baseProps } />
                    </div>
                )
            }
        </ToolkitProvider>
            )
};

export default CompanyBoard;