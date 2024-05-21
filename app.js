import config from "./config.js";
const { API_KEY } = config;

const formatDate = (date) => {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
}

const fetchMealInfo = (apiUrl) => {
  return fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => data.mealServiceDietInfo[1].row)
    .catch(error => {
      console.error('Error fetching meal information:', error);
      return null;
    });
};

const displayMealInfo = (mealData, mealType) => {
  if (!mealData) return `<p>${mealType} 정보가 없습니다.</p>`;
  return `<div class="meal"><h2>${mealType}</h2><p>${mealData.DDISH_NM}</div>`;
};

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayDate = formatDate(today);
  const tomorrowDate = formatDate(tomorrow);

  const apiUrlToday = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=F10&SD_SCHUL_CODE=7380292&MLSV_YMD=${todayDate}&Type=json&KEY=${API_KEY}`;
  const apiUrlTomorrow = `https://open.neis.go.kr/hub/mealServiceDietInfo?ATPT_OFCDC_SC_CODE=F10&SD_SCHUL_CODE=7380292&MLSV_YMD=${tomorrowDate}&Type=json&KEY=${API_KEY}`;

  const dateContainer = document.getElementById('date-container');

  Promise.all([
    fetchMealInfo(apiUrlToday),
    fetchMealInfo(apiUrlTomorrow)
  ])
    .then(([todayMeal, tomorrowMeal]) => {
      const mealInfoContainer = document.getElementById('meal-info');
      mealInfoContainer.innerHTML = `
        <div>날짜 : ${todayDate}</div>
        <span>🍙오늘 </span>
        ${displayMealInfo(todayMeal[0], '조식')}
        ${displayMealInfo(todayMeal[1], '중식')}
        ${displayMealInfo(todayMeal[2], '석식')}
        <div>날짜 : ${tomorrowDate}</div>
        <span>🍙내일 </span> 
        ${displayMealInfo(tomorrowMeal[0], '조식')}
        ${displayMealInfo(tomorrowMeal[1], '중식')}
        ${displayMealInfo(tomorrowMeal[2], '석식')}
      `;
    })
    .catch(error => {
      console.error('Error fetching meal information:', error);
      const mealInfoContainer = document.getElementById('meal-info');
      mealInfoContainer.innerHTML = '<p>Failed to get meal information...</p>';
    });
});
