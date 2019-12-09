import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { DashBoard, Workloads, WorkloadReplication } from 'pages';
import Menu from 'components/Menu';

class App extends Component {
    render() {
        return (
            <div style={{"backgroundColor": "#cfcfcf", "height": "950px"}}>
                <Menu/>
                <Route exact path="/" component={Workloads}/>
                <Route exact path="/DashBoard" component={DashBoard}/>
                <Route exact path="/workloads" component={Workloads}/>
                <Route exact path="/workloadReplication" component={WorkloadReplication}/>
                {/* <Switch>
                    <Route path="/about/:name" component={About}/>
                    <Route path="/about" component={About}/>
                </Switch> */}
            </div>
        );
    }
}

export default App;