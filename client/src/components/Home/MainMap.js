/* eslint-disable */
import styled from "styled-components";
import { useState } from "react";
import { useRef } from "react";
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useRecoilValue } from "recoil";
import { useQuery } from "@tanstack/react-query";
import { categoryState } from "../../atoms/filter";
import { searchState } from "../../atoms/search";
import { useEffect } from "react";
import axios from "axios";
import CustomMarker from "./CustomMarker";
import CustomOverlay from "./CustomOverlay";

const MapContainer = styled.div`
  margin: auto;
  min-height: calc(100vh - 140px);
  padding: 25px;
  background-color: white;
  @media screen and (min-width: 400px) {
    width: 410px;
  }
  @media screen and (min-width: 800px) {
    width: 810px;
  }
  @media screen and (min-width: 1200px) {
    width: 1210px;
  }
  @media screen and (min-width: 1600px) {
    width: 1610px;
  }
`;

const StyledCustomOverlay = styled(CustomOverlayMap)``;

const OverlayWrapper = styled.div``;

const { kakao } = window;

export default function MainMap() {
  const [state, setState] = useState({
    center: { lat: 33.450701, lng: 126.570667 },
    isPanto: false,
  });
  const [selected, setSelected] = useState(null);
  const category = useRecoilValue(categoryState);
  const search = useRecoilValue(searchState);
  const mapRef = useRef();

  const { data } = useQuery(
    ["reviews"],
    () => {
      return axios.get(`${process.env.REACT_APP_BASE_API}/reviews`);
    },
    {
      select: (reviews) =>
        category === "전체" && search === ""
          ? reviews.data
          : category === "전체" && search !== ""
          ? reviews.data.filter(
              (el) =>
                el.title.includes(search) ||
                el.city.includes(search) ||
                el.district.includes(search) ||
                el.street.includes(search)
            )
          : category !== "전체" && search === ""
          ? reviews.data.filter((el) => el.city.includes(category))
          : category !== "전체" && search !== ""
          ? reviews.data.filter(
              (el) =>
                el.city.includes(category) &&
                (el.title.includes(search) ||
                  el.city.includes(search) ||
                  el.district.includes(search) ||
                  el.street.includes(search))
            )
          : null,

      onSuccess: () => {
        const bounds = new kakao.maps.LatLngBounds();
        data.forEach((review) => {
          bounds.extend(new kakao.maps.LatLng(review.lat, review.lng));
        });
        const map = mapRef.current;
        map.setBounds(bounds);
      },
    }
  );

  const handleResize = () => {
    const bounds = new kakao.maps.LatLngBounds();
    data.forEach((review) => {
      bounds.extend(new kakao.maps.LatLng(review.lat, review.lng));
    });
    const map = mapRef.current;
    if (window.innerWidth < 800) {
      if (map) {
        map.setBounds(bounds);
        map.relayout();
      }
    } else if (window.innerWidth < 1200) {
      if (map) {
        map.setBounds(bounds);
        map.relayout();
      }
    } else if (window.innerWidth < 1600) {
      if (map) {
        map.setBounds(bounds);
        map.relayout();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const bounds = new kakao.maps.LatLngBounds();
    data.forEach((review) => {
      bounds.extend(new kakao.maps.LatLng(review.lat, review.lng));
    });
    const map = mapRef.current;
    if (map) {
      map.setBounds(bounds);
      map.relayout();
    }
  }, [data]);

  if (data.length === 0) return <MapContainer></MapContainer>;

  return (
    <MapContainer>
      <Map // 지도를 표시할 Container
        center={
          // 지도의 중심좌표
          state.center
        }
        isPanto={state.isPanto}
        style={{
          width: "100%",
          height: "calc(100vh - 190px)",
        }}
        level={3} // 지도의 확대 레벨
        ref={mapRef}
      >
        {data.map((review) => (
          <OverlayWrapper key={`${review.id}+${review.lat}`}>
            <CustomMarker
              position={{ lat: review.lat, lng: review.lng }}
              onClick={() => {
                setSelected(review.id);
                setState({
                  center: { lat: review.lat, lng: review.lng },
                  isPanto: true,
                });
              }}
            />
            <StyledCustomOverlay
              position={{ lat: review.lat, lng: review.lng }}
            >
              {selected === review.id && (
                <CustomOverlay review={review} setSelected={setSelected} />
              )}
            </StyledCustomOverlay>
          </OverlayWrapper>
        ))}
      </Map>
    </MapContainer>
  );
}
