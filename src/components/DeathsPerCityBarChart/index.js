import React, { useState, useEffect, useContext } from "react";
import Chart from "react-google-charts";

import ApplicationContext from "../../contexts/ApplicationContext";

const initialData = [
  "Cidade",
  "Óbitos",
  { type: "number", role: "annotation" },
];

export default function DeathsPerCityBarChart() {

  const [data, setData] = useState([initialData]);
  const { lastUpdateDate, casesPerCity } = useContext(ApplicationContext);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    const dataArr = [initialData];

    let maxval = 0;

    for (let i in casesPerCity) {
      if (casesPerCity[i].death) {
        let row = [i, casesPerCity[i].death, casesPerCity[i].death];

        if (casesPerCity[i].death > maxval) {
          maxval = casesPerCity[i].death;
        }

        dataArr.push(row);
      }
    }

    function compareByTotalCases(a, b) {
      if (a[1] < b[1]) {
        return 1;
      }
      if (a[1] > b[1]) {
        return -1;
      }
      return 0;
    }

    dataArr.sort(compareByTotalCases);

    setMaxValue(maxval);
    setData(dataArr);
  }, [casesPerCity]);

  return data.length > 1 && (
    <div style={{ textAlign: "center" }}>
      <h2>
        Carregando dados para{" "}
        <span className="CGNewsColorHighlight">Mato Grosso do Sul</span>
      </h2>
      <h5 className="CGNewsColorHighlight">Dados até {lastUpdateDate}</h5>
      <h4>Casos de Óbito por COVID-19</h4>
      <Chart
        width={"100%"}
        height={`${data.length * 50}px`}
        chartType="BarChart"
        loader={<div>Carregando Gráfico</div>}
        data={data}
        options={{
          legend: { position: "top", alignment: "center", textStyle: {fontSize: 10} },
          chartArea: { left: "30%", width: "65%", height: "95%" },
          colors: ["#333333"],
          hAxis: {
            format: "0",
            title: "Total de Casos",
            viewWindowMode: "explicit",
            viewWindow: {
              max: maxValue,
              min: 0,
            },
          },
          vAxis: {
            textStyle: {
              fontSize: 12, // or the number you want
            },
          },
          annotations: {
            textStyle: {
              fontSize: 14
            }
          }
        }}
      />
    </div>
  );
}
