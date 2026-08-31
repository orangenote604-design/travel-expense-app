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
  expenseSubjects: [],
  incomeSubjects: [],
  expenseRows: [],
  incomeRows: [],
  selectedExpense: null,
  selectedIncome: null,
  travelTransferRows: [],
  expenseForm: {
    mode: 'create',
    voucherNo: '',
    existingEvidence: null,
    pendingEvidenceFile: null,
    selectedTravel: null
  },
  incomeForm: {
    mode: 'create',
    voucherNo: '',
    existingEvidence: null,
    pendingEvidenceFile: null
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
  homeIncomeCount: document.getElementById('homeIncomeCount'),
  homeIncomeTotal: document.getElementById('homeIncomeTotal'),
  homeIncomeEvidenceCount: document.getElementById('homeIncomeEvidenceCount'),
  goExpensesButton: document.getElementById('goExpensesButton'),
  goExpenseCreateButton: document.getElementById('goExpenseCreateButton'),
  goIncomesButton: document.getElementById('goIncomesButton'),
  goIncomeCreateButton: document.getElementById('goIncomeCreateButton'),
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

  incomeFiscalYear: document.getElementById('incomeFiscalYear'),
  incomeKeyword: document.getElementById('incomeKeyword'),
  searchIncomesButton: document.getElementById('searchIncomesButton'),
  openIncomeCreateButton: document.getElementById('openIncomeCreateButton'),
  incomeCountLabel: document.getElementById('incomeCountLabel'),
  incomeTableBody: document.getElementById('incomeTableBody'),
  incomeDetailEmpty: document.getElementById('incomeDetailEmpty'),
  incomeDetailBody: document.getElementById('incomeDetailBody'),
  editIncomeButton: document.getElementById('editIncomeButton'),
  deleteIncomeButton: document.getElementById('deleteIncomeButton'),
  incomeDetailVoucherNo: document.getElementById('incomeDetailVoucherNo'),
  incomeDetailFiscalYear: document.getElementById('incomeDetailFiscalYear'),
  incomeDetailSubjectCode: document.getElementById('incomeDetailSubjectCode'),
  incomeDetailSubjectName: document.getElementById('incomeDetailSubjectName'),
  incomeDetailDate: document.getElementById('incomeDetailDate'),
  incomeDetailSummary: document.getElementById('incomeDetailSummary'),
  incomeDetailPayer: document.getElementById('incomeDetailPayer'),
  incomeDetailAmount: document.getElementById('incomeDetailAmount'),
  incomeDetailNote: document.getElementById('incomeDetailNote'),
  incomeDetailCreatedBy: document.getElementById('incomeDetailCreatedBy'),
  incomeDetailUpdatedBy: document.getElementById('incomeDetailUpdatedBy'),
  incomeDetailCreatedAt: document.getElementById('incomeDetailCreatedAt'),
  incomeDetailUpdatedAt: document.getElementById('incomeDetailUpdatedAt'),
  incomeEvidenceMeta: document.getElementById('incomeEvidenceMeta'),
  incomeEvidenceOpenLink: document.getElementById('incomeEvidenceOpenLink'),
  incomeEvidencePreview: document.getElementById('incomeEvidencePreview'),
  incomeFormTitle: document.getElementById('incomeFormTitle'),
  incomeFormVoucherNo: document.getElementById('incomeFormVoucherNo'),
  incomeFormFiscalYear: document.getElementById('incomeFormFiscalYear'),
  incomeFormDate: document.getElementById('incomeFormDate'),
  incomeFormSubjectSelect: document.getElementById('incomeFormSubjectSelect'),
  incomeFormSummary: document.getElementById('incomeFormSummary'),
  incomeFormPayer: document.getElementById('incomeFormPayer'),
  incomeFormAmount: document.getElementById('incomeFormAmount'),
  incomeFormNote: document.getElementById('incomeFormNote'),
  incomeFormEvidenceFile: document.getElementById('incomeFormEvidenceFile'),
  incomeRemoveEvidenceRow: document.getElementById('incomeRemoveEvidenceRow'),
  incomeRemoveEvidenceCheckbox: document.getElementById('incomeRemoveEvidenceCheckbox'),
  incomeFormEvidenceMeta: document.getElementById('incomeFormEvidenceMeta'),
  incomeFormEvidenceOpenLink: document.getElementById('incomeFormEvidenceOpenLink'),
  backToIncomeListButton: document.getElementById('backToIncomeListButton'),
  resetIncomeFormButton: document.getElementById('resetIncomeFormButton'),
  saveIncomeButton: document.getElementById('saveIncomeButton'),
  saveIncomeButtonBottom: document.getElementById('saveIncomeButtonBottom'),
  saveIncomeAndOpenListButton: document.getElementById('saveIncomeAndOpenListButton'),

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
    prepareIncomeForm('create');
    await loadHomeSummary();
  } else {
    showUserSelectScreen();
  }
}

function bindEvents() {
  els.reloadUsersButton.addEventListener('click', function() { loadUsers(); });
  els.userSearchInput.addEventListener('input', function() {
    renderUserList(els.userList, state.users, els.userSearchInput.value, selectUserAndEnter);
  });
  els.switchUserSearchInput.addEventListener('input', function() {
    renderUserList(els.switchUserList, state.users, els.switchUserSearchInput.value, switchCurrentUser);
  });
  els.switchUserButton.addEventListener('click', openSwitchUserModal);
  els.openSwitchUserFromHome.addEventListener('click', openSwitchUserModal);
  els.refreshHomeButton.addEventListener('click', function() { loadHomeSummary(); });

  els.goExpensesButton.addEventListener('click', function() {
    switchPage('expenses');
    loadExpenseList();
  });
  els.goExpenseCreateButton.addEventListener('click', openExpenseCreateForm);
  els.goIncomesButton.addEventListener('click', function() {
    switchPage('incomes');
    loadIncomeList();
  });
  els.goIncomeCreateButton.addEventListener('click', openIncomeCreateForm);
  els.openTravelTransferFromHome.addEventListener('click', function() { openTravelTransferModal(); });

  els.searchExpensesButton.addEventListener('click', function() { loadExpenseList(); });
  els.expenseKeyword.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      loadExpenseList();
    }
  });
  els.openExpenseCreateButton.addEventListener('click', openExpenseCreateForm);
  els.openTravelTransferButton.addEventListener('click', function() { openTravelTransferModal(); });
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
  els.openTravelTransferFromForm.addEventListener('click', function() { openTravelTransferModal(); });
  els.saveExpenseButton.addEventListener('click', function() { saveExpense(false); });
  els.saveExpenseButtonBottom.addEventListener('click', function() { saveExpense(false); });
  els.saveAndOpenListButton.addEventListener('click', function() { saveExpense(true); });
  els.formEvidenceFile.addEventListener('change', onExpenseEvidenceFileChange);
  els.removeEvidenceCheckbox.addEventListener('change', renderExpenseFormEvidenceInfo);

  els.searchIncomesButton.addEventListener('click', function() { loadIncomeList(); });
  els.incomeKeyword.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      loadIncomeList();
    }
  });
  els.openIncomeCreateButton.addEventListener('click', openIncomeCreateForm);
  els.editIncomeButton.addEventListener('click', function() {
    if (!state.selectedIncome || !state.selectedIncome.voucher) return;
    openIncomeEditForm(state.selectedIncome.voucher, state.selectedIncome.evidence || null);
  });
  els.deleteIncomeButton.addEventListener('click', deleteSelectedIncome);
  els.backToIncomeListButton.addEventListener('click', function() {
    switchPage('incomes');
    loadIncomeList();
  });
  els.resetIncomeFormButton.addEventListener('click', function() {
    if (state.incomeForm.mode === 'edit' && state.selectedIncome && state.selectedIncome.voucher) {
      openIncomeEditForm(state.selectedIncome.voucher, state.selectedIncome.evidence || null);
      return;
    }
    prepareIncomeForm('create');
    showToast('入力内容をリセットしました', 'success');
  });
  els.saveIncomeButton.addEventListener('click', function() { saveIncome(false); });
  els.saveIncomeButtonBottom.addEventListener('click', function() { saveIncome(false); });
  els.saveIncomeAndOpenListButton.addEventListener('click', function() { saveIncome(true); });
  els.incomeFormEvidenceFile.addEventListener('change', onIncomeEvidenceFileChange);
  els.incomeRemoveEvidenceCheckbox.addEventListener('change', renderIncomeFormEvidenceInfo);

  els.searchTravelTransferButton.addEventListener('click', function() { loadTravelTransferList(); });
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
      if (page === 'expense-form' && !state.expenseForm.voucherNo && state.expenseForm.mode !== 'edit') prepareExpenseForm('create');
      if (page === 'incomes') loadIncomeList();
      if (page === 'income-form' && !state.incomeForm.voucherNo && state.incomeForm.mode !== 'edit') prepareIncomeForm('create');
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(function(button) {
    button.addEventListener('click', function() { closeModal(button.dataset.closeModal); });
  });
}

function populateFiscalYearOptions() {
  const currentYear = getFiscalYearFromDate(new Date());
  const years = [];
  for (let i = currentYear - 2; i <= currentYear + 2; i += 1) years.push(i);
  [
    els.homeFiscalYear, els.expenseFiscalYear, els.formFiscalYear, els.travelTransferFiscalYear,
    els.incomeFiscalYear, els.incomeFormFiscalYear
  ].forEach(function(select) {
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

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function openSwitchUserModal() {
  openModal('switchUserModal');
  renderUserList(els.switchUserList, state.users, '', switchCurrentUser);
  els.switchUserSearchInput.value = '';
}

function showLoading(text) {
  els.loadingText.textContent = text || '読み込み中...';
  els.loadingOverlay.classList.remove('hidden');
}

function hideLoading() { els.loadingOverlay.classList.add('hidden'); }

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
  Object.entries(params || {}).forEach(function([key, value]) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });
  const response = await fetch(url.toString(), { method: 'GET' });
  if (!response.ok) throw new Error('通信に失敗しました');
  const json = await response.json();
  if (json.ok === false) throw new Error(json.error || json.message || '処理に失敗しました');
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
  if (!response.ok) throw new Error('通信に失敗しました');
  const json = await response.json();
  if (json.ok === false) throw new Error(json.error || json.message || '処理に失敗しました');
  return json;
}

async function loadUsers() {
  showLoading('利用者一覧を読み込んでいます...');
  try {
    const result = await apiGet('accounting/listUsers', {});
    state.users = result.users || [];
    els.userListStatus.textContent = state.users.length === 0 ? '部員一覧にデータがありません' : `${state.users.length}件の利用者を表示しています`;
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
  if (!rows.length) {
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
    button.addEventListener('click', function() { onSelect({ name: button.dataset.userName }); });
  });
}

async function selectUserAndEnter(user) {
  saveCurrentUser(user);
  showAppShell();
  await loadSubjects();
  prepareExpenseForm('create');
  prepareIncomeForm('create');
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
    const [expenseResult, incomeResult] = await Promise.all([
      apiGet('accounting/listSubjects', { type: '支出' }),
      apiGet('accounting/listSubjects', { type: '収入' })
    ]);
    state.expenseSubjects = expenseResult.subjects || [];
    state.incomeSubjects = incomeResult.subjects || [];
  } catch (error) {
    state.expenseSubjects = [];
    state.incomeSubjects = [];
    showToast(error.message, 'error');
  } finally {
    renderExpenseSubjectOptions();
    renderIncomeSubjectOptions();
    hideLoading();
  }
}

function renderSubjectOptions(selectEl, subjects, selectedCode, defaultCode) {
  if (!subjects.length) {
    selectEl.innerHTML = '<option value="">科目がありません</option>';
    return;
  }
  const options = subjects.slice().sort(function(a, b) {
    return Number(a['表示順'] || 0) - Number(b['表示順'] || 0);
  }).map(function(subject) {
    const code = subject['科目コード'] || '';
    const name = subject['科目名'] || '';
    const selected = code === selectedCode ? ' selected' : '';
    return `<option value="${escapeHtml(code)}" data-subject-name="${escapeHtml(name)}"${selected}>${escapeHtml(code)} / ${escapeHtml(name)}</option>`;
  });
  selectEl.innerHTML = options.join('');
  if (!selectedCode && defaultCode) {
    const defaultSubject = subjects.find(function(subject) { return String(subject['科目コード'] || '') === defaultCode; });
    if (defaultSubject) selectEl.value = defaultSubject['科目コード'];
  }
}

function renderExpenseSubjectOptions(selectedCode) {
  renderSubjectOptions(els.formSubjectSelect, state.expenseSubjects, selectedCode, 'EXP001');
}

function renderIncomeSubjectOptions(selectedCode) {
  renderSubjectOptions(els.incomeFormSubjectSelect, state.incomeSubjects, selectedCode, 'INC001');
}

async function loadHomeSummary() {
  if (!state.currentUser) {
    showUserSelectScreen();
    return;
  }
  showLoading('ホーム情報を集計しています...');
  try {
    const fiscalYear = els.homeFiscalYear.value;
    const [expenseResult, incomeResult] = await Promise.all([
      apiGet('accounting/listExpenseVouchers', { fiscalYear: fiscalYear }),
      apiGet('accounting/listIncomeVouchers', { fiscalYear: fiscalYear })
    ]);
    const expenseRows = expenseResult.vouchers || [];
    const incomeRows = incomeResult.vouchers || [];
    const expenseTotal = expenseRows.reduce(function(sum, row) { return sum + Number(row['支出金額'] || 0); }, 0);
    const incomeTotal = incomeRows.reduce(function(sum, row) { return sum + Number(row['収入金額'] || 0); }, 0);
    const expenseEvidenceCount = expenseRows.filter(function(row) { return toBoolean(row['証憑有無']); }).length;
    const incomeEvidenceCount = incomeRows.filter(function(row) { return toBoolean(row['証憑有無']); }).length;
    els.homeExpenseCount.textContent = String(expenseRows.length);
    els.homeExpenseTotal.textContent = formatCurrency(expenseTotal);
    els.homeEvidenceCount.textContent = String(expenseEvidenceCount);
    els.homeIncomeCount.textContent = String(incomeRows.length);
    els.homeIncomeTotal.textContent = formatCurrency(incomeTotal);
    els.homeIncomeEvidenceCount.textContent = String(incomeEvidenceCount);
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function loadExpenseList() {
  if (!state.currentUser) return showUserSelectScreen();
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
  const selectedVoucherNo = state.selectedExpense && state.selectedExpense.voucher ? state.selectedExpense.voucher['伝票番号'] : '';
  els.expenseTableBody.innerHTML = rows.map(function(row) {
    const voucherNo = row['伝票番号'] || '';
    const hasEvidence = toBoolean(row['証憑有無']);
    const selectedClass = voucherNo === selectedVoucherNo ? ' class="selected-row"' : '';
    return `
      <tr${selectedClass}>
        <td><button type="button" class="table-row-button" data-expense-voucher-no="${escapeHtml(voucherNo)}">${escapeHtml(voucherNo)}</button></td>
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
  els.expenseTableBody.querySelectorAll('[data-expense-voucher-no]').forEach(function(button) {
    button.addEventListener('click', function() { loadExpenseDetail(button.dataset.expenseVoucherNo); });
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
  clearEvidenceBox(els.evidenceMeta, els.evidenceOpenLink, els.evidencePreview);
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
  renderEvidencePreviewTo(els.evidenceMeta, els.evidenceOpenLink, els.evidencePreview, evidence);
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
    renderExpenseSubjectOptions(voucher['科目コード'] || '');
    els.formExpenseDate.value = toDateInputValue(voucher['支出日']);
    els.formSummary.value = voucher['摘要'] || '';
    els.formPayee.value = voucher['支払先'] || '';
    els.formAmount.value = toNumericInputValue(voucher['支出金額']);
    els.formRelatedTravelControlNo.value = voucher['関連旅費管理番号'] || '';
    els.formNote.value = voucher['備考'] || '';
    els.removeEvidenceRow.classList.remove('hidden');
    renderExpenseFormEvidenceInfo();
    return;
  }

  const travel = source.travel || null;
  state.expenseForm.selectedTravel = travel;
  els.expenseFormTitle.textContent = travel ? '支出伝票登録（旅費申請から転記）' : '支出伝票登録';
  els.formVoucherNo.value = '';
  els.formFiscalYear.value = String(travel ? (travel.fiscalYear || getFiscalYearFromDate(new Date())) : getFiscalYearFromDate(new Date()));
  renderExpenseSubjectOptions('EXP001');
  els.formExpenseDate.value = travel ? toDateInputValue(travel.travelDate) : todayInputValue();
  els.formSummary.value = travel ? [travel.tripName, travel.driverName].filter(Boolean).join(' / ') : '';
  els.formPayee.value = travel ? (travel.driverName || '') : '';
  els.formAmount.value = travel ? toNumericInputValue(travel.paymentAmount) : '';
  els.formRelatedTravelControlNo.value = travel ? (travel.controlNo || '') : '';
  els.formNote.value = travel ? `旅費申請 ${travel.controlNo || ''} から転記` : '';
  els.removeEvidenceRow.classList.add('hidden');
  renderExpenseFormEvidenceInfo();
}

function renderExpenseFormEvidenceInfo() {
  renderFormEvidenceInfoCore(state.expenseForm.pendingEvidenceFile, state.expenseForm.existingEvidence, els.removeEvidenceCheckbox.checked, els.formEvidenceMeta, els.formEvidenceOpenLink);
}

function onExpenseEvidenceFileChange(event) {
  handleEvidenceFileChange(event, 'expense');
}

function buildExpenseDataFromForm() {
  const selectedOption = els.formSubjectSelect.options[els.formSubjectSelect.selectedIndex];
  const subjectCode = els.formSubjectSelect.value;
  const subjectName = selectedOption ? selectedOption.dataset.subjectName || '' : '';
  if (!subjectCode || !subjectName) throw new Error('科目を選択してください');
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
  if (!state.currentUser) return showToast('利用者を選択してください', 'error');
  showLoading(state.expenseForm.mode === 'edit' ? '支出伝票を更新しています...' : '支出伝票を登録しています...');
  try {
    const data = buildExpenseDataFromForm();
    const payload = { currentUser: state.currentUser, data: data };
    if (state.expenseForm.mode === 'edit') payload.voucherNo = state.expenseForm.voucherNo;
    await applyEvidencePayloadForSave(payload, state.expenseForm, els.removeEvidenceCheckbox.checked);
    const result = await apiPost(state.expenseForm.mode === 'edit' ? 'accounting/updateExpenseVoucher' : 'accounting/createExpenseVoucher', payload);
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
  if (!window.confirm(`${voucherNo} を削除します。よろしいですか。`)) return;
  showLoading('支出伝票を削除しています...');
  try {
    await apiPost('accounting/deleteExpenseVoucher', { voucherNo: voucherNo, currentUser: state.currentUser });
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

async function loadIncomeList() {
  if (!state.currentUser) return showUserSelectScreen();
  showLoading('収入伝票一覧を読み込んでいます...');
  try {
    const result = await apiGet('accounting/listIncomeVouchers', {
      fiscalYear: els.incomeFiscalYear.value,
      keyword: els.incomeKeyword.value
    });
    state.incomeRows = result.vouchers || [];
    renderIncomeTable();
    clearIncomeDetail();
  } catch (error) {
    state.incomeRows = [];
    renderIncomeTable();
    clearIncomeDetail();
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function renderIncomeTable() {
  const rows = state.incomeRows;
  els.incomeCountLabel.textContent = `${rows.length}件`;
  if (!rows.length) {
    els.incomeTableBody.innerHTML = '<tr><td colspan="8" class="empty-cell">該当データがありません。</td></tr>';
    return;
  }
  const selectedVoucherNo = state.selectedIncome && state.selectedIncome.voucher ? state.selectedIncome.voucher['伝票番号'] : '';
  els.incomeTableBody.innerHTML = rows.map(function(row) {
    const voucherNo = row['伝票番号'] || '';
    const hasEvidence = toBoolean(row['証憑有無']);
    const selectedClass = voucherNo === selectedVoucherNo ? ' class="selected-row"' : '';
    return `
      <tr${selectedClass}>
        <td><button type="button" class="table-row-button" data-income-voucher-no="${escapeHtml(voucherNo)}">${escapeHtml(voucherNo)}</button></td>
        <td>${escapeHtml(String(row['年度'] || ''))}</td>
        <td>${escapeHtml(row['科目名'] || '')}</td>
        <td>${escapeHtml(formatDateLike(row['収入日']))}</td>
        <td class="text-right">${escapeHtml(formatNumber(row['収入金額']))}</td>
        <td>${escapeHtml(row['摘要'] || '')}</td>
        <td>${escapeHtml(row['入金元'] || '')}</td>
        <td>${hasEvidence ? '<span class="badge yes">あり</span>' : '<span class="badge none">なし</span>'}</td>
      </tr>
    `;
  }).join('');
  els.incomeTableBody.querySelectorAll('[data-income-voucher-no]').forEach(function(button) {
    button.addEventListener('click', function() { loadIncomeDetail(button.dataset.incomeVoucherNo); });
  });
}

async function loadIncomeDetail(voucherNo) {
  showLoading('伝票詳細を読み込んでいます...');
  try {
    const result = await apiGet('accounting/getIncomeVoucher', { voucherNo: voucherNo });
    state.selectedIncome = result;
    renderIncomeDetail(result.voucher, result.evidence);
    renderIncomeTable();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function clearIncomeDetail() {
  state.selectedIncome = null;
  els.incomeDetailEmpty.classList.remove('hidden');
  els.incomeDetailBody.classList.add('hidden');
  clearEvidenceBox(els.incomeEvidenceMeta, els.incomeEvidenceOpenLink, els.incomeEvidencePreview);
  els.editIncomeButton.disabled = true;
  els.deleteIncomeButton.disabled = true;
}

function renderIncomeDetail(voucher, evidence) {
  els.incomeDetailEmpty.classList.add('hidden');
  els.incomeDetailBody.classList.remove('hidden');
  els.editIncomeButton.disabled = false;
  els.deleteIncomeButton.disabled = false;
  els.incomeDetailVoucherNo.textContent = voucher['伝票番号'] || '-';
  els.incomeDetailFiscalYear.textContent = voucher['年度'] || '-';
  els.incomeDetailSubjectCode.textContent = voucher['科目コード'] || '-';
  els.incomeDetailSubjectName.textContent = voucher['科目名'] || '-';
  els.incomeDetailDate.textContent = formatDateLike(voucher['収入日']);
  els.incomeDetailSummary.textContent = voucher['摘要'] || '-';
  els.incomeDetailPayer.textContent = voucher['入金元'] || '-';
  els.incomeDetailAmount.textContent = formatCurrency(voucher['収入金額'] || 0);
  els.incomeDetailNote.textContent = voucher['備考'] || '-';
  els.incomeDetailCreatedBy.textContent = voucher['登録者'] || '-';
  els.incomeDetailUpdatedBy.textContent = voucher['更新者'] || '-';
  els.incomeDetailCreatedAt.textContent = voucher['登録日時'] || '-';
  els.incomeDetailUpdatedAt.textContent = voucher['更新日時'] || '-';
  renderEvidencePreviewTo(els.incomeEvidenceMeta, els.incomeEvidenceOpenLink, els.incomeEvidencePreview, evidence);
}

function openIncomeCreateForm() {
  prepareIncomeForm('create');
  switchPage('income-form');
}

function openIncomeEditForm(voucher, evidence) {
  prepareIncomeForm('edit', { voucher: voucher, evidence: evidence });
  switchPage('income-form');
}

function prepareIncomeForm(mode, options) {
  const source = options || {};
  state.incomeForm.mode = mode;
  state.incomeForm.voucherNo = '';
  state.incomeForm.existingEvidence = null;
  state.incomeForm.pendingEvidenceFile = null;
  els.incomeFormEvidenceFile.value = '';
  els.incomeRemoveEvidenceCheckbox.checked = false;

  if (mode === 'edit' && source.voucher) {
    const voucher = source.voucher;
    state.incomeForm.voucherNo = voucher['伝票番号'] || '';
    state.incomeForm.existingEvidence = source.evidence || null;
    els.incomeFormTitle.textContent = `収入伝票編集：${voucher['伝票番号'] || ''}`;
    els.incomeFormVoucherNo.value = voucher['伝票番号'] || '';
    els.incomeFormFiscalYear.value = String(voucher['年度'] || getFiscalYearFromDate(new Date()));
    renderIncomeSubjectOptions(voucher['科目コード'] || '');
    els.incomeFormDate.value = toDateInputValue(voucher['収入日']);
    els.incomeFormSummary.value = voucher['摘要'] || '';
    els.incomeFormPayer.value = voucher['入金元'] || '';
    els.incomeFormAmount.value = toNumericInputValue(voucher['収入金額']);
    els.incomeFormNote.value = voucher['備考'] || '';
    els.incomeRemoveEvidenceRow.classList.remove('hidden');
    renderIncomeFormEvidenceInfo();
    return;
  }

  els.incomeFormTitle.textContent = '収入伝票登録';
  els.incomeFormVoucherNo.value = '';
  els.incomeFormFiscalYear.value = String(getFiscalYearFromDate(new Date()));
  renderIncomeSubjectOptions('INC001');
  els.incomeFormDate.value = todayInputValue();
  els.incomeFormSummary.value = '';
  els.incomeFormPayer.value = '';
  els.incomeFormAmount.value = '';
  els.incomeFormNote.value = '';
  els.incomeRemoveEvidenceRow.classList.add('hidden');
  renderIncomeFormEvidenceInfo();
}

function renderIncomeFormEvidenceInfo() {
  renderFormEvidenceInfoCore(state.incomeForm.pendingEvidenceFile, state.incomeForm.existingEvidence, els.incomeRemoveEvidenceCheckbox.checked, els.incomeFormEvidenceMeta, els.incomeFormEvidenceOpenLink);
}

function onIncomeEvidenceFileChange(event) {
  handleEvidenceFileChange(event, 'income');
}

function buildIncomeDataFromForm() {
  const selectedOption = els.incomeFormSubjectSelect.options[els.incomeFormSubjectSelect.selectedIndex];
  const subjectCode = els.incomeFormSubjectSelect.value;
  const subjectName = selectedOption ? selectedOption.dataset.subjectName || '' : '';
  if (!subjectCode || !subjectName) throw new Error('科目を選択してください');
  return {
    fiscalYear: Number(els.incomeFormFiscalYear.value),
    subjectCode: subjectCode,
    subjectName: subjectName,
    incomeDate: els.incomeFormDate.value,
    amount: Number(els.incomeFormAmount.value || 0),
    summary: els.incomeFormSummary.value.trim(),
    note: els.incomeFormNote.value.trim(),
    payer: els.incomeFormPayer.value.trim(),
    paymentStatus: '入金済',
    paymentDate: els.incomeFormDate.value
  };
}

async function saveIncome(openListAfterSave) {
  if (!state.currentUser) return showToast('利用者を選択してください', 'error');
  showLoading(state.incomeForm.mode === 'edit' ? '収入伝票を更新しています...' : '収入伝票を登録しています...');
  try {
    const data = buildIncomeDataFromForm();
    const payload = { currentUser: state.currentUser, data: data };
    if (state.incomeForm.mode === 'edit') payload.voucherNo = state.incomeForm.voucherNo;
    await applyEvidencePayloadForSave(payload, state.incomeForm, els.incomeRemoveEvidenceCheckbox.checked);
    const result = await apiPost(state.incomeForm.mode === 'edit' ? 'accounting/updateIncomeVoucher' : 'accounting/createIncomeVoucher', payload);
    const savedVoucherNo = result.voucherNo || payload.voucherNo;
    showToast(state.incomeForm.mode === 'edit' ? '収入伝票を更新しました' : '収入伝票を登録しました', 'success');
    await loadHomeSummary();
    if (savedVoucherNo) {
      const detail = await apiGet('accounting/getIncomeVoucher', { voucherNo: savedVoucherNo });
      state.selectedIncome = detail;
      openIncomeEditForm(detail.voucher, detail.evidence || null);
      if (openListAfterSave) {
        switchPage('incomes');
        els.incomeFiscalYear.value = String(detail.voucher['年度'] || els.incomeFiscalYear.value);
        await loadIncomeList();
        await loadIncomeDetail(savedVoucherNo);
      }
    } else if (openListAfterSave) {
      switchPage('incomes');
      await loadIncomeList();
    }
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function deleteSelectedIncome() {
  if (!state.selectedIncome || !state.selectedIncome.voucher) return;
  const voucherNo = state.selectedIncome.voucher['伝票番号'];
  if (!window.confirm(`${voucherNo} を削除します。よろしいですか。`)) return;
  showLoading('収入伝票を削除しています...');
  try {
    await apiPost('accounting/deleteIncomeVoucher', { voucherNo: voucherNo, currentUser: state.currentUser });
    showToast('収入伝票を削除しました', 'success');
    clearIncomeDetail();
    prepareIncomeForm('create');
    await loadHomeSummary();
    await loadIncomeList();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function openTravelTransferModal() {
  if (!state.currentUser) return showToast('利用者を選択してください', 'error');
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
    button.addEventListener('click', function() { applyTravelTransfer(button.dataset.controlNo); });
  });
}

async function applyTravelTransfer(controlNo) {
  showLoading('旅費申請の内容を取り込んでいます...');
  try {
    const duplicate = await apiGet('accounting/checkTravelTransferDuplicate', { controlNo: controlNo });
    if (duplicate.duplicate) throw new Error(`この旅費申請はすでに ${duplicate.existingVoucherNo} へ転記済みです`);
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

function clearEvidenceBox(metaEl, linkEl, previewEl) {
  metaEl.textContent = '証憑なし';
  previewEl.innerHTML = '証憑が登録されていません。';
  previewEl.className = 'evidence-preview empty-preview';
  linkEl.classList.add('hidden');
  linkEl.removeAttribute('href');
}

function renderEvidencePreviewTo(metaEl, linkEl, previewEl, evidence) {
  if (!evidence || !evidence['DriveUrl']) {
    clearEvidenceBox(metaEl, linkEl, previewEl);
    return;
  }
  const url = evidence['DriveUrl'];
  const mime = evidence['MIMEタイプ'] || '';
  const fileName = evidence['ファイル名'] || '添付ファイル';
  metaEl.textContent = `${fileName} / ${mime || '形式不明'}`;
  linkEl.href = url;
  linkEl.classList.remove('hidden');
  previewEl.className = 'evidence-preview';
  if (mime === 'application/pdf') {
    previewEl.innerHTML = `<iframe src="${escapeAttribute(url)}"></iframe>`;
  } else if (mime === 'image/jpeg' || mime === 'image/png') {
    previewEl.innerHTML = `<img src="${escapeAttribute(url)}" alt="証憑プレビュー" />`;
  } else {
    previewEl.innerHTML = '<div class="empty-preview">この形式は画面内プレビュー対象外です。別タブで開いて確認してください。</div>';
  }
}

function renderFormEvidenceInfoCore(pendingFile, existing, removing, metaEl, linkEl) {
  if (pendingFile) {
    metaEl.textContent = `${pendingFile.name} / ${pendingFile.type || '形式不明'} / ${formatFileSize(pendingFile.size)}`;
    linkEl.classList.add('hidden');
    linkEl.removeAttribute('href');
    return;
  }
  if (existing && existing['DriveUrl'] && !removing) {
    metaEl.textContent = `${existing['ファイル名'] || '添付ファイル'} / ${existing['MIMEタイプ'] || '形式不明'}`;
    linkEl.href = existing['DriveUrl'];
    linkEl.classList.remove('hidden');
    return;
  }
  if (existing && removing) {
    metaEl.textContent = '保存時に既存証憑を削除します';
    linkEl.classList.add('hidden');
    linkEl.removeAttribute('href');
    return;
  }
  metaEl.textContent = '未添付';
  linkEl.classList.add('hidden');
  linkEl.removeAttribute('href');
}

function handleEvidenceFileChange(event, formType) {
  const file = event.target.files && event.target.files[0];
  const formState = formType === 'income' ? state.incomeForm : state.expenseForm;
  const render = formType === 'income' ? renderIncomeFormEvidenceInfo : renderExpenseFormEvidenceInfo;
  if (!file) {
    formState.pendingEvidenceFile = null;
    render();
    return;
  }
  if (!ALLOWED_EVIDENCE_MIME_TYPES.includes(file.type)) {
    event.target.value = '';
    formState.pendingEvidenceFile = null;
    showToast('証憑は PDF / JPG / PNG のみ添付できます', 'error');
    render();
    return;
  }
  if (file.size > MAX_EVIDENCE_FILE_SIZE) {
    event.target.value = '';
    formState.pendingEvidenceFile = null;
    showToast('証憑ファイルは5MB以下にしてください', 'error');
    render();
    return;
  }
  formState.pendingEvidenceFile = file;
  if (formType === 'income') {
    els.incomeRemoveEvidenceCheckbox.checked = false;
  } else {
    els.removeEvidenceCheckbox.checked = false;
  }
  render();
}

async function applyEvidencePayloadForSave(payload, formState, removeChecked) {
  if (formState.pendingEvidenceFile) {
    payload.evidence = await convertFileToEvidencePayload(formState.pendingEvidenceFile);
    if (formState.mode === 'edit') payload.evidenceOp = formState.existingEvidence ? 'replace' : 'attach';
  } else if (formState.mode === 'edit' && removeChecked && formState.existingEvidence) {
    payload.evidenceOp = 'remove';
  }
}

function toBoolean(value) {
  return value === true || value === 'true' || value === 'TRUE' || value === 1 || value === '1';
}

async function convertFileToEvidencePayload(file) {
  const base64 = await readFileAsBase64(file);
  return { fileName: file.name, mimeType: file.type, base64: base64 };
}

function readFileAsBase64(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onload = function() {
      const result = String(reader.result || '');
      const commaIndex = result.indexOf(',');
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.onerror = function() { reject(new Error('証憑ファイルの読み込みに失敗しました')); };
    reader.readAsDataURL(file);
  });
}

function toDateInputValue(value) {
  if (!value) return '';
  if (typeof value === 'string') {
    const match = value.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
    if (match) return `${match[1]}-${String(match[2]).padStart(2, '0')}-${String(match[3]).padStart(2, '0')}`;
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

function formatCurrency(value) { return `${formatNumber(value)} 円`; }
function formatNumber(value) { return Number(value || 0).toLocaleString('ja-JP'); }

function formatDateLike(value) {
  if (!value) return '-';
  if (typeof value === 'string') return value.replace(/-/g, '/');
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

function escapeAttribute(value) { return escapeHtml(value); }
