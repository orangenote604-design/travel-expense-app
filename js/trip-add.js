document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tripAddForm').addEventListener('submit', submitTrip);
  document.getElementById('outboundDistance').addEventListener('input', updateRoundTripDistance);
  document.getElementById('returnDistance').addEventListener('input', updateRoundTripDistance);
  document.getElementById('separateReturn').addEventListener('change', updateRoundTripDistance);
  updateRoundTripDistance();
});

function updateRoundTripDistance() {
  const separateReturn = document.getElementById('separateReturn').checked;
  const outbound = toNumber(document.getElementById('outboundDistance').value);
  const returnDistance = separateReturn ? toNumber(document.getElementById('returnDistance').value) : outbound;
  document.getElementById('returnDistanceField').classList.toggle('hidden', !separateReturn);
  document.getElementById('roundTripDistance').value = outbound + returnDistance;
}

async function submitTrip(event) {
  event.preventDefault();
  clearMessage();
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
  if (!payload.tripName || !payload.departureFrom || !payload.arrivalTo) {
    setMessage('旅行名・出発地・到着地は必須です。', 'error');
    return;
  }
  try {
    setLoading(true, '登録中...');
    const result = await apiPost({ action: 'addTrip', data: payload });
    if (!result.ok) {
      setMessage(result.error || '登録に失敗しました。', 'error');
      return;
    }
    setMessage(`登録しました: ${result.tripName}`, 'success');
    document.getElementById('tripAddForm').reset();
    updateRoundTripDistance();
  } catch (error) {
    setMessage('通信エラーが発生しました。', 'error');
    console.error(error);
  } finally {
    setLoading(false);
  }
}
