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
const statusProxy = new Proxy({
  StatusFan: null,
  StatusHeater: null,
  StatusLight: null,
  StatusFeeder: null,
  StatusPump: null,
  StatusFilter: null,
  StatusAuto: null,
  StatusOTA: null
}, {
  set(target, key, value) {
    if (target[key] !== value) {
      console.log(`${key} changed from ${target[key]} to ${value}`);
      target[key] = value;
    }
    return true;
  }
});

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
      updateUI();
    }
  });
};

// DOM Selectors
const DOM = {
  weatherContainer: document.getElementById('weather-container'),
  lightIcon: document.querySelector('.light-icon'),
  lightStatus: document.querySelector('.light-widget .status'),
  fanStatus: document.querySelector('.fan-widget .status'),
  heaterStatus: document.querySelector('.heater-widget .status'),
  pumpStatus: document.querySelector('.pumb-widget .status'),
  filterStatus: document.querySelector('.filter-widget .status'),
  feederStatus: document.querySelector('.feeder-widget .status'),
  lightSwitch: document.querySelector('#light-switch'),
  fanSwitch: document.querySelector('#fan-switch'),
  heaterSwitch: document.querySelector('#heater-switch'),
  pumpSwitch: document.querySelector('#pumb-switch'),
  filterSwitch: document.querySelector('#filter-switch'),
  feederSwitch: document.querySelector('#feeder-switch'),
  autoBtn: document.querySelector('#auto-btn'),
  fotaBtn: document.querySelector('#fota-btn')
};

// Update UI
const updateUI = () => {
  DOM.lightIcon.classList.toggle('active', statusProxy.StatusLight);
  DOM.lightSwitch.checked = statusProxy.StatusLight;
  DOM.fanSwitch.checked = statusProxy.StatusFan;
  DOM.heaterSwitch.checked = statusProxy.StatusHeater;
  DOM.pumpSwitch.checked = statusProxy.StatusPump;
  DOM.filterSwitch.checked = statusProxy.StatusFilter;
  DOM.feederSwitch.checked = statusProxy.StatusFeeder;
  DOM.autoBtn.checked = statusProxy.StatusAuto;
  DOM.fotaBtn.checked = statusProxy.StatusOTA === 255 || statusProxy.StatusOTA === 254;
};

// Event Listeners
const initEventListeners = () => {
  // Light
  DOM.lightStatus.addEventListener('click', () => {
    statusProxy.StatusLight = !statusProxy.StatusLight;
    if (statusProxy.StatusLight) {
      DOM.lightIcon.classList.add('active');
      eraWidget.triggerAction(Light_ON.action, null);
    } else {
      DOM.lightIcon.classList.remove('active');
      eraWidget.triggerAction(Light_OFF.action, null);
    }
  });

  DOM.lightSwitch.addEventListener('change', () => {
    console.log('Light switch:', DOM.lightSwitch.checked);
    statusProxy.StatusLight = DOM.lightSwitch.checked;
    DOM.lightIcon.classList.toggle('active', statusProxy.StatusLight);
  });

  // Fan
  DOM.fanStatus.addEventListener('click', () => {
    statusProxy.StatusFan = !statusProxy.StatusFan;
    if (statusProxy.StatusFan) {
      eraWidget.triggerAction(Fan_ON.action, null);
    } else {
      eraWidget.triggerAction(Fan_OFF.action, null);
    }
  });

  DOM.fanSwitch.addEventListener('change', () => {
    console.log('Fan switch:', DOM.fanSwitch.checked);
    statusProxy.StatusFan = DOM.fanSwitch.checked;
  });

  // Heater
  DOM.heaterStatus.addEventListener('click', () => {
    statusProxy.StatusHeater = !statusProxy.StatusHeater;
    if (statusProxy.StatusHeater) {
      eraWidget.triggerAction(Heater_ON.action, null);
    } else {
      eraWidget.triggerAction(Heater_OFF.action, null);
    }
  });

  DOM.heaterSwitch.addEventListener('change', () => {
    console.log('Heater switch:', DOM.heaterSwitch.checked);
    statusProxy.StatusHeater = DOM.heaterSwitch.checked;
  });

  // Pump
  DOM.pumpStatus.addEventListener('click', () => {
    statusProxy.StatusPump = !statusProxy.StatusPump;
    if (statusProxy.StatusPump) {
      eraWidget.triggerAction(Pumb_ON.action, null);
    } else {
      eraWidget.triggerAction(Pumb_OFF.action, null);
    }
  });

  DOM.pumpSwitch.addEventListener('change', () => {
    console.log('Pump switch:', DOM.pumpSwitch.checked);
    statusProxy.StatusPump = DOM.pumpSwitch.checked;
  });

  // Filter
  DOM.filterStatus.addEventListener('click', () => {
    statusProxy.StatusFilter = !statusProxy.StatusFilter;
    if (statusProxy.StatusFilter) {
      eraWidget.triggerAction(Filter_ON.action, null);
    } else {
      eraWidget.triggerAction(Filter_OFF.action, null);
    }
  });

  DOM.filterSwitch.addEventListener('change', () => {
    console.log('Filter switch:', DOM.filterSwitch.checked);
    statusProxy.StatusFilter = DOM.filterSwitch.checked;
  });

  // Feeder
  DOM.feederStatus.addEventListener('click', () => {
    statusProxy.StatusFeeder = !statusProxy.StatusFeeder;
    if (statusProxy.StatusFeeder) {
      eraWidget.triggerAction(Feeder_ON.action, null);
    } else {
      eraWidget.triggerAction(Feeder_OFF.action, null);
    }
  });

  DOM.feederSwitch.addEventListener('change', () => {
    console.log('Feeder switch:', DOM.feederSwitch.checked);
    statusProxy.StatusFeeder = DOM.feederSwitch.checked;
  });

  // Auto mode
  DOM.autoBtn.addEventListener('click', () => {
    statusProxy.StatusAuto = !statusProxy.StatusAuto;
    console.log('Auto mode:', statusProxy.StatusAuto);
    if (statusProxy.StatusAuto) {
      eraWidget.triggerAction(SetAutoON.action, null);
    } else {
      eraWidget.triggerAction(SetAutoOFF.action, null);
    }
    if (statusProxy.StatusAuto) requestAutoUpdate();
  });

  // OTA
  DOM.fotaBtn.addEventListener('click', () => {
    statusProxy.StatusOTA = statusProxy.StatusOTA === 255 ? 254 : 255;
    console.log('OTA status:', statusProxy.StatusOTA);
    if (statusProxy.StatusOTA === 255) {
      eraWidget.triggerAction(RequestOTA.action, null);
    } else if (statusProxy.StatusOTA === 254) {
      eraWidget.triggerAction(LoadingOTA.action, null);
    }
  });
};

// Auto Update Function
const requestAutoUpdate = () => {
  if (statusProxy.StatusAuto) {
    if (statusProxy.StatusLight) {
      DOM.lightIcon.classList.add('active');
      DOM.lightSwitch.checked = true;
    } else {
      DOM.lightIcon.classList.remove('active');
      DOM.lightSwitch.checked = false;
    }
    setTimeout(requestAutoUpdate, 1000);
  }
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
    DOM.weatherContainer.innerHTML = `
      <div class="weather-icon">🌍</div>
      <p>Weather in ${data.location.name}, ${data.location.country}: </p>
      <p>🌡️ ${data.current.temp_c}°C</p>
      <p>💨 ${data.current.wind_kph} km/h</p>
    `;
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