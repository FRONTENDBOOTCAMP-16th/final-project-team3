/* eslint-disable no-unused-vars */
declare namespace naver.maps {
  interface MapOptions {
    center?: LatLng;
    zoom?: number;
  }

  class LatLng {
    constructor(lat: number | string, lng: number | string);
  }

  class Map {
    constructor(element: HTMLElement, options?: MapOptions);
    setCenter(latLng: LatLng): void;
    setZoom(zoom: number): void;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
    title?: string;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
  }

  namespace Event {
    function addListener(
      target: Marker,
      eventName: string,
      listener: () => void,
    ): void;
  }
}

interface Window {
  naver?: {
    maps: typeof naver.maps;
  };
}
