const APP_CONFIG = {
  // 既存旅費申請システムで使用しているGASの実行URLを設定してください
  // 例: https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxx/exec
  apiBaseUrl: 'YOUR_GAS_WEB_APP_URL'
};

const storageKeys = {
  currentUser: 'accountingCurrentUser'
};

const state = {
  currentUser: null,
  users: [],
  expenseRows: [],
  selectedExpense: null
};

const els = {
  userSelectScreen: document.getElementById('userSelectScreen'),
  appShell: document.getElementById('appShell'),
  loadingOverlay: document.getElementById('loadingOverlay'),
  loadingText: document.getElementById('loadingText'),
  toast: document.getElementById('toast'),
  userSearchInput: document.getElementById('userSearchInput'),
  reloadUsersButton: document.getElementById('reloadUsersButton'),
  userList: document.getElementById('userList'),
  userListStatus: document.getElementById('userListStatus'),
  currentUserName: document.getElementById('currentUserName'),
  switchUserButton: document.getElementById('switchUserButton'),
  switchUserModal: document.getElementById('switchUserModal'),
  switchUserSearchInput: document.getElementById('switchUserSearchInput'),
  switchUserList: document.getElementById('switchUserList'),
  homeFiscalYear: document.getElementById('homeFiscalYear'),
  refreshHomeButton: document.getElementById('refreshHomeButton'),
  homeExpenseCount: document.getElementById('homeExpenseCount'),
  homeExpenseTotal: document.getElementById('homeExpenseTotal'),
  homeUnpaidCount: document.getElementById('homeUnpaidCount'),
  homeEvidenceCount: document.getElementById('homeEvidenceCount'),
  goExpensesButton: document.getElementById('goExpensesButton'),
  openSwitchUserFromHome: document.getElementById('openSwitchUserFromHome'),
  expenseFiscalYear: document.getElementById('expenseFiscalYear'),
  expenseKeyword: document.getElementById('expenseKeyword'),
  expenseStatus: document.getElementById('expenseStatus'),
  searchExpensesButton: document.getElementById('searchExpensesButton'),
  expenseCountLabel: document.getElementById('expenseCountLabel'),
  expenseTableBody: document.getElementById('expenseTableBody'),
  expenseDetailEmpty: document.getElementById('expenseDetailEmpty'),
  expenseDetailBody: document.getElementById('expenseDetailBody'),
  detailVoucherNo: document.getElementById('detailVoucherNo'),
  detailFiscalYear: document.getElementById('detailFiscalYear'),
  detailSubjectCode: document.getElementById('detailSubjectCode'),
  detailSubjectName: document.getElementById('detailSubjectName'),
  detailExpenseDate: document.getElementById('detailExpenseDate'),
  detailPaymentStatus: document.getElementById('detailPaymentStatus'),
  detailSummary: document.getElementById('detailSummary'),
  detailPayee: document.getElementById('detailPayee'),
  detailAmount: document.getElementById('detailAmount'),
  detailTravelControlNo: document.getElementById('detailTravelControlNo'),
  detailNote: document.getElementById('detailNote'),
  detailCreatedBy: document.getElementById('detailCreatedBy'),
  detailUpdatedBy: document.getElementById('detailUpdatedBy'),
  detailCreatedAt: document.getElementById('detailCreatedAt'),
  detailUpdatedAt: document.getElementById('detailUpdatedAt'),
  evidenceMeta: document.getElementById('evidenceMeta'),
  evidenceOpenLink: document.getElementById('evidenceOpenLink'),
  evidencePreview: document.getElementById('evidencePreview')
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  bindEvents();
  populateFiscalYearOptions();
  restoreCurrentUser();
  await loadUsers();

  if (state.currentUser) {
    showAppShell();
    await loadHomeSummary();
  } else {
    showUserSelectScreen();
  }
}

function bindEvents() {
  els.reloadUsersButton.addEventListener('click', function() {
    loadUsers();
  });

  els.userSearchInput.addEventListener('input', function() {
    renderUserList(els.userList, state.users, els.userSearchInput.value, selectUserAndEnter);
  });

  els.switchUserSearchInput.addEventListener('input', function() {
    renderUserList(els.switchUserList, state.users, els.switchUserSearchInput.value, switchCurrentUser);
  });

  els.switchUserButton.addEventListener('click', function() {
    openModal('switchUserModal');
    renderUserList(els.switchUserList, state.users, '', switchCurrentUser);
    els.switchUserSearchInput.value = '';
  });

  els.openSwitchUserFromHome.addEventListener('click', function() {
    openModal('switchUserModal');
    renderUserList(els.switchUserList, state.users, '', switchCurrentUser);
    els.switchUserSearchInput.value = '';
  });

  els.refreshHomeButton.addEventListener('click', function() {
    loadHomeSummary();
  });

  els.goExpensesButton.addEventListener('click', function() {
    switchPage('expenses');
    loadExpenseList();
  });

  els.searchExpensesButton.addEventListener('click', function() {
    loadExpenseList();
  });

  els.expenseKeyword.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      loadExpenseList();
    }
  });

  document.querySelectorAll('.side-nav-button[data-page]').forEach(function(button) {
    button.addEventListener('click', function() {
      const page = button.dataset.page;
      switchPage(page);
      if (page === 'home') {
        loadHomeSummary();
      }
      if (page === 'expenses') {
        loadExpenseList();
      }
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(function(button) {
    button.addEventListener('click', function() {
      closeModal(button.dataset.closeModal);
    });
  });
}

function populateFiscalYearOptions() {
  const currentYear = getFiscalYearFromDate(new Date());
  const years = [];
  for (let i = currentYear - 2; i <= currentYear + 2; i += 1) {
    years.push(i);
  }

  [els.homeFiscalYear, els.expenseFiscalYear].forEach(function(select) {
    select.innerHTML = years.map(function(year) {
      const selected = year === currentYear ? ' selected' : '';
      return `<option value="${year}"${selected}>${year}年度</option>`;
    }).join('');
  });
}

function getFiscalYearFromDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return month >= 10 ? year + 1 : year;
}

function restoreCurrentUser() {
  try {
    const raw = localStorage.getItem(storageKeys.currentUser);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.name) {
      state.currentUser = parsed;
      updateCurrentUserDisplay();
    }
  } catch (error) {
    console.warn(error);
  }
}

function saveCurrentUser(user) {
  state.currentUser = user;
  localStorage.setItem(storageKeys.currentUser, JSON.stringify(user));
  updateCurrentUserDisplay();
}

function updateCurrentUserDisplay() {
  els.currentUserName.textContent = state.currentUser ? state.currentUser.name : '未選択';
}

function showUserSelectScreen() {
  els.userSelectScreen.classList.remove('hidden');
  els.appShell.classList.add('hidden');
}

function showAppShell() {
  els.userSelectScreen.classList.add('hidden');
  els.appShell.classList.remove('hidden');
}

function switchPage(pageName) {
  document.querySelectorAll('.page-section').forEach(function(section) {
    section.classList.toggle('active', section.id === `page-${pageName}`);
  });

  document.querySelectorAll('.side-nav-button[data-page]').forEach(function(button) {
    button.classList.toggle('active', button.dataset.page === pageName);
  });
}

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function showLoading(text) {
  els.loadingText.textContent = text || '読み込み中...';
  els.loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
  els.loadingOverlay.classList.add('hidden');
}

function showToast(message, type) {
  els.toast.textContent = message;
  els.toast.className = `toast ${type || ''}`.trim();
  els.toast.classList.remove('hidden');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(function() {
    els.toast.classList.add('hidden');
  }, 2800);
}

async function apiGet(action, params) {
  if (!APP_CONFIG.apiBaseUrl || APP_CONFIG.apiBaseUrl === 'YOUR_GAS_WEB_APP_URL') {
    throw new Error('accounting.js の APP_CONFIG.apiBaseUrl を設定してください');
  }

  const url = new URL(APP_CONFIG.apiBaseUrl);
  url.searchParams.set('action', action);
  Object.entries(params || {}).forEach(function(entry) {
    const [key, value] = entry;
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: 'GET'
  });
  if (!response.ok) {
    throw new Error('通信に失敗しました');
  }
  const json = await response.json();
  if (json.ok === false) {
    throw new Error(json.error || json.message || '処理に失敗しました');
  }
  return json;
}

async function loadUsers() {
  showLoading('利用者一覧を読み込んでいます...');
  try {
    const result = await apiGet('accounting/listUsers', {});
    state.users = result.users || [];

    if (state.users.length === 0) {
      els.userListStatus.textContent = '部員一覧にデータがありません';
    } else {
      els.userListStatus.textContent = `${state.users.length}件の利用者を表示しています`;
    }

    renderUserList(els.userList, state.users, els.userSearchInput.value, selectUserAndEnter);
    renderUserList(els.switchUserList, state.users, '', switchCurrentUser);
  } catch (error) {
    showToast(error.message, 'error');
    els.userListStatus.textContent = '利用者一覧の取得に失敗しました';
  } finally {
    hideLoading();
  }
}

function renderUserList(container, users, keyword, onSelect) {
  const normalizedKeyword = (keyword || '').trim();
  const rows = users.filter(function(user) {
    return !normalizedKeyword || user.name.indexOf(normalizedKeyword) !== -1;
  });

  if (rows.length === 0) {
    container.innerHTML = '<div class="empty-detail">該当する利用者がいません。</div>';
    return;
  }

  container.innerHTML = rows.map(function(user) {
    return `
      <button class="user-card" type="button" data-user-name="${escapeHtml(user.name)}">
        <div>
          <strong>${escapeHtml(user.name)}</strong>
          <div class="hint">この氏名で登録者・更新者を記録します</div>
        </div>
        <span class="badge yes">選択</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('[data-user-name]').forEach(function(button) {
    button.addEventListener('click', function() {
      const user = { name: button.dataset.userName };
      onSelect(user);
    });
  });
}

async function selectUserAndEnter(user) {
  saveCurrentUser(user);
  showAppShell();
  switchPage('home');
  showToast(`${user.name} さんで開始しました`, 'success');
  await loadHomeSummary();
}

async function switchCurrentUser(user) {
  saveCurrentUser(user);
  closeModal('switchUserModal');
  showToast(`現在ユーザーを ${user.name} さんに切り替えました`, 'success');
}

async function loadHomeSummary() {
  if (!state.currentUser) {
    showUserSelectScreen();
    return;
  }

  const fiscalYear = els.homeFiscalYear.value;
  showLoading('ホーム情報を集計しています...');

  try {
    const result = await apiGet('accounting/listExpenseVouchers', { fiscalYear: fiscalYear });
    const rows = result.vouchers || [];
    const total = rows.reduce(function(sum, row) {
      return sum + Number(row['支出金額'] || 0);
    }, 0);
    const unpaidCount = rows.filter(function(row) {
      return (row['支払状況'] || '') === '未払';
    }).length;
    const evidenceCount = rows.filter(function(row) {
      return Boolean(row['証憑有無']);
    }).length;

    els.homeExpenseCount.textContent = String(rows.length);
    els.homeExpenseTotal.textContent = formatCurrency(total);
    els.homeUnpaidCount.textContent = String(unpaidCount);
    els.homeEvidenceCount.textContent = String(evidenceCount);
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function loadExpenseList() {
  if (!state.currentUser) {
    showUserSelectScreen();
    return;
  }

  showLoading('支出伝票一覧を読み込んでいます...');

  try {
    const result = await apiGet('accounting/listExpenseVouchers', {
      fiscalYear: els.expenseFiscalYear.value,
      keyword: els.expenseKeyword.value,
      status: els.expenseStatus.value
    });

    state.expenseRows = result.vouchers || [];
    renderExpenseTable();
    clearExpenseDetail();
  } catch (error) {
    showToast(error.message, 'error');
    els.expenseTableBody.innerHTML = '<tr><td colspan="9" class="empty-cell">支出伝票一覧の取得に失敗しました。</td></tr>';
    els.expenseCountLabel.textContent = '0件';
  } finally {
    hideLoading();
  }
}

function renderExpenseTable() {
  const rows = state.expenseRows;
  els.expenseCountLabel.textContent = `${rows.length}件`;

  if (rows.length === 0) {
    els.expenseTableBody.innerHTML = '<tr><td colspan="9" class="empty-cell">該当データがありません。</td></tr>';
    return;
  }

  els.expenseTableBody.innerHTML = rows.map(function(row) {
    const voucherNo = row['伝票番号'] || '';
    const status = row['支払状況'] || '';
    const hasEvidence = Boolean(row['証憑有無']);
    return `
      <tr>
        <td><button type="button" class="table-row-button" data-voucher-no="${escapeHtml(voucherNo)}">${escapeHtml(voucherNo)}</button></td>
        <td>${escapeHtml(String(row['年度'] || ''))}</td>
        <td>${escapeHtml(row['科目名'] || '')}</td>
        <td>${escapeHtml(formatDateLike(row['支出日']))}</td>
        <td class="text-right">${escapeHtml(formatNumber(row['支出金額']))}</td>
        <td>${escapeHtml(row['摘要'] || '')}</td>
        <td>${escapeHtml(row['支払先'] || '')}</td>
        <td>${renderStatusBadge(status)}</td>
        <td>${hasEvidence ? '<span class="badge yes">あり</span>' : '<span class="badge none">なし</span>'}</td>
      </tr>
    `;
  }).join('');

  els.expenseTableBody.querySelectorAll('[data-voucher-no]').forEach(function(button) {
    button.addEventListener('click', function() {
      loadExpenseDetail(button.dataset.voucherNo);
    });
  });
}

async function loadExpenseDetail(voucherNo) {
  showLoading('伝票詳細を読み込んでいます...');
  try {
    const result = await apiGet('accounting/getExpenseVoucher', { voucherNo: voucherNo });
    state.selectedExpense = result;
    renderExpenseDetail(result.voucher, result.evidence);
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function clearExpenseDetail() {
  state.selectedExpense = null;
  els.expenseDetailEmpty.classList.remove('hidden');
  els.expenseDetailBody.classList.add('hidden');
  els.evidencePreview.innerHTML = '証憑が登録されていません。';
  els.evidencePreview.className = 'evidence-preview empty-preview';
}

function renderExpenseDetail(voucher, evidence) {
  els.expenseDetailEmpty.classList.add('hidden');
  els.expenseDetailBody.classList.remove('hidden');

  els.detailVoucherNo.textContent = voucher['伝票番号'] || '-';
  els.detailFiscalYear.textContent = voucher['年度'] || '-';
  els.detailSubjectCode.textContent = voucher['科目コード'] || '-';
  els.detailSubjectName.textContent = voucher['科目名'] || '-';
  els.detailExpenseDate.textContent = formatDateLike(voucher['支出日']);
  els.detailPaymentStatus.textContent = voucher['支払状況'] || '-';
  els.detailSummary.textContent = voucher['摘要'] || '-';
  els.detailPayee.textContent = voucher['支払先'] || '-';
  els.detailAmount.textContent = formatCurrency(voucher['支出金額'] || 0);
  els.detailTravelControlNo.textContent = voucher['関連旅費管理番号'] || '-';
  els.detailNote.textContent = voucher['備考'] || '-';
  els.detailCreatedBy.textContent = voucher['登録者'] || '-';
  els.detailUpdatedBy.textContent = voucher['更新者'] || '-';
  els.detailCreatedAt.textContent = voucher['登録日時'] || '-';
  els.detailUpdatedAt.textContent = voucher['更新日時'] || '-';

  renderEvidencePreview(evidence);
}

function renderEvidencePreview(evidence) {
  if (!evidence || !evidence['DriveUrl']) {
    els.evidenceMeta.textContent = '証憑なし';
    els.evidencePreview.className = 'evidence-preview empty-preview';
    els.evidencePreview.innerHTML = '証憑が登録されていません。';
    els.evidenceOpenLink.classList.add('hidden');
    els.evidenceOpenLink.removeAttribute('href');
    return;
  }

  const url = evidence['DriveUrl'];
  const mime = evidence['MIMEタイプ'] || '';
  const fileName = evidence['ファイル名'] || '添付ファイル';

  els.evidenceMeta.textContent = `${fileName} / ${mime || '形式不明'}`;
  els.evidenceOpenLink.href = url;
  els.evidenceOpenLink.classList.remove('hidden');
  els.evidencePreview.className = 'evidence-preview';

  if (mime === 'application/pdf') {
    els.evidencePreview.innerHTML = `<iframe src="${escapeAttribute(url)}"></iframe>`;
  } else if (mime === 'image/jpeg' || mime === 'image/png') {
    els.evidencePreview.innerHTML = `<img src="${escapeAttribute(url)}" alt="証憑プレビュー" />`;
  } else {
    els.evidencePreview.innerHTML = '<div class="empty-preview">この形式は画面内プレビュー対象外です。別タブで開いて確認してください。</div>';
  }
}

function renderStatusBadge(status) {
  if (status === '支払済') {
    return '<span class="badge paid">支払済</span>';
  }
  return '<span class="badge unpaid">未払</span>';
}

function formatCurrency(value) {
  return `${formatNumber(value)} 円`;
}

function formatNumber(value) {
  const number = Number(value || 0);
  return number.toLocaleString('ja-JP');
}

function formatDateLike(value) {
  if (!value) return '-';
  if (typeof value === 'string') return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
