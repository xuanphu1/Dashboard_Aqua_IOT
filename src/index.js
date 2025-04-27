// Constants
const API_KEY = 'ec224bde787c4001b0281007251802';
const LOCATION = 'Hanoi';

// State Variables
const eraWidget = new EraWidget();
let configTemp, configWater, configTDS, configPH, configConductivity;
let Fan_ON, Fan_OFF, Heater_ON, Heater_OFF, Light_ON, Light_OFF, Feeder_ON, Feeder_OFF,
    Pumb_ON, Pumb_OFF, Filter_ON, Filter_OFF, SetAutoON, SetAutoOFF, RequestOTA, LoadingOTA;
let configStatusFan, configStatusHeater, configStatusLight, configStatusFeeder, configStatusPump,
    configStatusFilter, configStatusAuto, configStatusOTA;
let TemperatureValue = 50, WaterLevelValue, TDSValue, PHValue, ConductivityValue;

// Proxy for Status Tracking
let isUpdatingUI = false;

const statusProxy = new Proxy({
  StatusFan: 0,
  StatusHeater: 0,
  StatusLight: 0,
  StatusFeeder: 0,
  StatusPump: 0,
  StatusFilter: 0,
  StatusAuto: 0,
  StatusOTA: 0
}, {
  set(target, key, value) {
    if (target[key] !== value) {
      console.log(`${key} changed from ${target[key]} to ${value}`);
      target[key] = value;
      if (!isUpdatingUI) {
        updateUI();
      }
    }
    if (isUpdatingUI) isUpdatingUI = false;
    return true;
  }
});


// Update UI
const updateUI = () => {
  DOM.lightEffect.classList.toggle('active', statusProxy.StatusLight);
  DOM.fanEffect.classList.toggle('active', statusProxy.StatusFan);
  DOM.heaterEffect.classList.toggle('active', statusProxy.StatusHeater);
  DOM.pumbEffect.classList.toggle('active', statusProxy.StatusPump);
  DOM.filterEffect.classList.toggle('active', statusProxy.StatusFilter);
  DOM.feederEffect.classList.toggle('active', statusProxy.StatusFeeder);

  DOM.lightSwitch.checked = statusProxy.StatusLight;
  DOM.fanSwitch.checked = statusProxy.StatusFan;
  DOM.heaterSwitch.checked = statusProxy.StatusHeater;
  DOM.pumpSwitch.checked = statusProxy.StatusPump;
  DOM.filterSwitch.checked = statusProxy.StatusFilter;
  DOM.feederSwitch.checked = statusProxy.StatusFeeder;
  DOM.autoBtn.checked = statusProxy.StatusAuto;
  DOM.fotaBtn.checked = statusProxy.StatusOTA;

  isUpdatingUI = false;
};

// Initialize Era Widget
const initEraWidget = () => {
  eraWidget.init({
    onConfiguration: (configuration) => {
      configTemp = configuration.realtime_configs[0];
      configTDS = configuration.realtime_configs[1];
      configPH = configuration.realtime_configs[2];
      configWater = configuration.realtime_configs[3];
      configConductivity = configuration.realtime_configs[4];

      configStatusFan = configuration.realtime_configs[5];
      configStatusHeater = configuration.realtime_configs[6];
      configStatusLight = configuration.realtime_configs[7];
      configStatusFeeder = configuration.realtime_configs[8];
      configStatusPump = configuration.realtime_configs[9];
      configStatusFilter = configuration.realtime_configs[10];
      configStatusAuto = configuration.realtime_configs[11];
      configStatusOTA = configuration.realtime_configs[12];

      Fan_ON = configuration.actions[0];
      Fan_OFF = configuration.actions[1];
      Heater_ON = configuration.actions[2];
      Heater_OFF = configuration.actions[3];
      Light_ON = configuration.actions[4];
      Light_OFF = configuration.actions[5];
      Feeder_ON = configuration.actions[6];
      Feeder_OFF = configuration.actions[7];
      Pumb_ON = configuration.actions[8];
      Pumb_OFF = configuration.actions[9];
      Filter_ON = configuration.actions[10];
      Filter_OFF = configuration.actions[11];
      SetAutoON = configuration.actions[12];
      SetAutoOFF = configuration.actions[13];
      RequestOTA = configuration.actions[14];
      LoadingOTA = configuration.actions[15];
    },
    onValues: (values) => {
      // Update values
      TemperatureValue = values[configTemp.id]?.value ?? null;
      WaterLevelValue = values[configWater.id]?.value ?? null;
      TDSValue = values[configTDS.id]?.value ?? null;
      PHValue = values[configPH.id]?.value ?? null;
      ConductivityValue = values[configConductivity.id]?.value ?? null;

      // Update status via Proxy
      statusProxy.StatusFan = values[configStatusFan.id]?.value ?? null;
      statusProxy.StatusHeater = values[configStatusHeater.id]?.value ?? null;
      statusProxy.StatusLight = values[configStatusLight.id]?.value ?? null;
      statusProxy.StatusFeeder = values[configStatusFeeder.id]?.value ?? null;
      statusProxy.StatusPump = values[configStatusPump.id]?.value ?? null;
      statusProxy.StatusFilter = values[configStatusFilter.id]?.value ?? null;
      statusProxy.StatusAuto = values[configStatusAuto.id]?.value ?? null;
      statusProxy.StatusOTA = values[configStatusOTA.id]?.value ?? null;

      // Update progress bars and UI
      updateProgressBars();
      
    }
  });
};

// DOM Selectors
const DOM = {
  weatherContainer: document.getElementById('weather-container'),

  lightEffect: document.querySelector('.Light-effect'),
  fanEffect: document.querySelector('.Fan-effect'),
  heaterEffect: document.querySelector('.Heater-effect'),
  pumbEffect: document.querySelector('.Pumb-effect'),
  filterEffect: document.querySelector('.Filter-effect'),
  feederEffect: document.querySelector('.Feeder-effect'),

  lightStatus: document.querySelector('.Light-widget .status'),
  fanStatus: document.querySelector('.Fan-widget .status'),
  heaterStatus: document.querySelector('.Heater-widget .status'),
  pumpStatus: document.querySelector('.Pumb-widget .status'),
  filterStatus: document.querySelector('.Filter-widget .status'),
  feederStatus: document.querySelector('.Feeder-widget .status'),

  lightSwitch: document.querySelector('#light-switch'),
  fanSwitch: document.querySelector('#fan-switch'),
  heaterSwitch: document.querySelector('#heater-switch'),
  pumpSwitch: document.querySelector('#pumb-switch'),
  filterSwitch: document.querySelector('#filter-switch'),
  feederSwitch: document.querySelector('#feeder-switch'),

  autoBtn: document.querySelector('#auto-btn'),
  fotaBtn: document.querySelector('#fota-btn')
};



// Event Listeners
const initEventListeners = () => {
  // Light
  DOM.lightStatus.addEventListener('click', () => {
    isUpdatingUI = true; // Bắt đầu cập nhật UI
    statusProxy.StatusLight = !statusProxy.StatusLight;
    if (statusProxy.StatusLight) {
      DOM.lightEffect.classList.add('active');
      eraWidget.triggerAction(Light_ON.action, null);
    } else {
      DOM.lightEffect.classList.remove('active');
      eraWidget.triggerAction(Light_OFF.action, null);
    }
  });

  // Fan
DOM.fanStatus.addEventListener('click', () => {
  isUpdatingUI = true;
  statusProxy.StatusFan = !statusProxy.StatusFan;
  if (statusProxy.StatusFan) {
    DOM.fanEffect.classList.add('active');
    eraWidget.triggerAction(Fan_ON.action, null);
  } else {
    DOM.fanEffect.classList.remove('active');
    eraWidget.triggerAction(Fan_OFF.action, null);
  }
});


 // Heater
DOM.heaterStatus.addEventListener('click', () => {
  isUpdatingUI = true;
  statusProxy.StatusHeater = !statusProxy.StatusHeater;
  if (statusProxy.StatusHeater) {
    DOM.heaterEffect.classList.add('active');
    eraWidget.triggerAction(Heater_ON.action, null);
  } else {
    DOM.heaterEffect.classList.remove('active');
    eraWidget.triggerAction(Heater_OFF.action, null);
  }
});

// Pump
DOM.pumpStatus.addEventListener('click', () => {
  isUpdatingUI = true;
  statusProxy.StatusPump = !statusProxy.StatusPump;
  if (statusProxy.StatusPump) {
    DOM.pumbEffect.classList.add('active');
    eraWidget.triggerAction(Pumb_ON.action, null);
  } else {
    DOM.pumbEffect.classList.remove('active');
    eraWidget.triggerAction(Pumb_OFF.action, null);
  }
});



// Filter
DOM.filterStatus.addEventListener('click', () => {
  isUpdatingUI = true;
  statusProxy.StatusFilter = !statusProxy.StatusFilter;
  if (statusProxy.StatusFilter) {
    DOM.filterEffect.classList.add('active');
    eraWidget.triggerAction(Filter_ON.action, null);
  } else {
    DOM.filterEffect.classList.remove('active');
    eraWidget.triggerAction(Filter_OFF.action, null);
  }
});


// Feeder
DOM.feederStatus.addEventListener('click', () => {
  isUpdatingUI = true;
  statusProxy.StatusFeeder = !statusProxy.StatusFeeder;
  if (statusProxy.StatusFeeder) {
    DOM.feederEffect.classList.add('active');
    eraWidget.triggerAction(Feeder_ON.action, null);
  } else {
    DOM.feederEffect.classList.remove('active');
    eraWidget.triggerAction(Feeder_OFF.action, null);
  }
});




  // OTA
  DOM.fotaBtn.addEventListener('click', () => {
    isUpdatingUI = true; // Bắt đầu cập nhật UI
    statusProxy.StatusOTA = !statusProxy.StatusOTA;
    if (statusProxy.StatusOTA) {
      eraWidget.triggerAction(LoadingOTA.action, null);
    } else 
    {
      eraWidget.triggerAction(RequestOTA.action, null);
    }
  });

  // Auto
  DOM.autoBtn.addEventListener('click', () => {
    isUpdatingUI = true; // Bắt đầu cập nhật UI
    statusProxy.StatusAuto = !statusProxy.StatusAuto;
    if (statusProxy.StatusAuto) {
      eraWidget.triggerAction(SetAutoON.action, null);
    } else 
    {
      eraWidget.triggerAction(SetAutoOFF.action, null);
    }
  });

};


// Initialize Progress Bars
let progressBars;
const initProgressBars = () => {
  const commonConfig = {
    strokeWidth: 12,
    color: 'white',
    trailColor: 'rgba(255,255,255, 0.4)',
    trailWidth: 12,
    easing: 'easeInOut',
    duration: 1400,
    svgStyle: { width: '100%', height: '100%' },
    step: (state, bar) => {
      bar.path.setAttribute('stroke', state.color);
      const value = Math.round(bar.value() * 100);
      bar.setText(value || '');
      bar.text.style.color = state.color;
    }
  };

  progressBars = {
    temp: new ProgressBar.SemiCircle('#container_temperature', {
      ...commonConfig,
      text: { value: '', alignToBottom: false, className: 'progressbar_label' }
    }),
    water: new ProgressBar.Line('#container_waterlevel', {
      ...commonConfig,
      text: { value: '', className: 'water_level_label' }
    }),
    tds: new ProgressBar.Line('#container_tds', {
      ...commonConfig,
      text: { value: '', className: 'tds_label' }
    }),
    ph: new ProgressBar.Line('#container_ph', {
      ...commonConfig,
      text: { value: '', className: 'ph_label' }
    }),
    conductivity: new ProgressBar.Line('#container_conductivity', {
      ...commonConfig,
      text: { value: '', className: 'conductivity_label' }
    })
  };

  // Initial animation
  progressBars.temp.animate(TemperatureValue / 100);
  progressBars.water.animate(WaterLevelValue / 100);
  progressBars.tds.animate(TDSValue / 100);
  progressBars.ph.animate(PHValue / 100);
  progressBars.conductivity.animate(ConductivityValue / 100);
};

// Update Progress Bars
const updateProgressBars = () => {
  progressBars.temp.animate(TemperatureValue / 100);
  progressBars.water.animate(WaterLevelValue / 100);
  progressBars.tds.animate(TDSValue / 100);
  progressBars.ph.animate(PHValue / 100);
  progressBars.conductivity.animate(ConductivityValue / 100);
};

// Initialize Highcharts
const initHighcharts = () => {
  const generateInitialData = () => {
    const data = [];
    const time = new Date().getTime();
    for (let i = -19; i <= 0; i++) {
      data.push({ x: time + i * 1000, y: Math.random() });
    }
    return data;
  };

  const addConductivityEffect = (series, point) => {
    if (!series.pulse) {
      series.pulse = series.chart.renderer.circle()
        .attr({ r: 5, opacity: 0 })
        .add(series.markerGroup);
    }
    setTimeout(() => {
      series.pulse
        .attr({
          x: series.xAxis.toPixels(point.x, true),
          y: series.yAxis.toPixels(point.y, true),
          r: 5,
          opacity: 1,
          fill: series.color
        })
        .animate({ r: 20, opacity: 0 }, { duration: 1000 });
    }, 1);
  };

  const onChartLoad = function () {
    const chart = this;
    const series = chart.series;
    setInterval(() => {
      const x = new Date().getTime();
      const newDataPoints = [
        { seriesIndex: 0, y: TemperatureValue },
        { seriesIndex: 1, y: WaterLevelValue },
        { seriesIndex: 2, y: Math.min(TDSValue, 100) },
        { seriesIndex: 3, y: PHValue },
        { seriesIndex: 4, y: Math.min(ConductivityValue, 100) }
      ];
      newDataPoints.forEach((dataPoint) => {
        const seriesTarget = series[dataPoint.seriesIndex];
        seriesTarget.addPoint([x, dataPoint.y], true, true);
        addConductivityEffect(seriesTarget, { x, y: dataPoint.y });
      });
    }, 1000);
  };

  Highcharts.addEvent(Highcharts.Series, 'addPoint', (e) => {
    const point = e.point;
    const series = e.target;
    if (!series.pulse) {
      series.pulse = series.chart.renderer.circle().add(series.markerGroup);
    }
    setTimeout(() => {
      series.pulse
        .attr({
          x: series.xAxis.toPixels(point.x, true),
          y: series.yAxis.toPixels(point.y, true),
          r: series.options.marker.radius,
          opacity: 1,
          fill: series.color
        })
        .animate({ r: 20, opacity: 0 }, { duration: 1000 });
    }, 1);
  });

  Highcharts.chart('chart-container', {
    chart: { type: 'spline', events: { load: onChartLoad } },
    time: { useUTC: false },
    title: { text: 'Live random data', style: { color: '#FFFFFF' } },
    accessibility: {
      announceNewData: {
        enabled: true,
        minAnnounceInterval: 15000,
        announcementFormatter: (allSeries, newSeries, newPoint) =>
          newPoint ? 'New point added. Value: ' + newPoint.y : false
      }
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 150,
      maxPadding: 0.1,
      lineColor: '#FFFFFF',
      tickColor: '#FFFFFF',
      labels: { style: { color: '#FFFFFF' } }
    },
    yAxis: {
      title: { text: 'Value', style: { color: '#FFFFFF' } },
      lineColor: '#FFFFFF',
      tickColor: '#FFFFFF',
      labels: { style: { color: '#FFFFFF' } },
      plotLines: [{ value: 0, width: 1, color: '#FFFFFF' }]
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br/>',
      pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
    },
    legend: { enabled: true },
    exporting: { enabled: false },
    series: [
      { name: 'Temperature (°C)', lineWidth: 2, color: 'red', data: generateInitialData() },
      { name: 'Water Level (%)', lineWidth: 2, color: 'blue', data: generateInitialData(), visible: false },
      { name: 'TDS Value (ppm)', lineWidth: 2, color: 'green', data: generateInitialData(), visible: false },
      { name: 'PH Value', lineWidth: 2, color: 'yellow', data: generateInitialData(), visible: false },
      { name: 'Conductivity (μS/cm)', lineWidth: 2, color: 'purple', data: generateInitialData(), visible: false }
    ]
  });
};

// Fetch Weather Data
const fetchWeather = async (location) => {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=yes`);
    if (!response.ok) throw new Error(`${response.status}`);
    const data = await response.json();

    // Cập nhật các phần tử trong DOM
    document.getElementById("location").textContent = `Weather in ${data.location.name}, ${data.location.country}: `;
    document.getElementById("temperature").textContent = `${data.current.temp_c}°C`;
    document.getElementById("wind").textContent = `${data.current.wind_kph} km/h`;
  } catch (error) {
    console.log('❌ Error fetching data:', error.message);
  }
};


// Initialize Application
const init = () => {
  initEraWidget();
  initProgressBars();
  initHighcharts();
  initEventListeners();
  fetchWeather(LOCATION);
};

// Run Application
window.addEventListener('load', init);









//===========Full Screen Feature==========
// Add fullscreen button HTML to your document first
const fullscreenButton = document.createElement("button");
fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
fullscreenButton.className = "fullscreen-button";
document.body.appendChild(fullscreenButton);

// Add fullscreen functionality
let isFullscreen = false;

function toggleFullscreen() {
  if (!isFullscreen) {
    // Enter fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
    fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
  }
  isFullscreen = !isFullscreen;
}

// Event listener for fullscreen button
fullscreenButton.addEventListener("click", toggleFullscreen);

// Update button icon when fullscreen changes through other means (like Esc key)
document.addEventListener("fullscreenchange", function () {
  isFullscreen = !!document.fullscreenElement;
  fullscreenButton.innerHTML = isFullscreen
    ? '<i class="fas fa-compress"></i>'
    : '<i class="fas fa-expand"></i>';
});

// Handle fullscreen change for different browsers
document.addEventListener("webkitfullscreenchange", function () {
  isFullscreen = !!document.webkitFullscreenElement;
  fullscreenButton.innerHTML = isFullscreen
    ? '<i class="fas fa-compress"></i>'
    : '<i class="fas fa-expand"></i>';
});

document.addEventListener("mozfullscreenchange", function () {
  isFullscreen = !!document.mozFullScreenElement;
  fullscreenButton.innerHTML = isFullscreen
    ? '<i class="fas fa-compress"></i>'
    : '<i class="fas fa-expand"></i>';
});

document.addEventListener("MSFullscreenChange", function () {
  isFullscreen = !!document.msFullscreenElement;
  fullscreenButton.innerHTML = isFullscreen
    ? '<i class="fas fa-compress"></i>'
    : '<i class="fas fa-expand"></i>';
});
