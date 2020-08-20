import React, { useState, useEffect } from "react";
import { readRemoteFile } from "react-papaparse";

import AgeBarChart from "./components/AgeBarChart";
import GenderPieChart from "./components/GenderPieChart";
import TotalCasesLineChart from "./components/TotalCasesLineChart";
import CityCasesAndDeathsBarChart from "./components/CityCasesAndDeathsBarChart";
import CasesPerCityBarChart from "./components/CasesPerCityBarChart";
import DeathsPerCityBarChart from "./components/DeathsPerCityBarChart";
import DeathObservationTable from "./components/DeathObservationTable";
import InteractiveMap from "./components/InteractiveMap";

import ApplicationContext from "./contexts/ApplicationContext";

import totalCases from "./assets/totalcasesms.json";
import csv from "./assets/microdados.csv";

import "./App.css";

function App() {
  const [selectedCity, setSelectedCity] = useState({});
  const [lastUpdateDate, setLastUpdateDate] = useState(null);
  const [showContent, setShowContent] = useState(true);
  const [showCsvData, setShowCsvData] = useState(true);
  const [cases, setCases] = useState([]);
  const [casesPerCity, setCasesPerCity] = useState([]);
  const [sex, setSex] = useState([]);
  const [sexPerCity, setSexPerCity] = useState([]);
  const [ageRange, setAgeRange] = useState([]);
  const [ageRangePerCity, setAgeRangePerCity] = useState([]);

  useEffect(() => {
    const url =
      window.location !== window.parent.location
        ? document.referrer
        : document.location.href;

    const matchedUrl = url.match(
      /https:\/\/(\w|\d|-)+.campograndenews.com.br/g
    );

    if (matchedUrl !== null) {
      setShowContent(false);
    }

    //setShowCsvData(false);

    const lastTotalCase = totalCases[totalCases.length - 1];
    const [year, month, day] = lastTotalCase.date.split("-");
    let totaldeathscounter = 0;

    setLastUpdateDate(`${day}/${month}/${year}`);

    readRemoteFile(csv, {
      header: true,
      complete: (results) => {
        let counterCity = [];
        let sexCounter = [];
        let sexPerCityCounter = [];
        let ageRangeCounter = [];
        let ageRangePerCityCounter = [];

        if (!results.data[results.data.length - 1]["MUNICÍPIO RESIDÊNCIA AJUSTADO"]) {
          results.data.pop();
        }

        results.data.forEach((item, index) => {
          let status = item["STATUS"].trim().toUpperCase();
          item["MUNICÍPIO RESIDÊNCIA AJUSTADO"] = item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
          item["DETALHAMENTO STATUS"] = item["DETALHAMENTO STATUS"]
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();
          item["FAIXA_ETARIA"] = item["FAIXA_ETARIA"]
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
          item["SEXO"] = item["SEXO"]
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();

          if (status === "CONFIRMADO") {
            if (item["SEXO"] === "masculino") {
              item["SEXO"] = "m";
            }

            if (item["SEXO"] === "feminino") {
              item["SEXO"] = "f";
            }

            if (!counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]) {
              counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]] = [];
            }

            if (
              !counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]["confirmed"] &&
              counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]["confirmed"] !== 0
            ) {
              counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]["confirmed"] = 0;
            }
            if (
              !counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]["death"] &&
              counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]["death"] !== 0
            ) {
              counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]["death"] = 0;
            }
            if (
              !counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]["healed"] &&
              counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]["healed"] !== 0
            ) {
              counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]["healed"] = 0;
            }

            counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]["confirmed"]++;
            if (item["DETALHAMENTO STATUS"] === "obito") {
              counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]["death"]++;
            }
            if (item["DETALHAMENTO STATUS"] === "recuperado") {
              counterCity[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]["healed"]++;
            }

            if (!sexCounter[item["SEXO"]] && sexCounter[item["SEXO"]] !== 0) {
              sexCounter[item["SEXO"]] = 0;
            }
            sexCounter[item["SEXO"]]++;

            if (!sexPerCityCounter[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]) {
              sexPerCityCounter[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]] = [];
            }
            if (
              !sexPerCityCounter[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]][item["SEXO"]]
            ) {
              sexPerCityCounter[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]][item["SEXO"]] = 0;
            }
            sexPerCityCounter[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]][item["SEXO"]]++;

            if (
              !ageRangeCounter[item["FAIXA_ETARIA"]] &&
              ageRangeCounter[item["FAIXA_ETARIA"]] !== 0
            ) {
              ageRangeCounter[item["FAIXA_ETARIA"]] = 0;
            }
            ageRangeCounter[item["FAIXA_ETARIA"]]++;

            if (!ageRangePerCityCounter[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]]) {
              ageRangePerCityCounter[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]] = [];
            }
            if (
              !ageRangePerCityCounter[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]][
                item["FAIXA_ETARIA"]
              ]
            ) {
              ageRangePerCityCounter[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]][
                item["FAIXA_ETARIA"]
              ] = 0;
            }
            ageRangePerCityCounter[item["MUNICÍPIO RESIDÊNCIA AJUSTADO"]][
              item["FAIXA_ETARIA"]
            ]++;
          }

          if (
            status === 'CONFIRMADO'
            && item["DETALHAMENTO STATUS"] === "obito"
          ) {
            /*
            if (item["MUNICÍPIO RESIDÊNCIA AJUSTADO"] === "CAMPO GRANDE") {
              console.log('linha do obito: ', index+2);
            }
            */
            totaldeathscounter += 1;
          }

          if (
            status === 'CONFIRMADO'
            && item["DETALHAMENTO STATUS"] !== "recuperado"
            && item["DETALHAMENTO STATUS"] !== "obito"
          ) {
            /*
            if (item["MUNICÍPIO RESIDÊNCIA AJUSTADO"] === "JARDIM") {
              console.log('linha de onde nao tem obito: ', index+2);
            }
            */
          }
        });

        //console.log(totaldeathscounter);

        setSex(sexCounter);
        setSexPerCity(sexPerCityCounter);
        setAgeRange(ageRangeCounter);
        setAgeRangePerCity(ageRangePerCityCounter);
        setCasesPerCity(counterCity);
        setCases(results.data);
      },
    });
  }, []);

  return (
    <>
      {!showContent && (
        <ApplicationContext.Provider
          value={{
            selectedCity,
            setSelectedCity,
            lastUpdateDate,
            cases,
            casesPerCity,
            ageRange,
            ageRangePerCity,
            sex,
            sexPerCity,
          }}
        >
          {!selectedCity.code && (
            <>
              <TotalCasesLineChart />
              <div className="divisor" />
            </>
          )}
          {showCsvData && (
            <>
              <InteractiveMap />
              <div className="divisor" />
              {selectedCity.code && (
                <>
                  <CityCasesAndDeathsBarChart />
                  <div className="divisor" />
                </>
              )}
              {!selectedCity.code && (
                <>
                  <CasesPerCityBarChart />
                  <div className="divisor" />
                  <DeathsPerCityBarChart />
                  <DeathObservationTable />
                  <div className="divisor" />
                </>
              )}
              <GenderPieChart />
              <div className="divisor" />
              <AgeBarChart />
            </>
          )}
        </ApplicationContext.Provider>
      )}
    </>
  );
}

export default App;
