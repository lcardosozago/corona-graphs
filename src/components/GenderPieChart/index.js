import React, { useState, useEffect, useContext } from "react";
import Chart from "react-google-charts";

import ApplicationContext from "../../contexts/ApplicationContext";

const initialData = ["Gênero", "Casos de COVID-19"];

export default function GenderPieChart() {
  const [data, setData] = useState([initialData]);
  const [graphColors, setGraphColors] = useState([]);
  const { selectedCity, lastUpdateDate, sex, sexPerCity } = useContext(
    ApplicationContext
  );

  useEffect(() => {
    var dataArr = [initialData];
    var newGraphColors = [];

    if (selectedCity.code) {
      for (let city in sexPerCity) {
        if (city === selectedCity.name) {
          for (let gender in sexPerCity[city]) {
            let value = sexPerCity[city][gender];
            if (gender === "m") {
              dataArr.push(["Homens", value]);
            }
            if (gender === "f") {
              dataArr.push(["Mulheres", value]);
            }
          }
        }
      }
    } else {
      for (let gender in sex) {
        if (gender === "m") {
          dataArr.push(["Homens", sex[gender]]);
        }
        if (gender === "f") {
          dataArr.push(["Mulheres", sex[gender]]);
        }
      }
    }

    if (dataArr[1] && dataArr[1][0] === 'Mulheres') {
      newGraphColors.push("#ed0000");
      newGraphColors.push("#3366CC");
    } else if (dataArr[1] && dataArr[1][0] === 'Homens') {
      newGraphColors.push("#3366CC");
      newGraphColors.push("#ed0000");
    }

    setData(dataArr);
    setGraphColors(newGraphColors);
  }, [selectedCity, sex, sexPerCity]);

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
      <h4>Casos de coronavírus entre gêneros</h4>
      {data.length === 1 && (
        <h5 style={{ color: "#ED0000" }}>Sem dados para mostrar.</h5>
      )}
      {data.length > 1 && (
        <Chart
          width={"100%"}
          height={"300px"}
          chartType="PieChart"
          loader={<div>Carregando Gráfico</div>}
          data={data}
          options={{
            legend: { position: "bottom", alignment: "center", textStyle: {fontSize: 10} },
            colors: [ graphColors[0], graphColors[1] ],
            chartArea: { left: "0", width: "100%", height: "80%" },
          }}
        />
      )}
    </div>
  );
}
