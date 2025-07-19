let map, userLocation;

function initMap(lat = 13.0827, lng = 80.2707) {
  userLocation = { lat, lng };
  map = new google.maps.Map(document.getElementById("map"), {
    center: userLocation,
    zoom: 12
  });

  new google.maps.Marker({
    position: userLocation,
    map: map,
    label: "You"
  });
}

function registerMechanic() {
  navigator.geolocation.getCurrentPosition((position) => {
    const data = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };

    fetch('/register_mechanic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(res => alert(res.status));
  });
}

function findMechanics() {
  navigator.geolocation.getCurrentPosition((position) => {
    fetch(`/get_mechanics?lat=${position.coords.latitude}&lng=${position.coords.longitude}`)
      .then(res => res.json())
      .then(data => {
        initMap(position.coords.latitude, position.coords.longitude);
        data.forEach(m => {
          new google.maps.Marker({
            position: { lat: m.latitude, lng: m.longitude },
            map: map,
            title: `${m.name} (${m.phone})`
          });
        });
      });
  });
}

window.onload = () => initMap();
