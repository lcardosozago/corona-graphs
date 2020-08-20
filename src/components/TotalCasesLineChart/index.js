import React, { useState, useEffect, useContext } from "react";
import Chart from "react-google-charts";

import ApplicationContext from "../../contexts/ApplicationContext";

import totalCases from "../../assets/totalcasesms.json";

export default function TotalCasesLineChart() {
  const initialData = [
    "Data",
    "Suspeitos",
    { type: "string", role: "annotation" },
    "Confirmados",
    { type: "string", role: "annotation" },
    "Óbitos",
    { type: "string", role: "annotation" },
    "Curados",
    { type: "string", role: "annotation" },
  ];

  const [data, setData] = useState(initialData);
  const { lastUpdateDate } = useContext(ApplicationContext);

  useEffect(() => {
    let dataArr = [initialData];
    let yesterday = totalCases[totalCases.length - 2];
    let today = totalCases[totalCases.length - 1];
    let moreCases = {
      suspects: today.suspects - yesterday.suspects,
      confirmed: today.confirmed - yesterday.confirmed,
      deaths: today.deaths - yesterday.deaths,
      healed: today.healed - yesterday.healed
    }

    if (moreCases.suspects > 0) {
      moreCases.suspects = '+' + moreCases.suspects;
    }
    if (moreCases.confirmed > 0) {
      moreCases.confirmed = '+' + moreCases.confirmed;
    }
    if (moreCases.deaths > 0) {
      moreCases.deaths = '+' + moreCases.deaths;
    }
    if (moreCases.healed > 0) {
      moreCases.healed = '+' + moreCases.healed;
    }

    totalCases.forEach((obj, index) => {
      //if (index % 10 === 0 || index > totalCases.length - 3) {
        let arr = [];
        let hasAnnotation = false;
        let [year, month, day] = obj.date.split("-");

        if (index === totalCases.length - 1) {
          hasAnnotation = true;
        }

        arr.push(`${day}/${month}`);

        if (hasAnnotation) {
          arr.push(obj.suspects);
          arr.push(obj.suspects + `(${moreCases.suspects})`);
          arr.push(obj.confirmed);
          arr.push(obj.confirmed + `(${moreCases.confirmed})`);
          arr.push(obj.deaths);
          arr.push(obj.deaths + `(${moreCases.deaths})`);
          arr.push(obj.healed);
          arr.push(obj.healed + `(${moreCases.healed})`);
        } else {
          arr.push(obj.suspects);
          arr.push(null);
          arr.push(obj.confirmed);
          arr.push(null);
          arr.push(obj.deaths);
          arr.push(null);
          arr.push(obj.healed);
          arr.push(null);
        }

        dataArr.push(arr);
      //}
    });

    setData(dataArr);
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>
        Carregando dados para{" "}
        <span className="CGNewsColorHighlight">Mato Grosso do Sul</span>
      </h2>
      <h5 className="CGNewsColorHighlight">Dados até {lastUpdateDate}</h5>
      <h4>Progressão do COVID-19 em MS</h4>
      <Chart
        width={"100%"}
        height={"600px"}
        chartType="LineChart"
        loader={<div>Carregando Gráfico</div>}
        data={data}
        options={{
          legend: { position: "top", alignment: "center", maxLines: 4, textStyle: {fontSize: 10} },
          colors: ["#3366CC", "#f28900", "#ed0000", "#109618"],
          chartArea: { top: "15%", width: "75%", height: "70%" },
          hAxis: {
            slantedText: true,
            slantedTextAngle: 45,
          },
          vAxis: {
            viewWindow: {
              //max: 3000,
            },
          },
        }}
      />
    </div>
  );
}
