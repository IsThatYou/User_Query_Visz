import React from 'react';
import ReactDOM from 'react-dom';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

function compute_count(x) {
    var sum = 0;
    for (var key in x)
    {
        for (var key2 in x[key])
        {
            sum += x[key][key2];
        }
    }
    return sum;   
  }

//Components
function Make_row({x,fn})
{
    return(
        <tr>
        <td></td>
        <td>
        <Button
            block
            variant="outline-light"
            value={x.name}
            onClick={fn}>
            {x.name}
        </Button>
        </td>
        <td>{x.freq}</td>
        <td>{(x.perc*100).toFixed(4)}</td>
        </tr>
    );
}
export default class SimLeftPane extends React.Component{

    constructor(props) {
        super(props);
        
        this.state = {
          action:"Series",
          analysis: "similarity",
          cluster_num:100
        };
        this.handleQueryClick = this.handleQueryClick.bind(this);
        const {data_table,setPage} = this.props;


    }
    handleQueryClick(event) {

      this.props.setPage(event.target.value);
    }
    handle_analysis(name)
    {
        this.props.setAnalysis(name);
    }
    render(){

        const {data_table,cluster_data,query_num,setPage} = this.props;
        if (data_table!==undefined)
        {
            console.log(cluster_data);
            let tableCom;
            let cluster_table = [];
            for (var q in cluster_data)
            {
                let sub_dict = cluster_data[q];
                console.log
                let count = compute_count(sub_dict);
                cluster_table.push({name:q, freq:count,perc:count/query_num});
            }
            let cluster_table_sort = cluster_table.sort((a,b)=>(
                b.freq - a.freq));
            tableCom= cluster_table_sort.map((a)=>(
                <Make_row x={a} fn={this.handleQueryClick}/>
                )
            );
            
        
            return (<div>total query #: {} | unique query #: {data_table.length}
                <DropdownButton id="dropdown-basic-button" title={"Analysis Type: "+this.state.analysis}  variant="secondary" >
                <Dropdown.Item onClick={()=>this.handle_analysis("frequency")}>Frequency</Dropdown.Item>
                <Dropdown.Item onClick={()=>this.handle_analysis("similarity")}>Similarity</Dropdown.Item>
                </DropdownButton>
                <Button
                block
                variant="dark"
                value="home"
                onClick={this.handleQueryClick}>
                Overview
                </Button>
                <Table striped bordered hover size="sm" variant="dark">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>query</th>
                        <th>freq</th>
                        <th>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableCom}
                    </tbody>
                </Table>
            </div>)
        }
        return null;
    };
}