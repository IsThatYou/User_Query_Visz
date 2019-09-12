import React from 'react';
import ReactDOM from 'react-dom';
import "react-vis/dist/style.css";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries,AreaSeries,HorizontalBarSeries,VerticalBarSeries} from 'react-vis';
import Table from 'react-bootstrap/Table';

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

export default class Query extends React.Component {

    render()
    {
        const {data,data_table,page} = this.props;
        if (data!==undefined)
        {
            var dict = data[page];
            console.log(dict);
            let query_num = 0;
            let freq_hist_data = [];
            let display_num = 8;
            for (var q in dict)
            {
                var entity_count = dict[q];
                query_num+=entity_count;
                freq_hist_data.push({x:q, y:entity_count});
            };

            freq_hist_data = freq_hist_data.sort((a,b)=>(
                b.y - a.y));
            console.log(query_num);
            let tune_table_data = [];
            for (var q in dict)
            {
                let entity_count = dict[q];
                tune_table_data.push({name:q, freq:entity_count,perc:entity_count/query_num});
            };
            tune_table_data = tune_table_data.sort((a,b)=>(b.freq - a.freq));
            tune_table_data = tune_table_data.map((a)=>(<Make_row x={a}/>));


            return (
            <div>
                {/* <div>  total queries: </div> */}
                <div style={{marginLeft: 15+ 'px'}}>
                    <h3>Query:"{page}"</h3>
                    <h3>Most Frequent Media Tune Events For This Query</h3>
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
                        <th>Tune To</th>
                        <th>freq</th>
                        <th>%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tune_table_data}
                    </tbody>
                </Table>
                </div>

            </div>
            )
        }
        return null;
    }

}

