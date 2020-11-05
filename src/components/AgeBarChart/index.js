import React, { useState, useEffect, useContext } from "react";
import Chart from "react-google-charts";

import ApplicationContext from "../../contexts/ApplicationContext";

const initialData = [
  "Idade",
  "Casos de COVID-19",
  { type: "number", role: "annotation" },
];

export default function AgeBarChart() {
  const [data, setData] = useState([initialData]);
  const {
    selectedCity,
    lastUpdateDate,
    ageRange,
    ageRangePerCity,
  } = useContext(ApplicationContext);

  useEffect(() => {
    const dataArr = [initialData];

    if (selectedCity.code) {
      for (let city in ageRangePerCity) {
        if (city === selectedCity.name) {
          for (let range in ageRangePerCity[city]) {
            let value = ageRangePerCity[city][range];
            dataArr.push([range, value, value]);
          }
        }
      }
    } else {
      for (let range in ageRange) {
        let value = ageRange[range];
        let row = [range, value, value];

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

    setData(dataArr);
  }, [selectedCity, ageRange, ageRangePerCity]);

  return (
    <div style={{ textAlign: "center" }}>
      {selectedCity.code && (
        <h2>
          Carregando dados para{" "}
          <span className="CGNewsColorHighlight">{selectedCity.name}</span>
        </h2>
      )}
      {!selectedCity.code && (
        <h2>
          Carregando dados para{" "}
          <span className="CGNewsColorHighlight">Mato Grosso do Sul</span>
        </h2>
      )}
      <h5 className="CGNewsColorHighlight">Dados até {lastUpdateDate}</h5>
      <h4>Casos de coronavírus por idade</h4>
      {data.length === 1 && <h5 style={{ color: "#ED0000" }}>Sem dados para mostrar.</h5>}
      {data.length > 1 && (
        <Chart
          width={"100%"}
          height={`${data.length * 50}px`}
          chartType="BarChart"
          loader={<div>Carregando Gráfico</div>}
          data={data}
          options={{
            legend: { position: "bottom", alignment: "center" },
            chartArea: { left: "30%", width: "65%", height: "80%" },
            annotations: {
              textStyle: {
                fontSize: 14
              }
            }
          }}
        />
      )}
    </div>
  );
}
