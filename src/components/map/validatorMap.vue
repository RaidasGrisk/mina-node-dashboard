<script setup>
import { ref, onMounted } from 'vue'
import raw_data from './data.json'

import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'
import 'leaflet.heat'

const map = ref(null)
const mapContainer = ref(null)

const initMap = () => {

  // proprocess data by filtering out some keys
  const keysToKeep = ['datacenter', 'company', 'abuse', 'asn', 'location']
  const data = raw_data.map(json => {
    const json_ = {}
    keysToKeep.forEach(key => { json_[key] = json[key]})
    return json_
  })

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
  L.heatLayer(data.map(item => [item.location.latitude, item.location.longitude]), { 
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
  data.forEach(item => {
    L.marker([item.location.latitude, item.location.longitude])
    .bindPopup(
      JSON.stringify(item, null, 2).replace(/\n/g, '<br>').replace(/[ ]/g, '&nbsp;')
    )
    .addTo(markers)
  })
  markers.addTo(map.value)

}

onMounted(() => {
  setTimeout(() => { initMap() }, 100) 
  console.log(raw_data)
})

</script>

<template>
  <div ref="mapContainer" style="width: 100%; height: 100vh;"></div>
</template>

<style>

/* popup */
.leaflet-popup-content-wrapper {
  background-color: #222;
}

/* popup content */
.leaflet-popup-content {
  font-size: 10px;
  color: #999;
}

/* area outside the map */
.leaflet-container {
  background-color: #b1aeae00;
}

</style>
