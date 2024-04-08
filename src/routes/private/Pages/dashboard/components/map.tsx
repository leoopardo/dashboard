/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleMap, HeatmapLayer, useLoadScript } from "@react-google-maps/api";
import { CustomTable } from "@src/components/CustomTable";
import { useTheme } from "@src/contexts/ThemeContext";
import { useGetLastHalfHour } from "@src/services/heatMap/getByHalfHour";
import { getTotalByCity } from "@src/services/types/heatMap/heatMap.interface";
import { defaultTheme } from "@src/styles/defaultTheme";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { City, State } from "country-state-city";
import ReactECharts from "echarts-for-react";
import moment from "moment";
import { renderToString } from "react-dom/server";
import { statesObj } from "./geojson/br_states/statesObj";
import { useMediaQuery } from "react-responsive";
import { useGetLastHalfHourWithdraw } from "@src/services/heatMap/getByHalfHourWithdraw";
import { useTranslation } from "react-i18next";

const mapContainerStyle = {
  height: "500px",
  width: "99.6%",
  borderRadius: "10px",
};
const center = {
  lat: -15.9193954,
  lng: -48.5575,
};

export function RootMap({ data, state, query, setQuery }: any) {
  const { t } = useTranslation();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAWnvWF0zoGeSWJw0mL0pHARTTBNXm3KBo",
    libraries: [
      "visualization",
      "places",
      "geometry",
      "drawing",
      "core",
      "elevation",
      "maps",
      "marker",
    ],
  });
  const { theme } = useTheme();
  const { lastHalfHour, isLastHalfHourFetching } = useGetLastHalfHour({
    current_date: new Date(),
  });
  const { lastHalfHourWithdraw } = useGetLastHalfHourWithdraw({
    current_date: new Date(),
  });
  const isMobile = useMediaQuery({ maxWidth: "768px" });

  function getLatLng(state: string, city?: string) {
    if (city) {
      return new google.maps.LatLng(
        Number(
          City.getCitiesOfCountry("BR")?.find(
            (c) =>
              c?.name.toLocaleLowerCase() === city.toLocaleLowerCase() &&
              c?.stateCode.toLocaleLowerCase() === state.toLocaleLowerCase()
          )?.latitude
        ) as any,
        Number(
          City.getCitiesOfCountry("BR")?.find(
            (c) =>
              c?.name.toLocaleLowerCase() === city.toLocaleLowerCase() &&
              c?.stateCode.toLocaleLowerCase() === state.toLocaleLowerCase()
          )?.longitude
        ) as any
      );
    } else {
      return new google.maps.LatLng(
        Number(
          State.getStatesOfCountry("BR").find(
            (s) => s?.name.toLocaleLowerCase() === state.toLocaleLowerCase()
          )?.latitude
        ) as any,
        Number(
          State.getStatesOfCountry("BR").find(
            (s) => s?.name.toLocaleLowerCase() === state.toLocaleLowerCase()
          )?.longitude
        ) as any
      );
    }
  }

  const onLoad = (map: google.maps.Map | null) => {
    const refStates: any = {};
    if (data && data?.length >= 1)
      data?.forEach((item: any) => {
        if (item.state === "N/A") return;
        if (!refStates[item.state]) {
          refStates[item.state] = new google.maps.Polygon({
            paths: (statesObj as any)[item.state].features[0].geometry
              .coordinates[0][0],
            map,
            fillColor: "transparent",
            strokeWeight: 2,
            strokeColor: "#ffffff",
          });
        }
      });

    Object.keys(refStates).forEach((s: any) => {
      refStates[s].addListener("click", () => {
        setQuery((state: any) => ({
          ...state,
          state: s === state.state ? undefined : s,
        }));
      });
    });

    // newArr.forEach((item) => {
    //   // Criar sobreposições para estados
    //   const refStates: any = [];
    //   for (const [index, i] of newArr.entries()) {
    //     if (!refStates[i.state]) {
    //       refStates[i.state] = new google.maps.Polygon({
    //         paths: (statesObj as any)[i.state].features[0].geometry
    //           .coordinates[0][0],
    //         map,
    //         fillColor: "transparent",
    //         strokeWeight: 0,
    //         strokeColor: "transparent"
    //       });
    //     }
    //     // Adicione eventos de hover para estados
    //     refStates[i.state].addListener("mouseover", () => {
    //       setQuery((state: any) => ({ state: i.state }));
    //     });
    //     refStates[i.state].addListener("mouseout", () => {
    //       setQuery((state: any) => ({ state: undefined }));
    //     });
    //   }

    //   // Criar sobreposições para cidades
    //   // const cityOverlay = new google.maps.Circle({
    //   //   center: getLatLng(item.state, item.city),
    //   //   radius: 10000, // Ajuste conforme necessário
    //   //   map,
    //   //   // ... outras configurações da sobreposição
    //   // });

    //   // // Adicione eventos de hover para cidades
    //   // cityOverlay.addListener("mouseover", () => {
    //   //   console.log(`Hover sobre a cidade de ${item.city}, ${item.state}`);
    //   //   // Lógica adicional para o evento de hover da cidade
    //   // });

    //   // cityOverlay.addListener("mouseout", () => {
    //   //   console.log(
    //   //     `Saiu do hover sobre a cidade de ${item.city}, ${item.state}`
    //   //   );
    //   //   // Lógica adicional para o evento de sair do hover da cidade
    //   // });

    //   //cityOverlays.push(cityOverlay);
    // });

    new google.maps.visualization.HeatmapLayer({
      data: data
        ?.filter((item: getTotalByCity) => item.state !== "N/A")
        .map((item: getTotalByCity) => {
          return {
            location: getLatLng(item?.state, item?.city),
            weight: item?.quantity,
          };
        }),
      map,
      dissipating: true,
      radius: 20,
    });
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div style={{ height: 500, width: "100%", }}>
      <GoogleMap
        mapContainerStyle={{
          ...mapContainerStyle,
          opacity: 0.6,
        }}
        center={{
          lat:
            Number(
              State.getStatesOfCountry("BR").find(
                (state) => state?.isoCode === (query as any)?.state
              )?.latitude
            ) || center.lat,
          lng:
            Number(
              State.getStatesOfCountry("BR").find(
                (state) => state?.isoCode === (query as any)?.state
              )?.longitude
            ) || center.lng,
        }}
        onLoad={onLoad}
        zoom={(query as any)?.state ? 6 : 4}
        options={{
          styles: [
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [
                {
                  visibility: "off",
                },
              ],
            },
            {
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [
                {
                  color: "#ffffff",
                },
                {
                  weight: 2,
                },
              ],
            },
            {
              featureType: "administrative.state",
              elementType: "geometry.stroke",
              stylers: [
                {
                  color: "#ffffff",
                },
                {
                  weight: 2,
                },
              ],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [
                {
                  color: theme === "light" ? "#f5f5f5" : "#222222", // Set the color to white (hex code)
                },
              ],
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [
                {
                  color: "#b4b8c2", // Set the color of land (terra firme) to gray (hex code)
                },
              ],
            },
            {
              featureType: "water",
              elementType: "labels.text",
              stylers: [
                {
                  visibility: "off", // Hide labels for water bodies
                },
              ],
            },
            {
              featureType: "administrative.state",
              elementType: "labels",
              stylers: [
                {
                  weight: 0.2, // Set the stroke color to transparent
                },
                {
                  color: "#000000", // Set the stroke color to transparent
                },
              ],
            },
            {
              featureType: "poi.business",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
          ],
          mapTypeControl: false,
          scrollwheel: false,
        }}
      >
        {isLoaded && (
          <HeatmapLayer
            data={
              data && data.length >= 1
                ? data
                    ?.filter((item: getTotalByCity) => item.state !== "N/A")
                    .map((item: getTotalByCity) => {
                      return {
                        location: getLatLng(item?.state, item?.city),
                        weight: item?.quantity,
                      };
                    })
                : []
            }
          />
        )}
      </GoogleMap>
      {!isMobile && (
        <Typography.Title
          level={4}
          style={{
            position: "absolute",
            top: 20,
            left: 0,
          }}
        >
          {t("table.deposits_withdraws_view")}
        </Typography.Title>
      )}
      {!isMobile && (
        <Card
          bordered={false}
          style={{
            width: "15vw",
            position: "absolute",
            top: 70,
            left: 0,
            height: 400,
            minWidth: 280,
          }}
          title={
            <>
              <Statistic
                style={{ marginTop: 8 }}
                title={`${t("table.real_time_last_30")}`}
                value={
                  (lastHalfHour ? lastHalfHour?.total : 0) +
                  (lastHalfHourWithdraw ? lastHalfHourWithdraw?.total : 0)
                }
                decimalSeparator=","
              />
              {!isLastHalfHourFetching && (
                <Typography.Text style={{ color: "#a0a0a0", fontSize: "12px" }}>
                  {new Date().toLocaleDateString()}{" "}
                  {new Date().toLocaleTimeString()}
                </Typography.Text>
              )}
            </>
          }
        >
          <Row style={{ width: "100%" }}>
            <Col span={24} style={{ marginTop: -20 }}>
              <Typography.Text
                style={{ color: "#a0a0a0", width: 300, textAlign: "end" }}
              >
                {t("table.transactions_by_minute")}
              </Typography.Text>

              <ReactECharts
                style={{
                  height: "180px",
                  marginTop: -50,
                  marginLeft: -40,
                  marginRight: -40,
                }}
                option={{
                  xAxis: {
                    type: "category",
                    data: lastHalfHour?.items?.map((item) => {
                      return moment(item.date).format(
                        "YYYY-MM-DDTHH:mm:00.000"
                      );
                    }),
                    show: false,
                  },
                  yAxis: {
                    type: "value",
                    show: false,
                  },
                  series: [
                    {
                      data: lastHalfHour?.items?.map(
                        (item: any) =>
                          lastHalfHourWithdraw?.items.find(
                            (i) => i.date === item.date
                          )?.count + item.cont
                      ),
                      type: "bar",
                    },
                  ],
                  tooltip: {
                    trigger: "axis",
                    formatter: (props: any) =>
                      renderToString(
                        <Statistic
                          title={`${Math.floor(
                            ((new Date() as any) -
                              (new Date(props[0]?.axisValue) as any)) /
                              (60 * 1000)
                          )} minutos atrás`}
                          value={props[0]?.value}
                        />
                      ),
                  },
                  legend: {
                    show: false,
                  },
                }}
                opts={{ renderer: "svg" }}
                lazyUpdate
              />
            </Col>
            <Col span={24} style={{ marginTop: -60 }}>
              <Typography.Text style={{ color: "#a0a0a0" }}>
                {t("table.in_out_last_30")}
              </Typography.Text>
              <ReactECharts
                style={{
                  height: "170px",
                  marginTop: -20,
                  marginLeft: -40,
                  marginRight: -40,
                }}
                option={{
                  tooltip: {
                    trigger: "item",
                  },
                  legend: {
                    show: false,
                  },
                  series: [
                    {
                      name: "",
                      type: "pie",
                      radius: ["40%", "70%"],
                      avoidLabelOverlap: false,
                      itemStyle: {
                        borderRadius: 10,
                        borderColor: "#fff",
                        borderWidth: 2,
                      },
                      label: {
                        show: false,
                        position: "center",
                      },
                      emphasis: {
                        label: {
                          show: false,
                          fontSize: 40,
                          fontWeight: "bold",
                        },
                      },
                      labelLine: {
                        show: false,
                      },
                      data: [
                        {
                          value: lastHalfHourWithdraw?.total || 0,
                          name: "Saídas",
                          itemStyle: { color: defaultTheme.colors.error },
                        },
                        { value: lastHalfHour?.total || 0, name: "Entradas" },
                      ],
                    },
                  ],
                }}
                opts={{ renderer: "svg" }}
                lazyUpdate
              />
            </Col>
            <Col span={17} style={{ marginTop: -40 }}>
              <Statistic
                title="Entradas"
                value={lastHalfHour?.total || 0}
                valueStyle={{ color: "#5470c6" }}
              />
            </Col>
            <Col span={7} style={{ marginTop: -40 }}>
              <Statistic
                title="Saídas"
                value={lastHalfHourWithdraw?.total || 0}
                valueStyle={{ color: defaultTheme.colors.error }}
              />
            </Col>
          </Row>
        </Card>
      )}
      {!isMobile && (
        <Row
          style={{
            position: "absolute",
            right: -25,
            top: 0,
            width: "23vw",
            height: 380,
          }}
        >
          <Card
            style={{
              width: "100%",
              maxHeight: "100%",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            bodyStyle={{ padding: 0 }}
          >
            {!query.state ? (
              <CustomTable
                disableScrollToTop
                data={{ items: state }}
                items={state}
                removePagination
                columns={[
                  { name: "state", type: "text" },
                  { name: "quantity", head: "total", type: "text" },
                  { name: "totalValue", head: "value", type: "value" },
                  { name: "medianTicket", head: "ticket", type: "value" },
                ]}
                loading={false}
                query={query}
                setCurrentItem={() => {
                  return;
                }}
                setQuery={setQuery}
              />
            ) : (
              <CustomTable
                disableScrollToTop
                data={{ items: data }}
                items={
                  query.state
                    ? data
                        .sort((a: any, b: any) =>
                          a.quantity > b.quantity ? -1 : 1
                        )
                        .filter(
                          (item: any) => item.state === (query as any)?.state
                        )
                    : data
                }
                removePagination
                columns={[
                  { name: "city", type: "text" },
                  { name: "quantity", head: "total", type: "text" },
                  { name: "totalValue", head: "value", type: "value" },
                  { name: "medianTicket", head: "ticket", type: "value" },
                ]}
                loading={false}
                query={query}
                setCurrentItem={() => {
                  return;
                }}
                setQuery={setQuery}
              />
            )}
          </Card>
        </Row>
      )}
    </div>
  );
}
