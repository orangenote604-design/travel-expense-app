function getTodayInputValue() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function normalizeDateValue(value) {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function calcFiscalYear(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-').map(Number);
  if (parts.length < 2) return '';
  return parts[1] >= 10 ? parts[0] + 1 : parts[0];
}

function calcDriverAllowance(roundedKm) {
  if (roundedKm <= 0) return 0;
  if (roundedKm <= 200) return 1000;
  if (roundedKm <= 300) return 2000;
  return null;
}

function calcGasolineFee(roundedKm) {
  if (roundedKm <= 0) return 0;
  if (roundedKm <= 100) return 1000;
  if (roundedKm <= 200) return 2000;
  if (roundedKm <= 300) return 3000;
  return null;
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('ja-JP')}円`;
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function setMessage(text, type = 'info') {
  const el = document.getElementById('message');
  if (!el) return;
  el.className = `message show ${type}`;
  el.textContent = text;
}

function clearMessage() {
  const el = document.getElementById('message');
  if (!el) return;
  el.className = 'message';
  el.textContent = '';
}

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getQueryParam(name) {
  return new URLSearchParams(location.search).get(name);
}

function fillSimpleSelect(selectId, items, valueKey = null, labelKey = null) {
  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="">選択してください</option>';
  items.forEach(item => {
    const value = valueKey ? item[valueKey] : item;
    const label = labelKey ? item[labelKey] : item;
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });
}

function ensureLoadingOverlay() {
  let overlay = document.getElementById('loadingOverlay');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'loadingOverlay';
  overlay.className = 'loading-overlay';
  overlay.innerHTML = '<div class="loading-panel"><div class="loading-spinner"></div><div id="loadingOverlayText">処理中...</div></div>';
  document.body.appendChild(overlay);
  return overlay;
}

function setLoading(isLoading, text = '処理中...') {
  const overlay = ensureLoadingOverlay();
  const textEl = document.getElementById('loadingOverlayText');
  if (textEl) textEl.textContent = text;
  overlay.classList.toggle('show', !!isLoading);
  document.body.classList.toggle('is-loading', !!isLoading);
}
