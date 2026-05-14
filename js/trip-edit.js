document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('tripEditForm').addEventListener('submit', updateTrip);
  document.getElementById('deleteTripButton').addEventListener('click', deleteTrip);
  document.getElementById('outboundDistance').addEventListener('input', updateRoundTripDistance);
  document.getElementById('returnDistance').addEventListener('input', updateRoundTripDistance);
  document.getElementById('separateReturn').addEventListener('change', updateRoundTripDistance);
  await initPage();
});

async function initPage() {
  const tripName = getQueryParam('tripName') || '';
  if (!tripName) {
    setMessage('対象の旅行名が指定されていません。', 'error');
    return;
  }
  try {
    const trips = await apiGet('listTrips');
    const trip = trips.find(item => item.tripName === tripName);
    if (!trip) {
      setMessage('対象の旅行が見つかりません。', 'error');
      return;
    }
    document.getElementById('currentTripName').value = trip.tripName;
    document.getElementById('tripName').value = trip.tripName;
    document.getElementById('departureFrom').value = trip.departureFrom || '';
    document.getElementById('arrivalTo').value = trip.arrivalTo || '';
    document.getElementById('returnFrom').value = trip.returnFrom || '';
    document.getElementById('returnTo').value = trip.returnTo || '';
    document.getElementById('routeNote').value = trip.routeNote || '';
    document.getElementById('outboundDistance').value = toNumber(trip.outboundDistance);
    document.getElementById('separateReturn').checked = !!trip.separateReturn;
    document.getElementById('returnDistance').value = toNumber(trip.returnDistance);
    updateRoundTripDistance();
  } catch (error) {
    setMessage('旅行データの取得に失敗しました。', 'error');
    console.error(error);
  }
}

function updateRoundTripDistance() {
  const separateReturn = document.getElementById('separateReturn').checked;
  const outbound = toNumber(document.getElementById('outboundDistance').value);
  const returnDistance = separateReturn ? toNumber(document.getElementById('returnDistance').value) : outbound;
  document.getElementById('returnDistanceField').classList.toggle('hidden', !separateReturn);
  document.getElementById('roundTripDistance').value = outbound + returnDistance;
}

async function updateTrip(event) {
  event.preventDefault();
  clearMessage();
  const oldTripName = document.getElementById('currentTripName').value.trim();
  const payload = {
    tripName: document.getElementById('tripName').value.trim(),
    departureFrom: document.getElementById('departureFrom').value.trim(),
    arrivalTo: document.getElementById('arrivalTo').value.trim(),
    returnFrom: document.getElementById('returnFrom').value.trim(),
    returnTo: document.getElementById('returnTo').value.trim(),
    routeNote: document.getElementById('routeNote').value.trim(),
    outboundDistance: toNumber(document.getElementById('outboundDistance').value),
    separateReturn: document.getElementById('separateReturn').checked,
    returnDistance: toNumber(document.getElementById('returnDistance').value)
  };
  if (!oldTripName || !payload.tripName || !payload.departureFrom || !payload.arrivalTo) {
    setMessage('旅行名・出発地・到着地は必須です。', 'error');
    return;
  }
  try {
    setLoading(true, '更新中...');
    const result = await apiPost({ action: 'updateTrip', oldTripName, data: payload });
    if (!result.ok) {
      setMessage(result.error || '更新に失敗しました。', 'error');
      return;
    }
    setMessage(`更新しました: ${result.oldTripName} → ${result.tripName}`, 'success');
    document.getElementById('currentTripName').value = result.tripName;
    history.replaceState(null, '', `trip-edit.html?tripName=${encodeURIComponent(result.tripName)}`);
  } catch (error) {
    setMessage('通信エラーが発生しました。', 'error');
    console.error(error);
  } finally {
    setLoading(false);
  }
}

async function deleteTrip() {
  clearMessage();
  const tripName = document.getElementById('currentTripName').value.trim();
  if (!tripName) {
    setMessage('削除対象がありません。', 'error');
    return;
  }
  if (!confirm(`旅行「${tripName}」を削除しますか？`)) return;
  try {
    setLoading(true, '削除中...');
    const result = await apiPost({ action: 'deleteTrip', tripName });
    if (!result.ok) {
      setMessage(result.error || '削除に失敗しました。', 'error');
      return;
    }
    location.href = 'trips.html';
  } catch (error) {
    setMessage('通信エラーが発生しました。', 'error');
    console.error(error);
  } finally {
    setLoading(false);
  }
}
