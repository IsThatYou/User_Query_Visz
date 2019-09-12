import React from 'react';
import ReactDOM from 'react-dom';
import "react-vis/dist/style.css";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeries,AreaSeries,HorizontalBarSeries,VerticalBarSeries} from 'react-vis';


export default class Home extends React.Component {

    render()
    {
        const {data,data_table} = this.props;
        if (data_table!==undefined)
        {
            let freq_hist_data = [];
            let display_num = 15;
            if (data_table.length>=display_num)
            {
                for (var i=0;i<display_num;i++)
                {
                    freq_hist_data.push({x:data_table[i].name,y:data_table[i].freq});
                }
            }
            else
            {
                for (var i=0;i<data_table.length;i++)
                {
                    freq_hist_data.push({x:data_table[i].name,y:data_table[i].freq});
                }
            }

            return (
            <div>
                {/* <div>  total queries: </div> */}
                <div style={{marginLeft: 15+ 'px'}}>
                    <h3>Most Frequent Verex Searches</h3>
                    <p>This shows the quereies and where they are tuned to clusted by their 
                        apperance frequencies.
                    </p>
                <XYPlot xType="ordinal" margin-left
                    width={680}
                    height={280}>
                    <HorizontalGridLines />
                    <XAxis tickLabelAngle={-20} />
                    <YAxis tickLabelAngle={-40} tickSize={4}/>
                    <VerticalBarSeries
                        color="red"
                        data={freq_hist_data}/>
                    
                </XYPlot>
                </div>

            </div>
            )
        }
        return null;
    }

}

