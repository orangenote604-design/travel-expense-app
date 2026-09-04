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
  memberOrderInitialRows: [],
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
  budgetRows: [],
  budgetPreviousSummary: {
    incomeTotal: 0,
    expenseTotal: 0,
    balance: 0
  },
  budgetPdfBlobUrl: ''
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
  saveMemberOrderButton: document.getElementById('saveMemberOrderButton'),
  resetMemberOrderButton: document.getElementById('resetMemberOrderButton'),
  memberOrderStatus: document.getElementById('memberOrderStatus'),
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
  exportBudgetPdfButton: document.getElementById('exportBudgetPdfButton'),
  saveBudgetButton: document.getElementById('saveBudgetButton'),
  budgetPdfResult: document.getElementById('budgetPdfResult'),
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
  bindUnsavedChangeListeners();
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
    if (switchPage('expenses')) loadExpenseList();
  });
  els.goExpenseCreateButton.addEventListener('click', openExpenseCreateForm);
  els.goIncomesButton.addEventListener('click', function() {
    if (switchPage('incomes')) loadIncomeList();
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
    if (switchPage('expenses')) loadExpenseList();
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
    if (switchPage('incomes')) loadIncomeList();
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


  els.searchMembersButton.addEventListener('click', renderMemberTable);
  els.reloadMembersButton.addEventListener('click', reloadMemberMaster);
  els.saveMemberOrderButton.addEventListener('click', saveMemberOrder);
  els.resetMemberOrderButton.addEventListener('click', resetMemberOrder);
  els.memberKeyword.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      renderMemberTable();
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
  els.budgetFiscalYear.addEventListener('change', function() {
    const previousValue = els.budgetFiscalYear.dataset.loadedValue || '';
    if (hasUnsavedChanges('budget') && !window.confirm(UNSAVED_CHANGES_MESSAGE)) {
      if (previousValue) els.budgetFiscalYear.value = previousValue;
      return;
    }
    clearUnsavedContext('budget');
    loadBudgetPage({ force: true });
  });
  els.budgetTypeFilter.addEventListener('change', function() { renderBudgetTable(); });
  els.exportBudgetPdfButton.addEventListener('click', generateBudgetPdf);
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
      if (!switchPage(page)) return;
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


const UNSAVED_CHANGES_MESSAGE = '保存していない内容があります。このまま移動すると入力内容は破棄されます。よろしいですか？';
const unsavedState = {
  baselines: {},
  dirty: {},
  listenersBound: false
};

function clonePlain(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function setUnsavedBaseline(context, snapshot) {
  unsavedState.baselines[context] = snapshot;
  delete unsavedState.dirty[context];
}

function updateUnsavedContext(context, snapshot) {
  if (!(context in unsavedState.baselines)) {
    setUnsavedBaseline(context, snapshot);
    return;
  }
  if (unsavedState.baselines[context] === snapshot) {
    delete unsavedState.dirty[context];
    return;
  }
  unsavedState.dirty[context] = true;
}

function clearUnsavedContext(context) {
  delete unsavedState.baselines[context];
  delete unsavedState.dirty[context];
}

function hasUnsavedChanges(context) {
  if (context) return !!unsavedState.dirty[context];
  return Object.keys(unsavedState.dirty).some(function(key) { return !!unsavedState.dirty[key]; });
}

function confirmDiscardUnsavedChanges() {
  if (!hasUnsavedChanges()) return true;
  return window.confirm(UNSAVED_CHANGES_MESSAGE);
}

function getCurrentPageName() {
  const active = document.querySelector('.page-section.active');
  return active ? String(active.id || '').replace(/^page-/, '') : '';
}

function getUnsavedContextForPage(pageName) {
  if (pageName === 'expense-form') return 'expenseForm';
  if (pageName === 'income-form') return 'incomeForm';
  if (pageName === 'budget') return 'budget';
  if (pageName === 'members') return 'memberOrder';
  return '';
}

function getUnsavedContextForModal(modalId) {
  if (modalId === 'memberFormModal') return 'memberForm';
  if (modalId === 'subjectFormModal') return 'subjectForm';
  return '';
}

function getOpenDirtyModalId() {
  if (els.memberFormModal && !els.memberFormModal.classList.contains('hidden') && hasUnsavedChanges('memberForm')) return 'memberFormModal';
  if (els.subjectFormModal && !els.subjectFormModal.classList.contains('hidden') && hasUnsavedChanges('subjectForm')) return 'subjectFormModal';
  return '';
}

function getExpenseFormSnapshot() {
  return JSON.stringify({
    mode: state.expenseForm.mode,
    voucherNo: state.expenseForm.voucherNo,
    fiscalYear: els.formFiscalYear.value,
    expenseDate: els.formExpenseDate.value,
    subjectCode: els.formSubjectSelect.value,
    summary: els.formSummary.value,
    payee: els.formPayee.value,
    amount: els.formAmount.value,
    travelControlNo: els.formRelatedTravelControlNo.value,
    note: els.formNote.value,
    removeEvidence: els.removeEvidenceCheckbox.checked,
    pendingEvidenceName: state.expenseForm.pendingEvidenceFile ? state.expenseForm.pendingEvidenceFile.name : '',
    pendingEvidenceSize: state.expenseForm.pendingEvidenceFile ? state.expenseForm.pendingEvidenceFile.size : 0,
    existingEvidenceId: state.expenseForm.existingEvidence ? (state.expenseForm.existingEvidence['DriveFileId'] || state.expenseForm.existingEvidence['DriveUrl'] || '') : ''
  });
}

function getIncomeFormSnapshot() {
  return JSON.stringify({
    mode: state.incomeForm.mode,
    voucherNo: state.incomeForm.voucherNo,
    fiscalYear: els.incomeFormFiscalYear.value,
    incomeDate: els.incomeFormDate.value,
    subjectCode: els.incomeFormSubjectSelect.value,
    summary: els.incomeFormSummary.value,
    payer: els.incomeFormPayer.value,
    amount: els.incomeFormAmount.value,
    note: els.incomeFormNote.value,
    removeEvidence: els.incomeRemoveEvidenceCheckbox.checked,
    pendingEvidenceName: state.incomeForm.pendingEvidenceFile ? state.incomeForm.pendingEvidenceFile.name : '',
    pendingEvidenceSize: state.incomeForm.pendingEvidenceFile ? state.incomeForm.pendingEvidenceFile.size : 0,
    existingEvidenceId: state.incomeForm.existingEvidence ? (state.incomeForm.existingEvidence['DriveFileId'] || state.incomeForm.existingEvidence['DriveUrl'] || '') : ''
  });
}

function getMemberFormSnapshot() {
  return JSON.stringify({
    mode: state.memberForm.mode,
    originalName: state.memberForm.originalName || '',
    name: els.memberFormName.value
  });
}

function getMemberOrderSnapshot() {
  return JSON.stringify((state.memberRows || []).map(function(row) { return row.name || ''; }));
}

function getSubjectFormSnapshot() {
  return JSON.stringify({
    mode: state.subjectForm.mode,
    subjectCode: state.subjectForm.subjectCode || '',
    codeValue: els.subjectFormCode.value,
    name: els.subjectFormName.value,
    type: els.subjectFormType.value,
    sortOrder: els.subjectFormSortOrder.value,
    note: els.subjectFormNote.value,
    enabled: els.subjectFormEnabled.checked
  });
}

function getBudgetSnapshot() {
  return JSON.stringify({
    fiscalYear: els.budgetFiscalYear.value,
    rows: (state.budgetRows || []).map(function(row) {
      return {
        type: row.type || '',
        subjectCode: row.subjectCode || '',
        initialBudget: Number(row.initialBudget || 0),
        note: row.note || ''
      };
    })
  });
}

function discardUnsavedChangesForContext(context) {
  if (context === 'expenseForm') {
    prepareExpenseForm(state.expenseForm.mode || 'create', clonePlain(state.expenseForm.initialSource) || {});
    return;
  }
  if (context === 'incomeForm') {
    prepareIncomeForm(state.incomeForm.mode || 'create', clonePlain(state.incomeForm.initialSource) || {});
    return;
  }
  if (context === 'memberForm') {
    if ((state.memberForm.mode || 'create') === 'edit') {
      openMemberEditModal(clonePlain(state.memberForm.initialMember) || { name: state.memberForm.originalName || '' });
    } else {
      openMemberCreateModal();
    }
    return;
  }
  if (context === 'memberOrder') {
    state.memberRows = clonePlain(state.memberOrderInitialRows) || [];
    renderMemberTable();
    setUnsavedBaseline('memberOrder', getMemberOrderSnapshot());
    return;
  }
  if (context === 'subjectForm') {
    if ((state.subjectForm.mode || 'create') === 'edit') {
      openSubjectEditModal(clonePlain(state.subjectForm.initialSubject) || {});
    } else {
      openSubjectCreateModal();
    }
    return;
  }
  if (context === 'budget') {
    state.budgetRows = clonePlain(state.budgetInitialRows) || [];
    state.budgetPreviousSummary = clonePlain(state.budgetInitialSummary) || { incomeTotal: 0, expenseTotal: 0, balance: 0 };
    renderBudgetTable();
    setUnsavedBaseline('budget', getBudgetSnapshot());
  }
}

function discardAllUnsavedChanges() {
  ['memberForm', 'subjectForm', 'expenseForm', 'incomeForm', 'budget', 'memberOrder'].forEach(function(context) {
    if (!hasUnsavedChanges(context)) return;
    discardUnsavedChangesForContext(context);
    clearUnsavedContext(context);
  });
}

function bindUnsavedChangeListeners() {
  if (unsavedState.listenersBound) return;
  unsavedState.listenersBound = true;

  [
    els.formFiscalYear, els.formExpenseDate, els.formSubjectSelect, els.formSummary, els.formPayee,
    els.formAmount, els.formRelatedTravelControlNo, els.formNote, els.formEvidenceFile, els.removeEvidenceCheckbox
  ].forEach(function(el) {
    if (!el) return;
    ['input', 'change'].forEach(function(eventName) {
      el.addEventListener(eventName, function() { updateUnsavedContext('expenseForm', getExpenseFormSnapshot()); });
    });
  });

  [
    els.incomeFormFiscalYear, els.incomeFormDate, els.incomeFormSubjectSelect, els.incomeFormSummary,
    els.incomeFormPayer, els.incomeFormAmount, els.incomeFormNote, els.incomeFormEvidenceFile, els.incomeRemoveEvidenceCheckbox
  ].forEach(function(el) {
    if (!el) return;
    ['input', 'change'].forEach(function(eventName) {
      el.addEventListener(eventName, function() { updateUnsavedContext('incomeForm', getIncomeFormSnapshot()); });
    });
  });

  [els.memberFormName].forEach(function(el) {
    if (!el) return;
    ['input', 'change'].forEach(function(eventName) {
      el.addEventListener(eventName, function() { updateUnsavedContext('memberForm', getMemberFormSnapshot()); });
    });
  });

  [els.subjectFormCode, els.subjectFormName, els.subjectFormType, els.subjectFormSortOrder, els.subjectFormNote, els.subjectFormEnabled].forEach(function(el) {
    if (!el) return;
    ['input', 'change'].forEach(function(eventName) {
      el.addEventListener(eventName, function() { updateUnsavedContext('subjectForm', getSubjectFormSnapshot()); });
    });
  });

  window.addEventListener('beforeunload', function(event) {
    if (!hasUnsavedChanges()) return;
    event.preventDefault();
    event.returnValue = '';
  });
}

function switchPage(pageName, options) {
  const opts = options || {};
  const currentPage = getCurrentPageName();
  if (!opts.force) {
    const modalId = getOpenDirtyModalId();
    if (modalId) {
      if (!confirmDiscardUnsavedChanges()) return false;
      closeModal(modalId, { force: true });
    }
    const currentContext = getUnsavedContextForPage(currentPage);
    if (currentPage && currentPage !== pageName && currentContext && hasUnsavedChanges(currentContext)) {
      if (!confirmDiscardUnsavedChanges()) return false;
      discardUnsavedChangesForContext(currentContext);
      clearUnsavedContext(currentContext);
    }
  }
  document.querySelectorAll('.page-section').forEach(function(section) {
    section.classList.toggle('active', section.id === `page-${pageName}`);
  });
  document.querySelectorAll('.side-nav-button[data-page]').forEach(function(button) {
    button.classList.toggle('active', button.dataset.page === pageName);
  });
  return true;
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id, options) {
  const opts = options || {};
  const context = getUnsavedContextForModal(id);
  if (!opts.force && context && hasUnsavedChanges(context)) {
    if (!confirmDiscardUnsavedChanges()) return false;
  }
  if (context) clearUnsavedContext(context);
  document.getElementById(id).classList.add('hidden');
  return true;
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
  if (hasUnsavedChanges() && !window.confirm(UNSAVED_CHANGES_MESSAGE)) return;
  discardAllUnsavedChanges();
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
  if (hasUnsavedChanges() && !window.confirm(UNSAVED_CHANGES_MESSAGE)) return;
  discardAllUnsavedChanges();
  saveCurrentUser(user);
  closeModal('switchUserModal');
  showToast(`現在ユーザーを ${user.name} さんに切り替えました`, 'success');
}


async function loadMemberMaster(options) {
  const opts = options || {};
  if (!state.currentUser) return showUserSelectScreen();
  if (!opts.force && hasUnsavedChanges('memberOrder')) {
    if (!window.confirm(UNSAVED_CHANGES_MESSAGE)) return;
    discardUnsavedChangesForContext('memberOrder');
    clearUnsavedContext('memberOrder');
  }
  showLoading('部員一覧を読み込んでいます...');
  try {
    const result = await apiGet('accounting/listMemberMaster', {});
    const rows = (result.users || []).map(function(user, index) {
      return Object.assign({}, user, { __sheetOrder: index + 1 });
    });
    state.memberRows = rows;
    state.memberOrderInitialRows = clonePlain(rows) || [];
    renderMemberTable();
    setUnsavedBaseline('memberOrder', getMemberOrderSnapshot());
    if (state.selectedMember) {
      const matched = state.memberRows.find(function(row) { return row.name === state.selectedMember.name; });
      matched ? renderMemberDetail(matched) : clearMemberDetail();
    } else {
      clearMemberDetail();
    }
  } catch (error) {
    state.memberRows = [];
    state.memberOrderInitialRows = [];
    renderMemberTable();
    clearMemberDetail();
    clearUnsavedContext('memberOrder');
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function getFilteredMemberRows() {
  const keyword = (els.memberKeyword.value || '').trim();
  return (state.memberRows || []).filter(function(user) {
    return !keyword || String(user.name || '').indexOf(keyword) !== -1;
  });
}

function canReorderMembers() {
  return !(els.memberKeyword.value || '').trim();
}

function updateMemberOrderUiState() {
  const canReorder = canReorderMembers();
  const hasRows = (state.memberRows || []).length > 1;
  const dirty = hasUnsavedChanges('memberOrder');
  if (els.saveMemberOrderButton) els.saveMemberOrderButton.disabled = !dirty || !canReorder || !hasRows;
  if (els.resetMemberOrderButton) els.resetMemberOrderButton.disabled = !dirty;
  if (!els.memberOrderStatus) return;
  if (!hasRows) {
    els.memberOrderStatus.textContent = '部員が1件以下のため並び替えは不要です。';
    return;
  }
  if (!canReorder) {
    els.memberOrderStatus.textContent = '検索中は並び替えできません。検索条件をクリアするとドラッグできます。';
    return;
  }
  if (dirty) {
    els.memberOrderStatus.textContent = '並び順を変更しました。「並び順を保存」でスプレッドシートへ反映できます。';
    return;
  }
  els.memberOrderStatus.textContent = 'ドラッグ＆ドロップで並び替えできます。保存するとスプレッドシートの順番も更新されます。';
}

function renderMemberTable() {
  const rows = getFilteredMemberRows();
  const reorderEnabled = canReorderMembers() && rows.length > 1;
  els.memberCountLabel.textContent = `${rows.length}件`;
  if (!rows.length) {
    els.memberTableBody.innerHTML = '<tr><td colspan="2" class="empty-cell">該当する部員がいません。</td></tr>';
    updateMemberOrderUiState();
    return;
  }
  const selectedName = state.selectedMember ? state.selectedMember.name : '';
  els.memberTableBody.innerHTML = rows.map(function(row) {
    const name = row.name || '';
    const selectedClass = name === selectedName ? ' selected-row' : '';
    const rowClass = reorderEnabled ? 'member-draggable-row' : '';
    const handleClass = reorderEnabled ? 'member-drag-handle' : 'member-drag-handle disabled';
    const handleText = reorderEnabled ? '↕' : '—';
    return `
      <tr class="${selectedClass} ${rowClass}" data-member-row="1" data-member-name="${escapeHtml(name)}" ${reorderEnabled ? 'draggable="true"' : ''}>
        <td class="member-sort-cell"><span class="${handleClass}" title="ドラッグして並び替え">${handleText}</span></td>
        <td><button type="button" class="table-row-button" data-member-name="${escapeHtml(name)}">${escapeHtml(name)}</button></td>
      </tr>
    `;
  }).join('');
  els.memberTableBody.querySelectorAll('[data-member-name]').forEach(function(button) {
    button.addEventListener('click', function() {
      const member = state.memberRows.find(function(row) { return row.name === button.dataset.memberName; });
      if (member) renderMemberDetail(member);
    });
  });
  bindMemberRowDragEvents(reorderEnabled);
  updateMemberOrderUiState();
}

function bindMemberRowDragEvents(enabled) {
  const rows = Array.from(els.memberTableBody.querySelectorAll('[data-member-row]'));
  if (!enabled) return;
  rows.forEach(function(row) {
    row.addEventListener('dragstart', function(event) {
      row.classList.add('dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', row.dataset.memberName || '');
    });
    row.addEventListener('dragend', function() {
      row.classList.remove('dragging');
      rows.forEach(function(item) {
        item.classList.remove('drag-over-top');
        item.classList.remove('drag-over-bottom');
      });
    });
    row.addEventListener('dragover', function(event) {
      event.preventDefault();
      const rect = row.getBoundingClientRect();
      const insertAfter = event.clientY >= rect.top + rect.height / 2;
      row.classList.toggle('drag-over-top', !insertAfter);
      row.classList.toggle('drag-over-bottom', insertAfter);
      event.dataTransfer.dropEffect = 'move';
    });
    row.addEventListener('dragleave', function() {
      row.classList.remove('drag-over-top');
      row.classList.remove('drag-over-bottom');
    });
    row.addEventListener('drop', function(event) {
      event.preventDefault();
      row.classList.remove('drag-over-top');
      row.classList.remove('drag-over-bottom');
      const sourceName = event.dataTransfer.getData('text/plain');
      const targetName = row.dataset.memberName || '';
      if (!sourceName || !targetName || sourceName === targetName) return;
      const rect = row.getBoundingClientRect();
      const insertAfter = event.clientY >= rect.top + rect.height / 2;
      moveMemberRow(sourceName, targetName, insertAfter);
    });
  });
}

function moveMemberRow(sourceName, targetName, insertAfter) {
  const rows = (state.memberRows || []).slice();
  const sourceIndex = rows.findIndex(function(row) { return row.name === sourceName; });
  const targetIndex = rows.findIndex(function(row) { return row.name === targetName; });
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;
  const moved = rows.splice(sourceIndex, 1)[0];
  const baseIndex = rows.findIndex(function(row) { return row.name === targetName; });
  const nextIndex = insertAfter ? baseIndex + 1 : baseIndex;
  rows.splice(nextIndex, 0, moved);
  state.memberRows = rows.map(function(row, index) {
    return Object.assign({}, row, { __sheetOrder: index + 1 });
  });
  updateUnsavedContext('memberOrder', getMemberOrderSnapshot());
  renderMemberTable();
}

async function reloadMemberMaster() {
  if (hasUnsavedChanges('memberOrder') && !window.confirm(UNSAVED_CHANGES_MESSAGE)) return;
  await loadUsers();
  await loadMemberMaster({ force: true });
}

async function saveMemberOrder() {
  if (!state.currentUser) return showToast('利用者を選択してください', 'error');
  if (!canReorderMembers()) return showToast('検索中は並び順を保存できません。検索条件をクリアしてください', 'error');
  if (!hasUnsavedChanges('memberOrder')) return showToast('保存が必要な並び替えはありません', 'success');
  showLoading('部員の並び順を保存しています...');
  try {
    await apiPost('member/reorderFromAccounting', {
      currentUser: state.currentUser,
      names: (state.memberRows || []).map(function(row) { return row.name || ''; }).filter(Boolean)
    });
    clearUnsavedContext('memberOrder');
    await loadUsers();
    await loadMemberMaster({ force: true });
    showToast('部員の並び順を保存しました', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function resetMemberOrder() {
  if (!hasUnsavedChanges('memberOrder')) {
    showToast('元に戻す並び替えはありません', 'success');
    return;
  }
  state.memberRows = clonePlain(state.memberOrderInitialRows) || [];
  clearUnsavedContext('memberOrder');
  renderMemberTable();
  setUnsavedBaseline('memberOrder', getMemberOrderSnapshot());
  if (state.selectedMember) {
    const matched = state.memberRows.find(function(row) { return row.name === state.selectedMember.name; });
    matched ? renderMemberDetail(matched) : clearMemberDetail();
  }
  showToast('部員一覧の並び順を元に戻しました', 'success');
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
  if (hasUnsavedChanges('memberOrder')) {
    showToast('部員の並び順変更を先に保存するか、元に戻してください', 'error');
    return;
  }
  state.memberForm = { mode: 'create', originalName: '', initialMember: null };
  els.memberFormModalTitle.textContent = '部員登録';
  els.memberFormName.value = '';
  openModal('memberFormModal');
  setUnsavedBaseline('memberForm', getMemberFormSnapshot());
}

function openMemberEditModal(member) {
  if (hasUnsavedChanges('memberOrder')) {
    showToast('部員の並び順変更を先に保存するか、元に戻してください', 'error');
    return;
  }
  state.memberForm = { mode: 'edit', originalName: member.name || '', initialMember: clonePlain(member) || null };
  els.memberFormModalTitle.textContent = `部員編集：${member.name || ''}`;
  els.memberFormName.value = member.name || '';
  openModal('memberFormModal');
  setUnsavedBaseline('memberForm', getMemberFormSnapshot());
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
    clearUnsavedContext('memberForm');
    closeModal('memberFormModal', { force: true });
    await loadUsers();
    await loadMemberMaster();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function deleteSelectedMember() {
  if (hasUnsavedChanges('memberOrder')) {
    showToast('部員の並び順変更を先に保存するか、元に戻してください', 'error');
    return;
  }
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
  state.subjectForm = { mode: 'create', subjectCode: '', initialSubject: null };
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
  setUnsavedBaseline('subjectForm', getSubjectFormSnapshot());
}

function openSubjectEditModal(subject) {
  state.subjectForm = { mode: 'edit', subjectCode: subject['科目コード'] || '', initialSubject: clonePlain(subject) || null };
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
  setUnsavedBaseline('subjectForm', getSubjectFormSnapshot());
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
    clearUnsavedContext('subjectForm');
    closeModal('subjectFormModal', { force: true });
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
  state.expenseForm.initialSource = clonePlain(source || {});
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
    setUnsavedBaseline('expenseForm', getExpenseFormSnapshot());
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
  setUnsavedBaseline('expenseForm', getExpenseFormSnapshot());
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
    clearUnsavedContext('expenseForm');
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
  state.incomeForm.initialSource = clonePlain(source || {});
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
    setUnsavedBaseline('incomeForm', getIncomeFormSnapshot());
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
  setUnsavedBaseline('incomeForm', getIncomeFormSnapshot());
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
    clearUnsavedContext('incomeForm');
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
  if (hasUnsavedChanges('expenseForm') && !window.confirm(UNSAVED_CHANGES_MESSAGE)) return;
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


function clearBudgetPdfResult() {
  if (state.budgetPdfBlobUrl) {
    URL.revokeObjectURL(state.budgetPdfBlobUrl);
    state.budgetPdfBlobUrl = '';
  }
  if (!els.budgetPdfResult) return;
  els.budgetPdfResult.classList.add('hidden');
  els.budgetPdfResult.innerHTML = '';
}

function createBlobUrlFromBase64(base64, mimeType) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: mimeType || 'application/pdf' }));
}

function triggerFileDownload(blobUrl, fileName) {
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName || 'budget.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function renderBudgetPdfResult(result) {
  if (!els.budgetPdfResult) return;
  clearBudgetPdfResult();
  state.budgetPdfBlobUrl = createBlobUrlFromBase64(result.pdfBase64, result.mimeType);
  els.budgetPdfResult.classList.remove('hidden');
  els.budgetPdfResult.innerHTML = `
    <div class="budget-pdf-result-title">予算書PDFを生成しました</div>
    <div class="budget-pdf-result-meta">ファイル名: ${escapeHtml(result.fileName || '')}${result.createdAt ? ` / 生成日時: ${escapeHtml(result.createdAt)}` : ''}</div>
    <div class="budget-pdf-result-links">
      <a href="${escapeAttribute(state.budgetPdfBlobUrl)}" target="_blank" rel="noopener noreferrer">PDFを開く</a>
      <a href="${escapeAttribute(state.budgetPdfBlobUrl)}" download="${escapeAttribute(result.fileName || 'budget.pdf')}">PDFをダウンロード</a>
    </div>
    <div class="budget-pdf-result-note">PDFは一時生成です。画面を閉じるか再読み込みするとリンクは無効になります。</div>
  `;
  triggerFileDownload(state.budgetPdfBlobUrl, result.fileName || 'budget.pdf');
}

async function generateBudgetPdf() {
  if (!state.currentUser) return showToast('利用者を選択してください', 'error');
  const fiscalYear = requireValue(els.budgetFiscalYear.value, '年度を選択してください');
  clearBudgetPdfResult();
  if (!window.confirm(`${fiscalYear}年度の予算書PDFを生成しますか？`)) return;
  showLoading('予算書PDFを生成しています...');
  try {
    const result = await apiPost('accounting/generateBudgetPdf', {
      currentUser: state.currentUser,
      fiscalYear: Number(fiscalYear)
    });
    renderBudgetPdfResult(result);
    showToast('予算書PDFを生成しました', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}


async function loadBudgetPage(options) {
  const opts = options || {};
  if (!state.currentUser) return showUserSelectScreen();
  if (!opts.force && getCurrentPageName() === 'budget' && hasUnsavedChanges('budget')) {
    if (!window.confirm(UNSAVED_CHANGES_MESSAGE)) return;
    clearUnsavedContext('budget');
  }
  clearBudgetPdfResult();
  showLoading('予算書を読み込んでいます...');
  try {
    const fiscalYear = Number(requireValue(els.budgetFiscalYear.value, '年度を選択してください'));
    const previousFiscalYear = fiscalYear - 1;
    const [expenseSubjectsResult, incomeSubjectsResult, currentBudgetResult, previousBudgetResult, currentExpenseResult, currentIncomeResult, previousExpenseResult, previousIncomeResult] = await Promise.all([
      apiGet('accounting/listSubjects', { type: '支出' }),
      apiGet('accounting/listSubjects', { type: '収入' }),
      apiGet('accounting/listBudgetRows', { fiscalYear: fiscalYear }),
      apiGet('accounting/listBudgetRows', { fiscalYear: previousFiscalYear }),
      apiGet('accounting/listExpenseVouchers', { fiscalYear: fiscalYear }),
      apiGet('accounting/listIncomeVouchers', { fiscalYear: fiscalYear }),
      apiGet('accounting/listExpenseVouchers', { fiscalYear: previousFiscalYear }),
      apiGet('accounting/listIncomeVouchers', { fiscalYear: previousFiscalYear })
    ]);

    const subjectSeedRows = [];
    (expenseSubjectsResult.subjects || []).forEach(function(row) { subjectSeedRows.push(row); });
    (incomeSubjectsResult.subjects || []).forEach(function(row) { subjectSeedRows.push(row); });

    const currentBudgetRows = currentBudgetResult.rows || [];
    const previousBudgetRows = previousBudgetResult.rows || [];
    const currentExpenses = currentExpenseResult.vouchers || [];
    const currentIncomes = currentIncomeResult.vouchers || [];
    const previousExpenses = previousExpenseResult.vouchers || [];
    const previousIncomes = previousIncomeResult.vouchers || [];

    const currentActualMap = {};
    currentExpenses.forEach(function(row) {
      const key = ['支出', row['科目コード'] || ''].join('|');
      currentActualMap[key] = Number(currentActualMap[key] || 0) + Number(row['支出金額'] || 0);
    });
    currentIncomes.forEach(function(row) {
      const key = ['収入', row['科目コード'] || ''].join('|');
      currentActualMap[key] = Number(currentActualMap[key] || 0) + Number(row['収入金額'] || 0);
    });

    const previousBudgetMap = {};
    previousBudgetRows.forEach(function(row) {
      const key = [row['収支区分'] || '', row['科目コード'] || ''].join('|');
      const initialBudget = Number(row['当初予算額'] || 0);
      const revisedBudget = Number(row['補正予算額'] || 0);
      const budgetTotal = Number(row['予算合計額'] || 0);
      const mergedBudget = initialBudget + revisedBudget;
      previousBudgetMap[key] = mergedBudget || budgetTotal || 0;
    });

    const previousSettlementMap = {};
    previousExpenses.forEach(function(row) {
      const key = ['支出', row['科目コード'] || ''].join('|');
      previousSettlementMap[key] = Number(previousSettlementMap[key] || 0) + Number(row['支出金額'] || 0);
    });
    previousIncomes.forEach(function(row) {
      const key = ['収入', row['科目コード'] || ''].join('|');
      previousSettlementMap[key] = Number(previousSettlementMap[key] || 0) + Number(row['収入金額'] || 0);
    });

    const rowMap = {};
    subjectSeedRows.forEach(function(row) {
      const key = [row['収支区分'] || '', row['科目コード'] || ''].join('|');
      rowMap[key] = {
        fiscalYear: fiscalYear,
        type: row['収支区分'] || '',
        subjectCode: row['科目コード'] || '',
        subjectName: row['科目名'] || '',
        initialBudget: 0,
        revisedBudget: 0,
        actualAmount: Number(currentActualMap[key] || 0),
        previousBudgetAmount: Number(previousBudgetMap[key] || 0),
        previousSettlementAmount: Number(previousSettlementMap[key] || 0),
        note: '',
        enabled: String(row['使用可否']) !== 'false',
        createdAt: row['登録日時'] || '',
        updatedAt: row['更新日時'] || ''
      };
    });

    currentBudgetRows.forEach(function(row) {
      const key = [row['収支区分'] || '', row['科目コード'] || ''].join('|');
      const current = rowMap[key] || {};
      rowMap[key] = Object.assign(current, {
        fiscalYear: fiscalYear,
        type: row['収支区分'] || current.type || '',
        subjectCode: row['科目コード'] || current.subjectCode || '',
        subjectName: row['科目名'] || current.subjectName || '',
        initialBudget: Number(row['当初予算額'] || row['予算合計額'] || 0),
        revisedBudget: 0,
        actualAmount: Number(currentActualMap[key] || row['実績額'] || 0),
        previousBudgetAmount: Number(previousBudgetMap[key] || 0),
        previousSettlementAmount: Number(previousSettlementMap[key] || 0),
        note: row['備考'] || '',
        createdAt: row['登録日時'] || current.createdAt || '',
        updatedAt: row['更新日時'] || current.updatedAt || ''
      });
    });

    Object.keys(currentActualMap).forEach(function(key) {
      if (rowMap[key]) return;
      const parts = key.split('|');
      rowMap[key] = {
        fiscalYear: fiscalYear,
        type: parts[0] || '',
        subjectCode: parts[1] || '',
        subjectName: '',
        initialBudget: 0,
        revisedBudget: 0,
        actualAmount: Number(currentActualMap[key] || 0),
        previousBudgetAmount: Number(previousBudgetMap[key] || 0),
        previousSettlementAmount: Number(previousSettlementMap[key] || 0),
        note: ''
      };
    });

    Object.keys(previousBudgetMap).concat(Object.keys(previousSettlementMap)).forEach(function(key) {
      if (rowMap[key]) return;
      const parts = key.split('|');
      rowMap[key] = {
        fiscalYear: fiscalYear,
        type: parts[0] || '',
        subjectCode: parts[1] || '',
        subjectName: '',
        initialBudget: 0,
        revisedBudget: 0,
        actualAmount: Number(currentActualMap[key] || 0),
        previousBudgetAmount: Number(previousBudgetMap[key] || 0),
        previousSettlementAmount: Number(previousSettlementMap[key] || 0),
        note: ''
      };
    });

    state.budgetRows = Object.values(rowMap).filter(function(row) {
      return row.subjectCode || row.subjectName;
    }).sort(function(a, b) {
      const typeComp = String(a.type || '').localeCompare(String(b.type || ''), 'ja');
      if (typeComp !== 0) return typeComp;
      return String(a.subjectCode || '').localeCompare(String(b.subjectCode || ''), 'ja');
    });

    const previousIncomeTotal = previousIncomes.reduce(function(sum, row) { return sum + Number(row['収入金額'] || 0); }, 0);
    const previousExpenseTotal = previousExpenses.reduce(function(sum, row) { return sum + Number(row['支出金額'] || 0); }, 0);
    state.budgetPreviousSummary = {
      incomeTotal: previousIncomeTotal,
      expenseTotal: previousExpenseTotal,
      balance: previousIncomeTotal - previousExpenseTotal
    };

    els.budgetFiscalYear.dataset.loadedValue = String(fiscalYear);
    state.budgetInitialRows = clonePlain(state.budgetRows) || [];
    state.budgetInitialSummary = clonePlain(state.budgetPreviousSummary) || { incomeTotal: 0, expenseTotal: 0, balance: 0 };
    renderBudgetTable();
    setUnsavedBaseline('budget', getBudgetSnapshot());
  } catch (error) {
    state.budgetRows = [];
    state.budgetPreviousSummary = { incomeTotal: 0, expenseTotal: 0, balance: 0 };
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
    els.budgetTableBody.innerHTML = '<tr><td colspan="7" class="empty-cell">該当する予算データがありません。</td></tr>';
    updateBudgetSummary();
    return;
  }
  els.budgetTableBody.innerHTML = rows.map(function(row, index) {
    const typeChipClass = row.type === '収入' ? 'income' : 'expense';
    return `
      <tr data-budget-key="${escapeHtml([row.type, row.subjectCode].join('|'))}">
        <td><span class="budget-type-chip ${typeChipClass}">${escapeHtml(row.type || '-')}</span></td>
        <td>${escapeHtml(row.subjectCode || '')}</td>
        <td>${escapeHtml(row.subjectName || '')}</td>
        <td><input class="budget-input text-right" type="number" min="0" step="1" data-budget-field="initialBudget" data-budget-index="${index}" value="${escapeAttribute(String(Number(row.initialBudget || 0)))}" /></td>
        <td class="text-right">${escapeHtml(formatNumber(row.previousBudgetAmount || 0))}</td>
        <td class="text-right">${escapeHtml(formatNumber(row.previousSettlementAmount || 0))}</td>
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
      }
      updateUnsavedContext('budget', getBudgetSnapshot());
    });
  });
  updateBudgetSummary();
}

function updateBudgetSummary() {
  const summary = state.budgetPreviousSummary || { incomeTotal: 0, expenseTotal: 0, balance: 0 };
  els.budgetTotalAmount.textContent = formatCurrency(summary.incomeTotal || 0);
  els.budgetActualAmount.textContent = formatCurrency(summary.expenseTotal || 0);
  els.budgetDiffAmount.textContent = formatCurrency(summary.balance || 0);
}

async function saveBudgetRows() {
  if (!state.currentUser) return showToast('利用者を選択してください', 'error');
  const fiscalYear = requireValue(els.budgetFiscalYear.value, '年度を選択してください');
  const rows = (state.budgetRows || []).map(function(row) {
    return {
      type: row.type,
      subjectCode: row.subjectCode,
      subjectName: row.subjectName,
      initialBudget: Number(row.initialBudget || 0),
      revisedBudget: 0,
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
    clearUnsavedContext('budget');
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


/* === Fiscal year / settlement enhancement override block === */
storageKeys.currentFiscalYear = 'accountingCurrentFiscalYear';
state.currentFiscalYear = state.currentFiscalYear || null;
state.settlementRows = state.settlementRows || [];
state.settlementPdfBlobUrl = state.settlementPdfBlobUrl || '';

function cacheEnhancedEls_() {
  Object.assign(els, {
    startupFiscalYear: document.getElementById('startupFiscalYear'),
    startupYearStatus: document.getElementById('startupYearStatus'),
    currentFiscalYearLabel: document.getElementById('currentFiscalYearLabel'),
    switchFiscalYearButton: document.getElementById('switchFiscalYearButton'),
    subjectFiscalYear: document.getElementById('subjectFiscalYear'),
    settlementFiscalYear: document.getElementById('settlementFiscalYear'),
    refreshSettlementButton: document.getElementById('refreshSettlementButton'),
    exportSettlementPdfButton: document.getElementById('exportSettlementPdfButton'),
    settlementIncomeTotal: document.getElementById('settlementIncomeTotal'),
    settlementExpenseTotal: document.getElementById('settlementExpenseTotal'),
    settlementBalanceTotal: document.getElementById('settlementBalanceTotal'),
    settlementCountLabel: document.getElementById('settlementCountLabel'),
    settlementTableBody: document.getElementById('settlementTableBody'),
    settlementPdfResult: document.getElementById('settlementPdfResult'),
    switchYearModal: document.getElementById('switchYearModal'),
    switchYearList: document.getElementById('switchYearList')
  });
}

function ensureEnhancedLayout_() {
  ensureStartupFiscalYearUi_();
  ensureHeaderFiscalYearUi_();
  ensureSettlementNav_();
  ensureSubjectsFiscalYearUi_();
  ensureSettlementPage_();
  ensureSwitchYearModal_();
  cacheEnhancedEls_();
}

function ensureStartupFiscalYearUi_() {
  const card = document.querySelector('#userSelectScreen .startup-card');
  if (!card || document.getElementById('startupFiscalYear')) return;
  const statusHtml = '<div id="startupYearStatus" class="fiscal-year-badge fiscal-status-current">年度未選択</div>';
  const toolbar = card.querySelector('.user-select-toolbar');
  const html = `
    <div class="year-entry-row">
      <label class="field compact-field required-field">
        <span>開始年度</span>
        <select id="startupFiscalYear" required></select>
      </label>
      <div>${statusHtml}</div>
    </div>
    <div class="inline-note year-help-note">宍粟市野球部の年度は 10月開始 / 9月終了です。例：2026年10月〜2027年9月は 2026年度（令和8年度）として扱います。</div>
  `;
  toolbar.insertAdjacentHTML('afterend', html);
}

function ensureHeaderFiscalYearUi_() {
  const headerActions = document.querySelector('.header-actions');
  if (!headerActions || document.getElementById('currentFiscalYearLabel')) return;
  const currentUserBox = headerActions.querySelector('.current-user-box');
  if (currentUserBox) {
    currentUserBox.insertAdjacentHTML('afterend', `
      <div class="current-user-box fiscal-year-box">
        <span class="label">現在年度</span>
        <strong id="currentFiscalYearLabel" class="fiscal-year-badge fiscal-status-current">-</strong>
      </div>
    `);
  }
  const switchUserButton = document.getElementById('switchUserButton');
  if (switchUserButton && !document.getElementById('switchFiscalYearButton')) {
    switchUserButton.insertAdjacentHTML('afterend', '<button id="switchFiscalYearButton" class="button secondary" type="button">年度切替</button>');
  }
}

function ensureSettlementNav_() {
  const nav = document.querySelector('.side-nav');
  if (!nav || nav.querySelector('[data-page="settlement"]')) return;
  const budgetButton = nav.querySelector('[data-page="budget"]');
  const html = '<button class="side-nav-button" data-page="settlement" type="button">決算書</button>';
  if (budgetButton) {
    budgetButton.insertAdjacentHTML('afterend', html);
  } else {
    nav.insertAdjacentHTML('beforeend', html);
  }
}

function ensureSubjectsFiscalYearUi_() {
  const actions = document.querySelector('#page-subjects .page-actions');
  if (!actions || document.getElementById('subjectFiscalYear')) return;
  const first = actions.querySelector('.field');
  const html = `
    <label class="field compact-field required-field">
      <span>対象年度</span>
      <select id="subjectFiscalYear" required></select>
    </label>
  `;
  if (first) first.insertAdjacentHTML('beforebegin', html);
  const desc = document.querySelector('#page-subjects .page-description');
  if (desc && !document.querySelector('.subject-page-note')) {
    desc.insertAdjacentHTML('afterend', '<div class="inline-note subject-page-note">科目マスタは共通管理しつつ、年度ごとに使用可否・表示順・備考を切り替えます。</div>');
  }
}

function ensureSettlementPage_() {
  const contentArea = document.querySelector('.content-area');
  if (!contentArea || document.getElementById('page-settlement')) return;
  const budgetSection = document.getElementById('page-budget');
  const html = `
    <section id="page-settlement" class="page-section">
      <div class="page-head">
        <div>
          <h2 class="page-title">決算書</h2>
          <p class="page-description">年度ごとの収支実績を科目別に確認し、最終PDFを出力します。</p>
          <div class="inline-note settlement-note">PDFはご提示いただいた一般会計決算書レイアウトに寄せて、収入の部 / 支出の部 / 差引額を出力します。</div>
        </div>
        <div class="page-actions wrap-actions">
          <label class="field compact-field required-field">
            <span>年度</span>
            <select id="settlementFiscalYear" required></select>
          </label>
          <button id="refreshSettlementButton" class="button secondary" type="button">更新</button>
          <button id="exportSettlementPdfButton" class="button primary" type="button">PDF出力</button>
        </div>
      </div>

      <div class="summary-grid">
        <article class="summary-card settlement-income">
          <div class="summary-label">収入合計</div>
          <div id="settlementIncomeTotal" class="summary-value">0 円</div>
        </article>
        <article class="summary-card settlement-expense">
          <div class="summary-label">支出合計</div>
          <div id="settlementExpenseTotal" class="summary-value">0 円</div>
        </article>
        <article class="summary-card settlement-balance">
          <div class="summary-label">差引額</div>
          <div id="settlementBalanceTotal" class="summary-value">0 円</div>
        </article>
      </div>

      <div id="settlementPdfResult" class="card pdf-result-card hidden"></div>

      <div class="card table-card">
        <div class="card-title-row">
          <div>
            <div class="card-title">決算明細</div>
            <div class="inline-note">年度で有効な科目を優先表示し、予算額・決算額・差額・備考を確認できます。</div>
          </div>
          <div id="settlementCountLabel" class="inline-note">0件</div>
        </div>
        <div class="table-wrap settlement-table-wrap">
          <table class="settlement-table">
            <thead>
              <tr>
                <th>収支区分</th>
                <th>科目コード</th>
                <th>科目名</th>
                <th class="text-right">予算額</th>
                <th class="text-right">決算額</th>
                <th class="text-right">差額</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody id="settlementTableBody">
              <tr><td colspan="7" class="empty-cell">データを読み込んでください</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
  if (budgetSection) {
    budgetSection.insertAdjacentHTML('afterend', html);
  } else {
    contentArea.insertAdjacentHTML('beforeend', html);
  }
}

function ensureSwitchYearModal_() {
  if (document.getElementById('switchYearModal')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div id="switchYearModal" class="modal hidden">
      <div class="modal-backdrop" data-close-modal="switchYearModal"></div>
      <div class="modal-dialog">
        <div class="modal-header">
          <h3>年度切替</h3>
          <button class="icon-button" type="button" data-close-modal="switchYearModal">×</button>
        </div>
        <div class="modal-body">
          <p class="inline-note modal-note">青系 = 今年度 / オレンジ系 = 過年度 / グリーン系 = 未来年度</p>
          <div id="switchYearList" class="year-option-list"></div>
        </div>
      </div>
    </div>
  `);
}

function getFiscalYearFromDate(date) {
  const target = date instanceof Date ? date : new Date(date);
  const year = target.getFullYear();
  const month = target.getMonth() + 1;
  return month >= 10 ? year : year - 1;
}

function getCurrentFiscalYear_() {
  return getFiscalYearFromDate(new Date());
}

function toJapaneseEraFiscalYearLabel_(year) {
  const n = Number(year);
  if (!n) return `${year}年度`;
  if (n >= 2019) return `令和${n - 2018}年度`;
  if (n >= 1989) return `平成${n - 1988}年度`;
  return `${n}年度`;
}

function formatFiscalYearDisplay_(year) {
  const n = Number(year);
  if (!n) return '-';
  return `${n}年度（${toJapaneseEraFiscalYearLabel_(n)}）`;
}

function getFiscalYearStatus_(year) {
  const current = getCurrentFiscalYear_();
  const n = Number(year);
  if (!n) return 'current';
  if (n === current) return 'current';
  if (n < current) return 'past';
  return 'future';
}

function getFiscalYearStatusText_(status) {
  if (status === 'past') return '過年度';
  if (status === 'future') return '未来年度';
  return '今年度';
}

function getManagedFiscalYearSelects_() {
  return [
    els.startupFiscalYear,
    els.homeFiscalYear,
    els.expenseFiscalYear,
    els.formFiscalYear,
    els.travelTransferFiscalYear,
    els.incomeFiscalYear,
    els.incomeFormFiscalYear,
    els.budgetFiscalYear,
    els.subjectFiscalYear,
    els.settlementFiscalYear
  ].filter(Boolean);
}

function restoreCurrentFiscalYear() {
  try {
    const saved = Number(localStorage.getItem(storageKeys.currentFiscalYear) || '');
    state.currentFiscalYear = Number.isFinite(saved) && saved > 0 ? saved : getCurrentFiscalYear_();
  } catch (error) {
    console.warn(error);
    state.currentFiscalYear = getCurrentFiscalYear_();
  }
}

function saveCurrentFiscalYear(year) {
  const numericYear = Number(year);
  state.currentFiscalYear = numericYear || getCurrentFiscalYear_();
  try {
    localStorage.setItem(storageKeys.currentFiscalYear, String(state.currentFiscalYear));
  } catch (error) {
    console.warn(error);
  }
  applyFiscalYearUi_();
}

function populateFiscalYearOptions() {
  const currentYear = state.currentFiscalYear || getCurrentFiscalYear_();
  const years = [];
  for (let i = currentYear - 3; i <= currentYear + 2; i += 1) years.push(i);
  getManagedFiscalYearSelects_().forEach(function(select) {
    const currentValue = Number(select.value || currentYear);
    select.innerHTML = years.map(function(year) {
      const selected = year === currentValue || year === currentYear ? ' selected' : '';
      return `<option value="${year}"${selected}>${formatFiscalYearDisplay_(year)}</option>`;
    }).join('');
  });
  applyFiscalYearUi_();
}

function applyFiscalYearUi_() {
  const fiscalYear = Number(state.currentFiscalYear || getCurrentFiscalYear_());
  const status = getFiscalYearStatus_(fiscalYear);
  const className = `fiscal-year-badge fiscal-status-${status}`;
  document.body.classList.remove('fiscal-theme-current', 'fiscal-theme-past', 'fiscal-theme-future');
  document.body.classList.add(`fiscal-theme-${status}`);
  getManagedFiscalYearSelects_().forEach(function(select) {
    select.value = String(fiscalYear);
    select.classList.remove('fiscal-status-select-current', 'fiscal-status-select-past', 'fiscal-status-select-future');
    select.classList.add(`fiscal-status-select-${status}`);
  });
  if (els.currentFiscalYearLabel) {
    els.currentFiscalYearLabel.className = className;
    els.currentFiscalYearLabel.textContent = formatFiscalYearDisplay_(fiscalYear);
  }
  if (els.startupYearStatus) {
    els.startupYearStatus.className = className;
    els.startupYearStatus.textContent = `${formatFiscalYearDisplay_(fiscalYear)} / ${getFiscalYearStatusText_(status)}`;
  }
}

function updateCurrentUserDisplay() {
  if (els.currentUserName) {
    els.currentUserName.textContent = state.currentUser ? state.currentUser.name : '未選択';
  }
  applyFiscalYearUi_();
}

function showUserSelectScreen() {
  if (els.userSelectScreen) els.userSelectScreen.classList.remove('hidden');
  if (els.appShell) els.appShell.classList.add('hidden');
  applyFiscalYearUi_();
}

function showAppShell() {
  if (els.userSelectScreen) els.userSelectScreen.classList.add('hidden');
  if (els.appShell) els.appShell.classList.remove('hidden');
  applyFiscalYearUi_();
}

function bindFiscalYearChange_(select) {
  if (!select) return;
  select.addEventListener('change', function() {
    const nextYear = Number(select.value || getCurrentFiscalYear_());
    if (nextYear === Number(state.currentFiscalYear || 0)) {
      applyFiscalYearUi_();
      return;
    }
    if (hasUnsavedChanges() && !window.confirm(UNSAVED_CHANGES_MESSAGE)) {
      select.value = String(state.currentFiscalYear || getCurrentFiscalYear_());
      applyFiscalYearUi_();
      return;
    }
    if (typeof discardAllUnsavedChanges === 'function') discardAllUnsavedChanges();
    saveCurrentFiscalYear(nextYear);
    refreshPageForFiscalYearChange_();
  });
}

async function refreshPageForFiscalYearChange_() {
  if (!state.currentUser) return;
  try {
    await loadSubjects();
    const page = getCurrentPageName();
    if (page === 'home') return await loadHomeSummary();
    if (page === 'expenses') return await loadExpenseList();
    if (page === 'incomes') return await loadIncomeList();
    if (page === 'budget') return await loadBudgetPage({ force: true });
    if (page === 'subjects') return await loadSubjectMaster();
    if (page === 'settlement') return await loadSettlementPage();
    if (page === 'expense-form' && state.expenseForm.mode !== 'edit') return prepareExpenseForm('create');
    if (page === 'income-form' && state.incomeForm.mode !== 'edit') return prepareIncomeForm('create');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function renderYearSwitchList_() {
  if (!els.switchYearList) return;
  const baseYear = Number(state.currentFiscalYear || getCurrentFiscalYear_());
  const years = [];
  for (let i = baseYear - 3; i <= baseYear + 2; i += 1) years.push(i);
  els.switchYearList.innerHTML = years.map(function(year) {
    const status = getFiscalYearStatus_(year);
    return `
      <button type="button" class="year-option-card fiscal-status-${status}" data-switch-year="${year}">
        <strong>${escapeHtml(formatFiscalYearDisplay_(year))}</strong>
        <div class="sub">${escapeHtml(getFiscalYearStatusText_(status))} / 10月開始〜翌9月終了</div>
      </button>
    `;
  }).join('');
  els.switchYearList.querySelectorAll('[data-switch-year]').forEach(function(button) {
    button.addEventListener('click', async function() {
      const nextYear = Number(button.dataset.switchYear || 0);
      if (nextYear === Number(state.currentFiscalYear || 0)) {
        closeModal('switchYearModal', { force: true });
        return;
      }
      if (hasUnsavedChanges() && !window.confirm(UNSAVED_CHANGES_MESSAGE)) return;
      if (typeof discardAllUnsavedChanges === 'function') discardAllUnsavedChanges();
      saveCurrentFiscalYear(nextYear);
      closeModal('switchYearModal', { force: true });
      await refreshPageForFiscalYearChange_();
      showToast(`表示年度を ${formatFiscalYearDisplay_(nextYear)} に切り替えました`, 'success');
    });
  });
}

function openSwitchYearModal() {
  renderYearSwitchList_();
  openModal('switchYearModal');
}

async function selectUserAndEnter(user) {
  if (hasUnsavedChanges() && !window.confirm(UNSAVED_CHANGES_MESSAGE)) return;
  if (typeof discardAllUnsavedChanges === 'function') discardAllUnsavedChanges();
  saveCurrentUser(user);
  saveCurrentFiscalYear(Number((els.startupFiscalYear && els.startupFiscalYear.value) || state.currentFiscalYear || getCurrentFiscalYear_()));
  showAppShell();
  await loadSubjects();
  prepareExpenseForm('create');
  prepareIncomeForm('create');
  switchPage('home');
  showToast(`${user.name} さんで ${formatFiscalYearDisplay_(state.currentFiscalYear)} を開始しました`, 'success');
  await loadHomeSummary();
}

async function switchCurrentUser(user) {
  if (hasUnsavedChanges() && !window.confirm(UNSAVED_CHANGES_MESSAGE)) return;
  if (typeof discardAllUnsavedChanges === 'function') discardAllUnsavedChanges();
  saveCurrentUser(user);
  closeModal('switchUserModal');
  showToast(`現在ユーザーを ${user.name} さんに切り替えました`, 'success');
}

function bindEvents() {
  const on = function(el, eventName, handler) { if (el) el.addEventListener(eventName, handler); };

  on(els.reloadUsersButton, 'click', function() { loadUsers(); });
  on(els.userSearchInput, 'input', function() {
    renderUserList(els.userList, state.users, els.userSearchInput.value, selectUserAndEnter);
  });
  on(els.switchUserSearchInput, 'input', function() {
    renderUserList(els.switchUserList, state.users, els.switchUserSearchInput.value, switchCurrentUser);
  });
  on(els.switchUserButton, 'click', openSwitchUserModal);
  on(els.openSwitchUserFromHome, 'click', openSwitchUserModal);
  on(els.switchFiscalYearButton, 'click', openSwitchYearModal);
  on(els.refreshHomeButton, 'click', function() { loadHomeSummary(); });

  on(els.goExpensesButton, 'click', function() { if (switchPage('expenses')) loadExpenseList(); });
  on(els.goExpenseCreateButton, 'click', openExpenseCreateForm);
  on(els.goIncomesButton, 'click', function() { if (switchPage('incomes')) loadIncomeList(); });
  on(els.goIncomeCreateButton, 'click', openIncomeCreateForm);
  on(els.openTravelTransferFromHome, 'click', function() { openTravelTransferModal(); });

  on(els.searchExpensesButton, 'click', function() { loadExpenseList(); });
  on(els.expenseKeyword, 'keydown', function(event) { if (event.key === 'Enter') { event.preventDefault(); loadExpenseList(); } });
  on(els.openExpenseCreateButton, 'click', openExpenseCreateForm);
  on(els.openTravelTransferButton, 'click', function() { openTravelTransferModal(); });
  on(els.editExpenseButton, 'click', function() {
    if (!state.selectedExpense || !state.selectedExpense.voucher) return;
    openExpenseEditForm(state.selectedExpense.voucher, state.selectedExpense.evidence || null);
  });
  on(els.deleteExpenseButton, 'click', deleteSelectedExpense);
  on(els.backToExpenseListButton, 'click', function() { if (switchPage('expenses')) loadExpenseList(); });
  on(els.resetExpenseFormButton, 'click', function() {
    if (state.expenseForm.mode === 'edit' && state.selectedExpense && state.selectedExpense.voucher) {
      openExpenseEditForm(state.selectedExpense.voucher, state.selectedExpense.evidence || null);
      return;
    }
    prepareExpenseForm('create');
    showToast('入力内容をリセットしました', 'success');
  });
  on(els.openTravelTransferFromForm, 'click', function() { openTravelTransferModal(); });
  on(els.saveExpenseButton, 'click', function() { saveExpense(false); });
  on(els.saveExpenseButtonBottom, 'click', function() { saveExpense(false); });
  on(els.formEvidenceFile, 'change', onExpenseEvidenceFileChange);
  on(els.removeEvidenceCheckbox, 'change', renderExpenseFormEvidenceInfo);

  on(els.searchIncomesButton, 'click', function() { loadIncomeList(); });
  on(els.incomeKeyword, 'keydown', function(event) { if (event.key === 'Enter') { event.preventDefault(); loadIncomeList(); } });
  on(els.openIncomeCreateButton, 'click', openIncomeCreateForm);
  on(els.editIncomeButton, 'click', function() {
    if (!state.selectedIncome || !state.selectedIncome.voucher) return;
    openIncomeEditForm(state.selectedIncome.voucher, state.selectedIncome.evidence || null);
  });
  on(els.deleteIncomeButton, 'click', deleteSelectedIncome);
  on(els.backToIncomeListButton, 'click', function() { if (switchPage('incomes')) loadIncomeList(); });
  on(els.resetIncomeFormButton, 'click', function() {
    if (state.incomeForm.mode === 'edit' && state.selectedIncome && state.selectedIncome.voucher) {
      openIncomeEditForm(state.selectedIncome.voucher, state.selectedIncome.evidence || null);
      return;
    }
    prepareIncomeForm('create');
    showToast('入力内容をリセットしました', 'success');
  });
  on(els.saveIncomeButton, 'click', function() { saveIncome(false); });
  on(els.saveIncomeButtonBottom, 'click', function() { saveIncome(false); });
  on(els.incomeFormEvidenceFile, 'change', onIncomeEvidenceFileChange);
  on(els.incomeRemoveEvidenceCheckbox, 'change', renderIncomeFormEvidenceInfo);

  on(els.searchMembersButton, 'click', renderMemberTable);
  on(els.reloadMembersButton, 'click', reloadMemberMaster);
  on(els.saveMemberOrderButton, 'click', saveMemberOrder);
  on(els.resetMemberOrderButton, 'click', resetMemberOrder);
  on(els.memberKeyword, 'keydown', function(event) { if (event.key === 'Enter') { event.preventDefault(); renderMemberTable(); } });
  on(els.openMemberCreateButton, 'click', openMemberCreateModal);
  on(els.editMemberButton, 'click', function() { if (state.selectedMember) openMemberEditModal(state.selectedMember); });
  on(els.deleteMemberButton, 'click', deleteSelectedMember);
  on(els.memberFormSaveButton, 'click', saveMember);

  on(els.searchSubjectsButton, 'click', function() { loadSubjectMaster(); });
  on(els.reloadSubjectsButton, 'click', function() { loadSubjectMaster(); });
  on(els.subjectTypeFilter, 'change', function() { loadSubjectMaster(); });
  on(els.subjectKeyword, 'keydown', function(event) { if (event.key === 'Enter') { event.preventDefault(); loadSubjectMaster(); } });
  on(els.openSubjectCreateButton, 'click', openSubjectCreateModal);
  on(els.editSubjectButton, 'click', function() { if (state.selectedSubject) openSubjectEditModal(state.selectedSubject); });
  on(els.deleteSubjectButton, 'click', deleteSelectedSubject);
  on(els.subjectFormSaveButton, 'click', saveSubject);

  on(els.reloadBudgetButton, 'click', function() { loadBudgetPage(); });
  on(els.budgetTypeFilter, 'change', function() { renderBudgetTable(); });
  on(els.exportBudgetPdfButton, 'click', generateBudgetPdf);
  on(els.saveBudgetButton, 'click', saveBudgetRows);

  on(els.refreshSettlementButton, 'click', loadSettlementPage);
  on(els.exportSettlementPdfButton, 'click', generateSettlementPdf);

  on(els.searchTravelTransferButton, 'click', function() { loadTravelTransferList(); });
  on(els.travelTransferKeyword, 'keydown', function(event) { if (event.key === 'Enter') { event.preventDefault(); loadTravelTransferList(); } });

  getManagedFiscalYearSelects_().forEach(bindFiscalYearChange_);

  document.querySelectorAll('.side-nav-button[data-page]').forEach(function(button) {
    button.addEventListener('click', function() {
      const page = button.dataset.page;
      if (!switchPage(page)) return;
      if (page === 'home') loadHomeSummary();
      if (page === 'expenses') loadExpenseList();
      if (page === 'expense-form' && !state.expenseForm.voucherNo && state.expenseForm.mode !== 'edit') prepareExpenseForm('create');
      if (page === 'incomes') loadIncomeList();
      if (page === 'income-form' && !state.incomeForm.voucherNo && state.incomeForm.mode !== 'edit') prepareIncomeForm('create');
      if (page === 'members') loadMemberMaster();
      if (page === 'subjects') loadSubjectMaster();
      if (page === 'budget') loadBudgetPage();
      if (page === 'settlement') loadSettlementPage();
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(function(button) {
    button.addEventListener('click', function() { closeModal(button.dataset.closeModal); });
  });
}

async function init() {
  ensureEnhancedLayout_();
  cacheEnhancedEls_();
  bindEvents();
  bindUnsavedChangeListeners();
  restoreCurrentFiscalYear();
  populateFiscalYearOptions();
  restoreCurrentUser();
  await loadUsers();

  if (state.currentUser) {
    showAppShell();
    await loadSubjects();
    prepareExpenseForm('create');
    prepareIncomeForm('create');
    if (els.budgetTypeFilter) els.budgetTypeFilter.value = '';
    switchPage('home', { force: true });
    await loadHomeSummary();
  } else {
    showUserSelectScreen();
  }
}

async function loadSubjects() {
  showLoading('科目一覧を読み込んでいます...');
  try {
    const fiscalYear = Number(state.currentFiscalYear || getCurrentFiscalYear_());
    const [expenseResult, incomeResult] = await Promise.all([
      apiGet('accounting/listSubjects', { type: '支出', fiscalYear: fiscalYear }),
      apiGet('accounting/listSubjects', { type: '収入', fiscalYear: fiscalYear })
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

async function loadSubjectMaster() {
  if (!state.currentUser) return showUserSelectScreen();
  showLoading('科目一覧を読み込んでいます...');
  try {
    const fiscalYear = Number((els.subjectFiscalYear && els.subjectFiscalYear.value) || state.currentFiscalYear || getCurrentFiscalYear_());
    const result = await apiGet('accounting/listSubjects', {
      type: els.subjectTypeFilter ? els.subjectTypeFilter.value : '',
      keyword: (els.subjectKeyword && els.subjectKeyword.value || '').trim(),
      fiscalYear: fiscalYear,
      includeDisabled: 'true'
    });
    state.subjectMasterRows = (result.subjects || []).slice().sort(function(a, b) {
      const typeOrder = { '収入': 0, '支出': 1 };
      const aType = Object.prototype.hasOwnProperty.call(typeOrder, a['収支区分']) ? typeOrder[a['収支区分']] : 9;
      const bType = Object.prototype.hasOwnProperty.call(typeOrder, b['収支区分']) ? typeOrder[b['収支区分']] : 9;
      if (aType !== bType) return aType - bType;
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
  state.subjectForm = { mode: 'create', subjectCode: '', initialSubject: null };
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
  setUnsavedBaseline('subjectForm', getSubjectFormSnapshot());
}

function openSubjectEditModal(subject) {
  state.subjectForm = { mode: 'edit', subjectCode: subject['科目コード'] || '', initialSubject: clonePlain(subject) || null };
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
  setUnsavedBaseline('subjectForm', getSubjectFormSnapshot());
}

async function saveSubject() {
  if (!state.currentUser) return showToast('利用者を選択してください', 'error');
  try {
    const fiscalYear = Number((els.subjectFiscalYear && els.subjectFiscalYear.value) || state.currentFiscalYear || getCurrentFiscalYear_());
    const subjectCode = requireValue(els.subjectFormCode.value, '科目コードを入力してください').trim();
    const subjectName = requireValue(els.subjectFormName.value, '科目名を入力してください').trim();
    const type = requireValue(els.subjectFormType.value, '収支区分を選択してください');
    const sortOrder = Number(els.subjectFormSortOrder.value || 0);
    const data = {
      fiscalYear: fiscalYear,
      subjectCode: subjectCode,
      subjectName: subjectName,
      type: type,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
      enabled: els.subjectFormEnabled.checked,
      note: els.subjectFormNote.value.trim()
    };
    showLoading(state.subjectForm.mode === 'edit' ? '科目を更新しています...' : '科目を登録しています...');
    if (state.subjectForm.mode === 'edit') {
      await apiPost('accounting/updateSubject', { currentUser: state.currentUser, fiscalYear: fiscalYear, subjectCode: state.subjectForm.subjectCode, data: data });
      showToast('科目を更新しました', 'success');
    } else {
      await apiPost('accounting/createSubject', { currentUser: state.currentUser, fiscalYear: fiscalYear, data: data });
      showToast('科目を登録しました', 'success');
    }
    clearUnsavedContext('subjectForm');
    closeModal('subjectFormModal', { force: true });
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
  const fiscalYear = Number((els.subjectFiscalYear && els.subjectFiscalYear.value) || state.currentFiscalYear || getCurrentFiscalYear_());
  const code = state.selectedSubject['科目コード'] || '';
  if (!window.confirm(`${code} を削除します。全年度設定からも削除されます。よろしいですか。`)) return;
  showLoading('科目を削除しています...');
  try {
    await apiPost('accounting/deleteSubject', { currentUser: state.currentUser, fiscalYear: fiscalYear, subjectCode: code });
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
    const fiscalYear = Number((els.homeFiscalYear && els.homeFiscalYear.value) || state.currentFiscalYear || getCurrentFiscalYear_());
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

function prepareExpenseForm(mode, options) {
  const source = options || {};
  state.expenseForm.initialSource = clonePlain(source || {});
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
    els.formFiscalYear.value = String(voucher['年度'] || state.currentFiscalYear || getCurrentFiscalYear_());
    renderExpenseSubjectOptions(voucher['科目コード'] || '');
    els.formExpenseDate.value = toDateInputValue(voucher['支出日']);
    els.formSummary.value = voucher['摘要'] || '';
    els.formPayee.value = voucher['支払先'] || '';
    els.formAmount.value = toNumericInputValue(voucher['支出金額']);
    els.formRelatedTravelControlNo.value = voucher['関連旅費管理番号'] || '';
    els.formNote.value = voucher['備考'] || '';
    els.removeEvidenceRow.classList.remove('hidden');
    renderExpenseFormEvidenceInfo();
    setUnsavedBaseline('expenseForm', getExpenseFormSnapshot());
    return;
  }

  const travel = source.travel || null;
  const defaultYear = Number(travel ? (travel.fiscalYear || state.currentFiscalYear || getCurrentFiscalYear_()) : (state.currentFiscalYear || getCurrentFiscalYear_()));
  state.expenseForm.selectedTravel = travel;
  els.expenseFormTitle.textContent = travel ? '支出伝票登録（旅費申請から転記）' : '支出伝票登録';
  els.formVoucherNo.value = '';
  els.formFiscalYear.value = String(defaultYear);
  renderExpenseSubjectOptions('EXP001');
  els.formExpenseDate.value = travel ? toDateInputValue(travel.travelDate) : todayInputValue();
  els.formSummary.value = travel ? [travel.tripName, travel.driverName].filter(Boolean).join(' / ') : '';
  els.formPayee.value = travel ? (travel.driverName || '') : '';
  els.formAmount.value = travel ? toNumericInputValue(travel.paymentAmount) : '';
  els.formRelatedTravelControlNo.value = travel ? (travel.controlNo || '') : '';
  els.formNote.value = travel ? (travel.note || '') : '';
  els.removeEvidenceRow.classList.add('hidden');
  renderExpenseFormEvidenceInfo();
  setUnsavedBaseline('expenseForm', getExpenseFormSnapshot());
}

function prepareIncomeForm(mode, options) {
  const source = options || {};
  state.incomeForm.initialSource = clonePlain(source || {});
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
    els.incomeFormFiscalYear.value = String(voucher['年度'] || state.currentFiscalYear || getCurrentFiscalYear_());
    renderIncomeSubjectOptions(voucher['科目コード'] || '');
    els.incomeFormDate.value = toDateInputValue(voucher['収入日']);
    els.incomeFormSummary.value = voucher['摘要'] || '';
    els.incomeFormPayer.value = voucher['入金元'] || '';
    els.incomeFormAmount.value = toNumericInputValue(voucher['収入金額']);
    els.incomeFormNote.value = voucher['備考'] || '';
    els.incomeRemoveEvidenceRow.classList.remove('hidden');
    renderIncomeFormEvidenceInfo();
    setUnsavedBaseline('incomeForm', getIncomeFormSnapshot());
    return;
  }

  const defaultYear = Number(state.currentFiscalYear || getCurrentFiscalYear_());
  els.incomeFormTitle.textContent = '収入伝票登録';
  els.incomeFormVoucherNo.value = '';
  els.incomeFormFiscalYear.value = String(defaultYear);
  renderIncomeSubjectOptions('INC001');
  els.incomeFormDate.value = todayInputValue();
  els.incomeFormSummary.value = '';
  els.incomeFormPayer.value = '';
  els.incomeFormAmount.value = '';
  els.incomeFormNote.value = '';
  els.incomeRemoveEvidenceRow.classList.add('hidden');
  renderIncomeFormEvidenceInfo();
  setUnsavedBaseline('incomeForm', getIncomeFormSnapshot());
}

async function loadBudgetPage(options) {
  const opts = options || {};
  if (!state.currentUser) return showUserSelectScreen();
  if (!opts.force && getCurrentPageName() === 'budget' && hasUnsavedChanges('budget')) {
    if (!window.confirm(UNSAVED_CHANGES_MESSAGE)) return;
    clearUnsavedContext('budget');
  }
  clearBudgetPdfResult();
  showLoading('予算書を読み込んでいます...');
  try {
    const fiscalYear = Number(requireValue((els.budgetFiscalYear && els.budgetFiscalYear.value) || state.currentFiscalYear, '年度を選択してください'));
    const previousFiscalYear = fiscalYear - 1;
    const [expenseSubjectsResult, incomeSubjectsResult, currentBudgetResult, previousBudgetResult, currentExpenseResult, currentIncomeResult, previousExpenseResult, previousIncomeResult] = await Promise.all([
      apiGet('accounting/listSubjects', { type: '支出', fiscalYear: fiscalYear }),
      apiGet('accounting/listSubjects', { type: '収入', fiscalYear: fiscalYear }),
      apiGet('accounting/listBudgetRows', { fiscalYear: fiscalYear }),
      apiGet('accounting/listBudgetRows', { fiscalYear: previousFiscalYear }),
      apiGet('accounting/listExpenseVouchers', { fiscalYear: fiscalYear }),
      apiGet('accounting/listIncomeVouchers', { fiscalYear: fiscalYear }),
      apiGet('accounting/listExpenseVouchers', { fiscalYear: previousFiscalYear }),
      apiGet('accounting/listIncomeVouchers', { fiscalYear: previousFiscalYear })
    ]);

    const subjectSeedRows = [];
    (expenseSubjectsResult.subjects || []).forEach(function(row) { subjectSeedRows.push(row); });
    (incomeSubjectsResult.subjects || []).forEach(function(row) { subjectSeedRows.push(row); });

    const currentBudgetRows = currentBudgetResult.rows || [];
    const previousBudgetRows = previousBudgetResult.rows || [];
    const currentExpenses = currentExpenseResult.vouchers || [];
    const currentIncomes = currentIncomeResult.vouchers || [];
    const previousExpenses = previousExpenseResult.vouchers || [];
    const previousIncomes = previousIncomeResult.vouchers || [];

    const currentActualMap = {};
    currentExpenses.forEach(function(row) {
      const key = ['支出', row['科目コード'] || ''].join('|');
      currentActualMap[key] = Number(currentActualMap[key] || 0) + Number(row['支出金額'] || 0);
    });
    currentIncomes.forEach(function(row) {
      const key = ['収入', row['科目コード'] || ''].join('|');
      currentActualMap[key] = Number(currentActualMap[key] || 0) + Number(row['収入金額'] || 0);
    });

    const previousBudgetMap = {};
    previousBudgetRows.forEach(function(row) {
      const key = [row['収支区分'] || '', row['科目コード'] || ''].join('|');
      const initialBudget = Number(row['当初予算額'] || 0);
      const revisedBudget = Number(row['補正予算額'] || 0);
      const budgetTotal = Number(row['予算合計額'] || 0);
      const mergedBudget = initialBudget + revisedBudget;
      previousBudgetMap[key] = mergedBudget || budgetTotal || 0;
    });

    const previousSettlementMap = {};
    previousExpenses.forEach(function(row) {
      const key = ['支出', row['科目コード'] || ''].join('|');
      previousSettlementMap[key] = Number(previousSettlementMap[key] || 0) + Number(row['支出金額'] || 0);
    });
    previousIncomes.forEach(function(row) {
      const key = ['収入', row['科目コード'] || ''].join('|');
      previousSettlementMap[key] = Number(previousSettlementMap[key] || 0) + Number(row['収入金額'] || 0);
    });

    const rowMap = {};
    subjectSeedRows.forEach(function(row) {
      const key = [row['収支区分'] || '', row['科目コード'] || ''].join('|');
      rowMap[key] = {
        fiscalYear: fiscalYear,
        type: row['収支区分'] || '',
        subjectCode: row['科目コード'] || '',
        subjectName: row['科目名'] || '',
        initialBudget: 0,
        revisedBudget: 0,
        actualAmount: Number(currentActualMap[key] || 0),
        previousBudgetAmount: Number(previousBudgetMap[key] || 0),
        previousSettlementAmount: Number(previousSettlementMap[key] || 0),
        note: '',
        enabled: String(row['使用可否']) !== 'false',
        sortOrder: Number(row['表示順'] || 0)
      };
    });

    currentBudgetRows.forEach(function(row) {
      const key = [row['収支区分'] || '', row['科目コード'] || ''].join('|');
      const current = rowMap[key] || {};
      rowMap[key] = Object.assign(current, {
        fiscalYear: fiscalYear,
        type: row['収支区分'] || current.type || '',
        subjectCode: row['科目コード'] || current.subjectCode || '',
        subjectName: row['科目名'] || current.subjectName || '',
        initialBudget: Number(row['当初予算額'] || row['予算合計額'] || 0),
        revisedBudget: 0,
        actualAmount: Number(currentActualMap[key] || row['実績額'] || 0),
        previousBudgetAmount: Number(previousBudgetMap[key] || 0),
        previousSettlementAmount: Number(previousSettlementMap[key] || 0),
        note: row['備考'] || '',
        sortOrder: Number(current.sortOrder || 0)
      });
    });

    Object.keys(currentActualMap).forEach(function(key) {
      if (rowMap[key]) return;
      const parts = key.split('|');
      rowMap[key] = {
        fiscalYear: fiscalYear,
        type: parts[0] || '',
        subjectCode: parts[1] || '',
        subjectName: '',
        initialBudget: 0,
        revisedBudget: 0,
        actualAmount: Number(currentActualMap[key] || 0),
        previousBudgetAmount: Number(previousBudgetMap[key] || 0),
        previousSettlementAmount: Number(previousSettlementMap[key] || 0),
        note: '',
        sortOrder: 0
      };
    });

    Object.keys(previousBudgetMap).concat(Object.keys(previousSettlementMap)).forEach(function(key) {
      if (rowMap[key]) return;
      const parts = key.split('|');
      rowMap[key] = {
        fiscalYear: fiscalYear,
        type: parts[0] || '',
        subjectCode: parts[1] || '',
        subjectName: '',
        initialBudget: 0,
        revisedBudget: 0,
        actualAmount: Number(currentActualMap[key] || 0),
        previousBudgetAmount: Number(previousBudgetMap[key] || 0),
        previousSettlementAmount: Number(previousSettlementMap[key] || 0),
        note: '',
        sortOrder: 0
      };
    });

    state.budgetRows = Object.values(rowMap).filter(function(row) {
      return row.subjectCode || row.subjectName;
    }).sort(function(a, b) {
      const typeOrder = { '収入': 0, '支出': 1 };
      const aType = Object.prototype.hasOwnProperty.call(typeOrder, a.type) ? typeOrder[a.type] : 9;
      const bType = Object.prototype.hasOwnProperty.call(typeOrder, b.type) ? typeOrder[b.type] : 9;
      if (aType !== bType) return aType - bType;
      const sortComp = Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
      if (sortComp !== 0) return sortComp;
      return String(a.subjectCode || '').localeCompare(String(b.subjectCode || ''), 'ja');
    });

    const previousIncomeTotal = previousIncomes.reduce(function(sum, row) { return sum + Number(row['収入金額'] || 0); }, 0);
    const previousExpenseTotal = previousExpenses.reduce(function(sum, row) { return sum + Number(row['支出金額'] || 0); }, 0);
    state.budgetPreviousSummary = {
      incomeTotal: previousIncomeTotal,
      expenseTotal: previousExpenseTotal,
      balance: previousIncomeTotal - previousExpenseTotal
    };

    els.budgetFiscalYear.dataset.loadedValue = String(fiscalYear);
    state.budgetInitialRows = clonePlain(state.budgetRows) || [];
    state.budgetInitialSummary = clonePlain(state.budgetPreviousSummary) || { incomeTotal: 0, expenseTotal: 0, balance: 0 };
    renderBudgetTable();
    setUnsavedBaseline('budget', getBudgetSnapshot());
  } catch (error) {
    state.budgetRows = [];
    state.budgetPreviousSummary = { incomeTotal: 0, expenseTotal: 0, balance: 0 };
    renderBudgetTable();
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function loadSettlementPage() {
  if (!state.currentUser) return showUserSelectScreen();
  clearSettlementPdfResult();
  showLoading('決算書を読み込んでいます...');
  try {
    const fiscalYear = Number(requireValue((els.settlementFiscalYear && els.settlementFiscalYear.value) || state.currentFiscalYear, '年度を選択してください'));
    const result = await apiGet('accounting/buildSettlementSummary', { fiscalYear: fiscalYear });
    state.settlementRows = result.summary || [];
    renderSettlementTable();
    if (els.settlementIncomeTotal) els.settlementIncomeTotal.textContent = formatCurrency(result.incomeTotal || 0);
    if (els.settlementExpenseTotal) els.settlementExpenseTotal.textContent = formatCurrency(result.expenseTotal || 0);
    if (els.settlementBalanceTotal) els.settlementBalanceTotal.textContent = formatCurrency(result.balance || 0);
  } catch (error) {
    state.settlementRows = [];
    renderSettlementTable();
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function renderSettlementTable() {
  if (!els.settlementTableBody) return;
  const rows = state.settlementRows || [];
  if (els.settlementCountLabel) els.settlementCountLabel.textContent = `${rows.length}件`;
  if (!rows.length) {
    els.settlementTableBody.innerHTML = '<tr><td colspan="7" class="empty-cell">該当する決算データがありません。</td></tr>';
    return;
  }
  const sections = ['収入', '支出'];
  const html = [];
  sections.forEach(function(section) {
    const sectionRows = rows.filter(function(row) { return row.type === section; });
    if (!sectionRows.length) return;
    html.push(`<tr class="settlement-section-row"><td colspan="7">${escapeHtml(section)}の部</td></tr>`);
    sectionRows.forEach(function(row) {
      html.push(`
        <tr>
          <td>${escapeHtml(row.type || '')}</td>
          <td>${escapeHtml(row.subjectCode || '')}</td>
          <td>${escapeHtml(row.subjectName || '')}</td>
          <td class="text-right">${escapeHtml(formatNumber(row.budgetAmount || 0))}</td>
          <td class="text-right">${escapeHtml(formatNumber(row.actualAmount || 0))}</td>
          <td class="text-right">${escapeHtml(formatNumber(row.diffAmount || 0))}</td>
          <td>${escapeHtml(row.note || '')}</td>
        </tr>
      `);
    });
    const totalBudget = sectionRows.reduce(function(sum, row) { return sum + Number(row.budgetAmount || 0); }, 0);
    const totalActual = sectionRows.reduce(function(sum, row) { return sum + Number(row.actualAmount || 0); }, 0);
    const totalDiff = sectionRows.reduce(function(sum, row) { return sum + Number(row.diffAmount || 0); }, 0);
    html.push(`
      <tr class="settlement-total-row">
        <td colspan="3">${escapeHtml(section)}合計</td>
        <td class="text-right">${escapeHtml(formatNumber(totalBudget))}</td>
        <td class="text-right">${escapeHtml(formatNumber(totalActual))}</td>
        <td class="text-right">${escapeHtml(formatNumber(totalDiff))}</td>
        <td></td>
      </tr>
    `);
  });
  els.settlementTableBody.innerHTML = html.join('');
}

function clearSettlementPdfResult() {
  if (state.settlementPdfBlobUrl) {
    URL.revokeObjectURL(state.settlementPdfBlobUrl);
    state.settlementPdfBlobUrl = '';
  }
  if (els.settlementPdfResult) {
    els.settlementPdfResult.classList.add('hidden');
    els.settlementPdfResult.innerHTML = '';
  }
}

function renderSettlementPdfResult(result) {
  if (!els.settlementPdfResult) return;
  clearSettlementPdfResult();
  state.settlementPdfBlobUrl = createBlobUrlFromBase64(result.pdfBase64, result.mimeType);
  els.settlementPdfResult.classList.remove('hidden');
  els.settlementPdfResult.innerHTML = `
    <div class="pdf-title">決算書PDFを生成しました</div>
    <div class="budget-pdf-result-meta">ファイル名: ${escapeHtml(result.fileName || '')}${result.createdAt ? ` / 生成日時: ${escapeHtml(result.createdAt)}` : ''}</div>
    <div class="pdf-links">
      <a href="${escapeAttribute(state.settlementPdfBlobUrl)}" target="_blank" rel="noopener noreferrer">PDFを開く</a>
      <a href="${escapeAttribute(state.settlementPdfBlobUrl)}" download="${escapeAttribute(result.fileName || 'settlement.pdf')}">PDFをダウンロード</a>
    </div>
    <div class="budget-pdf-result-note">PDFは一時生成です。画面を閉じるか再読み込みするとリンクは無効になります。</div>
  `;
  triggerFileDownload(state.settlementPdfBlobUrl, result.fileName || 'settlement.pdf');
}

async function generateSettlementPdf() {
  if (!state.currentUser) return showToast('利用者を選択してください', 'error');
  const fiscalYear = requireValue((els.settlementFiscalYear && els.settlementFiscalYear.value) || state.currentFiscalYear, '年度を選択してください');
  clearSettlementPdfResult();
  if (!window.confirm(`${fiscalYear}年度の決算書PDFを生成しますか？`)) return;
  showLoading('決算書PDFを生成しています...');
  try {
    const result = await apiPost('accounting/exportSettlementSheet', {
      currentUser: state.currentUser,
      fiscalYear: Number(fiscalYear)
    });
    renderSettlementPdfResult(result);
    showToast('決算書PDFを生成しました', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}


/* === CSV import/export enhancement block === */
state.csvImportKind = state.csvImportKind || '';
state.csvImportLastResult = state.csvImportLastResult || null;
state.csvImportObjectUrl = state.csvImportObjectUrl || '';
state.csvExportObjectUrl = state.csvExportObjectUrl || '';

const EXPENSE_IMPORT_TEMPLATE_HEADERS = ['伝票番号','年度','科目コード','科目名','支出日','支出金額','摘要','備考','支払先','関連旅費管理番号','登録日時','更新日時','登録者','更新者'];
const INCOME_IMPORT_TEMPLATE_HEADERS = ['伝票番号','年度','科目コード','科目名','収入日','収入金額','摘要','備考','入金元','入金確認状況','入金確認日','登録日時','更新日時','登録者','更新者'];

const _cacheEnhancedElsForCsv_ = cacheEnhancedEls_;
cacheEnhancedEls_ = function() {
  if (typeof _cacheEnhancedElsForCsv_ === 'function') _cacheEnhancedElsForCsv_();
  Object.assign(els, {
    exportExpenseCsvButton: document.getElementById('exportExpenseCsvButton'),
    openExpenseCsvImportButton: document.getElementById('openExpenseCsvImportButton'),
    downloadExpenseTemplateButton: document.getElementById('downloadExpenseTemplateButton'),
    exportIncomeCsvButton: document.getElementById('exportIncomeCsvButton'),
    openIncomeCsvImportButton: document.getElementById('openIncomeCsvImportButton'),
    downloadIncomeTemplateButton: document.getElementById('downloadIncomeTemplateButton'),
    csvImportModal: document.getElementById('csvImportModal'),
    csvImportTitle: document.getElementById('csvImportTitle'),
    csvImportLead: document.getElementById('csvImportLead'),
    csvImportRequiredColumns: document.getElementById('csvImportRequiredColumns'),
    csvImportOptionalColumns: document.getElementById('csvImportOptionalColumns'),
    csvImportTemplateHint: document.getElementById('csvImportTemplateHint'),
    csvImportFile: document.getElementById('csvImportFile'),
    csvImportFileName: document.getElementById('csvImportFileName'),
    csvImportExecuteButton: document.getElementById('csvImportExecuteButton'),
    csvImportResult: document.getElementById('csvImportResult')
  });
};

const _ensureEnhancedLayoutForCsv_ = ensureEnhancedLayout_;
ensureEnhancedLayout_ = function() {
  if (typeof _ensureEnhancedLayoutForCsv_ === 'function') _ensureEnhancedLayoutForCsv_();
  ensureCsvFeatureLayout_();
  cacheEnhancedEls_();
};

const _bindEventsForCsv_ = bindEvents;
bindEvents = function() {
  if (typeof _bindEventsForCsv_ === 'function') _bindEventsForCsv_();
  bindCsvFeatureEvents_();
};

function ensureCsvFeatureLayout_() {
  ensureExpenseCsvActions_();
  ensureIncomeCsvActions_();
  ensureCsvImportModal_();
}

function ensureExpenseCsvActions_() {
  const actions = document.querySelector('#page-expenses .page-actions');
  if (!actions || document.getElementById('exportExpenseCsvButton')) return;
  actions.insertAdjacentHTML('beforeend', `
    <div class="csv-action-group">
      <button id="exportExpenseCsvButton" class="button secondary" type="button">CSV出力</button>
      <button id="openExpenseCsvImportButton" class="button warning" type="button">CSV取込</button>
      <button id="downloadExpenseTemplateButton" class="button secondary" type="button">テンプレートCSV</button>
    </div>
  `);
}

function ensureIncomeCsvActions_() {
  const actions = document.querySelector('#page-incomes .page-actions');
  if (!actions || document.getElementById('exportIncomeCsvButton')) return;
  actions.insertAdjacentHTML('beforeend', `
    <div class="csv-action-group">
      <button id="exportIncomeCsvButton" class="button secondary" type="button">CSV出力</button>
      <button id="openIncomeCsvImportButton" class="button warning" type="button">CSV取込</button>
      <button id="downloadIncomeTemplateButton" class="button secondary" type="button">テンプレートCSV</button>
    </div>
  `);
}

function ensureCsvImportModal_() {
  if (document.getElementById('csvImportModal')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <div id="csvImportModal" class="modal hidden">
      <div class="modal-backdrop" data-close-modal="csvImportModal"></div>
      <div class="modal-dialog wide-dialog">
        <div class="modal-header">
          <h3 id="csvImportTitle">CSV取込</h3>
          <button class="icon-button" type="button" data-close-modal="csvImportModal">×</button>
        </div>
        <div class="modal-body csv-import-modal-body">
          <p id="csvImportLead" class="inline-note modal-note">CSVファイルを選択して取り込みます。</p>
          <div class="csv-guide-grid">
            <div class="card csv-guide-card">
              <div class="card-title">必須列</div>
              <div id="csvImportRequiredColumns" class="csv-column-chips"></div>
            </div>
            <div class="card csv-guide-card">
              <div class="card-title">任意列</div>
              <div id="csvImportOptionalColumns" class="csv-column-chips"></div>
            </div>
          </div>
          <div class="csv-template-hint" id="csvImportTemplateHint"></div>
          <div class="form-grid single-form-grid compact-modal-grid">
            <label class="field required-field">
              <span>CSVファイル</span>
              <input type="file" id="csvImportFile" accept=".csv,text/csv" />
            </label>
          </div>
          <div id="csvImportFileName" class="inline-note">未選択</div>
          <div class="form-footer button-row wrap-actions modal-footer-actions">
            <button id="csvImportExecuteButton" class="button success" type="button">取込実行</button>
          </div>
          <div id="csvImportResult" class="csv-import-result hidden"></div>
        </div>
      </div>
    </div>
  `);
}

function bindCsvFeatureEvents_() {
  if (els.exportExpenseCsvButton && !els.exportExpenseCsvButton.dataset.bound) {
    els.exportExpenseCsvButton.dataset.bound = '1';
    els.exportExpenseCsvButton.addEventListener('click', function() { exportAccountingCsv_('expense'); });
  }
  if (els.openExpenseCsvImportButton && !els.openExpenseCsvImportButton.dataset.bound) {
    els.openExpenseCsvImportButton.dataset.bound = '1';
    els.openExpenseCsvImportButton.addEventListener('click', function() { openCsvImportModal_('expense'); });
  }
  if (els.downloadExpenseTemplateButton && !els.downloadExpenseTemplateButton.dataset.bound) {
    els.downloadExpenseTemplateButton.dataset.bound = '1';
    els.downloadExpenseTemplateButton.addEventListener('click', function() { downloadImportTemplateCsv_('expense'); });
  }
  if (els.exportIncomeCsvButton && !els.exportIncomeCsvButton.dataset.bound) {
    els.exportIncomeCsvButton.dataset.bound = '1';
    els.exportIncomeCsvButton.addEventListener('click', function() { exportAccountingCsv_('income'); });
  }
  if (els.openIncomeCsvImportButton && !els.openIncomeCsvImportButton.dataset.bound) {
    els.openIncomeCsvImportButton.dataset.bound = '1';
    els.openIncomeCsvImportButton.addEventListener('click', function() { openCsvImportModal_('income'); });
  }
  if (els.downloadIncomeTemplateButton && !els.downloadIncomeTemplateButton.dataset.bound) {
    els.downloadIncomeTemplateButton.dataset.bound = '1';
    els.downloadIncomeTemplateButton.addEventListener('click', function() { downloadImportTemplateCsv_('income'); });
  }
  if (els.csvImportFile && !els.csvImportFile.dataset.bound) {
    els.csvImportFile.dataset.bound = '1';
    els.csvImportFile.addEventListener('change', function() {
      const file = els.csvImportFile.files && els.csvImportFile.files[0];
      if (els.csvImportFileName) els.csvImportFileName.textContent = file ? `${file.name} / ${formatFileSize(file.size)}` : '未選択';
    });
  }
  if (els.csvImportExecuteButton && !els.csvImportExecuteButton.dataset.bound) {
    els.csvImportExecuteButton.dataset.bound = '1';
    els.csvImportExecuteButton.addEventListener('click', executeCsvImport_);
  }
}

function getCsvImportConfig_(kind) {
  if (kind === 'expense') {
    return {
      title: '支出CSV取込',
      lead: '過去の支出データを CSV で一括取り込みできます。伝票番号は空欄なら自動採番、入力済みなら重複チェックを行います。',
      required: ['年度', '科目名 または 科目コード', '支出日', '支出金額', '摘要'],
      optional: ['伝票番号', '科目コード', '科目名', '支払先', '関連旅費管理番号', '登録日時', '更新日時', '登録者', '更新者'],
      hint: '文字コードは UTF-8（BOM付き推奨）。支出先は空欄でも取り込めます。支払状況・支払日はCSVになくてもよく、科目コードが空欄でも既存判定または新規科目自動作成を行います。',
      templateName: 'expense_import_template.csv',
      action: 'accounting/importExpenseCsv',
      refresh: function() { return loadExpenseList(); }
    };
  }
  return {
    title: '収入CSV取込',
    lead: '過去の収入データを CSV で一括取り込みできます。伝票番号は空欄なら自動採番、入力済みなら重複チェックを行います。',
    required: ['年度', '科目名 または 科目コード', '収入日', '収入金額', '摘要', '入金元'],
    optional: ['伝票番号', '科目コード', '科目名', '入金確認状況', '入金確認日', '登録日時', '更新日時', '登録者', '更新者'],
    hint: '文字コードは UTF-8（BOM付き推奨）。入金確認状況・入金確認日は省略できます。科目コードが空欄でも既存判定または新規科目自動作成を行います。',
    templateName: 'income_import_template.csv',
    action: 'accounting/importIncomeCsv',
    refresh: function() { return loadIncomeList(); }
  };
}

function renderColumnChips_(container, columns) {
  if (!container) return;
  container.innerHTML = (columns || []).map(function(name) {
    return `<span class="csv-chip">${escapeHtml(name)}</span>`;
  }).join('');
}

function openCsvImportModal_(kind) {
  state.csvImportKind = kind;
  state.csvImportLastResult = null;
  const config = getCsvImportConfig_(kind);
  if (els.csvImportTitle) els.csvImportTitle.textContent = config.title;
  if (els.csvImportLead) els.csvImportLead.textContent = config.lead;
  renderColumnChips_(els.csvImportRequiredColumns, config.required);
  renderColumnChips_(els.csvImportOptionalColumns, config.optional);
  if (els.csvImportTemplateHint) {
    els.csvImportTemplateHint.innerHTML = `<div class="inline-note">${escapeHtml(config.hint)}<br>同梱テンプレート: <strong>${escapeHtml(config.templateName)}</strong></div>`;
  }
  if (els.csvImportFile) els.csvImportFile.value = '';
  if (els.csvImportFileName) els.csvImportFileName.textContent = '未選択';
  if (els.csvImportResult) {
    els.csvImportResult.classList.add('hidden');
    els.csvImportResult.innerHTML = '';
  }
  openModal('csvImportModal');
}

function buildCsvText_(rows) {
  return '\ufeff' + (rows || []).map(function(row) {
    return (row || []).map(function(value) {
      const text = String(value === undefined || value === null ? '' : value).replace(/"/g, '""');
      return /[",\r\n]/.test(text) ? `"${text}"` : text;
    }).join(',');
  }).join('\r\n') + '\r\n';
}

function buildExpenseTemplateRows_() {
  const fiscalYear = Number(state.currentFiscalYear || getCurrentFiscalYear_());
  const previousFiscalYear = fiscalYear - 1;
  return [
    EXPENSE_IMPORT_TEMPLATE_HEADERS,
    ['', fiscalYear, '', '旅費交通費', '2026/09/15', '12000', '遠征バス代', '秋季大会遠征', '', '', '', '', '', ''],
    ['', fiscalYear, 'EXP002', '', '2026/08/28', '18500', 'ボール・ライン用品購入', '練習用備品の補充', '', '', '', '', '', ''],
    ['', previousFiscalYear, '', '新設科目サンプル', '2025/11/05', '3200', '氷・飲料購入', '科目コード空欄でも自動作成確認用', '', '', '', '', '', '']
  ];
}

function buildIncomeTemplateRows_() {
  const fiscalYear = Number(state.currentFiscalYear || getCurrentFiscalYear_());
  const previousFiscalYear = fiscalYear - 1;
  return [
    INCOME_IMPORT_TEMPLATE_HEADERS,
    ['', fiscalYear, 'INC001', '部費収入', '2026/09/10', '30000', '9月分部費', '3年生分', '3年生部員一同', '確認済', '2026/09/10', '', '', '', ''],
    ['', fiscalYear, 'INC002', '補助金収入', '2026/08/05', '50000', '市補助金入金', '前期分', '宍粟市スポーツ振興課', '確認済', '2026/08/05', '', '', '', ''],
    ['', fiscalYear, 'INC003', '寄付金収入', '2026/07/18', '10000', 'OB会寄付', '夏大会激励金', '宍粟市野球部OB会', '確認済', '2026/07/18', '', '', '', ''],
    ['', previousFiscalYear, 'INC004', '雑収入', '2025/12/01', '4500', '自販機売上精算', '11月分', '球場売店', '未確認', '', '', '', '', '']
  ];
}

function downloadImportTemplateCsv_(kind) {
  const rows = kind === 'expense' ? buildExpenseTemplateRows_() : buildIncomeTemplateRows_();
  const fileName = kind === 'expense' ? 'expense_import_template.csv' : 'income_import_template.csv';
  triggerTextDownload_(buildCsvText_(rows), fileName, 'text/csv;charset=utf-8');
  showToast('テンプレートCSVをダウンロードしました', 'success');
}

function revokeCsvObjectUrl_(key) {
  if (state[key]) {
    URL.revokeObjectURL(state[key]);
    state[key] = '';
  }
}

function triggerTextDownload_(text, fileName, mimeType) {
  revokeCsvObjectUrl_('csvExportObjectUrl');
  const blob = new Blob([text], { type: mimeType || 'text/plain;charset=utf-8' });
  state.csvExportObjectUrl = URL.createObjectURL(blob);
  triggerFileDownload(state.csvExportObjectUrl, fileName || 'download.txt');
}

async function exportAccountingCsv_(kind) {
  const isExpense = kind === 'expense';
  const fiscalYear = isExpense ? (els.expenseFiscalYear && els.expenseFiscalYear.value) : (els.incomeFiscalYear && els.incomeFiscalYear.value);
  if (!fiscalYear) return showToast('年度を選択してください', 'error');
  showLoading(isExpense ? '支出CSVを出力しています...' : '収入CSVを出力しています...');
  try {
    const result = await apiGet(isExpense ? 'accounting/exportExpenseCsv' : 'accounting/exportIncomeCsv', { fiscalYear: fiscalYear });
    revokeCsvObjectUrl_('csvExportObjectUrl');
    state.csvExportObjectUrl = createBlobUrlFromBase64(result.csvBase64, result.mimeType || 'text/csv');
    triggerFileDownload(state.csvExportObjectUrl, result.fileName || (isExpense ? 'expense.csv' : 'income.csv'));
    showToast(isExpense ? '支出CSVを出力しました' : '収入CSVを出力しました', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}

function readFileAsText_(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onload = function() { resolve(String(reader.result || '')); };
    reader.onerror = function() { reject(new Error('CSVファイルの読み込みに失敗しました')); };
    reader.readAsText(file, 'utf-8');
  });
}

function renderCsvImportResult_(result) {
  if (!els.csvImportResult) return;
  const importedCount = Number(result.importedCount || 0);
  const errorCount = Number(result.errorCount || 0);
  const warningCount = Number(result.warningCount || 0);
  const errorRows = result.errors || [];
  const warningRows = result.warnings || [];

  const errorTable = errorRows.length ? `
    <div class="table-wrap csv-result-table-wrap">
      <table>
        <thead>
          <tr>
            <th>CSV行</th>
            <th>内容</th>
          </tr>
        </thead>
        <tbody>
          ${errorRows.map(function(row) {
            return `<tr><td>${escapeHtml(String(row.rowNumber || '-'))}</td><td>${escapeHtml(row.message || '')}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  ` : '<div class="inline-note">エラーはありません。</div>';

  const warningTable = warningRows.length ? `
    <div class="table-wrap csv-result-table-wrap">
      <table>
        <thead>
          <tr>
            <th>CSV行</th>
            <th>内容</th>
          </tr>
        </thead>
        <tbody>
          ${warningRows.map(function(row) {
            return `<tr><td>${escapeHtml(String(row.rowNumber || '-'))}</td><td>${escapeHtml(row.message || '')}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  ` : '<div class="inline-note">警告はありません。</div>';

  els.csvImportResult.classList.remove('hidden');
  els.csvImportResult.innerHTML = `
    <div class="csv-result-summary">
      <div class="csv-result-card success">
        <div class="csv-result-label">取込成功</div>
        <div class="csv-result-value">${escapeHtml(String(importedCount))}件</div>
      </div>
      <div class="csv-result-card warning">
        <div class="csv-result-label">警告</div>
        <div class="csv-result-value">${escapeHtml(String(warningCount))}件</div>
      </div>
      <div class="csv-result-card danger">
        <div class="csv-result-label">エラー</div>
        <div class="csv-result-value">${escapeHtml(String(errorCount))}件</div>
      </div>
    </div>
    <div class="csv-result-block">
      <div class="card-title">取込結果</div>
      <div class="inline-note">${escapeHtml(result.message || '')}</div>
    </div>
    <div class="csv-result-block">
      <div class="card-title">エラー一覧</div>
      ${errorTable}
    </div>
    <div class="csv-result-block">
      <div class="card-title">警告一覧</div>
      ${warningTable}
    </div>
  `;
}

async function executeCsvImport_() {
  if (!state.currentUser) return showToast('利用者を選択してください', 'error');
  const config = getCsvImportConfig_(state.csvImportKind || 'expense');
  const file = els.csvImportFile && els.csvImportFile.files ? els.csvImportFile.files[0] : null;
  if (!file) return showToast('CSVファイルを選択してください', 'error');
  showLoading('CSVを取り込んでいます...');
  try {
    const csvText = await readFileAsText_(file);
    const result = await apiPost(config.action, {
      currentUser: state.currentUser,
      fileName: file.name,
      csvText: csvText
    });
    state.csvImportLastResult = result;
    renderCsvImportResult_(result);
    await loadHomeSummary();
    await config.refresh();
    showToast(result.errorCount ? 'CSV取込が完了しました（一部エラーあり）' : 'CSV取込が完了しました', result.errorCount ? 'warning' : 'success');
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    hideLoading();
  }
}
