import React from 'react';
import ReactDOM from 'react-dom';
import "react-vis/dist/style.css";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries,AreaSeries,HorizontalBarSeries,VerticalBarSeries} from 'react-vis';
import Table from 'react-bootstrap/Table';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
import continuousColorLegend from 'react-vis/dist/legends/continuous-color-legend';



function compute_count(x) {
    var sum = 0;
    for (var key in x)
    {
        sum += x[key]
    }
    return sum;   
  }
function Make_row({x})
{
    return(
        <tr>
        <td></td>
        <td>{x.name}</td>
        <td>{x.freq}</td>
        <td>{(x.perc*100).toFixed(4)}</td>
        </tr>
    );
}
function Make_table({x})
{
    // console.log(x);
    let x_sort = x.sort((a,b)=>(
        b.freq - a.freq));
    let x_comp = x_sort.map((a)=>(
        <Make_row x={a}/>
        ));

    return(
        <Table striped bordered hover size="sm" variant="light">
        <thead>
            <tr>
            <th></th>
            <th>Tune To</th>
            <th>freq</th>
            <th>%</th>
            </tr>
        </thead>
        <tbody>
            {x_comp}
        </tbody>
        </Table>
    );
}
function Make_accorion_table({x})
{


    return (
    <tr>
        <td></td>
        <td>     
            <Accordion>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
            {x.name}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
                <Make_table x={x.data}/>

            </Accordion.Collapse>
            </Accordion> </td>
        <td>{x.freq}</td>
        <td>{(x.perc*100).toFixed(4)}</td>
    </tr>
    );
}

export default class SimQuery extends React.Component {

    render()
    {
        const {data,data_table,cluster_data,page,query_num} = this.props;
        if (data!==undefined)
        {
            var dict = cluster_data[page];
            console.log(dict);
            let freq_hist_data = [];
            let display_num = 8;

            let accordion_data = {};
            let accordion_table_data = [];
            for (var q in dict)
            {
                var this_count = 0;
                for (var q2 in dict[q])
                {   
                    var entity_count = dict[q][q2];
                    this_count+=entity_count;
                }
                accordion_data[q] = [];
                for (var q2 in dict[q])
                {   
                    var entity_count = dict[q][q2];
                    accordion_data[q].push({name:q2, freq:entity_count,perc:entity_count/this_count});
                }
                freq_hist_data.push({x:q, y:this_count});

                accordion_table_data.push({name:q,data:accordion_data[q], freq:this_count,perc:this_count/query_num});
            };

            freq_hist_data = freq_hist_data.sort((a,b)=>(
                b.y - a.y));
            
            let accordion_table_data_sort = accordion_table_data.sort((a,b)=>(b.freq-a.freq));
            let accordion_table_data_comp = accordion_table_data_sort.map((a)=>(<Make_accorion_table x={a}/>));


            return (
            <div>
                {/* <div>  total queries: </div> */}
                <div style={{marginLeft: 15+ 'px'}}>
                    <h3>Query:"{page}"</h3>
                    <h3>All the queries that are related to {page}</h3>
                <XYPlot xType="ordinal" margin-left
                    width={700}
                    height={280}>
                    <HorizontalGridLines />
                    <XAxis tickLabelAngle={-8} tickSize={3} style={{
                    text: {fontSize:8}
                    }}/>

                    <YAxis tickLabelAngle={-40} tickSize={4}/>
                    <VerticalBarSeries
                        color="red"
                        data={freq_hist_data.slice(0,display_num)}/>
                    
                </XYPlot>
                </div>
                
                <div>
                <Table striped bordered hover size="sm" variant="light">
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>Similar Queries</th>
                        <th>freq</th>
                        <th>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accordion_table_data_comp}
                    </tbody>
                </Table>

                </div>

            </div>
            )
        }
        return null;
    }

}

