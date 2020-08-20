import React, { useState, useEffect, useContext } from "react";
import Chart from "react-google-charts";

import ApplicationContext from "../../contexts/ApplicationContext";

export default function CityCasesAndDeathsBarChart() {
  const initialData = [
    "Cidade",
    "Confirmados",
    { type: "number", role: "annotation" },
    "Recuperados",
    { type: "number", role: "annotation" },
    "Óbitos",
    { type: "number", role: "annotation" },
  ];

  const [data, setData] = useState([initialData]);
  const [maxValue, setMaxValue] = useState(0);
  const { selectedCity, lastUpdateDate, casesPerCity } = useContext(
    ApplicationContext
  );

  useEffect(() => {
    const dataArr = [initialData];

    let maxval = 0;

    for (let i in casesPerCity) {
      if (i !== selectedCity.name) continue;

      let row = [i];

      if (casesPerCity[i].confirmed) {
        row = [...row, casesPerCity[i].confirmed, casesPerCity[i].confirmed];

        if (casesPerCity[i].confirmed > maxval) {
          maxval = casesPerCity[i].confirmed;
        }
      }

      if (casesPerCity[i].healed) {
        row = [...row, casesPerCity[i].healed, casesPerCity[i].healed];
      } else {
        row = [...row, 0, 0];
      }

      if (casesPerCity[i].death) {
        row = [...row, casesPerCity[i].death, casesPerCity[i].death];
      } else {
        row = [...row, 0, 0];
      }

      dataArr.push(row);
    }

    if (dataArr.length === 1) {
      dataArr.push([selectedCity.name, 0, 0, 0, 0, 0, 0]);
    }

    setMaxValue(maxval);
    setData(dataArr);
  }, [selectedCity, casesPerCity]);

  return data.length > 1 && (
    <div style={{ textAlign: "center" }}>
      {selectedCity.code && (
        <h2>
          Carregando dados para{" "}
          <span className="CGNewsColorHighlight">{selectedCity.name}</span>
        </h2>
      )}
      <h5 className="CGNewsColorHighlight">Dados até {lastUpdateDate}</h5>
      <h4>Casos Confirmados de COVID-19 em {selectedCity.name}</h4>
      <Chart
        width={"100%"}
        height={`${data.length * 50}px`}
        chartType="BarChart"
        loader={<div>Carregando Gráfico</div>}
        data={data}
        options={{
          legend: { position: "top", alignment: "center", textStyle: {fontSize: 10} },
          chartArea: { left: "30%", width: "60%", height: "90%" },
          colors: ["#ed0000", "#00AB44", "#333333"],
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
