import React, { useState, useEffect } from 'react'
import {Line} from "react-chartjs-2";
import numeral from "numeral";
import './LineGraph.css';


const options ={
    legend:{
        display:false,
    },
    elements:{
        point:{
            radius:2,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode:"index",
        intersect:false,
        callbacks:{
            label:function(tooltipItem,data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales:{
        xAxes:[
            {
                type:"time",
                time:{
                    format:"MM/DD/YY",
                    tooltipFormat:"ll",
                },
            },
        ],
        yAxes:[
            {
                gridLines:{
                    display:false,
                },
                ticks:{
                    callback:function(value,index,values){
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

const buildChartData = (data,casesType) =>{
    const chartData = [];
    let lastDataPoint;
    for(let date in data.cases){
        if (lastDataPoint){
            let newDataPoint={
                x:date,
                y:data[casesType][date] - lastDataPoint
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
};

function LineGraph({casesType}) {

    const [data,setData]=useState({});

    useEffect(()=>{
        const fetchData=async ()=>{
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then((response)=>{
                return response.json();
            })
            .then((data) =>{
                let chartData = buildChartData(data,casesType);
    
                setData(chartData);
            });
        
    };
    fetchData();
},
    [casesType]);

  

    return (
        <div className="linegraph">
            {data?.length>0 && (
         <Line
            options={options}

            data= {{ 
                datasets : [ 
                    {
                        label:'New Covid Cases',
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(201, 203, 207, 0.2)'
                          ],
                          borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)'
                          ],
                       
                        data : data,
                        fill:false,
                        pointStyle:'circle',
                        borderWidth:1
                    },
                ],
            }}
           />
            )}

        </div>
    );
}

export default LineGraph
