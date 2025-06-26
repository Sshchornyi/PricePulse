export function createChart(canvasId, history, isModal = false) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) {
    console.error(`Canvas with id ${canvasId} not found!`);
    return null;
  }

  // Sort history by date
  history.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const dates = history.map(item => item.date);
  const prices = history.map(item => item.price);

  // Determine the color based on last price change or default
  let lineColor = 'blue';
  let fillColor = 'transparent';
  
  if (prices.length >= 1) {
    if (prices.length > 1) {
      const lastChange = prices[prices.length - 1] - prices[prices.length - 2];
      lineColor = lastChange > 0 ? 'red' : lastChange < 0 ? 'green' : 'blue';
      
      if (isModal) {
        fillColor = lastChange > 0 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)';
      }
    }
  }

  const datasets = [{
    label: 'Ціна',
    data: prices,
    borderColor: lineColor,
    backgroundColor: fillColor,
    borderWidth: isModal ? 3 : 2,
    fill: isModal ? 'origin' : false,
    pointRadius: prices.length === 1 ? 5 : (isModal ? 4 : 3), // Збільшуємо радіус точки для однієї ціни
    pointHoverRadius: prices.length === 1 ? 7 : (isModal ? 6 : 4), // Збільшуємо при наведенні
    pointStyle: prices.length === 1 ? 'circle' : undefined, // Явно визначаємо стиль точки
    tension: 0.1
  }];

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { 
          display: isModal,
          title: { 
            display: isModal, 
            text: 'Дата',
            font: {
              size: isModal ? 14 : 10
            }
          },
          ticks: {
            font: {
              size: isModal ? 12 : 8
            }
          }
        },
        y: { 
          display: true,
          title: { 
            display: isModal, 
            text: 'Ціна (грн)',
            font: {
              size: isModal ? 14 : 10
            }
          },
          ticks: {
            font: {
              size: isModal ? 12 : 8
            }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: isModal || prices.length === 1, // Додаємо tooltip для однієї точки
          callbacks: {
            label: function(context) {
              return `Ціна: ${context.parsed.y} грн`;
            }
          }
        }
      },
      elements: {
        line: {
          borderWidth: isModal ? 3 : 2
        },
        point: {
          radius: prices.length === 1 ? 5 : (isModal ? 4 : 3), // Додаткове налаштування точки
          hoverRadius: prices.length === 1 ? 7 : (isModal ? 6 : 4)
        }
      }
    }
  });

  return chart;
}