let allTravelRecords = [];
let allMembers = [];
let allTrips = [];

document.addEventListener('DOMContentLoaded', async () => {
  setLoading(true, '画面を読み込み中...');
  try {
    bindEvents();
    await loadData();
    showFlashMessage();
  } finally {
    setLoading(false);
  }
});

function bindEvents() {
  document.getElementById('searchButton').addEventListener('click', renderTable);
  document.getElementById('clearSearchButton').addEventListener('click', clearFilters);
  document.getElementById('travelTableBody').addEventListener('click', handleTableClick);
}

function showFlashMessage() {
  const created = getQueryParam('created');
  if (created) {
    setMessage(`登録しました。管理番号: ${created}`, 'success');
    history.replaceState(null, '', 'list.html');
  }
}

async function loadData() {
  try {
    const [records, members, trips] = await Promise.all([apiGet('listTravel'), apiGet('listMembers'), apiGet('listTrips')]);
    allTravelRecords = records;
    allMembers = members;
    allTrips = trips;
    populateFilters();
    renderTable();
  } catch (error) {
    setMessage('一覧の取得に失敗しました。', 'error');
    console.error(error);
  }
}

function populateFilters() {
  const years = [...new Set(allTravelRecords.map(item => item.fiscalYear).filter(Boolean))].sort((a, b) => b - a);
  fillSimpleSelect('filterFiscalYear', years);
  fillSimpleSelect('filterDriverName', [...allMembers].sort((a, b) => String(a).localeCompare(String(b), 'ja')));
  fillSimpleSelect('filterTripName', [...allTrips].sort((a, b) => String(a.tripName).localeCompare(String(b.tripName), 'ja')), 'tripName', 'tripName');
}

function clearFilters() {
  document.getElementById('filterFiscalYear').value = '';
  document.getElementById('filterTripName').value = '';
  document.getElementById('filterDriverName').value = '';
  document.getElementById('filterPaidFlag').value = '';
  document.getElementById('filterControlNo').value = '';
  renderTable();
}

function getFilteredRecords() {
  const fiscalYear = document.getElementById('filterFiscalYear').value;
  const tripName = document.getElementById('filterTripName').value;
  const driverName = document.getElementById('filterDriverName').value;
  const paidFlag = document.getElementById('filterPaidFlag').value;
  const controlNo = document.getElementById('filterControlNo').value.trim().toLowerCase();

  return allTravelRecords
    .filter(item => !fiscalYear || String(item.fiscalYear) === fiscalYear)
    .filter(item => !tripName || item.tripName === tripName)
    .filter(item => !driverName || item.driverName === driverName)
    .filter(item => {
      if (!paidFlag) return true;
      if (paidFlag === 'paid') return !!item.paidFlag;
      if (paidFlag === 'unpaid') return !item.paidFlag;
      return true;
    })
    .filter(item => !controlNo || String(item.controlNo || '').toLowerCase().includes(controlNo))
    .sort((a, b) => new Date(b.travelDate) - new Date(a.travelDate));
}

function renderTable() {
  const rows = getFilteredRecords();
  const tbody = document.getElementById('travelTableBody');

  document.getElementById('summaryCount').textContent = `${rows.length}件`;
  document.getElementById('summaryTotal').textContent = formatCurrency(rows.reduce((sum, item) => sum + toNumber(item.paymentAmount), 0));

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="14">データがありません。</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map(item => {
    const actualReturnDistance = item.separateReturn ? toNumber(item.returnDistance) : toNumber(item.outboundDistance);
    return `
      <tr>
        <td class="nowrap">${escapeHtml(item.controlNo)}</td>
        <td>${escapeHtml(normalizeDateValue(item.travelDate))}</td>
        <td>${escapeHtml(item.fiscalYear)}</td>
        <td>${escapeHtml(item.tripName)}</td>
        <td>${escapeHtml(item.driverName)}</td>
        <td>${escapeHtml(item.departureFrom)}</td>
        <td>${escapeHtml(item.arrivalTo)}</td>
        <td class="text-right">${toNumber(item.outboundDistance).toLocaleString('ja-JP')}</td>
        <td class="text-right">${actualReturnDistance.toLocaleString('ja-JP')}</td>
        <td class="text-right">${toNumber(item.roundTripDistance).toLocaleString('ja-JP')}</td>
        <td>${escapeHtml(item.otherDetail || '')}</td>
        <td class="text-right">${toNumber(item.paymentAmount).toLocaleString('ja-JP')}</td>
        <td>${item.paidFlag ? '<span class="badge paid">済</span>' : '<span class="badge unpaid">未</span>'}</td>
        <td><div class="button-row"><a href="index.html?controlNo=${encodeURIComponent(item.controlNo)}" class="button-link secondary">編集</a><button type="button" class="danger delete-button" data-control-no="${escapeHtml(item.controlNo)}">削除</button></div></td>
      </tr>`;
  }).join('');
}

async function handleTableClick(event) {
  const button = event.target.closest('.delete-button');
  if (!button) return;
  const controlNo = button.dataset.controlNo;
  if (!confirm(`管理番号 ${controlNo} を削除しますか？`)) return;

  try {
    setLoading(true, '削除中...');
    const result = await apiPost({ action: 'deleteTravel', controlNo });
    if (!result.ok) {
      setMessage(result.error || '削除に失敗しました。', 'error');
      return;
    }
    setMessage(`削除しました。管理番号: ${controlNo}`, 'success');
    await loadData();
  } catch (error) {
    setMessage('削除時に通信エラーが発生しました。', 'error');
    console.error(error);
  } finally {
    setLoading(false);
  }
}
