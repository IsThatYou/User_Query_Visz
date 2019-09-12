import React from 'react';
import ReactDOM from 'react-dom';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
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
function check_action(x)
{    
    return "channel";

}
export default class LeftPane extends React.Component{

    constructor(props) {
        super(props);
        
        this.state = {
          action:"Channel",
          analysis:"frequency"
        };
        this.handleQueryClick = this.handleQueryClick.bind(this);
        const {data_table,setPage} = this.props;


    }
    handleQueryClick(event) {

      this.props.setPage(event.target.value);
    }
    handle_action(name)
    {
        this.setState({action:name });
    }
    handle_analysis(name)
    {
        this.props.setAnalysis(name);
    }
    render(){

        const {data_table,setPage} = this.props;
        if (data_table!==undefined)
        {
            console.log("inside leftpane.jsx");
            let series = [];
            let channels = [];
            let tableCom;
            for (var x in data_table)
            {
            
                if (check_action(x.name) === "channel")
                {
                    channels.push(data_table[x]);
                }
                else{
                    series.push(x);
                }
            }


            if (this.state.action=="Series")
            {
                tableCom = series.map((a)=>(
                    <Make_row x={a} fn={this.handleQueryClick}/>
                    )
                );
            }
            else{
                tableCom = channels.map((a)=>(
                    <Make_row x={a} fn={this.handleQueryClick}/>
                    )
                );
            }
            return (<div>total query #: {} | unique query #: {data_table.length}
                <DropdownButton id="dropdown-basic-button" title={"Analysis Type: "+this.state.analysis} variant="secondary" >
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

                <DropdownButton id="dropdown-basic-button" title="Action Type" variant="secondary" >
                <Dropdown.Item onClick={()=>this.handle_action("Series")}>Series</Dropdown.Item>
                <Dropdown.Item onClick={()=>this.handle_action("Channel")}>Channel</Dropdown.Item>
                </DropdownButton>
                <p>Current Action: {this.state.action}</p>
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