import React from 'react';
import ReactDOM from 'react-dom';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

import Home from './freq/overview_page.jsx';
import Query from './freq/query_page.jsx';
import LeftPane from './freq/leftpane.jsx';

import SimHome from './sim/overview_page.jsx';
import SimQuery from './sim/query_page.jsx';
import SimLeftPane from './sim/leftpane.jsx';


//miscellanious
// let table_data = [];
function compute_count(x) {
    var sum = 0;
    for (var key in x)
    {
        sum += x[key]
    }
    return sum;   
  }

//Components


class App extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
          page: "home",
          result: "<unk>",
          analysis:"frequency"
        };
        // this.data = {};
        this.table_data = [];
        const query = this.state.page;
        this.query_num = 0;
        this.tableSort = undefined;
        this.tableCom = undefined;
        this.cluster_data = undefined;


        fetch('http://0.0.0.0:5000/get_data/', 
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(query)
          })
          .then(response => response.json())
          .then(response => {
            for (var q in response.result)
            {
                var cur_dict = response.result[q]
                var count = compute_count(cur_dict);
                this.query_num+=count;
            };
            // console.log(this.query_num);
            for (var q in response.result)
            {
                var cur_dict = response.result[q]
                // console.log(this.response.result[q]);
                var count = compute_count(cur_dict);
                this.table_data.push({name:q, freq:count,perc:count/this.query_num});
                // console.log(count);
            };
            this.tableSort = this.table_data.sort((a,b)=>(
                b.freq - a.freq));
            this.cluster_data = response.clusters;
            this.setState({
                result: response.result
              });
          });

        //   console.log(this.data);
      }


    render() {
        console.log("current page:",this.state.page);
        console.log("current analysis method:",this.state.analysis);
        console.log(this.cluster_data);
        console.log("");
        let data;
        data = this.state.result;

        let rightpane;
        if (this.state.page !== "home")
        {
            if (this.state.analysis !== "similarity")
            {
                rightpane = <Query data={data} data_table={this.tableSort} page={this.state.page} query_num={this.query_num}/>;
            }
            else{
                rightpane = <SimQuery data={data} data_table={this.tableSort} cluster_data={this.cluster_data} page={this.state.page} query_num={this.query_num}/>;
            }
        }
        else{
            if (this.state.analysis !== "similarity")
            {
                rightpane = <Home data={data} data_table={this.tableSort} query_num={this.query_num}/>;
            }
            else
            {
                rightpane = <SimHome data={data} data_table={this.tableSort} cluster_data={this.cluster_data} query_num={this.query_num}/>;
            }
        }
        let leftpane;
        if (this.state.analysis !== "similarity")
        {
            leftpane =<LeftPane data_table={this.tableSort} setPage={i => this.setState({page:i})} setAnalysis={i => this.setState({analysis:i})}  query_num={this.query_num}/>;
        }
        else
        {
            leftpane =<SimLeftPane data_table={this.tableSort} cluster_data={this.cluster_data} setPage={i => this.setState({page:i})} setAnalysis={i => this.setState({analysis:i})} query_num={this.query_num} />;
        }
        return (
            <SplitterLayout percentage secondaryInitialSize={70}>
                {leftpane}
            <div>
            {rightpane}

            </div>
            
          </SplitterLayout>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
