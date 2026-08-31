const APP_CONFIG = {
  // 既存旅費申請システムで使用しているGASの実行URLを設定してください
  // 例: https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxx/exec
  apiBaseUrl: 'https://script.google.com/macros/s/AKfycbwukgQry4L4PrwKZWlK4N-74kHE6aqYTYgbOyPpfm5gGyPQvQKUV07Nl0pg65gUzGBB/exec'
};

const storageKeys = {
  currentUser: 'accountingCurrentUser'
};

const MAX_EVIDENCE_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EVIDENCE_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const state = {
  currentUser: null,
  users: [],
  subjects: [],
  expenseRows: [],
  selectedExpense: null,
  travelTransferRows: [],
  expenseForm: {
    mode: 'create',
    voucherNo: '',
    existingEvidence: null,
    pendingEvidenceFile: null,
    selectedTravel: null
  }
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
  homeEvidenceCount: document.getElementById('homeEvidenceCount'),
  goExpensesButton: document.getElementById('goExpensesButton'),
  goExpenseCreateButton: document.getElementById('goExpenseCreateButton'),
  openSwitchUserFromHome: document.getElementById('openSwitchUserFromHome'),
  openTravelTransferFromHome: document.getElementById('openTravelTransferFromHome'),
  expenseFiscalYear: document.getElementById('expenseFiscalYear'),
  expenseKeyword: document.getElementById('expenseKeyword'),
  searchExpensesButton: document.getElementById('searchExpensesButton'),
  openExpenseCreateButton: document.getElementById('openExpenseCreateButton'),
  openTravelTransferButton: document.getElementById('openTravelTransferButton'),
  expenseCountLabel: document.getElementById('expenseCountLabel'),
  expenseTableBody: document.getElementById('expenseTableBody'),
  expenseDetailEmpty: document.getElementById('expenseDetailEmpty'),
  expenseDetailBody: document.getElementById('expenseDetailBody'),
  editExpenseButton: document.getElementById('editExpenseButton'),
  deleteExpenseButton: document.getElementById('deleteExpenseButton'),
  detailVoucherNo: document.getElementById('detailVoucherNo'),
  detailFiscalYear: document.getElementById('detailFiscalYear'),
  detailSubjectCode: document.getElementById('detailSubjectCode'),
  detailSubjectName: document.getElementById('detailSubjectName'),
  detailExpenseDate: document.getElementById('detailExpenseDate'),
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
  evidencePreview: document.getElementById('evidencePreview'),
  expenseFormTitle: document.getElementById('expenseFormTitle'),
  formVoucherNo: document.getElementById('formVoucherNo'),
  formFiscalYear: document.getElementById('formFiscalYear'),
  formExpenseDate: document.getElementById('formExpenseDate'),
  formSubjectSelect: document.getElementById('formSubjectSelect'),
  formSummary: document.getElementById('formSummary'),
  formPayee: document.getElementById('formPayee'),
  formAmount: document.getElementById('formAmount'),
  formRelatedTravelControlNo: document.getElementById('formRelatedTravelControlNo'),
  formNote: document.getElementById('formNote'),
  formEvidenceFile: document.getElementById('formEvidenceFile'),
  removeEvidenceRow: document.getElementById('removeEvidenceRow'),
  removeEvidenceCheckbox: document.getElementById('removeEvidenceCheckbox'),
  formEvidenceMeta: document.getElementById('formEvidenceMeta'),
  formEvidenceOpenLink: document.getElementById('formEvidenceOpenLink'),
  backToExpenseListButton: document.getElementById('backToExpenseListButton'),
  resetExpenseFormButton: document.getElementById('resetExpenseFormButton'),
  openTravelTransferFromForm: document.getElementById('openTravelTransferFromForm'),
  saveExpenseButton: document.getElementById('saveExpenseButton'),
  saveExpenseButtonBottom: document.getElementById('saveExpenseButtonBottom'),
  saveAndOpenListButton: document.getElementById('saveAndOpenListButton'),
  travelTransferModal: document.getElementById('travelTransferModal'),
  travelTransferFiscalYear: document.getElementById('travelTransferFiscalYear'),
  travelTransferKeyword: document.getElementById('travelTransferKeyword'),
  searchTravelTransferButton: document.getElementById('searchTravelTransferButton'),
  travelTransferTableBody: document.getElementById('travelTransferTableBody')
};

document.addEventListener('DOMContentLoaded', init);

async function init() {
  bindEvents();
  populateFiscalYearOptions();
  restoreCurrentUser();
  await loadUsers();

  if (state.currentUser) {
    showAppShell();
    await loadSubjects();
    prepareExpenseForm('create');
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

  els.switchUserButton.addEventListener('click', openSwitchUserModal);
  els.openSwitchUserFromHome.addEventListener('click', openSwitchUserModal);

  els.refreshHomeButton.addEventListener('click', function() {
    loadHomeSummary();
  });

  els.goExpensesButton.addEventListener('click', function() {
    switchPage('expenses');
    loadExpenseList();
  });

  els.goExpenseCreateButton.addEventListener('click', function() {
    openExpenseCreateForm();
  });

  els.openTravelTransferFromHome.addEventListener('click', function() {
    openTravelTransferModal();
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

  els.openExpenseCreateButton.addEventListener('click', function() {
    openExpenseCreateForm();
  });

  els.openTravelTransferButton.addEventListener('click', function() {
    openTravelTransferModal();
  });

  els.editExpenseButton.addEventListener('click', function() {
    if (!state.selectedExpense || !state.selectedExpense.voucher) return;
    openExpenseEditForm(state.selectedExpense.voucher, state.selectedExpense.evidence || null);
  });

  els.deleteExpenseButton.addEventListener('click', deleteSelectedExpense);

  els.backToExpenseListButton.addEventListener('click', function() {
    switchPage('expenses');
    loadExpenseList();
  });

  els.resetExpenseFormButton.addEventListener('click', function() {
    if (state.expenseForm.mode === 'edit' && state.selectedExpense && state.selectedExpense.voucher) {
      openExpenseEditForm(state.selectedExpense.voucher, state.selectedExpense.evidence || null);
      return;
    }
    prepareExpenseForm('create');
    showToast('入力内容をリセットしました', 'success');
  });

  els.openTravelTransferFromForm.addEventListener('click', function() {
    openTravelTransferModal();
  });

  els.saveExpenseButton.addEventListener('click', function() {
    saveExpense(false);
  });

  els.saveExpenseButtonBottom.addEventListener('click', function() {
    saveExpense(false);
  });

  els.saveAndOpenListButton.addEventListener('click', function() {
    saveExpense(true);
  });

  els.formEvidenceFile.addEventListener('change', onEvidenceFileChange);
  els.removeEvidenceCheckbox.addEventListener('change', renderFormEvidenceInfo);

  els.searchTravelTransferButton.addEventListener('click', function() {
    loadTravelTransferList();
  });

  els.travelTransferKeyword.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      loadTravelTransferList();
    }
  });

  document.querySelectorAll('.side-nav-button[data-page]').forEach(function(button) {
    button.addEventListener('click', function() {
      const page = button.dataset.page;
      switchPage(page);
      if (page === 'home') loadHomeSummary();
      if (page === 'expenses') loadExpenseList();
      if (page === 'expense-form' && !state.expenseForm.voucherNo && state.expenseForm.mode !== 'edit') {
        prepareExpenseForm('create');
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

  [els.homeFiscalYear, els.expenseFiscalYear, els.formFiscalYear, els.travelTransferFiscalYear].forEach(function(select) {
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

function todayInputValue() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
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

function openSwitchUserModal() {
  openModal('switchUserModal');
  renderUserList(els.switchUserList, state.users, '', switchCurrentUser);
  els.switchUserSearchInput.value = '';
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

  const response = await fetch(url.toString(), { method: 'GET' });
  if (!response.ok) {
    throw new Error('通信に失敗しました');
  }

  const json = await response.json();
  if (json.ok === false) {
    throw new Error(json.error || json.message || '処理に失敗しました');
  }
  return json;
}

async function apiPost(action, payload) {
  if (!APP_CONFIG.apiBaseUrl || APP_CONFIG.apiBaseUrl === 'YOUR_GAS_WEB_APP_URL') {
    throw new Error('accounting.js の APP_CONFIG.apiBaseUrl を設定してください');
  }

  const response = await fetch(APP_CONFIG.apiBaseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(Object.assign({ action: action }, payload || {}))
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

    els.userListStatus.textContent = state.users.length === 0
      ? '部員一覧にデータがありません'
      : `${state.users.length}件の利用者を表示しています`;

    renderUserList(els.userList, state.users, els.userSearchInput.value, selectUserAndEnter);
    renderUserList(els.switchUserList, state.users, '', switchCurrentUser);
  } catch (error) {
    els.userListStatus.textContent = '利用者一覧の取得に失敗しました';
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function renderUserList(container, users, keyword, onSelect) {
  const normalizedKeyword = (keyword || '').trim();
  const rows = users.filter(function(user) {
    return !normalizedKeyword || String(user.name || '').indexOf(normalizedKeyword) !== -1;
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
      onSelect({ name: button.dataset.userName });
    });
  });
}

async function selectUserAndEnter(user) {
  saveCurrentUser(user);
  showAppShell();
  await loadSubjects();
  prepareExpenseForm('create');
  switchPage('home');
  showToast(`${user.name} さんで開始しました`, 'success');
  await loadHomeSummary();
}

async function switchCurrentUser(user) {
  saveCurrentUser(user);
  closeModal('switchUserModal');
  showToast(`現在ユーザーを ${user.name} さんに切り替えました`, 'success');
}

async function loadSubjects() {
  showLoading('科目一覧を読み込んでいます...');
  try {
    const result = await apiGet('accounting/listSubjects', { type: '支出' });
    state.subjects = result.subjects || [];
    renderSubjectOptions();
  } catch (error) {
    state.subjects = [];
    renderSubjectOptions();
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function renderSubjectOptions(selectedCode) {
  if (!state.subjects.length) {
    els.formSubjectSelect.innerHTML = '<option value="">科目がありません</option>';
    return;
  }

  const options = state.subjects
    .slice()
    .sort(function(a, b) {
      return Number(a['表示順'] || 0) - Number(b['表示順'] || 0);
    })
    .map(function(subject) {
      const code = subject['科目コード'] || '';
      const name = subject['科目名'] || '';
      const selected = code === selectedCode ? ' selected' : '';
      return `<option value="${escapeHtml(code)}" data-subject-name="${escapeHtml(name)}"${selected}>${escapeHtml(code)} / ${escapeHtml(name)}</option>`;
    });

  els.formSubjectSelect.innerHTML = options.join('');

  if (!selectedCode) {
    const defaultSubject = state.subjects.find(function(subject) {
      return String(subject['科目コード'] || '') === 'EXP001';
    });
    if (defaultSubject) {
      els.formSubjectSelect.value = defaultSubject['科目コード'];
    }
  }
}

async function loadHomeSummary() {
  if (!state.currentUser) {
    showUserSelectScreen();
    return;
  }

  showLoading('ホーム情報を集計しています...');
  try {
    const result = await apiGet('accounting/listExpenseVouchers', { fiscalYear: els.homeFiscalYear.value });
    const rows = result.vouchers || [];
    const total = rows.reduce(function(sum, row) {
      return sum + Number(row['支出金額'] || 0);
    }, 0);
    const evidenceCount = rows.filter(function(row) {
      return toBoolean(row['証憑有無']);
    }).length;

    els.homeExpenseCount.textContent = String(rows.length);
    els.homeExpenseTotal.textContent = formatCurrency(total);
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
      keyword: els.expenseKeyword.value
    });

    state.expenseRows = result.vouchers || [];
    renderExpenseTable();
    clearExpenseDetail();
  } catch (error) {
    state.expenseRows = [];
    renderExpenseTable();
    clearExpenseDetail();
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function renderExpenseTable() {
  const rows = state.expenseRows;
  els.expenseCountLabel.textContent = `${rows.length}件`;

  if (!rows.length) {
    els.expenseTableBody.innerHTML = '<tr><td colspan="8" class="empty-cell">該当データがありません。</td></tr>';
    return;
  }

  const selectedVoucherNo = state.selectedExpense && state.selectedExpense.voucher
    ? state.selectedExpense.voucher['伝票番号']
    : '';

  els.expenseTableBody.innerHTML = rows.map(function(row) {
    const voucherNo = row['伝票番号'] || '';
    const hasEvidence = toBoolean(row['証憑有無']);
    const selectedClass = voucherNo === selectedVoucherNo ? ' class="selected-row"' : '';
    return `
      <tr${selectedClass}>
        <td><button type="button" class="table-row-button" data-voucher-no="${escapeHtml(voucherNo)}">${escapeHtml(voucherNo)}</button></td>
        <td>${escapeHtml(String(row['年度'] || ''))}</td>
        <td>${escapeHtml(row['科目名'] || '')}</td>
        <td>${escapeHtml(formatDateLike(row['支出日']))}</td>
        <td class="text-right">${escapeHtml(formatNumber(row['支出金額']))}</td>
        <td>${escapeHtml(row['摘要'] || '')}</td>
        <td>${escapeHtml(row['支払先'] || '')}</td>
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
    renderExpenseTable();
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
  els.evidenceMeta.textContent = '証憑なし';
  els.evidencePreview.innerHTML = '証憑が登録されていません。';
  els.evidencePreview.className = 'evidence-preview empty-preview';
  els.evidenceOpenLink.classList.add('hidden');
  els.evidenceOpenLink.removeAttribute('href');
  els.editExpenseButton.disabled = true;
  els.deleteExpenseButton.disabled = true;
}

function renderExpenseDetail(voucher, evidence) {
  els.expenseDetailEmpty.classList.add('hidden');
  els.expenseDetailBody.classList.remove('hidden');
  els.editExpenseButton.disabled = false;
  els.deleteExpenseButton.disabled = false;

  els.detailVoucherNo.textContent = voucher['伝票番号'] || '-';
  els.detailFiscalYear.textContent = voucher['年度'] || '-';
  els.detailSubjectCode.textContent = voucher['科目コード'] || '-';
  els.detailSubjectName.textContent = voucher['科目名'] || '-';
  els.detailExpenseDate.textContent = formatDateLike(voucher['支出日']);
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

function openExpenseCreateForm() {
  prepareExpenseForm('create');
  switchPage('expense-form');
}

function openExpenseEditForm(voucher, evidence) {
  prepareExpenseForm('edit', { voucher: voucher, evidence: evidence });
  switchPage('expense-form');
}

function prepareExpenseForm(mode, options) {
  const source = options || {};
  state.expenseForm.mode = mode;
  state.expenseForm.voucherNo = '';
  state.expenseForm.existingEvidence = null;
  state.expenseForm.pendingEvidenceFile = null;
  state.expenseForm.selectedTravel = null;

  els.formEvidenceFile.value = '';
  els.removeEvidenceCheckbox.checked = false;

  if (mode === 'edit' && source.voucher) {
    const voucher = source.voucher;
    state.expenseForm.voucherNo = voucher['伝票番号'] || '';
    state.expenseForm.existingEvidence = source.evidence || null;
    els.expenseFormTitle.textContent = `支出伝票編集：${voucher['伝票番号'] || ''}`;
    els.formVoucherNo.value = voucher['伝票番号'] || '';
    els.formFiscalYear.value = String(voucher['年度'] || getFiscalYearFromDate(new Date()));
    renderSubjectOptions(voucher['科目コード'] || '');
    els.formExpenseDate.value = toDateInputValue(voucher['支出日']);
    els.formSummary.value = voucher['摘要'] || '';
    els.formPayee.value = voucher['支払先'] || '';
    els.formAmount.value = toNumericInputValue(voucher['支出金額']);
    els.formRelatedTravelControlNo.value = voucher['関連旅費管理番号'] || '';
    els.formNote.value = voucher['備考'] || '';
    els.removeEvidenceRow.classList.remove('hidden');
    renderFormEvidenceInfo();
    return;
  }

  const travel = source.travel || null;
  state.expenseForm.selectedTravel = travel;
  els.expenseFormTitle.textContent = travel ? '支出伝票登録（旅費申請から転記）' : '支出伝票登録';
  els.formVoucherNo.value = '';
  els.formFiscalYear.value = String(travel ? (travel.fiscalYear || getFiscalYearFromDate(new Date())) : getFiscalYearFromDate(new Date()));
  renderSubjectOptions('EXP001');
  els.formExpenseDate.value = travel ? toDateInputValue(travel.travelDate) : todayInputValue();
  els.formSummary.value = travel ? [travel.tripName, travel.driverName].filter(Boolean).join(' / ') : '';
  els.formPayee.value = travel ? (travel.driverName || '') : '';
  els.formAmount.value = travel ? toNumericInputValue(travel.paymentAmount) : '';
  els.formRelatedTravelControlNo.value = travel ? (travel.controlNo || '') : '';
  els.formNote.value = travel ? `旅費申請 ${travel.controlNo || ''} から転記` : '';
  els.removeEvidenceRow.classList.add('hidden');
  renderFormEvidenceInfo();
}

function renderFormEvidenceInfo() {
  const pendingFile = state.expenseForm.pendingEvidenceFile;
  const existing = state.expenseForm.existingEvidence;
  const removing = els.removeEvidenceCheckbox.checked;

  if (pendingFile) {
    els.formEvidenceMeta.textContent = `${pendingFile.name} / ${pendingFile.type || '形式不明'} / ${formatFileSize(pendingFile.size)}`;
    els.formEvidenceOpenLink.classList.add('hidden');
    els.formEvidenceOpenLink.removeAttribute('href');
    return;
  }

  if (existing && existing['DriveUrl'] && !removing) {
    els.formEvidenceMeta.textContent = `${existing['ファイル名'] || '添付ファイル'} / ${existing['MIMEタイプ'] || '形式不明'}`;
    els.formEvidenceOpenLink.href = existing['DriveUrl'];
    els.formEvidenceOpenLink.classList.remove('hidden');
    return;
  }

  if (existing && removing) {
    els.formEvidenceMeta.textContent = '保存時に既存証憑を削除します';
    els.formEvidenceOpenLink.classList.add('hidden');
    els.formEvidenceOpenLink.removeAttribute('href');
    return;
  }

  els.formEvidenceMeta.textContent = '未添付';
  els.formEvidenceOpenLink.classList.add('hidden');
  els.formEvidenceOpenLink.removeAttribute('href');
}

function onEvidenceFileChange(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    state.expenseForm.pendingEvidenceFile = null;
    renderFormEvidenceInfo();
    return;
  }

  if (!ALLOWED_EVIDENCE_MIME_TYPES.includes(file.type)) {
    event.target.value = '';
    state.expenseForm.pendingEvidenceFile = null;
    showToast('証憑は PDF / JPG / PNG のみ添付できます', 'error');
    renderFormEvidenceInfo();
    return;
  }

  if (file.size > MAX_EVIDENCE_FILE_SIZE) {
    event.target.value = '';
    state.expenseForm.pendingEvidenceFile = null;
    showToast('証憑ファイルは5MB以下にしてください', 'error');
    renderFormEvidenceInfo();
    return;
  }

  state.expenseForm.pendingEvidenceFile = file;
  els.removeEvidenceCheckbox.checked = false;
  renderFormEvidenceInfo();
}

function buildExpenseDataFromForm() {
  const selectedOption = els.formSubjectSelect.options[els.formSubjectSelect.selectedIndex];
  const subjectCode = els.formSubjectSelect.value;
  const subjectName = selectedOption ? selectedOption.dataset.subjectName || '' : '';

  if (!subjectCode || !subjectName) {
    throw new Error('科目を選択してください');
  }

  return {
    fiscalYear: Number(els.formFiscalYear.value),
    subjectCode: subjectCode,
    subjectName: subjectName,
    expenseDate: els.formExpenseDate.value,
    amount: Number(els.formAmount.value || 0),
    summary: els.formSummary.value.trim(),
    note: els.formNote.value.trim(),
    payee: els.formPayee.value.trim(),
    paymentStatus: '支払済',
    paymentDate: els.formExpenseDate.value,
    relatedTravelControlNo: els.formRelatedTravelControlNo.value.trim()
  };
}

async function saveExpense(openListAfterSave) {
  if (!state.currentUser) {
    showToast('利用者を選択してください', 'error');
    return;
  }

  showLoading(state.expenseForm.mode === 'edit' ? '支出伝票を更新しています...' : '支出伝票を登録しています...');
  try {
    const data = buildExpenseDataFromForm();
    const payload = {
      currentUser: state.currentUser,
      data: data
    };

    if (state.expenseForm.mode === 'edit') {
      payload.voucherNo = state.expenseForm.voucherNo;
    }

    if (state.expenseForm.pendingEvidenceFile) {
      payload.evidence = await convertFileToEvidencePayload(state.expenseForm.pendingEvidenceFile);
      if (state.expenseForm.mode === 'edit') {
        payload.evidenceOp = state.expenseForm.existingEvidence ? 'replace' : 'attach';
      }
    } else if (state.expenseForm.mode === 'edit' && els.removeEvidenceCheckbox.checked && state.expenseForm.existingEvidence) {
      payload.evidenceOp = 'remove';
    }

    const result = await apiPost(
      state.expenseForm.mode === 'edit' ? 'accounting/updateExpenseVoucher' : 'accounting/createExpenseVoucher',
      payload
    );

    const savedVoucherNo = result.voucherNo || payload.voucherNo;
    showToast(state.expenseForm.mode === 'edit' ? '支出伝票を更新しました' : '支出伝票を登録しました', 'success');
    await loadHomeSummary();

    if (savedVoucherNo) {
      const detail = await apiGet('accounting/getExpenseVoucher', { voucherNo: savedVoucherNo });
      state.selectedExpense = detail;
      openExpenseEditForm(detail.voucher, detail.evidence || null);
      if (openListAfterSave) {
        switchPage('expenses');
        els.expenseFiscalYear.value = String(detail.voucher['年度'] || els.expenseFiscalYear.value);
        await loadExpenseList();
        await loadExpenseDetail(savedVoucherNo);
      }
    } else if (openListAfterSave) {
      switchPage('expenses');
      await loadExpenseList();
    }
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function deleteSelectedExpense() {
  if (!state.selectedExpense || !state.selectedExpense.voucher) return;
  const voucherNo = state.selectedExpense.voucher['伝票番号'];
  if (!window.confirm(`${voucherNo} を削除します。よろしいですか。`)) {
    return;
  }

  showLoading('支出伝票を削除しています...');
  try {
    await apiPost('accounting/deleteExpenseVoucher', {
      voucherNo: voucherNo,
      currentUser: state.currentUser
    });
    showToast('支出伝票を削除しました', 'success');
    clearExpenseDetail();
    prepareExpenseForm('create');
    await loadHomeSummary();
    await loadExpenseList();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function openTravelTransferModal() {
  if (!state.currentUser) {
    showToast('利用者を選択してください', 'error');
    return;
  }
  els.travelTransferKeyword.value = '';
  els.travelTransferFiscalYear.value = els.formFiscalYear.value || els.expenseFiscalYear.value || els.homeFiscalYear.value;
  openModal('travelTransferModal');
  await loadTravelTransferList();
}

async function loadTravelTransferList() {
  showLoading('旅費申請一覧を読み込んでいます...');
  try {
    const result = await apiGet('accounting/travel/listForTransfer', {
      fiscalYear: els.travelTransferFiscalYear.value,
      keyword: els.travelTransferKeyword.value
    });
    state.travelTransferRows = result.travels || [];
    renderTravelTransferTable();
  } catch (error) {
    state.travelTransferRows = [];
    renderTravelTransferTable();
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function renderTravelTransferTable() {
  const rows = state.travelTransferRows;
  if (!rows.length) {
    els.travelTransferTableBody.innerHTML = '<tr><td colspan="9" class="empty-cell">該当する旅費申請がありません。</td></tr>';
    return;
  }

  els.travelTransferTableBody.innerHTML = rows.map(function(row) {
    const duplicated = Boolean(row.transferredVoucherNo);
    return `
      <tr>
        <td>${escapeHtml(row.controlNo || '')}</td>
        <td>${escapeHtml(String(row.fiscalYear || ''))}</td>
        <td>${escapeHtml(formatDateLike(row.travelDate))}</td>
        <td>${escapeHtml(row.tripName || '')}</td>
        <td>${escapeHtml(row.driverName || '')}</td>
        <td class="text-right">${escapeHtml(formatNumber(row.paymentAmount || 0))}</td>
        <td>${row.paidFlag ? '<span class="badge yes">済</span>' : '<span class="badge waiting">未</span>'}</td>
        <td>${duplicated ? `<span class="badge transfered">${escapeHtml(row.transferredVoucherNo)}</span>` : '<span class="badge waiting">未転記</span>'}</td>
        <td>${duplicated ? '<span class="inline-note">転記済み</span>' : `<button class="select-row-button" type="button" data-control-no="${escapeHtml(row.controlNo || '')}">この内容を使う</button>`}</td>
      </tr>
    `;
  }).join('');

  els.travelTransferTableBody.querySelectorAll('[data-control-no]').forEach(function(button) {
    button.addEventListener('click', function() {
      applyTravelTransfer(button.dataset.controlNo);
    });
  });
}

async function applyTravelTransfer(controlNo) {
  showLoading('旅費申請の内容を取り込んでいます...');
  try {
    const duplicate = await apiGet('accounting/checkTravelTransferDuplicate', { controlNo: controlNo });
    if (duplicate.duplicate) {
      throw new Error(`この旅費申請はすでに ${duplicate.existingVoucherNo} へ転記済みです`);
    }

    const result = await apiGet('accounting/travel/getForTransfer', { controlNo: controlNo });
    prepareExpenseForm('create', { travel: result.travel });
    closeModal('travelTransferModal');
    switchPage('expense-form');
    showToast(`旅費申請 ${controlNo} を支出伝票フォームへ取り込みました`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function toBoolean(value) {
  return value === true || value === 'true' || value === 'TRUE' || value === 1 || value === '1';
}

async function convertFileToEvidencePayload(file) {
  const base64 = await readFileAsBase64(file);
  return {
    fileName: file.name,
    mimeType: file.type,
    base64: base64
  };
}

function readFileAsBase64(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onload = function() {
      const result = String(reader.result || '');
      const commaIndex = result.indexOf(',');
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = function() {
      reject(new Error('証憑ファイルの読み込みに失敗しました'));
    };
    reader.readAsDataURL(file);
  });
}

function toDateInputValue(value) {
  if (!value) return '';
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
    if (match) {
      return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
    }
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toNumericInputValue(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? String(number) : '';
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
  if (typeof value === 'string') {
    return value.replace(/-/g, '/');
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}

function formatFileSize(size) {
  const value = Number(size || 0);
  if (value >= 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(2)} MB`;
  if (value >= 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${value} B`;
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
