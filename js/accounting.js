const APP_CONFIG = {
  // 既存旅費申請システムで使用しているGASの実行URLを設定してください
  // 例: https://script.google.com/macros/s/AKfycbwtf6EiFSeIAeJDRw-LxUn7yBNRPjzVEzqLR4IA3GXeL0RJ7N0bS22qiiShsrp46lwF/exec
  apiBaseUrl: 'https://script.google.com/macros/s/AKfycbwtf6EiFSeIAeJDRw-LxUn7yBNRPjzVEzqLR4IA3GXeL0RJ7N0bS22qiiShsrp46lwF/exec'
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
  },
  memberRows: [],
  selectedMember: null,
  memberForm: {
    mode: 'create',
    originalName: ''
  },
  subjectMasterRows: [],
  selectedSubject: null,
  subjectForm: {
    mode: 'create',
    subjectCode: ''
  },
  budgetRows: []
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
  homeExpenseTotal: document.getElementById('homeExpenseTotal'),
  homeIncomeTotal: document.getElementById('homeIncomeTotal'),
  homeBalanceTotal: document.getElementById('homeBalanceTotal'),
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


  memberKeyword: document.getElementById('memberKeyword'),
  searchMembersButton: document.getElementById('searchMembersButton'),
  reloadMembersButton: document.getElementById('reloadMembersButton'),
  openMemberCreateButton: document.getElementById('openMemberCreateButton'),
  memberCountLabel: document.getElementById('memberCountLabel'),
  memberTableBody: document.getElementById('memberTableBody'),
  memberDetailEmpty: document.getElementById('memberDetailEmpty'),
  memberDetailBody: document.getElementById('memberDetailBody'),
  memberDetailName: document.getElementById('memberDetailName'),
  editMemberButton: document.getElementById('editMemberButton'),
  deleteMemberButton: document.getElementById('deleteMemberButton'),
  memberFormModal: document.getElementById('memberFormModal'),
  memberFormModalTitle: document.getElementById('memberFormModalTitle'),
  memberFormName: document.getElementById('memberFormName'),
  memberFormSaveButton: document.getElementById('memberFormSaveButton'),

  subjectTypeFilter: document.getElementById('subjectTypeFilter'),
  subjectKeyword: document.getElementById('subjectKeyword'),
  searchSubjectsButton: document.getElementById('searchSubjectsButton'),
  reloadSubjectsButton: document.getElementById('reloadSubjectsButton'),
  openSubjectCreateButton: document.getElementById('openSubjectCreateButton'),
  subjectCountLabel: document.getElementById('subjectCountLabel'),
  subjectTableBody: document.getElementById('subjectTableBody'),
  subjectDetailEmpty: document.getElementById('subjectDetailEmpty'),
  subjectDetailBody: document.getElementById('subjectDetailBody'),
  subjectDetailCode: document.getElementById('subjectDetailCode'),
  subjectDetailName: document.getElementById('subjectDetailName'),
  subjectDetailType: document.getElementById('subjectDetailType'),
  subjectDetailSortOrder: document.getElementById('subjectDetailSortOrder'),
  subjectDetailEnabled: document.getElementById('subjectDetailEnabled'),
  subjectDetailNote: document.getElementById('subjectDetailNote'),
  editSubjectButton: document.getElementById('editSubjectButton'),
  deleteSubjectButton: document.getElementById('deleteSubjectButton'),
  subjectFormModal: document.getElementById('subjectFormModal'),
  subjectFormModalTitle: document.getElementById('subjectFormModalTitle'),
  subjectCodeReadonlyRow: document.getElementById('subjectCodeReadonlyRow'),
  subjectFormCode: document.getElementById('subjectFormCode'),
  subjectFormName: document.getElementById('subjectFormName'),
  subjectFormType: document.getElementById('subjectFormType'),
  subjectFormSortOrder: document.getElementById('subjectFormSortOrder'),
  subjectFormNote: document.getElementById('subjectFormNote'),
  subjectFormEnabled: document.getElementById('subjectFormEnabled'),
  subjectFormSaveButton: document.getElementById('subjectFormSaveButton'),


  budgetFiscalYear: document.getElementById('budgetFiscalYear'),
  budgetTypeFilter: document.getElementById('budgetTypeFilter'),
  reloadBudgetButton: document.getElementById('reloadBudgetButton'),
  saveBudgetButton: document.getElementById('saveBudgetButton'),
  budgetTotalAmount: document.getElementById('budgetTotalAmount'),
  budgetActualAmount: document.getElementById('budgetActualAmount'),
  budgetDiffAmount: document.getElementById('budgetDiffAmount'),
  budgetCountLabel: document.getElementById('budgetCountLabel'),
  budgetTableBody: document.getElementById('budgetTableBody'),

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
    if (els.budgetTypeFilter) els.budgetTypeFilter.value = '';
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
  els.incomeFormEvidenceFile.addEventListener('change', onIncomeEvidenceFileChange);
  els.incomeRemoveEvidenceCheckbox.addEventListener('change', renderIncomeFormEvidenceInfo);


  els.searchMembersButton.addEventListener('click', function() { loadMemberMaster(); });
  els.reloadMembersButton.addEventListener('click', function() { loadUsers().then(loadMemberMaster); });
  els.memberKeyword.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      loadMemberMaster();
    }
  });
  els.openMemberCreateButton.addEventListener('click', openMemberCreateModal);
  els.editMemberButton.addEventListener('click', function() {
    if (!state.selectedMember) return;
    openMemberEditModal(state.selectedMember);
  });
  els.deleteMemberButton.addEventListener('click', deleteSelectedMember);
  els.memberFormSaveButton.addEventListener('click', saveMember);

  els.searchSubjectsButton.addEventListener('click', function() { loadSubjectMaster(); });
  els.reloadSubjectsButton.addEventListener('click', function() { loadSubjectMaster(); });
  els.subjectTypeFilter.addEventListener('change', function() { loadSubjectMaster(); });
  els.subjectKeyword.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      loadSubjectMaster();
    }
  });
  els.openSubjectCreateButton.addEventListener('click', openSubjectCreateModal);
  els.editSubjectButton.addEventListener('click', function() {
    if (!state.selectedSubject) return;
    openSubjectEditModal(state.selectedSubject);
  });
  els.deleteSubjectButton.addEventListener('click', deleteSelectedSubject);
  els.subjectFormSaveButton.addEventListener('click', saveSubject);

  els.reloadBudgetButton.addEventListener('click', function() { loadBudgetPage(); });
  els.budgetFiscalYear.addEventListener('change', function() { loadBudgetPage(); });
  els.budgetTypeFilter.addEventListener('change', function() { renderBudgetTable(); });
  els.saveBudgetButton.addEventListener('click', saveBudgetRows);

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
      if (page === 'members') loadMemberMaster();
      if (page === 'subjects') loadSubjectMaster();
      if (page === 'budget') loadBudgetPage();
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
    els.incomeFiscalYear, els.incomeFormFiscalYear, els.budgetFiscalYear
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


async function loadMemberMaster() {
  if (!state.currentUser) return showUserSelectScreen();
  showLoading('部員一覧を読み込んでいます...');
  try {
    const keyword = (els.memberKeyword.value || '').trim();
    const source = state.users.length ? state.users.slice() : (await apiGet('accounting/listMemberMaster', { keyword: keyword })).users || [];
    const rows = source.filter(function(user) {
      return !keyword || String(user.name || '').indexOf(keyword) !== -1;
    }).sort(function(a, b) {
      return String(a.name || '').localeCompare(String(b.name || ''), 'ja');
    });
    state.memberRows = rows;
    renderMemberTable();
    if (state.selectedMember) {
      const matched = rows.find(function(row) { return row.name === state.selectedMember.name; });
      matched ? renderMemberDetail(matched) : clearMemberDetail();
    } else {
      clearMemberDetail();
    }
  } catch (error) {
    state.memberRows = [];
    renderMemberTable();
    clearMemberDetail();
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function renderMemberTable() {
  const rows = state.memberRows || [];
  els.memberCountLabel.textContent = `${rows.length}件`;
  if (!rows.length) {
    els.memberTableBody.innerHTML = '<tr><td class="empty-cell">該当する部員がいません。</td></tr>';
    return;
  }
  const selectedName = state.selectedMember ? state.selectedMember.name : '';
  els.memberTableBody.innerHTML = rows.map(function(row) {
    const name = row.name || '';
    const selectedClass = name === selectedName ? ' class="selected-row"' : '';
    return `<tr${selectedClass}><td><button type="button" class="table-row-button" data-member-name="${escapeHtml(name)}">${escapeHtml(name)}</button></td></tr>`;
  }).join('');
  els.memberTableBody.querySelectorAll('[data-member-name]').forEach(function(button) {
    button.addEventListener('click', function() {
      const member = rows.find(function(row) { return row.name === button.dataset.memberName; });
      if (member) renderMemberDetail(member);
    });
  });
}

function clearMemberDetail() {
  state.selectedMember = null;
  els.memberDetailEmpty.classList.remove('hidden');
  els.memberDetailBody.classList.add('hidden');
  els.memberDetailName.textContent = '-';
  els.editMemberButton.disabled = true;
  els.deleteMemberButton.disabled = true;
}

function renderMemberDetail(member) {
  state.selectedMember = member;
  els.memberDetailEmpty.classList.add('hidden');
  els.memberDetailBody.classList.remove('hidden');
  els.memberDetailName.textContent = member.name || '-';
  els.editMemberButton.disabled = false;
  els.deleteMemberButton.disabled = false;
  renderMemberTable();
}

function openMemberCreateModal() {
  state.memberForm = { mode: 'create', originalName: '' };
  els.memberFormModalTitle.textContent = '部員登録';
  els.memberFormName.value = '';
  openModal('memberFormModal');
}

function openMemberEditModal(member) {
  state.memberForm = { mode: 'edit', originalName: member.name || '' };
  els.memberFormModalTitle.textContent = `部員編集：${member.name || ''}`;
  els.memberFormName.value = member.name || '';
  openModal('memberFormModal');
}

async function saveMember() {
  if (!state.currentUser) return showToast('利用者を選択してください', 'error');
  try {
    const name = requireValue(els.memberFormName.value, '氏名を入力してください').trim();
    showLoading(state.memberForm.mode === 'edit' ? '部員情報を更新しています...' : '部員を登録しています...');
    if (state.memberForm.mode === 'edit') {
      const result = await apiPost('member/updateFromAccounting', {
        currentUser: state.currentUser,
        oldName: state.memberForm.originalName,
        newName: name
      });
      if (state.currentUser && state.currentUser.name === state.memberForm.originalName) {
        saveCurrentUser({ name: result.newName || name });
      }
      showToast('部員情報を更新しました', 'success');
    } else {
      await apiPost('member/createFromAccounting', {
        currentUser: state.currentUser,
        name: name
      });
      showToast('部員を登録しました', 'success');
    }
    closeModal('memberFormModal');
    await loadUsers();
    await loadMemberMaster();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function deleteSelectedMember() {
  if (!state.selectedMember) return;
  const name = state.selectedMember.name || '';
  if (state.currentUser && state.currentUser.name === name) {
    showToast('現在ユーザーは削除できません。先に別の利用者へ切り替えてください', 'error');
    return;
  }
  if (!window.confirm(`${name} を削除します。よろしいですか。`)) return;
  showLoading('部員を削除しています...');
  try {
    await apiPost('member/deleteFromAccounting', { currentUser: state.currentUser, name: name });
    showToast('部員を削除しました', 'success');
    clearMemberDetail();
    await loadUsers();
    await loadMemberMaster();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
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


async function loadSubjectMaster() {
  if (!state.currentUser) return showUserSelectScreen();
  showLoading('科目マスタを読み込んでいます...');
  try {
    const result = await apiGet('accounting/listSubjects', {
      type: els.subjectTypeFilter.value,
      keyword: (els.subjectKeyword.value || '').trim(),
      includeDisabled: 'true'
    });
    state.subjectMasterRows = (result.subjects || []).slice().sort(function(a, b) {
      const typeComp = String(a['収支区分'] || '').localeCompare(String(b['収支区分'] || ''), 'ja');
      if (typeComp !== 0) return typeComp;
      const orderComp = Number(a['表示順'] || 0) - Number(b['表示順'] || 0);
      if (orderComp !== 0) return orderComp;
      return String(a['科目コード'] || '').localeCompare(String(b['科目コード'] || ''), 'ja');
    });
    renderSubjectTable();
    if (state.selectedSubject) {
      const matched = state.subjectMasterRows.find(function(row) { return row['科目コード'] === state.selectedSubject['科目コード']; });
      matched ? renderSubjectDetail(matched) : clearSubjectDetail();
    } else {
      clearSubjectDetail();
    }
  } catch (error) {
    state.subjectMasterRows = [];
    renderSubjectTable();
    clearSubjectDetail();
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function renderSubjectTable() {
  const rows = state.subjectMasterRows || [];
  els.subjectCountLabel.textContent = `${rows.length}件`;
  if (!rows.length) {
    els.subjectTableBody.innerHTML = '<tr><td colspan="6" class="empty-cell">該当する科目がありません。</td></tr>';
    return;
  }
  const selectedCode = state.selectedSubject ? state.selectedSubject['科目コード'] : '';
  els.subjectTableBody.innerHTML = rows.map(function(row) {
    const code = row['科目コード'] || '';
    const enabled = String(row['使用可否']) !== 'false';
    const selectedClass = code === selectedCode ? ' class="selected-row"' : '';
    return `
      <tr${selectedClass}>
        <td><button type="button" class="table-row-button" data-subject-code="${escapeHtml(code)}">${escapeHtml(code)}</button></td>
        <td>${escapeHtml(row['科目名'] || '')}</td>
        <td>${renderSubjectTypeText(row['収支区分'])}</td>
        <td class="text-right">${escapeHtml(String(row['表示順'] || 0))}</td>
        <td>${enabled ? '<span class="badge yes">使用中</span>' : '<span class="badge none">停止</span>'}</td>
        <td>${escapeHtml(row['備考'] || '')}</td>
      </tr>
    `;
  }).join('');
  els.subjectTableBody.querySelectorAll('[data-subject-code]').forEach(function(button) {
    button.addEventListener('click', function() {
      const row = state.subjectMasterRows.find(function(item) { return item['科目コード'] === button.dataset.subjectCode; });
      if (row) renderSubjectDetail(row);
    });
  });
}

function renderSubjectTypeText(type) {
  if (type === '収入') return '<span class="subject-type-income">収入</span>';
  if (type === '支出') return '<span class="subject-type-expense">支出</span>';
  return escapeHtml(type || '-');
}

function clearSubjectDetail() {
  state.selectedSubject = null;
  els.subjectDetailEmpty.classList.remove('hidden');
  els.subjectDetailBody.classList.add('hidden');
  els.subjectDetailCode.textContent = '-';
  els.subjectDetailName.textContent = '-';
  els.subjectDetailType.textContent = '-';
  els.subjectDetailSortOrder.textContent = '-';
  els.subjectDetailEnabled.textContent = '-';
  els.subjectDetailNote.textContent = '-';
  els.editSubjectButton.disabled = true;
  els.deleteSubjectButton.disabled = true;
}

function renderSubjectDetail(subject) {
  state.selectedSubject = subject;
  els.subjectDetailEmpty.classList.add('hidden');
  els.subjectDetailBody.classList.remove('hidden');
  els.subjectDetailCode.textContent = subject['科目コード'] || '-';
  els.subjectDetailName.textContent = subject['科目名'] || '-';
  els.subjectDetailType.textContent = subject['収支区分'] || '-';
  els.subjectDetailSortOrder.textContent = String(subject['表示順'] || 0);
  els.subjectDetailEnabled.textContent = String(subject['使用可否']) !== 'false' ? '使用中' : '停止';
  els.subjectDetailNote.textContent = subject['備考'] || '-';
  els.editSubjectButton.disabled = false;
  els.deleteSubjectButton.disabled = false;
  renderSubjectTable();
}

function openSubjectCreateModal() {
  state.subjectForm = { mode: 'create', subjectCode: '' };
  els.subjectFormModalTitle.textContent = '科目登録';
  els.subjectFormCode.readOnly = false;
  els.subjectCodeReadonlyRow.classList.remove('readonly-field');
  els.subjectFormCode.value = '';
  els.subjectFormCode.required = true;
  els.subjectFormName.value = '';
  els.subjectFormType.value = els.subjectTypeFilter.value || '';
  els.subjectFormSortOrder.value = '';
  els.subjectFormNote.value = '';
  els.subjectFormEnabled.checked = true;
  openModal('subjectFormModal');
}

function openSubjectEditModal(subject) {
  state.subjectForm = { mode: 'edit', subjectCode: subject['科目コード'] || '' };
  els.subjectFormModalTitle.textContent = `科目編集：${subject['科目コード'] || ''}`;
  els.subjectFormCode.readOnly = true;
  els.subjectCodeReadonlyRow.classList.add('readonly-field');
  els.subjectFormCode.value = subject['科目コード'] || '';
  els.subjectFormCode.required = false;
  els.subjectFormName.value = subject['科目名'] || '';
  els.subjectFormType.value = subject['収支区分'] || '';
  els.subjectFormSortOrder.value = String(subject['表示順'] || 0);
  els.subjectFormNote.value = subject['備考'] || '';
  els.subjectFormEnabled.checked = String(subject['使用可否']) !== 'false';
  openModal('subjectFormModal');
}

async function saveSubject() {
  if (!state.currentUser) return showToast('利用者を選択してください', 'error');
  try {
    const subjectCode = requireValue(els.subjectFormCode.value, '科目コードを入力してください').trim();
    const subjectName = requireValue(els.subjectFormName.value, '科目名を入力してください').trim();
    const type = requireValue(els.subjectFormType.value, '収支区分を選択してください');
    const sortOrder = Number(els.subjectFormSortOrder.value || 0);
    const data = {
      subjectCode: subjectCode,
      subjectName: subjectName,
      type: type,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      enabled: els.subjectFormEnabled.checked,
      note: els.subjectFormNote.value.trim()
    };
    showLoading(state.subjectForm.mode === 'edit' ? '科目を更新しています...' : '科目を登録しています...');
    if (state.subjectForm.mode === 'edit') {
      await apiPost('accounting/updateSubject', {
        currentUser: state.currentUser,
        subjectCode: state.subjectForm.subjectCode,
        data: data
      });
      showToast('科目を更新しました', 'success');
    } else {
      await apiPost('accounting/createSubject', {
        currentUser: state.currentUser,
        data: data
      });
      showToast('科目を登録しました', 'success');
    }
    closeModal('subjectFormModal');
    await loadSubjects();
    await loadSubjectMaster();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function deleteSelectedSubject() {
  if (!state.selectedSubject) return;
  const code = state.selectedSubject['科目コード'] || '';
  if (!window.confirm(`${code} を削除します。よろしいですか。`)) return;
  showLoading('科目を削除しています...');
  try {
    await apiPost('accounting/deleteSubject', { currentUser: state.currentUser, subjectCode: code });
    showToast('科目を削除しました', 'success');
    clearSubjectDetail();
    await loadSubjects();
    await loadSubjectMaster();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
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
    const balanceTotal = incomeTotal - expenseTotal;
    els.homeExpenseTotal.textContent = formatCurrency(expenseTotal);
    els.homeIncomeTotal.textContent = formatCurrency(incomeTotal);
    els.homeBalanceTotal.textContent = formatCurrency(balanceTotal);
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
  const subjectCode = requireValue(els.formSubjectSelect.value, '科目を選択してください');
  const subjectName = selectedOption ? selectedOption.dataset.subjectName || '' : '';
  if (!subjectName) throw new Error('科目を選択してください');
  const expenseDate = requireValue(els.formExpenseDate.value, '支出日を入力してください');
  const summary = requireValue(els.formSummary.value, '摘要を入力してください').trim();
  const payee = requireValue(els.formPayee.value, '支払先を入力してください').trim();
  const amount = requirePositiveNumber(els.formAmount.value, '支出金額を入力してください');
  return {
    fiscalYear: Number(requireValue(els.formFiscalYear.value, '年度を選択してください')),
    subjectCode: subjectCode,
    subjectName: subjectName,
    expenseDate: expenseDate,
    amount: amount,
    summary: summary,
    note: els.formNote.value.trim(),
    payee: payee,
    paymentStatus: '支払済',
    paymentDate: expenseDate,
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
    if (openListAfterSave) {
      if (savedVoucherNo) {
        const detail = await apiGet('accounting/getExpenseVoucher', { voucherNo: savedVoucherNo });
        state.selectedExpense = detail;
        switchPage('expenses');
        els.expenseFiscalYear.value = String(detail.voucher['年度'] || els.expenseFiscalYear.value);
        await loadExpenseList();
        await loadExpenseDetail(savedVoucherNo);
      } else {
        switchPage('expenses');
        await loadExpenseList();
      }
      return;
    }
    prepareExpenseForm('create');
    switchPage('home');
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
  const subjectCode = requireValue(els.incomeFormSubjectSelect.value, '科目を選択してください');
  const subjectName = selectedOption ? selectedOption.dataset.subjectName || '' : '';
  if (!subjectName) throw new Error('科目を選択してください');
  const incomeDate = requireValue(els.incomeFormDate.value, '収入日を入力してください');
  const summary = requireValue(els.incomeFormSummary.value, '摘要を入力してください').trim();
  const payer = requireValue(els.incomeFormPayer.value, '入金元を入力してください').trim();
  const amount = requirePositiveNumber(els.incomeFormAmount.value, '収入金額を入力してください');
  return {
    fiscalYear: Number(requireValue(els.incomeFormFiscalYear.value, '年度を選択してください')),
    subjectCode: subjectCode,
    subjectName: subjectName,
    incomeDate: incomeDate,
    amount: amount,
    summary: summary,
    note: els.incomeFormNote.value.trim(),
    payer: payer,
    paymentStatus: '入金済',
    paymentDate: incomeDate
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
    if (openListAfterSave) {
      if (savedVoucherNo) {
        const detail = await apiGet('accounting/getIncomeVoucher', { voucherNo: savedVoucherNo });
        state.selectedIncome = detail;
        switchPage('incomes');
        els.incomeFiscalYear.value = String(detail.voucher['年度'] || els.incomeFiscalYear.value);
        await loadIncomeList();
        await loadIncomeDetail(savedVoucherNo);
      } else {
        switchPage('incomes');
        await loadIncomeList();
      }
      return;
    }
    prepareIncomeForm('create');
    switchPage('home');
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


async function loadBudgetPage() {
  if (!state.currentUser) return showUserSelectScreen();
  showLoading('予算書を読み込んでいます...');
  try {
    const fiscalYear = requireValue(els.budgetFiscalYear.value, '年度を選択してください');
    const [expenseSubjectsResult, incomeSubjectsResult, budgetResult, settlementResult] = await Promise.all([
      apiGet('accounting/listSubjects', { type: '支出' }),
      apiGet('accounting/listSubjects', { type: '収入' }),
      apiGet('accounting/listBudgetRows', { fiscalYear: fiscalYear }),
      apiGet('accounting/buildSettlementSummary', { fiscalYear: fiscalYear })
    ]);

    const budgetRows = budgetResult.rows || [];
    const settlementRows = settlementResult.rows || [];
    const subjectSeedRows = [];
    (expenseSubjectsResult.subjects || []).forEach(function(row) { subjectSeedRows.push(row); });
    (incomeSubjectsResult.subjects || []).forEach(function(row) { subjectSeedRows.push(row); });

    const rowMap = {};
    subjectSeedRows.forEach(function(row) {
      const key = [row['収支区分'], row['科目コード']].join('|');
      rowMap[key] = {
        fiscalYear: Number(fiscalYear),
        type: row['収支区分'] || '',
        subjectCode: row['科目コード'] || '',
        subjectName: row['科目名'] || '',
        initialBudget: 0,
        revisedBudget: 0,
        budgetTotal: 0,
        actualAmount: 0,
        diffAmount: 0,
        note: row['備考'] || '',
        enabled: String(row['使用可否']) !== 'false',
        createdAt: row['登録日時'] || '',
        updatedAt: row['更新日時'] || ''
      };
    });

    budgetRows.forEach(function(row) {
      const key = [row['収支区分'], row['科目コード']].join('|');
      rowMap[key] = Object.assign(rowMap[key] || {}, {
        fiscalYear: Number(fiscalYear),
        type: row['収支区分'] || (rowMap[key] && rowMap[key].type) || '',
        subjectCode: row['科目コード'] || (rowMap[key] && rowMap[key].subjectCode) || '',
        subjectName: row['科目名'] || (rowMap[key] && rowMap[key].subjectName) || '',
        initialBudget: Number(row['当初予算額'] || 0),
        revisedBudget: Number(row['補正予算額'] || 0),
        budgetTotal: Number(row['予算合計額'] || 0),
        actualAmount: Number(row['実績額'] || 0),
        diffAmount: Number(row['差額'] || 0),
        note: row['備考'] || '',
        createdAt: row['登録日時'] || '',
        updatedAt: row['更新日時'] || ''
      });
    });

    settlementRows.forEach(function(row) {
      const key = [row.type, row.subjectCode].join('|');
      const current = rowMap[key] || {
        fiscalYear: Number(fiscalYear),
        type: row.type || '',
        subjectCode: row.subjectCode || '',
        subjectName: row.subjectName || '',
        initialBudget: 0,
        revisedBudget: 0,
        budgetTotal: 0,
        actualAmount: 0,
        diffAmount: 0,
        note: ''
      };
      current.actualAmount = Number(row.actualAmount || 0);
      current.budgetTotal = Number(current.initialBudget || 0) + Number(current.revisedBudget || 0);
      current.diffAmount = current.budgetTotal - current.actualAmount;
      if (!current.subjectName) current.subjectName = row.subjectName || '';
      rowMap[key] = current;
    });

    state.budgetRows = Object.values(rowMap).filter(function(row) {
      return row.subjectCode || row.subjectName;
    }).sort(function(a, b) {
      const typeComp = String(a.type || '').localeCompare(String(b.type || ''), 'ja');
      if (typeComp !== 0) return typeComp;
      return String(a.subjectCode || '').localeCompare(String(b.subjectCode || ''), 'ja');
    });

    renderBudgetTable();
  } catch (error) {
    state.budgetRows = [];
    renderBudgetTable();
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function getFilteredBudgetRows() {
  const type = els.budgetTypeFilter.value || '';
  return (state.budgetRows || []).filter(function(row) {
    return !type || row.type === type;
  });
}

function renderBudgetTable() {
  const rows = getFilteredBudgetRows();
  els.budgetCountLabel.textContent = `${rows.length}件`;
  if (!rows.length) {
    els.budgetTableBody.innerHTML = '<tr><td colspan="9" class="empty-cell">該当する予算データがありません。</td></tr>';
    updateBudgetSummary([]);
    return;
  }
  els.budgetTableBody.innerHTML = rows.map(function(row, index) {
    const budgetTotal = Number(row.initialBudget || 0) + Number(row.revisedBudget || 0);
    const diff = budgetTotal - Number(row.actualAmount || 0);
    const diffClass = diff < 0 ? 'minus' : 'plus';
    const typeChipClass = row.type === '収入' ? 'income' : 'expense';
    return `
      <tr data-budget-key="${escapeHtml([row.type, row.subjectCode].join('|'))}">
        <td><span class="budget-type-chip ${typeChipClass}">${escapeHtml(row.type || '-')}</span></td>
        <td>${escapeHtml(row.subjectCode || '')}</td>
        <td>${escapeHtml(row.subjectName || '')}</td>
        <td><input class="budget-input text-right" type="number" min="0" step="1" data-budget-field="initialBudget" data-budget-index="${index}" value="${escapeAttribute(String(Number(row.initialBudget || 0)))}" /></td>
        <td><input class="budget-input text-right" type="number" min="0" step="1" data-budget-field="revisedBudget" data-budget-index="${index}" value="${escapeAttribute(String(Number(row.revisedBudget || 0)))}" /></td>
        <td class="text-right budget-total-cell" data-budget-total="${index}">${escapeHtml(formatNumber(budgetTotal))}</td>
        <td class="text-right">${escapeHtml(formatNumber(row.actualAmount || 0))}</td>
        <td class="text-right budget-diff-cell ${diffClass}" data-budget-diff="${index}">${escapeHtml(formatNumber(diff))}</td>
        <td><input class="budget-note-input" type="text" data-budget-field="note" data-budget-index="${index}" value="${escapeAttribute(row.note || '')}" /></td>
      </tr>
    `;
  }).join('');

  els.budgetTableBody.querySelectorAll('[data-budget-field]').forEach(function(input) {
    input.addEventListener('input', function() {
      const index = Number(input.dataset.budgetIndex);
      const field = input.dataset.budgetField;
      const target = rows[index];
      if (!target) return;
      if (field === 'note') {
        target.note = input.value;
      } else {
        target[field] = Number(input.value || 0);
        updateBudgetRowVisual(index, target, rows);
      }
      updateBudgetSummary(rows);
    });
  });
  updateBudgetSummary(rows);
}

function updateBudgetRowVisual(index, row, rows) {
  const budgetTotal = Number(row.initialBudget || 0) + Number(row.revisedBudget || 0);
  const diff = budgetTotal - Number(row.actualAmount || 0);
  row.budgetTotal = budgetTotal;
  row.diffAmount = diff;
  const totalEl = els.budgetTableBody.querySelector(`[data-budget-total="${index}"]`);
  const diffEl = els.budgetTableBody.querySelector(`[data-budget-diff="${index}"]`);
  if (totalEl) totalEl.textContent = formatNumber(budgetTotal);
  if (diffEl) {
    diffEl.textContent = formatNumber(diff);
    diffEl.classList.toggle('plus', diff >= 0);
    diffEl.classList.toggle('minus', diff < 0);
  }
}

function updateBudgetSummary(rows) {
  const targets = rows || [];
  const budgetTotal = targets.reduce(function(sum, row) { return sum + Number(row.initialBudget || 0) + Number(row.revisedBudget || 0); }, 0);
  const actualTotal = targets.reduce(function(sum, row) { return sum + Number(row.actualAmount || 0); }, 0);
  const diffTotal = budgetTotal - actualTotal;
  els.budgetTotalAmount.textContent = formatCurrency(budgetTotal);
  els.budgetActualAmount.textContent = formatCurrency(actualTotal);
  els.budgetDiffAmount.textContent = formatCurrency(diffTotal);
}

async function saveBudgetRows() {
  if (!state.currentUser) return showToast('利用者を選択してください', 'error');
  const fiscalYear = requireValue(els.budgetFiscalYear.value, '年度を選択してください');
  const rows = getFilteredBudgetRows().map(function(row) {
    const initialBudget = Number(row.initialBudget || 0);
    const revisedBudget = Number(row.revisedBudget || 0);
    return {
      type: row.type,
      subjectCode: row.subjectCode,
      subjectName: row.subjectName,
      initialBudget: initialBudget,
      revisedBudget: revisedBudget,
      actualAmount: Number(row.actualAmount || 0),
      note: row.note || ''
    };
  });
  showLoading('予算書を保存しています...');
  try {
    await apiPost('accounting/saveBudgetRows', {
      currentUser: state.currentUser,
      fiscalYear: Number(fiscalYear),
      rows: rows
    });
    showToast('予算書を保存しました', 'success');
    await loadBudgetPage();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function requireValue(value, message) {
  if (value === null || value === undefined) throw new Error(message);
  if (typeof value === 'string' && !value.trim()) throw new Error(message);
  return value;
}

function requirePositiveNumber(value, message) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) throw new Error(message);
  return number;
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
