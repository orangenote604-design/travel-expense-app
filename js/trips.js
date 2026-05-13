let tripList = [];

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('searchTripButton').addEventListener('click', renderTrips);
  document.getElementById('clearTripButton').addEventListener('click', clearSearch);
  document.getElementById('tripTableBody').addEventListener('click', handleTableClick);
  await loadTrips();
});

async function loadTrips() {
  try {
    tripList = await apiGet('listTrips');
    renderTrips();
  } catch (error) {
    setMessage('旅行一覧の取得に失敗しました。', 'error');
    console.error(error);
  }
}

function clearSearch() {
  document.getElementById('tripSearch').value = '';
  renderTrips();
}

function renderTrips() {
  const keyword = document.getElementById('tripSearch').value.trim().toLowerCase();
  const rows = tripList.filter(item => !keyword || String(item.tripName).toLowerCase().includes(keyword));
  const tbody = document.getElementById('tripTableBody');

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="9">データがありません。</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(item => {
    const actualReturnDistance = item.separateReturn ? toNumber(item.returnDistance) : toNumber(item.outboundDistance);
    return `
      <tr>
        <td>${escapeHtml(item.tripName)}</td>
        <td>${escapeHtml(item.departureFrom)}</td>
        <td>${escapeHtml(item.arrivalTo)}</td>
        <td>${escapeHtml(item.returnFrom)}</td>
        <td>${escapeHtml(item.returnTo)}</td>
        <td class="text-right">${toNumber(item.outboundDistance).toLocaleString('ja-JP')}</td>
        <td class="text-right">${actualReturnDistance.toLocaleString('ja-JP')}</td>
        <td class="text-right">${toNumber(item.roundTripDistance).toLocaleString('ja-JP')}</td>
        <td><div class="button-row"><a href="trip-edit.html?tripName=${encodeURIComponent(item.tripName)}" class="button-link secondary">編集</a><button type="button" class="danger delete-trip-button" data-trip-name="${escapeHtml(item.tripName)}">削除</button></div></td>
      </tr>`;
  }).join('');
}

async function handleTableClick(event) {
  const button = event.target.closest('.delete-trip-button');
  if (!button) return;
  const tripName = button.dataset.tripName;
  if (!confirm(`旅行「${tripName}」を削除しますか？`)) return;
  try {
    const result = await apiPost({ action: 'deleteTrip', tripName });
    if (!result.ok) {
      setMessage(result.error || '削除に失敗しました。', 'error');
      return;
    }
    setMessage(`削除しました: ${tripName}`, 'success');
    await loadTrips();
  } catch (error) {
    setMessage('通信エラーが発生しました。', 'error');
    console.error(error);
  }
}
