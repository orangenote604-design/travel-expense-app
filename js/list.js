let allTravelRecords = [];
let allMembers = [];
let allTrips = [];
let selectedControlNos = new Set();
let currentReceiptBlobUrl = '';

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
  document.getElementById('searchButton').addEventListener('click', handleSearch);
  document.getElementById('clearSearchButton').addEventListener('click', clearFilters);
  document.getElementById('travelTableBody').addEventListener('click', handleTableClick);
  document.getElementById('travelTableBody').addEventListener('change', handleTableChange);
  document.getElementById('selectAllCheckbox').addEventListener('change', handleSelectAllChange);
  document.getElementById('generateReceiptPdfButton').addEventListener('click', handleGenerateReceiptPdfClick);
  document.getElementById('markPaidButton').addEventListener('click', markSelectedAsPaid);
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
    const [records, members, trips] = await Promise.all([
      apiGet('listTravel'),
      apiGet('listMembers'),
      apiGet('listTrips')
    ]);
    allTravelRecords = records;
    allMembers = members;
    allTrips = trips;
    selectedControlNos = new Set(
      [...selectedControlNos].filter(controlNo => allTravelRecords.some(item => item.controlNo === controlNo))
    );
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

function handleSearch() {
  selectedControlNos.clear();
  clearReceiptResult();
  renderTable();
}

function clearFilters() {
  document.getElementById('filterFiscalYear').value = '';
  document.getElementById('filterTripName').value = '';
  document.getElementById('filterDriverName').value = '';
  document.getElementById('filterPaidFlag').value = '';
  document.getElementById('filterControlNo').value = '';
  selectedControlNos.clear();
  clearReceiptResult();
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
    tbody.innerHTML = '<tr><td colspan="15">データがありません。</td></tr>';
    updateSelectionToolbar(rows);
    return;
  }

  tbody.innerHTML = rows.map(item => {
    const actualReturnDistance = item.separateReturn ? toNumber(item.returnDistance) : toNumber(item.outboundDistance);
    const checked = selectedControlNos.has(item.controlNo) ? 'checked' : '';
    return `
      <tr>
        <td class="checkbox-cell"><input type="checkbox" class="row-select-checkbox" data-control-no="${escapeHtml(item.controlNo)}" ${checked} aria-label="${escapeHtml(item.controlNo)} を選択" /></td>
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

  updateSelectionToolbar(rows);
}

function updateSelectionToolbar(visibleRows) {
  const selectedCount = selectedControlNos.size;
  const selectedCountText = `${selectedCount}件`;
  document.getElementById('selectedCount').textContent = selectedCountText;
  document.getElementById('selectionStatus').textContent = `選択中: ${selectedCountText}`;

  const generateButton = document.getElementById('generateReceiptPdfButton');
  const markPaidButton = document.getElementById('markPaidButton');
  generateButton.disabled = selectedCount === 0;
  markPaidButton.disabled = selectedCount === 0;

  const selectAllCheckbox = document.getElementById('selectAllCheckbox');
  const visibleControlNos = visibleRows.map(item => item.controlNo);
  const selectedVisibleCount = visibleControlNos.filter(controlNo => selectedControlNos.has(controlNo)).length;

  selectAllCheckbox.disabled = visibleControlNos.length === 0;
  selectAllCheckbox.checked = visibleControlNos.length > 0 && selectedVisibleCount === visibleControlNos.length;
  selectAllCheckbox.indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < visibleControlNos.length;
}

function handleTableChange(event) {
  const checkbox = event.target.closest('.row-select-checkbox');
  if (!checkbox) return;

  const controlNo = checkbox.dataset.controlNo;
  if (!controlNo) return;

  if (checkbox.checked) {
    selectedControlNos.add(controlNo);
  } else {
    selectedControlNos.delete(controlNo);
  }
  updateSelectionToolbar(getFilteredRecords());
}

function handleSelectAllChange(event) {
  const rows = getFilteredRecords();
  if (event.target.checked) {
    rows.forEach(item => selectedControlNos.add(item.controlNo));
  } else {
    rows.forEach(item => selectedControlNos.delete(item.controlNo));
  }
  renderTable();
}

function getSelectedRecords() {
  const recordMap = new Map(allTravelRecords.map(item => [item.controlNo, item]));
  return [...selectedControlNos]
    .map(controlNo => recordMap.get(controlNo))
    .filter(Boolean)
    .sort((a, b) => new Date(a.travelDate) - new Date(b.travelDate) || String(a.controlNo).localeCompare(String(b.controlNo), 'ja'));
}

function clearReceiptResult() {
  const container = document.getElementById('receiptResult');
  if (!container) return;
  if (currentReceiptBlobUrl) {
    URL.revokeObjectURL(currentReceiptBlobUrl);
    currentReceiptBlobUrl = '';
  }
  container.className = 'receipt-result hidden';
  container.innerHTML = '';
}

function createBlobUrlFromBase64(base64, mimeType) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return URL.createObjectURL(new Blob([bytes], { type: mimeType || 'application/pdf' }));
}

function triggerPdfDownload(blobUrl, fileName) {
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName || 'receipt.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function renderReceiptResult(result) {
  const container = document.getElementById('receiptResult');
  if (!container) return;

  const missing = Array.isArray(result.missingControlNos) && result.missingControlNos.length
    ? `<div class="receipt-result-note">未取得の管理番号: ${escapeHtml(result.missingControlNos.join(', '))}</div>`
    : '';

  currentReceiptBlobUrl = createBlobUrlFromBase64(result.pdfBase64, result.mimeType);

  container.className = 'receipt-result';
  container.innerHTML = `
    <div class="receipt-result-title">受領証PDFを生成しました</div>
    <div class="receipt-result-meta">ファイル名: ${escapeHtml(result.fileName || '')}${result.createdAt ? ` / 生成日時: ${escapeHtml(result.createdAt)}` : ''}</div>
    <div class="receipt-result-links">
      <a href="${escapeHtml(currentReceiptBlobUrl)}" target="_blank" rel="noopener">PDFを開く</a>
      <a href="${escapeHtml(currentReceiptBlobUrl)}" download="${escapeHtml(result.fileName || 'receipt.pdf')}">PDFをダウンロード</a>
    </div>
    <div class="receipt-result-note">PDFは一時生成です。画面を閉じるか再読み込みするとリンクは無効になります。</div>
    ${missing}
  `;

  triggerPdfDownload(currentReceiptBlobUrl, result.fileName || 'receipt.pdf');
}

async function handleGenerateReceiptPdfClick() {
  clearMessage();
  clearReceiptResult();

  const records = getSelectedRecords();
  if (!records.length) {
    setMessage('受領証PDFを生成する申請を選択してください。', 'warning');
    return;
  }

  if (!confirm(`選択した ${records.length} 件の受領証PDFを生成しますか？`)) return;

  try {
    setLoading(true, '受領証PDFを生成中...');
    const result = await apiPost({
      action: 'generateReceiptPdf',
      controlNos: records.map(item => item.controlNo)
    });

    if (!result.ok) {
      setMessage(result.error || '受領証PDFの生成に失敗しました。', 'error');
      return;
    }

    renderReceiptResult(result);
    setMessage(`${result.recordCount}件分の受領証PDFを生成しました。`, 'success');
  } catch (error) {
    setMessage('受領証PDF生成時に通信エラーが発生しました。', 'error');
    console.error(error);
  } finally {
    setLoading(false);
  }
}

async function markSelectedAsPaid() {
  clearMessage();
  const records = getSelectedRecords();
  if (!records.length) {
    setMessage('支払い済みにする申請を選択してください。', 'warning');
    return;
  }
  if (!confirm(`選択した ${records.length} 件の申請を支払い済みにしますか？`)) return;

  try {
    setLoading(true, '支払い済みフラグを更新中...');
    const result = await apiPost({
      action: 'bulkSetPaidFlag',
      controlNos: records.map(item => item.controlNo),
      paidFlag: true
    });

    if (!result.ok) {
      setMessage(result.error || '支払い済みフラグの更新に失敗しました。', 'error');
      return;
    }

    selectedControlNos.clear();
    await loadData();
    setMessage(`${result.updatedCount}件を支払い済みにしました。`, 'success');
  } catch (error) {
    setMessage('支払い済みフラグ更新時に通信エラーが発生しました。', 'error');
    console.error(error);
  } finally {
    setLoading(false);
  }
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
    selectedControlNos.delete(controlNo);
    clearReceiptResult();
    setMessage(`削除しました。管理番号: ${controlNo}`, 'success');
    await loadData();
  } catch (error) {
    setMessage('削除時に通信エラーが発生しました。', 'error');
    console.error(error);
  } finally {
    setLoading(false);
  }
}
