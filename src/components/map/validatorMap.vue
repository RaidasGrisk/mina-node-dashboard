<script setup>
import { ref, onMounted } from 'vue';
import data from './data.json';

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import "leaflet.markercluster";
import "leaflet.heat";

const map = ref(null);
const mapContainer = ref(null);

const initMap = () => {

  // data prep
  const coordData = data.map(
    point => [point.location.latitude, point.location.longitude]
  )

  // init map
  map.value = L.map(mapContainer.value, {
    zoomControl: false,
    zoomAnimation: false,
    minZoom: 3,
  }).setView([30.0, 0.0], 3)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
  }).addTo(map.value)

  // init heat layer
  L.heatLayer(coordData, { 
    radius: 25,
    blur: 15,
    maxZoom: 18,
    minOpacity: 0.5,
  }).addTo(map.value)

  // init clusters
  const markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    singleMarkerMode: true,
  })
  coordData.forEach(coords => {
    L.marker(coords).addTo(markers)
  })
  markers.addTo(map.value)

}

onMounted(() => {
  setTimeout(() => { initMap() }, 100) 
  console.log(data)
})

</script>

<template>
  <div ref="mapContainer" style="width: 100%; height: 100vh;"></div>
</template>

<style>
</style>
