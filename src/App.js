import React,{useEffect, useState} from "react";
import { MenuItem,FormControl, Select,Card,CardContent } from '@material-ui/core';
import './App.css';
import reactDom from 'react-dom';
import InfoBox from "./InfoBox";
import Table from"./Table";
import {sortData} from "./util";
import LineGraph from "./LineGraph";
import numeral from "numeral";
function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  //USEEFFECT  RUNS A CODE BASED ON A GIVEN CONDITION

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) =>{
      setCountryInfo(data);
    }); 
  },[]); 

  useEffect(()=>{
    //The code inside here will run once when the component loads and not again
    //The here will run once when the component loads and everytime the countries state changes
    //async = sends a request waits for it and then do somthing with it

    const getCountriesData = async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data)=>{
        const countries = data.map((country)=>(
          {
            name:country.country, // United States
            value:country.countryInfo.iso2 //USA
          }
        ));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
      });
    };
    getCountriesData();

  },[]);

  const onCountryChange = async (event)=>{
    const countryCode = event.target.value;

    const url = 
    countryCode === "worldwide" 
    ? 'https://disease.sh/v3/covid-19/all' 
    :  `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response) => response.json())
    .then((data) =>{
      setCountry(countryCode);
      setCountryInfo(data);
    })
  };
 
  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
  
    <h1>COVID-19 Global Tracker</h1>

    <FormControl className="app__dropdown">

      <Select 
        variant ="outlined"
        onChange={onCountryChange}
        value={country}
      >
        <MenuItem value="worldwide">World Wide</MenuItem>
        {countries.map((country)=>(
            <MenuItem value={country.value}>{country.name}</MenuItem>
        ))}
        
        </Select>
    
    </FormControl>

    </div>
    <div className="space"></div>
    <div className="app__stats">
      <InfoBox title="Reported Covid-19 Cases" total={countryInfo.cases} cases={countryInfo.todayCases}/>
      <InfoBox title="Recovered" total={countryInfo.recovered} cases={countryInfo.todayRecovered}/>
      <InfoBox title="Deaths" total={countryInfo.deaths} cases={countryInfo.todayDeaths}/>

    </div>
    <div className="empty"></div>
    <LineGraph casesType="cases"/>




    </div>
      <Card className="app__right">

        <CardContent>
          <h3>Live Cases by Country</h3>

          <Table countries={tableData}/>
        </CardContent>

      </Card>
    </div>
  );
};

export default App;
