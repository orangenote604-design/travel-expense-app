let editMode = false;
let currentControlNo = '';
let tripMasterList = [];
let currentRecordSnapshot = null;

document.addEventListener('DOMContentLoaded', async () => {
  bindEvents();
  await loadInitialData();
  await initForm();
});

function bindEvents() {
  document.getElementById('travelDate').addEventListener('change', updateFiscalYear);
  document.getElementById('tripName').addEventListener('change', handleTripChange);
  document.getElementById('parkingFee').addEventListener('input', updatePaymentAmount);
  document.getElementById('tollFee').addEventListener('input', updatePaymentAmount);
  document.getElementById('otherFee').addEventListener('input', handleOtherFeeChange);
  document.getElementById('otherDetail').addEventListener('input', updatePaymentAmount);
  document.getElementById('driverAllowance').addEventListener('input', updatePaymentAmount);
  document.getElementById('gasolineFee').addEventListener('input', updatePaymentAmount);
  document.getElementById('clearButton').addEventListener('click', resetNewForm);
  document.getElementById('travelForm').addEventListener('submit', submitForm);
}

async function loadInitialData() {
  try {
    const [members, trips] = await Promise.all([apiGet('listMembers'), apiGet('listTrips')]);
    fillSimpleSelect('driverName', members);
    tripMasterList = [...trips].sort((a, b) => String(a.tripName).localeCompare(String(b.tripName), 'ja'));
    fillSimpleSelect('tripName', tripMasterList, 'tripName', 'tripName');
  } catch (error) {
    setMessage('初期データの取得に失敗しました。', 'error');
    console.error(error);
  }
}

async function initForm() {
  currentControlNo = getQueryParam('controlNo') || '';
  if (!currentControlNo) {
    resetNewForm();
    return;
  }

  editMode = true;
  document.getElementById('pageTitle').textContent = '旅費申請編集';
  document.getElementById('submitButton').textContent = '更新する';
  document.getElementById('controlNo').value = currentControlNo;
  await loadRecord(currentControlNo);
}

function resetNewForm() {
  clearMessage();
  editMode = false;
  currentControlNo = '';
  currentRecordSnapshot = null;
  document.getElementById('pageTitle').textContent = '旅費申請入力';
  document.getElementById('submitButton').textContent = '登録する';
  document.getElementById('travelForm').reset();
  document.getElementById('travelDate').value = getTodayInputValue();
  document.getElementById('fiscalYear').value = calcFiscalYear(document.getElementById('travelDate').value);
  document.getElementById('controlNo').value = '登録後に自動採番';
  document.getElementById('parkingFee').value = 0;
  document.getElementById('tollFee').value = 0;
  document.getElementById('otherFee').value = 0;
  document.getElementById('otherDetail').value = '';
  document.getElementById('paidFlag').checked = false;
  fillTripFields(null);
  handleOtherFeeChange();
}

async function loadRecord(controlNo) {
  try {
    const records = await apiGet('listTravel');
    const record = records.find(item => item.controlNo === controlNo);
    if (!record) {
      setMessage('対象データが見つかりませんでした。', 'error');
      return;
    }

    currentRecordSnapshot = record;
    document.getElementById('travelDate').value = normalizeDateValue(record.travelDate);
    document.getElementById('fiscalYear').value = record.fiscalYear || '';
    document.getElementById('controlNo').value = record.controlNo || '';
    document.getElementById('tripName').value = record.tripName || '';
    document.getElementById('driverName').value = record.driverName || '';
    document.getElementById('parkingFee').value = toNumber(record.parkingFee);
    document.getElementById('tollFee').value = toNumber(record.tollFee);
    document.getElementById('otherFee').value = toNumber(record.otherFee);
    document.getElementById('otherDetail').value = record.otherDetail || '';
    document.getElementById('remarks').value = record.remarks || '';
    document.getElementById('paidFlag').checked = !!record.paidFlag;

    fillTripFields({
      departureFrom: record.departureFrom,
      arrivalTo: record.arrivalTo,
      returnFrom: record.returnFrom,
      returnTo: record.returnTo,
      routeNote: record.routeNote,
      outboundDistance: record.outboundDistance,
      separateReturn: record.separateReturn,
      returnDistance: record.returnDistance,
      roundTripDistance: record.roundTripDistance
    });

    const roundedKm = Math.round(toNumber(record.roundTripDistance));
    if (roundedKm >= 301) {
      document.getElementById('driverAllowance').readOnly = false;
      document.getElementById('gasolineFee').readOnly = false;
      document.getElementById('driverAllowance').value = toNumber(record.driverAllowance);
      document.getElementById('gasolineFee').value = toNumber(record.gasolineFee);
      document.getElementById('manualFeeNote').classList.remove('hidden');
    }

    handleOtherFeeChange();
  } catch (error) {
    setMessage('申請データの取得に失敗しました。', 'error');
    console.error(error);
  }
}

function updateFiscalYear() {
  document.getElementById('fiscalYear').value = calcFiscalYear(document.getElementById('travelDate').value);
}

function findSelectedTrip() {
  const tripName = document.getElementById('tripName').value;
  return tripMasterList.find(item => item.tripName === tripName) || null;
}

function handleTripChange() {
  const trip = findSelectedTrip();
  currentRecordSnapshot = null;
  fillTripFields(trip);
}

function fillTripFields(trip) {
  document.getElementById('departureFrom').value = trip?.departureFrom || '';
  document.getElementById('arrivalTo').value = trip?.arrivalTo || '';
  document.getElementById('returnFrom').value = trip?.returnFrom || '';
  document.getElementById('returnTo').value = trip?.returnTo || '';
  document.getElementById('routeNote').value = trip?.routeNote || '';
  document.getElementById('outboundDistance').value = trip ? toNumber(trip.outboundDistance) : '';
  document.getElementById('separateReturn').checked = !!trip?.separateReturn;
  document.getElementById('returnDistance').value = trip ? toNumber(trip.returnDistance) : '';
  document.getElementById('roundTripDistance').value = trip ? toNumber(trip.roundTripDistance) : 0;
  updateFeeFieldsByDistance();
}

function updateFeeFieldsByDistance() {
  const roundTripDistance = toNumber(document.getElementById('roundTripDistance').value);
  const roundedKm = Math.round(roundTripDistance);
  const autoDriverAllowance = calcDriverAllowance(roundedKm);
  const autoGasolineFee = calcGasolineFee(roundedKm);
  const manualMode = roundedKm >= 301;

  const driverAllowanceInput = document.getElementById('driverAllowance');
  const gasolineFeeInput = document.getElementById('gasolineFee');
  const manualFeeNote = document.getElementById('manualFeeNote');

  if (manualMode) {
    driverAllowanceInput.readOnly = false;
    gasolineFeeInput.readOnly = false;
    if (!editMode || !currentRecordSnapshot) {
      driverAllowanceInput.value = driverAllowanceInput.value || 0;
      gasolineFeeInput.value = gasolineFeeInput.value || 0;
    }
    manualFeeNote.classList.remove('hidden');
  } else {
    driverAllowanceInput.readOnly = true;
    gasolineFeeInput.readOnly = true;
    driverAllowanceInput.value = autoDriverAllowance ?? 0;
    gasolineFeeInput.value = autoGasolineFee ?? 0;
    manualFeeNote.classList.add('hidden');
  }

  document.getElementById('returnDistanceField').classList.toggle('hidden', !document.getElementById('separateReturn').checked);
  updatePaymentAmount();
}

function handleOtherFeeChange() {
  const otherFee = toNumber(document.getElementById('otherFee').value);
  document.getElementById('otherDetailField').classList.toggle('hidden', otherFee <= 0);
  if (otherFee <= 0) document.getElementById('otherDetail').value = '';
  updatePaymentAmount();
}

function updatePaymentAmount() {
  const total =
    toNumber(document.getElementById('driverAllowance').value) +
    toNumber(document.getElementById('gasolineFee').value) +
    toNumber(document.getElementById('parkingFee').value) +
    toNumber(document.getElementById('tollFee').value) +
    toNumber(document.getElementById('otherFee').value);
  document.getElementById('paymentAmount').value = total;
}

function buildPayload() {
  return {
    travelDate: document.getElementById('travelDate').value,
    tripName: document.getElementById('tripName').value,
    departureFrom: document.getElementById('departureFrom').value,
    arrivalTo: document.getElementById('arrivalTo').value,
    returnFrom: document.getElementById('returnFrom').value,
    returnTo: document.getElementById('returnTo').value,
    routeNote: document.getElementById('routeNote').value,
    outboundDistance: toNumber(document.getElementById('outboundDistance').value),
    separateReturn: document.getElementById('separateReturn').checked,
    returnDistance: toNumber(document.getElementById('returnDistance').value),
    driverName: document.getElementById('driverName').value,
    driverAllowance: toNumber(document.getElementById('driverAllowance').value),
    gasolineFee: toNumber(document.getElementById('gasolineFee').value),
    parkingFee: toNumber(document.getElementById('parkingFee').value),
    tollFee: toNumber(document.getElementById('tollFee').value),
    otherFee: toNumber(document.getElementById('otherFee').value),
    otherDetail: document.getElementById('otherDetail').value.trim(),
    paidFlag: document.getElementById('paidFlag').checked,
    remarks: document.getElementById('remarks').value.trim()
  };
}

async function submitForm(event) {
  event.preventDefault();
  clearMessage();

  const payload = buildPayload();
  if (!payload.travelDate || !payload.tripName || !payload.driverName) {
    setMessage('旅費発生日・旅行名・運転者は必須です。', 'error');
    return;
  }
  if (payload.otherFee > 0 && !payload.otherDetail) {
    setMessage('その他の金額を入力した場合は、その他内容を入力してください。', 'error');
    return;
  }

  try {
    setLoading(true, editMode ? '更新中...' : '登録中...');
    const result = await apiPost(editMode
      ? { action: 'updateTravel', controlNo: currentControlNo, data: payload }
      : { action: 'createTravel', data: payload });

    if (!result.ok) {
      setMessage(result.error || '保存に失敗しました。', 'error');
      return;
    }

    if (!editMode) {
      location.href = `list.html?created=${encodeURIComponent(result.controlNo)}`;
      return;
    }

    document.getElementById('controlNo').value = result.controlNo;
    document.getElementById('fiscalYear').value = result.fiscalYear;
    document.getElementById('roundTripDistance').value = result.roundTripDistance;
    document.getElementById('paymentAmount').value = result.paymentAmount;
    setMessage(`更新しました。管理番号: ${result.controlNo}`, 'success');
  } catch (error) {
    setMessage('通信エラーが発生しました。', 'error');
    console.error(error);
  } finally {
    setLoading(false);
  }
}
