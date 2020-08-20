import React, { useState, useEffect, useContext } from "react";
import $ from "jquery";

import ApplicationContext from "../../contexts/ApplicationContext";

import { ReactComponent as SvgMap } from "../../assets/ms_map.svg";

import cities from "../../assets/cities.json";

import "./index.css";

export default function InteractiveMap() {
  const initialCityValue = {
    code: null,
    name: null,
  };
  const [contentWidth, setContentWidth] = useState();
  const [contentHeight, setContentHeight] = useState();

  const {
    selectedCity,
    setSelectedCity,
    lastUpdateDate,
    casesPerCity,
  } = useContext(ApplicationContext);

  useEffect(() => {
    function initContentWidthHeight() {
      var myWidth = 0,
        myHeight = 0;

      if (typeof window.innerWidth == "number") {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
      } else if (
        document.documentElement &&
        (document.documentElement.clientWidth ||
          document.documentElement.clientHeight)
      ) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
      } else if (
        document.body &&
        (document.body.clientWidth || document.body.clientHeight)
      ) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
      }

      setContentWidth(myWidth);
      setContentHeight(myHeight);
    }

    initContentWidthHeight();
  }, []);

  useEffect(() => {
    function calculateInfoPanelPosition(mouseX, mouseY) {
      let infoPanelMousePositionHorizontal =
        mouseX - $(".info_panel").width() / 2;
      let infoPanelMousePositionVertical = mouseY - 120;

      let infoPanelExceedsWindowLimitLeft =
        mouseX - $(".info_panel").width() < 0;

      let infoPanelExceedsWindowLimitRight =
        mouseX + $(".info_panel").width() > contentWidth;

      let infoPanelExceedsWindowLimitTop = infoPanelMousePositionVertical < 0;

      let infoPanelWindowPositionHorizontal = contentWidth / 2;

      if (infoPanelExceedsWindowLimitLeft) {
        infoPanelWindowPositionHorizontal = 20;
      } else if (infoPanelExceedsWindowLimitRight) {
        infoPanelWindowPositionHorizontal =
          contentWidth - $(".info_panel").width() - 30;
      }

      let infoPanelWindowPositionVertical = contentHeight / 2;

      if (infoPanelExceedsWindowLimitTop) {
        infoPanelWindowPositionVertical = mouseY + 45;
      }

      let infoPanelFinalPositionHorizontal =
        infoPanelExceedsWindowLimitLeft || infoPanelExceedsWindowLimitRight
          ? infoPanelWindowPositionHorizontal
          : infoPanelMousePositionHorizontal;

      let infoPanelFinalPositionVertical = infoPanelExceedsWindowLimitTop
        ? infoPanelWindowPositionVertical
        : infoPanelMousePositionVertical;

      return {
        top: infoPanelFinalPositionVertical,
        left: infoPanelFinalPositionHorizontal,
      };
    }

    function setInfoPanelPosition(mouseX, mouseY) {
      $(".info_panel").css(calculateInfoPanelPosition(mouseX, mouseY));
    }

    for (let i = 0; i < cities.length; i++) {
      let formattedCityName = cities[i].name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toUpperCase();

      var numberOfCases = 0;
      var numberOfHealed = 0;
      var numberOfDeaths = 0;

      if (casesPerCity[formattedCityName]) {
        numberOfCases = casesPerCity[formattedCityName]["confirmed"];
        numberOfHealed = casesPerCity[formattedCityName]["healed"];
        numberOfDeaths = casesPerCity[formattedCityName]["death"];
      }

      var cityCase = {
        ...cities[i],
        cases: numberOfCases,
        healed: numberOfHealed,
        deaths: numberOfDeaths,
      };

      var color = "#cccccc";

      if (numberOfCases > 0) {
        color = "#dd0000";
      }

      if (numberOfDeaths > 0) {
        color = "#000000";
      }

      $(`#${cities[i]._code} path`)
        .css({
          fill: color,
        })
        .data("city", cityCase);
    }

    $(".map g path")
      .click(function (e) {
        e.preventDefault();
        var city_data = $(this).data("city");

        setSelectedCity({
          code: city_data._code,
          name: city_data.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toUpperCase(),
        });
      })
      .mouseover(function (e) {
        e.preventDefault();

        var city_data = $(this).data("city");

        $(
          `<div class="info_panel">
            <span class="info_panel_city">
              ${city_data.name}
            </span>
            <br/>
            <span class="info_panel_confirmed_cases">
              Casos confirmados: ${city_data.cases.toLocaleString("pt-BR")}
            </span>
            <br/>
            <span class="info_panel_deaths">
              Recuperados: ${city_data.healed.toLocaleString("pt-BR")}
            </span>
            <br/>
            <span class="info_panel_deaths">
              Óbitos: ${city_data.deaths.toLocaleString("pt-BR")}
            </span>
            <br/>
            <span class="info_panel_population">
              População: ${city_data.population.toLocaleString("pt-BR")}
            </span>
          </div>`
        ).appendTo("body");

        var mouseX = e.pageX,
          mouseY = e.pageY;

        setInfoPanelPosition(mouseX, mouseY);
      })
      .mouseleave(function (e) {
        e.preventDefault();
        $(".info_panel").remove();
      })
      .mousemove(function (e) {
        e.preventDefault();

        let mouseX = e.pageX,
          mouseY = e.pageY;

        setInfoPanelPosition(mouseX, mouseY);
      });

    $(".info_panel").click(function (e) {
      e.preventDefault();

      $(".info_panel").remove();
    });
  }, [contentWidth, contentHeight, casesPerCity]);

  function handleClickClearCityButton(e) {
    e.preventDefault();
    setSelectedCity(initialCityValue);
  }

  return (
    cities && (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {selectedCity.name && (
            <h2>
              Carregando dados para{" "}
              <span className="CGNewsColorHighlight">{selectedCity.name}</span>
            </h2>
          )}
          {!selectedCity.name && (
            <h2>
              Carregando dados para{" "}
              <span className="CGNewsColorHighlight">Mato Grosso do Sul</span>
            </h2>
          )}
          <h5 className="CGNewsColorHighlight">Dados até {lastUpdateDate}</h5>
          <h3>Toque em uma cidade no mapa para filtrar os dados</h3>
          <div style={{ flex: 1 }} className="map">
            <SvgMap />
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#ff0000",
                }}
              ></div>
              <span style={{ fontSize: "22px", marginLeft: "10px" }}>
                Confirmados
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: "#333333",
                }}
              ></div>

              <span style={{ fontSize: "22px", marginLeft: "10px" }}>
                Óbitos
              </span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            style={{
              padding: "20px",
              backgroundColor: "#68B817",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "bold",
            }}
            onClick={handleClickClearCityButton}
          >
            Limpar Filtro de Cidade
          </button>
        </div>
      </>
    )
  );
}
