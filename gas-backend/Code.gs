const TRAVEL_SHEET_NAME = '旅費申請DB';
const MEMBER_SHEET_NAME = '部員一覧';
const TRIP_SHEET_NAME = '旅行一覧';
const RECEIPT_SHEET_NAME = '受領証出力';
const RECEIPT_TITLE = '宍粟市野球部旅費受領証';
const ID_PREFIX = 'SGBC';
const APP_TIMEZONE = 'Asia/Tokyo';
const RECEIPT_HEADER_ROW = 5;
const RECEIPT_DATA_START_ROW = 6;
const RECEIPT_HEADERS = [
  '旅行発生日',
  '管理番号',
  '旅行名',
  '会場名',
  '往復距離',
  '運転手当',
  'ガソリン代',
  '駐車場利用料',
  '高速道路利用料',
  'その他',
  '支給額',
  '運転者',
  '受領印又は署名'
];


/*********************************
 * 会計システム追加定数
 *********************************/
const ACCOUNTING_EXPENSE_SHEET_NAME = '支出伝票DB';
const ACCOUNTING_INCOME_SHEET_NAME = '収入伝票DB';
const ACCOUNTING_SUBJECT_SHEET_NAME = '科目一覧';
const ACCOUNTING_BUDGET_SHEET_NAME = '予算書DB';
const ACCOUNTING_EVIDENCE_SHEET_NAME = '証憑一覧';
const ACCOUNTING_CONFIG_SHEET_NAME = '会計設定';
const ACCOUNTING_SETTLEMENT_OUTPUT_SHEET_NAME = '決算書出力';
const ACCOUNTING_BUDGET_OUTPUT_SHEET_NAME = '予算書出力';

const EXPENSE_VOUCHER_PREFIX = 'PV';
const INCOME_VOUCHER_PREFIX = 'RV';
const EVIDENCE_PREFIX = 'EV';

const MAX_EVIDENCE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EVIDENCE_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png'
];

const DEFAULT_TRAVEL_EXPENSE_SUBJECT_CODE = 'EXP001';
const DEFAULT_TRAVEL_EXPENSE_SUBJECT_NAME = '旅費交通費';

const ACCOUNTING_EXPENSE_HEADERS = [
  '伝票番号',
  '年度',
  '科目コード',
  '科目名',
  '支出日',
  '支出金額',
  '摘要',
  '備考',
  '支払先',
  '支払状況',
  '支払日',
  '関連旅費管理番号',
  '証憑有無',
  '証憑ID',
  '証憑ファイル名',
  '証憑MIMEタイプ',
  '証憑DriveFileId',
  '証憑DriveUrl',
  '登録日時',
  '更新日時',
  '登録者',
  '更新者'
];

const ACCOUNTING_INCOME_HEADERS = [
  '伝票番号',
  '年度',
  '科目コード',
  '科目名',
  '収入日',
  '収入金額',
  '摘要',
  '備考',
  '入金元',
  '入金確認状況',
  '入金確認日',
  '証憑有無',
  '証憑ID',
  '証憑ファイル名',
  '証憑MIMEタイプ',
  '証憑DriveFileId',
  '証憑DriveUrl',
  '登録日時',
  '更新日時',
  '登録者',
  '更新者'
];

const ACCOUNTING_SUBJECT_HEADERS = [
  '科目コード',
  '科目名',
  '収支区分',
  '表示順',
  '使用可否',
  '備考'
];

const ACCOUNTING_BUDGET_HEADERS = [
  '年度',
  '収支区分',
  '科目コード',
  '科目名',
  '当初予算額',
  '補正予算額',
  '予算合計額',
  '実績額',
  '差額',
  '備考',
  '登録日時',
  '更新日時',
  '登録者',
  '更新者'
];

const ACCOUNTING_EVIDENCE_HEADERS = [
  '証憑ID',
  '年度',
  '伝票種別',
  '伝票番号',
  'ファイル名',
  'MIMEタイプ',
  'ファイルサイズ',
  'DriveFileId',
  'DriveUrl',
  'DriveFolderId',
  '登録日時',
  '登録者'
];

const ACCOUNTING_CONFIG_HEADERS = [
  '設定キー',
  '設定値',
  '備考'
];

const ACCOUNTING_SETTLEMENT_HEADERS = [
  '年度',
  '収支区分',
  '科目コード',
  '科目名',
  '予算額',
  '実績額',
  '差額'
];

function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const travelHeaders = [
    '旅費発生日',
    '年度',
    '管理番号',
    '旅行名',
    '出発地',
    '到着地',
    '帰路出発地',
    '帰路到着地',
    '経由地等補足',
    '往路距離',
    '復路距離個別入力フラグ',
    '復路距離',
    '往復距離',
    '運転者',
    '運転手当',
    'ガソリン代',
    '駐車場利用料',
    '高速道路利用料',
    'その他',
    'その他内容',
    '支給額',
    '支払い済みフラグ',
    '備考'
  ];

  const memberHeaders = ['氏名'];

  const tripHeaders = [
    '旅行名',
    '出発地',
    '到着地',
    '帰路出発地',
    '帰路到着地',
    '経由地等補足',
    '往路距離',
    '復路距離個別入力フラグ',
    '復路距離',
    '往復距離'
  ];

  const travelSheet = ensureSheetWithHeaders_(ss, TRAVEL_SHEET_NAME, travelHeaders);
  travelSheet.getRange(2, 1, Math.max(travelSheet.getMaxRows() - 1, 1), 1).setNumberFormat('yyyy-mm-dd');

  ensureSheetWithHeaders_(ss, MEMBER_SHEET_NAME, memberHeaders);
  ensureSheetWithHeaders_(ss, TRIP_SHEET_NAME, tripHeaders);
  ensureReceiptSheetInitialized_(ss);
  setupAccountingDatabase_();

  return { ok: true };
}

function resetSheet_(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
    sheet.clearFormats();
    sheet.clearConditionalFormatRules();
  }

  ensureSheetSize_(sheet, 200, headers.length);
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#2563eb')
    .setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
  return sheet;
}

function ensureSheet_(ss, sheetName) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  return sheet;
}

function ensureSheetSize_(sheet, minRows, minCols) {
  const currentRows = sheet.getMaxRows();
  const currentCols = sheet.getMaxColumns();
  if (currentRows < minRows) {
    sheet.insertRowsAfter(currentRows, minRows - currentRows);
  }
  if (currentCols < minCols) {
    sheet.insertColumnsAfter(currentCols, minCols - currentCols);
  }
}

function calcFiscalYear(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) throw new Error('旅費発生日が不正です');
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  return month >= 10 ? year + 1 : year;
}

function normalizeBoolean_(value) {
  return value === true || value === 'true' || value === 'TRUE' || value === 1 || value === '1';
}

function toNumber_(value) {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

function trim_(value) {
  return (value || '').toString().trim();
}

function normalizeDateForDisplay_(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) {
    return trim_(value);
  }
  return Utilities.formatDate(date, APP_TIMEZONE, 'yyyy/MM/dd');
}

function findFirstEmptyRowByColumn_(sheet, keyColumn, startRow) {
  const firstRow = startRow || 2;
  const maxRows = sheet.getMaxRows();
  const rowCount = Math.max(maxRows - firstRow + 1, 1);
  const values = sheet.getRange(firstRow, keyColumn, rowCount, 1).getValues().flat();

  for (var i = 0; i < values.length; i++) {
    if (trim_(values[i]) === '') {
      return firstRow + i;
    }
  }

  sheet.insertRowsAfter(maxRows, 100);
  return maxRows + 1;
}

function findRowByColumnValue_(sheet, keyColumn, expectedValue, startRow) {
  const firstRow = startRow || 2;
  const maxRows = sheet.getMaxRows();
  const rowCount = Math.max(maxRows - firstRow + 1, 1);
  const values = sheet.getRange(firstRow, keyColumn, rowCount, 1).getValues().flat();
  const target = trim_(expectedValue);

  for (var i = 0; i < values.length; i++) {
    if (trim_(values[i]) === target) {
      return firstRow + i;
    }
  }
  return -1;
}

function generateControlNumber(fiscalYear) {
  const records = listTravelRecords();
  const prefix = ID_PREFIX + String(fiscalYear).slice(-2);
  let maxSeq = 0;

  records.forEach(function(record) {
    const controlNo = trim_(record.controlNo);
    if (controlNo.indexOf(prefix) === 0) {
      const seq = parseInt(controlNo.slice(prefix.length), 10);
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  });

  return prefix + String(maxSeq + 1).padStart(4, '0');
}

function calcDriverAllowanceByDistance(roundedKm) {
  if (roundedKm <= 0) return 0;
  if (roundedKm <= 200) return 1000;
  if (roundedKm <= 300) return 2000;
  return null;
}

function calcGasolineFeeByDistance(roundedKm) {
  if (roundedKm <= 0) return 0;
  if (roundedKm <= 100) return 1000;
  if (roundedKm <= 200) return 2000;
  if (roundedKm <= 300) return 3000;
  return null;
}

function normalizeDistanceFields_(data) {
  const outboundDistance = toNumber_(data.outboundDistance);
  const separateReturn = normalizeBoolean_(data.separateReturn);
  const rawReturnDistance = toNumber_(data.returnDistance);
  const returnDistance = separateReturn ? rawReturnDistance : outboundDistance;
  const roundTripDistance = outboundDistance + returnDistance;

  return {
    outboundDistance: outboundDistance,
    separateReturn: separateReturn,
    returnDistance: returnDistance,
    roundTripDistance: roundTripDistance
  };
}

function getTripByName_(tripName) {
  const target = trim_(tripName);
  if (!target) return null;
  const trips = listTrips();
  for (var i = 0; i < trips.length; i++) {
    if (trim_(trips[i].tripName) === target) return trips[i];
  }
  return null;
}

function normalizeTripPayload(data) {
  const tripName = trim_(data.tripName);
  const departureFrom = trim_(data.departureFrom);
  const arrivalTo = trim_(data.arrivalTo);

  if (!tripName) throw new Error('旅行名は必須です');
  if (!departureFrom) throw new Error('出発地は必須です');
  if (!arrivalTo) throw new Error('到着地は必須です');

  const distance = normalizeDistanceFields_(data);

  return {
    tripName: tripName,
    departureFrom: departureFrom,
    arrivalTo: arrivalTo,
    returnFrom: trim_(data.returnFrom),
    returnTo: trim_(data.returnTo),
    routeNote: trim_(data.routeNote),
    outboundDistance: distance.outboundDistance,
    separateReturn: distance.separateReturn,
    returnDistance: distance.returnDistance,
    roundTripDistance: distance.roundTripDistance
  };
}

function normalizeTravelPayload(data) {
  const travelDate = trim_(data.travelDate);
  const tripName = trim_(data.tripName);
  const driverName = trim_(data.driverName);

  if (!travelDate) throw new Error('旅費発生日は必須です');
  if (!tripName) throw new Error('旅行名は必須です');
  if (!driverName) throw new Error('運転者は必須です');

  const masterTrip = getTripByName_(tripName);
  const source = masterTrip || data;
  const distance = normalizeDistanceFields_(source);
  const roundedKm = Math.round(distance.roundTripDistance);

  const autoDriverAllowance = calcDriverAllowanceByDistance(roundedKm);
  const autoGasolineFee = calcGasolineFeeByDistance(roundedKm);
  const driverAllowance = autoDriverAllowance === null ? toNumber_(data.driverAllowance) : autoDriverAllowance;
  const gasolineFee = autoGasolineFee === null ? toNumber_(data.gasolineFee) : autoGasolineFee;

  const parkingFee = toNumber_(data.parkingFee);
  const tollFee = toNumber_(data.tollFee);
  const otherFee = toNumber_(data.otherFee);
  const otherDetail = otherFee > 0 ? trim_(data.otherDetail) : '';
  if (otherFee > 0 && !otherDetail) throw new Error('その他の金額を入力した場合は、その他内容を入力してください');

  return {
    travelDate: travelDate,
    fiscalYear: calcFiscalYear(travelDate),
    tripName: tripName,
    departureFrom: trim_(source.departureFrom),
    arrivalTo: trim_(source.arrivalTo),
    returnFrom: trim_(source.returnFrom),
    returnTo: trim_(source.returnTo),
    routeNote: trim_(source.routeNote),
    outboundDistance: distance.outboundDistance,
    separateReturn: distance.separateReturn,
    returnDistance: distance.returnDistance,
    roundTripDistance: distance.roundTripDistance,
    driverName: driverName,
    driverAllowance: driverAllowance,
    gasolineFee: gasolineFee,
    parkingFee: parkingFee,
    tollFee: tollFee,
    otherFee: otherFee,
    otherDetail: otherDetail,
    paymentAmount: driverAllowance + gasolineFee + parkingFee + tollFee + otherFee,
    paidFlag: normalizeBoolean_(data.paidFlag),
    remarks: trim_(data.remarks)
  };
}

function createTravelRecord(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TRAVEL_SHEET_NAME);
  const normalized = normalizeTravelPayload(data);
  const controlNo = generateControlNumber(normalized.fiscalYear);
  const row = findFirstEmptyRowByColumn_(sheet, 3, 2);

  sheet.getRange(row, 11).insertCheckboxes();
  sheet.getRange(row, 22).insertCheckboxes();
  sheet.getRange(row, 1, 1, 23).setValues([[
    normalized.travelDate,
    normalized.fiscalYear,
    controlNo,
    normalized.tripName,
    normalized.departureFrom,
    normalized.arrivalTo,
    normalized.returnFrom,
    normalized.returnTo,
    normalized.routeNote,
    normalized.outboundDistance,
    normalized.separateReturn,
    normalized.returnDistance,
    normalized.roundTripDistance,
    normalized.driverName,
    normalized.driverAllowance,
    normalized.gasolineFee,
    normalized.parkingFee,
    normalized.tollFee,
    normalized.otherFee,
    normalized.otherDetail,
    normalized.paymentAmount,
    normalized.paidFlag,
    normalized.remarks
  ]]);

  return {
    ok: true,
    controlNo: controlNo,
    fiscalYear: normalized.fiscalYear,
    roundTripDistance: normalized.roundTripDistance,
    paymentAmount: normalized.paymentAmount
  };
}

function listTravelRecords() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TRAVEL_SHEET_NAME);
  const maxRows = sheet.getMaxRows();
  const rowCount = Math.max(maxRows - 1, 1);
  const values = sheet.getRange(2, 1, rowCount, 23).getValues();

  return values
    .filter(function(r) { return trim_(r[2]) !== ''; })
    .map(function(r) {
      return {
        travelDate: r[0],
        fiscalYear: r[1],
        controlNo: r[2],
        tripName: r[3],
        departureFrom: r[4],
        arrivalTo: r[5],
        returnFrom: r[6],
        returnTo: r[7],
        routeNote: r[8],
        outboundDistance: r[9],
        separateReturn: r[10],
        returnDistance: r[11],
        roundTripDistance: r[12],
        driverName: r[13],
        driverAllowance: r[14],
        gasolineFee: r[15],
        parkingFee: r[16],
        tollFee: r[17],
        otherFee: r[18],
        otherDetail: r[19],
        paymentAmount: r[20],
        paidFlag: r[21],
        remarks: r[22]
      };
    });
}

function updateTravelRecord(controlNo, data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TRAVEL_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 3, controlNo, 2);
  if (row < 0) return { ok: false, error: '対象データが見つかりません' };

  const normalized = normalizeTravelPayload(data);
  sheet.getRange(row, 11).insertCheckboxes();
  sheet.getRange(row, 22).insertCheckboxes();
  sheet.getRange(row, 1, 1, 23).setValues([[
    normalized.travelDate,
    normalized.fiscalYear,
    trim_(controlNo),
    normalized.tripName,
    normalized.departureFrom,
    normalized.arrivalTo,
    normalized.returnFrom,
    normalized.returnTo,
    normalized.routeNote,
    normalized.outboundDistance,
    normalized.separateReturn,
    normalized.returnDistance,
    normalized.roundTripDistance,
    normalized.driverName,
    normalized.driverAllowance,
    normalized.gasolineFee,
    normalized.parkingFee,
    normalized.tollFee,
    normalized.otherFee,
    normalized.otherDetail,
    normalized.paymentAmount,
    normalized.paidFlag,
    normalized.remarks
  ]]);

  return {
    ok: true,
    controlNo: trim_(controlNo),
    fiscalYear: normalized.fiscalYear,
    roundTripDistance: normalized.roundTripDistance,
    paymentAmount: normalized.paymentAmount
  };
}

function deleteTravelRecord(controlNo) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TRAVEL_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 3, controlNo, 2);
  if (row < 0) return { ok: false, error: '対象データが見つかりません' };
  sheet.deleteRow(row);
  return { ok: true };
}

function bulkSetTravelPaidFlag(controlNos, paidFlag) {
  const targets = (controlNos || []).map(function(value) { return trim_(value); }).filter(function(value) { return value !== ''; });
  if (!targets.length) return { ok: false, error: '対象の管理番号が指定されていません' };

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TRAVEL_SHEET_NAME);
  const maxRows = sheet.getMaxRows();
  const rowCount = Math.max(maxRows - 1, 1);
  const values = sheet.getRange(2, 3, rowCount, 1).getValues().flat();
  const rowMap = {};

  for (var i = 0; i < values.length; i++) {
    const controlNo = trim_(values[i]);
    if (controlNo && !(controlNo in rowMap)) {
      rowMap[controlNo] = i + 2;
    }
  }

  const normalizedPaidFlag = normalizeBoolean_(paidFlag);
  let updatedCount = 0;
  Array.from(new Set(targets)).forEach(function(controlNo) {
    const row = rowMap[controlNo];
    if (!row) return;
    sheet.getRange(row, 22).insertCheckboxes();
    sheet.getRange(row, 22).setValue(normalizedPaidFlag);
    updatedCount += 1;
  });

  return { ok: true, updatedCount: updatedCount, paidFlag: normalizedPaidFlag };
}

function getSingleColumnList_(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const maxRows = sheet.getMaxRows();
  const rowCount = Math.max(maxRows - 1, 1);
  return sheet.getRange(2, 1, rowCount, 1).getValues()
    .map(function(row) { return trim_(row[0]); })
    .filter(function(value) { return value !== ''; });
}

function listMembers() {
  return getSingleColumnList_(MEMBER_SHEET_NAME);
}

function addMember(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(MEMBER_SHEET_NAME);
  const value = trim_(name);
  if (!value) return { ok: false, error: '氏名は必須です' };
  if (listMembers().indexOf(value) >= 0) return { ok: false, error: '同名の部員が既に存在します' };

  const row = findFirstEmptyRowByColumn_(sheet, 1, 2);
  sheet.getRange(row, 1).setValue(value);
  return { ok: true, name: value };
}

function updateMember(oldName, newName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(MEMBER_SHEET_NAME);
  const oldValue = trim_(oldName);
  const newValue = trim_(newName);
  if (!oldValue) return { ok: false, error: '編集元の氏名が不正です' };
  if (!newValue) return { ok: false, error: '新しい氏名は必須です' };

  const row = findRowByColumnValue_(sheet, 1, oldValue, 2);
  if (row < 0) return { ok: false, error: '対象の部員が見つかりません' };

  const members = listMembers();
  if (members.indexOf(newValue) >= 0 && oldValue !== newValue) return { ok: false, error: '同名の部員が既に存在します' };

  sheet.getRange(row, 1).setValue(newValue);
  return { ok: true, oldName: oldValue, newName: newValue };
}

function deleteMember(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(MEMBER_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, name, 2);
  if (row < 0) return { ok: false, error: '対象の部員が見つかりません' };
  sheet.deleteRow(row);
  return { ok: true };
}

function listTrips() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TRIP_SHEET_NAME);
  const maxRows = sheet.getMaxRows();
  const rowCount = Math.max(maxRows - 1, 1);
  const values = sheet.getRange(2, 1, rowCount, 10).getValues();

  return values
    .filter(function(r) { return trim_(r[0]) !== ''; })
    .map(function(r) {
      return {
        tripName: r[0],
        departureFrom: r[1],
        arrivalTo: r[2],
        returnFrom: r[3],
        returnTo: r[4],
        routeNote: r[5],
        outboundDistance: r[6],
        separateReturn: r[7],
        returnDistance: r[8],
        roundTripDistance: r[9]
      };
    });
}

function addTrip(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TRIP_SHEET_NAME);
  const normalized = normalizeTripPayload(data);
  if (listTrips().some(function(t) { return trim_(t.tripName) === normalized.tripName; })) {
    return { ok: false, error: '同名の旅行が既に存在します' };
  }

  const row = findFirstEmptyRowByColumn_(sheet, 1, 2);
  sheet.getRange(row, 8).insertCheckboxes();
  sheet.getRange(row, 1, 1, 10).setValues([[
    normalized.tripName,
    normalized.departureFrom,
    normalized.arrivalTo,
    normalized.returnFrom,
    normalized.returnTo,
    normalized.routeNote,
    normalized.outboundDistance,
    normalized.separateReturn,
    normalized.returnDistance,
    normalized.roundTripDistance
  ]]);

  return { ok: true, tripName: normalized.tripName, roundTripDistance: normalized.roundTripDistance };
}

function updateTrip(oldTripName, data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TRIP_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, oldTripName, 2);
  if (row < 0) return { ok: false, error: '対象の旅行が見つかりません' };

  const normalized = normalizeTripPayload(data);
  if (listTrips().some(function(t) { return trim_(t.tripName) === normalized.tripName && trim_(t.tripName) !== trim_(oldTripName); })) {
    return { ok: false, error: '同名の旅行が既に存在します' };
  }

  sheet.getRange(row, 8).insertCheckboxes();
  sheet.getRange(row, 1, 1, 10).setValues([[
    normalized.tripName,
    normalized.departureFrom,
    normalized.arrivalTo,
    normalized.returnFrom,
    normalized.returnTo,
    normalized.routeNote,
    normalized.outboundDistance,
    normalized.separateReturn,
    normalized.returnDistance,
    normalized.roundTripDistance
  ]]);

  return { ok: true, oldTripName: trim_(oldTripName), tripName: normalized.tripName, roundTripDistance: normalized.roundTripDistance };
}

function deleteTrip(tripName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TRIP_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, tripName, 2);
  if (row < 0) return { ok: false, error: '対象の旅行が見つかりません' };
  sheet.deleteRow(row);
  return { ok: true };
}

function getTravelRecordsByControlNos_(controlNos) {
  const uniqueTargets = Array.from(new Set((controlNos || []).map(function(value) {
    return trim_(value);
  }).filter(function(value) {
    return value !== '';
  })));

  if (!uniqueTargets.length) {
    return [];
  }

  const recordMap = {};
  listTravelRecords().forEach(function(record) {
    const controlNo = trim_(record.controlNo);
    if (controlNo) {
      recordMap[controlNo] = record;
    }
  });

  return uniqueTargets
    .map(function(controlNo) { return recordMap[controlNo]; })
    .filter(function(record) { return !!record; })
    .sort(function(a, b) {
      const dateDiff = new Date(a.travelDate).getTime() - new Date(b.travelDate).getTime();
      if (dateDiff !== 0) return dateDiff;
      return trim_(a.controlNo).localeCompare(trim_(b.controlNo));
    });
}

function formatReceiptSheet_(sheet) {
  ensureSheetSize_(sheet, 200, RECEIPT_HEADERS.length);

  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).breakApart();
  sheet.clear();
  sheet.clearFormats();
  sheet.clearConditionalFormatRules();
  sheet.setHiddenGridlines(true);

  const lastColumn = RECEIPT_HEADERS.length;
  const columnWidths = [90, 115, 170, 170, 95, 95, 95, 105, 115, 90, 100, 110, 135];
  columnWidths.forEach(function(width, index) {
    sheet.setColumnWidth(index + 1, width);
  });

  sheet.getRange(1, 1, 1, lastColumn).merge();
  sheet.getRange(1, 1)
    .setValue(RECEIPT_TITLE)
    .setFontSize(16)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  sheet.getRange(2, 1, 1, lastColumn).merge();
  sheet.getRange(2, 1)
    .setValue('宍粟市野球部旅費として、下記のとおり正に受領しました。')
    .setFontColor('#374151')
    .setFontSize(10)
    .setHorizontalAlignment('left');

  sheet.getRange(3, 1, 1, lastColumn).merge();
  sheet.getRange(3, 1)
    .setHorizontalAlignment('right')
    .setFontSize(10)
    .setFontColor('#4b5563');

  sheet.getRange(RECEIPT_HEADER_ROW, 1, 1, lastColumn)
    .setValues([RECEIPT_HEADERS])
    .setFontWeight('bold')
    .setBackground('#e5e7eb')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true)
    .setBorder(true, true, true, true, true, true, '#9ca3af', SpreadsheetApp.BorderStyle.SOLID);

  sheet.setFrozenRows(RECEIPT_HEADER_ROW);
  sheet.setRowHeight(1, 32);
  sheet.setRowHeight(2, 24);
  sheet.setRowHeight(3, 22);
  sheet.setRowHeight(4, 10);
  sheet.setRowHeight(RECEIPT_HEADER_ROW, 34);
}

function buildReceiptDriverTotals_(records) {
  const totals = {};
  const driverOrder = [];

  (records || []).forEach(function(record) {
    const driverName = trim_(record.driverName) || '（未設定）';
    if (!totals.hasOwnProperty(driverName)) {
      totals[driverName] = 0;
      driverOrder.push(driverName);
    }
    totals[driverName] += toNumber_(record.paymentAmount);
  });

  return driverOrder.map(function(driverName) {
    return {
      driverName: driverName,
      totalPaymentAmount: totals[driverName]
    };
  });
}

function writeReceiptSheetRecords_(sheet, records) {
  formatReceiptSheet_(sheet);
  const lastColumn = RECEIPT_HEADERS.length;
  const timestamp = Utilities.formatDate(new Date(), APP_TIMEZONE, 'yyyy/MM/dd HH:mm:ss');
  sheet.getRange(3, 1).setValue('出力日時: ' + timestamp + '    件数: ' + records.length + '件');

  const values = records.map(function(record) {
    return [
      normalizeDateForDisplay_(record.travelDate),
      trim_(record.controlNo),
      trim_(record.tripName),
      trim_(record.arrivalTo),
      toNumber_(record.roundTripDistance),
      toNumber_(record.driverAllowance),
      toNumber_(record.gasolineFee),
      toNumber_(record.parkingFee),
      toNumber_(record.tollFee),
      toNumber_(record.otherFee),
      toNumber_(record.paymentAmount),
      trim_(record.driverName),
      ''
    ];
  });

  const clearRows = Math.max(sheet.getMaxRows() - RECEIPT_DATA_START_ROW + 1, 1);
  sheet.getRange(RECEIPT_DATA_START_ROW, 1, clearRows, lastColumn).clearContent().clearFormat();

  if (!values.length) {
    return;
  }

  const dataRange = sheet.getRange(RECEIPT_DATA_START_ROW, 1, values.length, lastColumn);
  dataRange.setValues(values);
  dataRange
    .setVerticalAlignment('middle')
    .setWrap(true)
    .setBorder(true, true, true, true, true, true, '#9ca3af', SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange(RECEIPT_DATA_START_ROW, 5, values.length, 1)
    .setNumberFormat('#,##0.0" km"')
    .setHorizontalAlignment('right');

  sheet.getRange(RECEIPT_DATA_START_ROW, 6, values.length, 6)
    .setNumberFormat('#,##0" 円"')
    .setHorizontalAlignment('right');

  sheet.getRange(RECEIPT_DATA_START_ROW, 13, values.length, 1)
    .setBackground('#ffffff')
    .setHorizontalAlignment('center');

  for (var i = 0; i < values.length; i++) {
    sheet.setRowHeight(RECEIPT_DATA_START_ROW + i, 38);
  }

  const driverTotals = buildReceiptDriverTotals_(records);
  if (!driverTotals.length) {
    return;
  }

  const summaryTitleRow = RECEIPT_DATA_START_ROW + values.length + 1;
  const summaryHeaderRow = summaryTitleRow + 1;
  const summaryDataStartRow = summaryHeaderRow + 1;
  const summaryTotalRow = summaryDataStartRow + driverTotals.length;

  sheet.getRange(summaryTitleRow, 1, 1, lastColumn).merge();
  sheet.getRange(summaryTitleRow, 1)
    .setValue('運転者ごとの支給額合計')
    .setFontWeight('bold')
    .setFontSize(11)
    .setBackground('#fff7ed')
    .setFontColor('#9a3412')
    .setHorizontalAlignment('left')
    .setVerticalAlignment('middle')
    .setBorder(true, true, true, true, true, true, '#fdba74', SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange(summaryHeaderRow, 1, 1, 2)
    .setValues([['運転者', '支給額合計']])
    .setFontWeight('bold')
    .setBackground('#e5e7eb')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setBorder(true, true, true, true, true, true, '#9ca3af', SpreadsheetApp.BorderStyle.SOLID);

  const summaryValues = driverTotals.map(function(item) {
    return [item.driverName, item.totalPaymentAmount];
  });

  sheet.getRange(summaryDataStartRow, 1, summaryValues.length, 2)
    .setValues(summaryValues)
    .setVerticalAlignment('middle')
    .setBorder(true, true, true, true, true, true, '#9ca3af', SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange(summaryDataStartRow, 1, summaryValues.length, 1)
    .setHorizontalAlignment('left');

  sheet.getRange(summaryDataStartRow, 2, summaryValues.length, 1)
    .setNumberFormat('#,##0" 円"')
    .setHorizontalAlignment('right');

  const grandTotal = driverTotals.reduce(function(sum, item) {
    return sum + toNumber_(item.totalPaymentAmount);
  }, 0);

  sheet.getRange(summaryTotalRow, 1, 1, 2)
    .setValues([['合計', grandTotal]])
    .setFontWeight('bold')
    .setBackground('#eff6ff')
    .setBorder(true, true, true, true, true, true, '#93c5fd', SpreadsheetApp.BorderStyle.SOLID);

  sheet.getRange(summaryTotalRow, 1).setHorizontalAlignment('left');
  sheet.getRange(summaryTotalRow, 2)
    .setNumberFormat('#,##0" 円"')
    .setHorizontalAlignment('right');

  sheet.setRowHeight(summaryTitleRow, 28);
  sheet.setRowHeight(summaryHeaderRow, 28);
  for (var j = 0; j < summaryValues.length; j++) {
    sheet.setRowHeight(summaryDataStartRow + j, 28);
  }
  sheet.setRowHeight(summaryTotalRow, 30);
}

function buildReceiptPdfExportUrl_(spreadsheetId, sheetId) {
  const params = {
    format: 'pdf',
    exportFormat: 'pdf',
    gid: sheetId,
    size: 'A4',
    portrait: 'false',
    fitw: 'true',
    sheetnames: 'false',
    printtitle: 'false',
    pagenumbers: 'false',
    gridlines: 'false',
    fzr: 'false',
    horizontal_alignment: 'CENTER',
    vertical_alignment: 'TOP',
    top_margin: '1.00',
    bottom_margin: '0.30',
    left_margin: '0.50',
    right_margin: '0.50',
    attachment: 'true'
  };

  const query = Object.keys(params).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');

  return 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/export?' + query;
}

function exportReceiptSheetPdfBlob_(sheet, fileName) {
  SpreadsheetApp.flush();
  Utilities.sleep(1000);

  const url = buildReceiptPdfExportUrl_(sheet.getParent().getId(), sheet.getSheetId());
  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: 'Bearer ' + ScriptApp.getOAuthToken()
    },
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();
  if (code >= 400) {
    throw new Error('受領証PDFの出力に失敗しました');
  }

  return response.getBlob().setName(fileName);
}

function generateReceiptPdf(controlNos) {
  const targets = Array.from(new Set((controlNos || []).map(function(value) {
    return trim_(value);
  }).filter(function(value) {
    return value !== '';
  })));

  if (!targets.length) {
    return { ok: false, error: '対象の管理番号が指定されていません' };
  }

  const records = getTravelRecordsByControlNos_(targets);
  if (!records.length) {
    return { ok: false, error: '対象の申請データが見つかりません' };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ensureSheet_(ss, RECEIPT_SHEET_NAME);
  writeReceiptSheetRecords_(sheet, records);

  const timestamp = Utilities.formatDate(new Date(), APP_TIMEZONE, 'yyyyMMdd_HHmmss');
  const fileName = RECEIPT_TITLE + '_' + timestamp + '.pdf';
  const pdfBlob = exportReceiptSheetPdfBlob_(sheet, fileName);
  const pdfBase64 = Utilities.base64Encode(pdfBlob.getBytes());

  const foundMap = {};
  records.forEach(function(record) {
    foundMap[trim_(record.controlNo)] = true;
  });

  return {
    ok: true,
    fileName: fileName,
    mimeType: 'application/pdf',
    pdfBase64: pdfBase64,
    recordCount: records.length,
    missingControlNos: targets.filter(function(controlNo) { return !foundMap[controlNo]; }),
    createdAt: Utilities.formatDate(new Date(), APP_TIMEZONE, 'yyyy/MM/dd HH:mm:ss')
  };
}

function authorizeRequiredScopes() {
  SpreadsheetApp.getActiveSpreadsheet().getId();
  UrlFetchApp.fetch('https://www.googleapis.com/generate_204', {
    muteHttpExceptions: true
  });
  return 'AUTHORIZED';
}

function testReceiptPdfExport() {
  const sheet = ensureSheet_(SpreadsheetApp.getActiveSpreadsheet(), RECEIPT_SHEET_NAME);
  writeReceiptSheetRecords_(sheet, [
    {
      travelDate: new Date(),
      controlNo: 'TEST0001',
      tripName: 'テスト旅行A',
      arrivalTo: 'テスト会場A',
      roundTripDistance: 120.5,
      driverAllowance: 1000,
      gasolineFee: 2000,
      parkingFee: 500,
      tollFee: 800,
      otherFee: 0,
      paymentAmount: 4300,
      driverName: '山田太郎'
    },
    {
      travelDate: new Date(),
      controlNo: 'TEST0002',
      tripName: 'テスト旅行B',
      arrivalTo: 'テスト会場B',
      roundTripDistance: 98.0,
      driverAllowance: 1000,
      gasolineFee: 1000,
      parkingFee: 0,
      tollFee: 500,
      otherFee: 0,
      paymentAmount: 2500,
      driverName: '山田太郎'
    },
    {
      travelDate: new Date(),
      controlNo: 'TEST0003',
      tripName: 'テスト旅行C',
      arrivalTo: 'テスト会場C',
      roundTripDistance: 150.0,
      driverAllowance: 1000,
      gasolineFee: 2000,
      parkingFee: 300,
      tollFee: 700,
      otherFee: 0,
      paymentAmount: 4000,
      driverName: '佐藤次郎'
    }
  ]);

  const blob = exportReceiptSheetPdfBlob_(sheet, 'test.pdf');
  return {
    ok: true,
    size: blob.getBytes().length,
    name: blob.getName()
  };
}

function outputJson_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : '';
  try {
    switch (action) {
      case 'listTravel': return outputJson_(listTravelRecords());
      case 'listMembers': return outputJson_(listMembers());
      case 'listTrips': return outputJson_(listTrips());

      case 'accounting/listUsers': return outputJson_(listAccountingUsers_(e.parameter || {}));
      case 'accounting/listMemberMaster': return outputJson_(listAccountingUsers_(e.parameter || {}));
      case 'accounting/listSubjects': return outputJson_(listAccountingSubjects_(e.parameter || {}));
      case 'accounting/listExpenseVouchers': return outputJson_(listExpenseVouchers_(e.parameter || {}));
      case 'accounting/getExpenseVoucher': return outputJson_(getExpenseVoucher_(e.parameter || {}));
      case 'accounting/listIncomeVouchers': return outputJson_(listIncomeVouchers_(e.parameter || {}));
      case 'accounting/getIncomeVoucher': return outputJson_(getIncomeVoucher_(e.parameter || {}));
      case 'accounting/listEvidences': return outputJson_(listEvidences_(e.parameter || {}));
      case 'accounting/getVoucherEvidence': return outputJson_(getVoucherEvidence_(e.parameter || {}));
      case 'accounting/travel/listForTransfer': return outputJson_(listTravelRecordsForTransfer_(e.parameter || {}));
      case 'accounting/travel/getForTransfer': return outputJson_(getTravelRecordForTransfer_(e.parameter || {}));
      case 'accounting/checkTravelTransferDuplicate': return outputJson_(checkTravelTransferDuplicate_(e.parameter || {}));
      case 'accounting/listBudgetRows': return outputJson_(listBudgetRows_(e.parameter || {}));
      case 'accounting/buildSettlementSummary': return outputJson_(buildSettlementSummary_(e.parameter || {}));
      default: return outputJson_({ ok: false, error: 'unknown action' });
    }
  } catch (error) {
    return outputJson_({ ok: false, error: error.message });
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    switch (payload.action || '') {
      case 'createTravel': return outputJson_(createTravelRecord(payload.data || {}));
      case 'updateTravel': return outputJson_(updateTravelRecord(payload.controlNo, payload.data || {}));
      case 'deleteTravel': return outputJson_(deleteTravelRecord(payload.controlNo));
      case 'bulkSetPaidFlag': return outputJson_(bulkSetTravelPaidFlag(payload.controlNos, payload.paidFlag));
      case 'generateReceiptPdf': return outputJson_(generateReceiptPdf(payload.controlNos));
      case 'addMember': return outputJson_(addMember(payload.name));
      case 'updateMember': return outputJson_(updateMember(payload.oldName, payload.newName));
      case 'deleteMember': return outputJson_(deleteMember(payload.name));
      case 'addTrip': return outputJson_(addTrip(payload.data || {}));
      case 'updateTrip': return outputJson_(updateTrip(payload.oldTripName, payload.data || {}));
      case 'deleteTrip': return outputJson_(deleteTrip(payload.tripName));

      case 'accounting/setup': return outputJson_(setupAccountingDatabase_());

      case 'member/createFromAccounting': return outputJson_(createMemberFromAccounting_(payload));
      case 'member/updateFromAccounting': return outputJson_(updateMemberFromAccounting_(payload));
      case 'member/deleteFromAccounting': return outputJson_(deleteMemberFromAccounting_(payload));

      case 'accounting/createSubject': return outputJson_(createAccountingSubject_(payload));
      case 'accounting/updateSubject': return outputJson_(updateAccountingSubject_(payload));
      case 'accounting/deleteSubject': return outputJson_(deleteAccountingSubject_(payload));

      case 'accounting/createExpenseVoucher': return outputJson_(createExpenseVoucher_(payload));
      case 'accounting/updateExpenseVoucher': return outputJson_(updateExpenseVoucher_(payload));
      case 'accounting/deleteExpenseVoucher': return outputJson_(deleteExpenseVoucher_(payload));
      case 'accounting/setExpensePaymentStatus': return outputJson_(setExpensePaymentStatus_(payload));

      case 'accounting/createIncomeVoucher': return outputJson_(createIncomeVoucher_(payload));
      case 'accounting/updateIncomeVoucher': return outputJson_(updateIncomeVoucher_(payload));
      case 'accounting/deleteIncomeVoucher': return outputJson_(deleteIncomeVoucher_(payload));

      case 'accounting/uploadEvidence': return outputJson_(uploadEvidence_(payload));
      case 'accounting/deleteEvidence': return outputJson_(deleteEvidence_(payload));

      case 'travelTransfer/createFromTravel': return outputJson_(createExpenseVoucherFromTravel_(payload));

      case 'accounting/saveBudgetRows': return outputJson_(saveBudgetRows_(payload));
      case 'accounting/generateBudgetPdf': return outputJson_(generateBudgetPdf_(payload));
      case 'accounting/exportSettlementSheet': return outputJson_(exportSettlementSheet_(payload));
      default: return outputJson_({ ok: false, error: 'unknown action' });
    }
  } catch (error) {
    return outputJson_({ ok: false, error: error.message });
  }
}

/*********************************
 * 会計システム追加処理
 *********************************/
function setupAccountingDatabase_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  ensureAccountingSheetWithHeaders_(ss, ACCOUNTING_EXPENSE_SHEET_NAME, ACCOUNTING_EXPENSE_HEADERS);
  ensureAccountingSheetWithHeaders_(ss, ACCOUNTING_INCOME_SHEET_NAME, ACCOUNTING_INCOME_HEADERS);
  ensureAccountingSheetWithHeaders_(ss, ACCOUNTING_SUBJECT_SHEET_NAME, ACCOUNTING_SUBJECT_HEADERS);
  ensureAccountingSheetWithHeaders_(ss, ACCOUNTING_BUDGET_SHEET_NAME, ACCOUNTING_BUDGET_HEADERS);
  ensureAccountingSheetWithHeaders_(ss, ACCOUNTING_EVIDENCE_SHEET_NAME, ACCOUNTING_EVIDENCE_HEADERS);
  ensureAccountingSheetWithHeaders_(ss, ACCOUNTING_CONFIG_SHEET_NAME, ACCOUNTING_CONFIG_HEADERS);
  ensureAccountingSheetWithHeaders_(ss, ACCOUNTING_SETTLEMENT_OUTPUT_SHEET_NAME, ACCOUNTING_SETTLEMENT_HEADERS);
  ensureBudgetPdfSheetInitialized_(ss);

  seedAccountingConfig_();
  seedAccountingSubjectsIfNeeded_();

  return { ok: true };
}

function ensureAccountingSheetWithHeaders_(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  ensureSheetSize_(sheet, 200, headers.length);

  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const isBlank = currentHeaders.every(function(v) { return trim_(v) === ''; });

  if (isBlank) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#2563eb')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}

function seedAccountingConfig_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_CONFIG_SHEET_NAME);
  const seeds = [
    ['EXPENSE_PREFIX', EXPENSE_VOUCHER_PREFIX, '支出伝票採番接頭辞'],
    ['INCOME_PREFIX', INCOME_VOUCHER_PREFIX, '収入伝票採番接頭辞'],
    ['EVIDENCE_PREFIX', EVIDENCE_PREFIX, '証憑採番接頭辞'],
    ['MAX_UPLOAD_SIZE_BYTES', String(MAX_EVIDENCE_SIZE_BYTES), '証憑1ファイル最大サイズ'],
    ['ALLOWED_EVIDENCE_MIME_TYPES', ALLOWED_EVIDENCE_MIME_TYPES.join(','), '許可する証憑MIMEタイプ'],
    ['ACCOUNTING_DRIVE_ROOT_FOLDER_ID', '', '会計証憑保存先Google DriveルートフォルダID'],
    ['DEFAULT_TRAVEL_EXPENSE_SUBJECT_CODE', DEFAULT_TRAVEL_EXPENSE_SUBJECT_CODE, '旅費転記時の既定科目コード']
  ];

  const lastRow = Math.max(sheet.getLastRow(), 1);
  const existing = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 3).getValues() : [];
  const existingKeys = existing.map(function(row) { return trim_(row[0]); });
  const rowsToAdd = seeds.filter(function(row) { return existingKeys.indexOf(row[0]) === -1; });

  if (rowsToAdd.length > 0) {
    const startRow = findFirstEmptyRowByColumn_(sheet, 1, 2);
    sheet.getRange(startRow, 1, rowsToAdd.length, 3).setValues(rowsToAdd);
  }
}

function seedAccountingSubjectsIfNeeded_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_SUBJECT_SHEET_NAME);
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) return;

  const seeds = [
    ['EXP001', '旅費交通費', '支出', 1, true, '旅費申請からの転記用既定科目'],
    ['EXP002', '消耗品費', '支出', 2, true, ''],
    ['INC001', '部費収入', '収入', 1, true, ''],
    ['INC002', '補助金収入', '収入', 2, true, '']
  ];
  sheet.getRange(2, 1, seeds.length, seeds[0].length).setValues(seeds);
}

function nowString_() {
  return Utilities.formatDate(new Date(), APP_TIMEZONE, 'yyyy/MM/dd HH:mm:ss');
}

function getSheetDataObjects_(sheet, headers) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return values.filter(function(row) {
    return row.some(function(cell) { return trim_(cell) !== ''; });
  }).map(function(row) {
    const obj = {};
    headers.forEach(function(header, i) {
      obj[header] = row[i];
    });
    return obj;
  });
}

function getHeaderMap_(headers) {
  const map = {};
  headers.forEach(function(name, index) {
    map[name] = index;
  });
  return map;
}

function validateCurrentUser_(currentUser) {
  const name = trim_(currentUser && currentUser.name);
  if (!name) throw new Error('利用者が未選択です');
  return { name: name };
}

function generateAccountingId_(prefix, fiscalYear, sheet, keyColumnIndex) {
  const yy = String(fiscalYear).slice(-2);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return prefix + yy + '0001';

  const values = sheet.getRange(2, keyColumnIndex, lastRow - 1, 1).getValues().flat();
  let maxSeq = 0;
  values.forEach(function(value) {
    const text = trim_(value);
    const expectedPrefix = prefix + yy;
    if (text.indexOf(expectedPrefix) === 0) {
      const seq = Number(text.slice(expectedPrefix.length));
      if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
    }
  });
  return prefix + yy + String(maxSeq + 1).padStart(4, '0');
}

function getAccountingConfigValue_(key) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_CONFIG_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, key, 2);
  if (row < 0) return '';
  return trim_(sheet.getRange(row, 2).getValue());
}

function getAccountingDriveRootFolder_() {
  const folderId = trim_(getAccountingConfigValue_('ACCOUNTING_DRIVE_ROOT_FOLDER_ID'));
  if (!folderId) throw new Error('会計設定の ACCOUNTING_DRIVE_ROOT_FOLDER_ID を設定してください');
  return DriveApp.getFolderById(folderId);
}

function findOrCreateFolder_(parent, folderName) {
  const folders = parent.getFoldersByName(folderName);
  return folders.hasNext() ? folders.next() : parent.createFolder(folderName);
}

function buildEvidenceFolder_(fiscalYear, voucherType, voucherNo) {
  const root = getAccountingDriveRootFolder_();
  const yearFolder = findOrCreateFolder_(root, String(fiscalYear) + '年度');
  const typeFolder = findOrCreateFolder_(yearFolder, voucherType === '支出' ? '支出伝票' : '収入伝票');
  return findOrCreateFolder_(typeFolder, voucherNo);
}

function parseBase64File_(base64, mimeType, fileName) {
  if (!base64) throw new Error('証憑データがありません');
  if (ALLOWED_EVIDENCE_MIME_TYPES.indexOf(mimeType) === -1) throw new Error('対応していない証憑形式です');
  const raw = Utilities.base64Decode(base64);
  if (raw.length > MAX_EVIDENCE_SIZE_BYTES) throw new Error('証憑ファイルサイズが5MBを超えています');
  return Utilities.newBlob(raw, mimeType, fileName);
}

function syncVoucherEvidenceMeta_(voucherType, voucherNo, evidence) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const isExpense = voucherType === '支出';
  const sheet = ss.getSheetByName(isExpense ? ACCOUNTING_EXPENSE_SHEET_NAME : ACCOUNTING_INCOME_SHEET_NAME);
  const headers = isExpense ? ACCOUNTING_EXPENSE_HEADERS : ACCOUNTING_INCOME_HEADERS;
  const row = findRowByColumnValue_(sheet, 1, voucherNo, 2);
  if (row < 0) return;

  const map = getHeaderMap_(headers);
  sheet.getRange(row, map['証憑有無'] + 1).setValue(!!evidence);
  sheet.getRange(row, map['証憑ID'] + 1).setValue(evidence ? evidence.evidenceId : '');
  sheet.getRange(row, map['証憑ファイル名'] + 1).setValue(evidence ? evidence.fileName : '');
  sheet.getRange(row, map['証憑MIMEタイプ'] + 1).setValue(evidence ? evidence.mimeType : '');
  sheet.getRange(row, map['証憑DriveFileId'] + 1).setValue(evidence ? evidence.driveFileId : '');
  sheet.getRange(row, map['証憑DriveUrl'] + 1).setValue(evidence ? evidence.driveUrl : '');
}

function listAccountingUsers_(params) {
  const keyword = trim_(params.keyword);
  const members = listMembers();
  const items = members.filter(function(name) {
    return !keyword || String(name).indexOf(keyword) !== -1;
  }).map(function(name) {
    return { name: String(name) };
  });
  return { ok: true, users: items };
}

function listAccountingSubjects_(params) {
  const type = trim_(params.type);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_SUBJECT_SHEET_NAME);
  const rows = getSheetDataObjects_(sheet, ACCOUNTING_SUBJECT_HEADERS);
  const items = rows.filter(function(row) {
    const kind = trim_(row['収支区分']);
    const enabled = String(row['使用可否']) !== 'false';
    if (!enabled) return false;
    if (!type) return true;
    return kind === type;
  });
  return { ok: true, subjects: items };
}

function createAccountingSubject_(payload) {
  const currentUser = validateCurrentUser_(payload.currentUser);
  const data = payload.data || {};
  const subjectCode = trim_(data.subjectCode);
  const subjectName = trim_(data.subjectName);
  const type = trim_(data.type);

  if (!subjectCode) throw new Error('科目コードは必須です');
  if (!subjectName) throw new Error('科目名は必須です');
  if (!type) throw new Error('収支区分は必須です');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_SUBJECT_SHEET_NAME);
  const existsRow = findRowByColumnValue_(sheet, 1, subjectCode, 2);
  if (existsRow >= 0) throw new Error('同じ科目コードが既に存在します');

  const row = findFirstEmptyRowByColumn_(sheet, 1, 2);
  sheet.getRange(row, 1, 1, ACCOUNTING_SUBJECT_HEADERS.length).setValues([[
    subjectCode,
    subjectName,
    type,
    toNumber_(data.sortOrder),
    data.enabled !== false,
    trim_(data.note)
  ]]);

  return { ok: true, subjectCode: subjectCode, updatedBy: currentUser.name };
}

function updateAccountingSubject_(payload) {
  const currentUser = validateCurrentUser_(payload.currentUser);
  const subjectCode = trim_(payload.subjectCode);
  const data = payload.data || {};
  if (!subjectCode) throw new Error('科目コードが必要です');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_SUBJECT_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, subjectCode, 2);
  if (row < 0) throw new Error('対象科目が見つかりません');

  sheet.getRange(row, 2, 1, 5).setValues([[
    trim_(data.subjectName),
    trim_(data.type),
    toNumber_(data.sortOrder),
    data.enabled !== false,
    trim_(data.note)
  ]]);

  return { ok: true, subjectCode: subjectCode, updatedBy: currentUser.name };
}

function deleteAccountingSubject_(payload) {
  const subjectCode = trim_(payload.subjectCode);
  if (!subjectCode) throw new Error('科目コードが必要です');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_SUBJECT_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, subjectCode, 2);
  if (row < 0) throw new Error('対象科目が見つかりません');
  sheet.deleteRow(row);
  return { ok: true, subjectCode: subjectCode };
}

function normalizeExpenseVoucherPayload_(data) {
  const fiscalYear = data.fiscalYear ? Number(data.fiscalYear) : calcFiscalYear(data.expenseDate);
  const amount = toNumber_(data.amount);

  if (!trim_(data.subjectCode)) throw new Error('科目コードは必須です');
  if (!trim_(data.subjectName)) throw new Error('科目名は必須です');
  if (!trim_(data.expenseDate)) throw new Error('支出日は必須です');
  if (amount <= 0) throw new Error('支出金額は0より大きい値を入力してください');
  if (!trim_(data.summary)) throw new Error('摘要は必須です');
  if (!trim_(data.payee)) throw new Error('支払先は必須です');

  return {
    fiscalYear: fiscalYear,
    subjectCode: trim_(data.subjectCode),
    subjectName: trim_(data.subjectName),
    expenseDate: trim_(data.expenseDate),
    amount: amount,
    summary: trim_(data.summary),
    note: trim_(data.note),
    payee: trim_(data.payee),
    paymentStatus: trim_(data.paymentStatus) || '未払',
    paymentDate: trim_(data.paymentDate),
    relatedTravelControlNo: trim_(data.relatedTravelControlNo)
  };
}

function listExpenseVouchers_(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_EXPENSE_SHEET_NAME);
  const rows = getSheetDataObjects_(sheet, ACCOUNTING_EXPENSE_HEADERS);

  const fiscalYear = trim_(params.fiscalYear);
  const keyword = trim_(params.keyword);
  const status = trim_(params.status);

  const items = rows.filter(function(row) {
    if (fiscalYear && String(row['年度']) !== fiscalYear) return false;
    if (status && trim_(row['支払状況']) !== status) return false;
    if (keyword) {
      const joined = [row['伝票番号'], row['科目名'], row['摘要'], row['支払先'], row['関連旅費管理番号']].join(' ');
      if (joined.indexOf(keyword) === -1) return false;
    }
    return true;
  });

  return { ok: true, vouchers: items };
}

function getExpenseVoucher_(params) {
  const voucherNo = trim_(params.voucherNo);
  if (!voucherNo) throw new Error('伝票番号が必要です');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_EXPENSE_SHEET_NAME);
  const rowNumber = findRowByColumnValue_(sheet, 1, voucherNo, 2);
  if (rowNumber < 0) throw new Error('支出伝票が見つかりません');

  const row = sheet.getRange(rowNumber, 1, 1, ACCOUNTING_EXPENSE_HEADERS.length).getValues()[0];
  const data = {};
  ACCOUNTING_EXPENSE_HEADERS.forEach(function(header, i) { data[header] = row[i]; });
  const evidence = trim_(data['証憑ID']) ? getEvidenceById_(trim_(data['証憑ID'])) : null;

  return { ok: true, voucher: data, evidence: evidence };
}

function createExpenseVoucher_(payload) {
  const currentUser = validateCurrentUser_(payload.currentUser);
  const data = normalizeExpenseVoucherPayload_(payload.data || {});

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_EXPENSE_SHEET_NAME);
  const voucherNo = generateAccountingId_(EXPENSE_VOUCHER_PREFIX, data.fiscalYear, sheet, 1);
  const now = nowString_();

  let evidenceResult = null;
  if (payload.evidence && payload.evidence.base64) {
    evidenceResult = saveEvidenceFile_({
      fiscalYear: data.fiscalYear,
      voucherType: '支出',
      voucherNo: voucherNo,
      fileName: payload.evidence.fileName,
      mimeType: payload.evidence.mimeType,
      base64: payload.evidence.base64,
      currentUser: currentUser
    });
  }

  const row = findFirstEmptyRowByColumn_(sheet, 1, 2);
  sheet.getRange(row, 1, 1, ACCOUNTING_EXPENSE_HEADERS.length).setValues([[
    voucherNo,
    data.fiscalYear,
    data.subjectCode,
    data.subjectName,
    data.expenseDate,
    data.amount,
    data.summary,
    data.note,
    data.payee,
    data.paymentStatus,
    data.paymentDate,
    data.relatedTravelControlNo,
    evidenceResult ? true : false,
    evidenceResult ? evidenceResult.evidenceId : '',
    evidenceResult ? evidenceResult.fileName : '',
    evidenceResult ? evidenceResult.mimeType : '',
    evidenceResult ? evidenceResult.driveFileId : '',
    evidenceResult ? evidenceResult.driveUrl : '',
    now,
    now,
    currentUser.name,
    currentUser.name
  ]]);

  return { ok: true, voucherNo: voucherNo, evidenceId: evidenceResult ? evidenceResult.evidenceId : '' };
}

function updateExpenseVoucher_(payload) {
  const currentUser = validateCurrentUser_(payload.currentUser);
  const voucherNo = trim_(payload.voucherNo);
  if (!voucherNo) throw new Error('伝票番号が必要です');

  const data = normalizeExpenseVoucherPayload_(payload.data || {});
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_EXPENSE_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, voucherNo, 2);
  if (row < 0) throw new Error('支出伝票が見つかりません');

  const oldValues = sheet.getRange(row, 1, 1, ACCOUNTING_EXPENSE_HEADERS.length).getValues()[0];
  const oldObj = {};
  ACCOUNTING_EXPENSE_HEADERS.forEach(function(header, i) { oldObj[header] = oldValues[i]; });

  let evidenceResult = null;
  const evidenceOp = trim_(payload.evidenceOp);

  if (evidenceOp === 'remove' && trim_(oldObj['証憑ID'])) {
    deleteEvidenceById_(trim_(oldObj['証憑ID']));
  } else if ((evidenceOp === 'replace' || evidenceOp === 'attach') && payload.evidence && payload.evidence.base64) {
    if (trim_(oldObj['証憑ID'])) deleteEvidenceById_(trim_(oldObj['証憑ID']));
    evidenceResult = saveEvidenceFile_({
      fiscalYear: data.fiscalYear,
      voucherType: '支出',
      voucherNo: voucherNo,
      fileName: payload.evidence.fileName,
      mimeType: payload.evidence.mimeType,
      base64: payload.evidence.base64,
      currentUser: currentUser
    });
  } else if (trim_(oldObj['証憑ID'])) {
    evidenceResult = {
      evidenceId: trim_(oldObj['証憑ID']),
      fileName: trim_(oldObj['証憑ファイル名']),
      mimeType: trim_(oldObj['証憑MIMEタイプ']),
      driveFileId: trim_(oldObj['証憑DriveFileId']),
      driveUrl: trim_(oldObj['証憑DriveUrl'])
    };
  }

  sheet.getRange(row, 2, 1, ACCOUNTING_EXPENSE_HEADERS.length - 1).setValues([[
    data.fiscalYear,
    data.subjectCode,
    data.subjectName,
    data.expenseDate,
    data.amount,
    data.summary,
    data.note,
    data.payee,
    data.paymentStatus,
    data.paymentDate,
    data.relatedTravelControlNo,
    evidenceResult ? true : false,
    evidenceResult ? evidenceResult.evidenceId : '',
    evidenceResult ? evidenceResult.fileName : '',
    evidenceResult ? evidenceResult.mimeType : '',
    evidenceResult ? evidenceResult.driveFileId : '',
    evidenceResult ? evidenceResult.driveUrl : '',
    oldObj['登録日時'],
    nowString_(),
    oldObj['登録者'],
    currentUser.name
  ]]);

  return { ok: true, voucherNo: voucherNo, evidenceId: evidenceResult ? evidenceResult.evidenceId : '' };
}

function deleteExpenseVoucher_(payload) {
  const voucherNo = trim_(payload.voucherNo);
  if (!voucherNo) throw new Error('伝票番号が必要です');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_EXPENSE_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, voucherNo, 2);
  if (row < 0) throw new Error('支出伝票が見つかりません');

  const values = sheet.getRange(row, 1, 1, ACCOUNTING_EXPENSE_HEADERS.length).getValues()[0];
  const evidenceId = trim_(values[13]);
  if (payload.withEvidence && evidenceId) deleteEvidenceById_(evidenceId);

  sheet.deleteRow(row);
  return { ok: true, voucherNo: voucherNo };
}

function setExpensePaymentStatus_(payload) {
  const currentUser = validateCurrentUser_(payload.currentUser);
  const voucherNo = trim_(payload.voucherNo);
  if (!voucherNo) throw new Error('伝票番号が必要です');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_EXPENSE_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, voucherNo, 2);
  if (row < 0) throw new Error('支出伝票が見つかりません');

  const map = getHeaderMap_(ACCOUNTING_EXPENSE_HEADERS);
  sheet.getRange(row, map['支払状況'] + 1).setValue(trim_(payload.paymentStatus) || '未払');
  sheet.getRange(row, map['支払日'] + 1).setValue(trim_(payload.paymentDate));
  sheet.getRange(row, map['更新日時'] + 1).setValue(nowString_());
  sheet.getRange(row, map['更新者'] + 1).setValue(currentUser.name);

  return { ok: true, voucherNo: voucherNo };
}

function normalizeIncomeVoucherPayload_(data) {
  const fiscalYear = data.fiscalYear ? Number(data.fiscalYear) : calcFiscalYear(data.incomeDate);
  const amount = toNumber_(data.amount);

  if (!trim_(data.subjectCode)) throw new Error('科目コードは必須です');
  if (!trim_(data.subjectName)) throw new Error('科目名は必須です');
  if (!trim_(data.incomeDate)) throw new Error('収入日は必須です');
  if (amount <= 0) throw new Error('収入金額は0より大きい値を入力してください');
  if (!trim_(data.summary)) throw new Error('摘要は必須です');
  if (!trim_(data.payer)) throw new Error('入金元は必須です');

  return {
    fiscalYear: fiscalYear,
    subjectCode: trim_(data.subjectCode),
    subjectName: trim_(data.subjectName),
    incomeDate: trim_(data.incomeDate),
    amount: amount,
    summary: trim_(data.summary),
    note: trim_(data.note),
    payer: trim_(data.payer),
    paymentStatus: trim_(data.paymentStatus) || '未確認',
    paymentDate: trim_(data.paymentDate)
  };
}

function listIncomeVouchers_(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_INCOME_SHEET_NAME);
  const rows = getSheetDataObjects_(sheet, ACCOUNTING_INCOME_HEADERS);

  const fiscalYear = trim_(params.fiscalYear);
  const keyword = trim_(params.keyword);
  const status = trim_(params.status);

  const items = rows.filter(function(row) {
    if (fiscalYear && String(row['年度']) !== fiscalYear) return false;
    if (status && trim_(row['入金確認状況']) !== status) return false;
    if (keyword) {
      const joined = [row['伝票番号'], row['科目名'], row['摘要'], row['入金元']].join(' ');
      if (joined.indexOf(keyword) === -1) return false;
    }
    return true;
  });

  return { ok: true, vouchers: items };
}

function getIncomeVoucher_(params) {
  const voucherNo = trim_(params.voucherNo);
  if (!voucherNo) throw new Error('伝票番号が必要です');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_INCOME_SHEET_NAME);
  const rowNumber = findRowByColumnValue_(sheet, 1, voucherNo, 2);
  if (rowNumber < 0) throw new Error('収入伝票が見つかりません');

  const row = sheet.getRange(rowNumber, 1, 1, ACCOUNTING_INCOME_HEADERS.length).getValues()[0];
  const data = {};
  ACCOUNTING_INCOME_HEADERS.forEach(function(header, i) { data[header] = row[i]; });
  const evidence = trim_(data['証憑ID']) ? getEvidenceById_(trim_(data['証憑ID'])) : null;

  return { ok: true, voucher: data, evidence: evidence };
}

function createIncomeVoucher_(payload) {
  const currentUser = validateCurrentUser_(payload.currentUser);
  const data = normalizeIncomeVoucherPayload_(payload.data || {});
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_INCOME_SHEET_NAME);
  const voucherNo = generateAccountingId_(INCOME_VOUCHER_PREFIX, data.fiscalYear, sheet, 1);
  const now = nowString_();

  let evidenceResult = null;
  if (payload.evidence && payload.evidence.base64) {
    evidenceResult = saveEvidenceFile_({
      fiscalYear: data.fiscalYear,
      voucherType: '収入',
      voucherNo: voucherNo,
      fileName: payload.evidence.fileName,
      mimeType: payload.evidence.mimeType,
      base64: payload.evidence.base64,
      currentUser: currentUser
    });
  }

  const row = findFirstEmptyRowByColumn_(sheet, 1, 2);
  sheet.getRange(row, 1, 1, ACCOUNTING_INCOME_HEADERS.length).setValues([[
    voucherNo,
    data.fiscalYear,
    data.subjectCode,
    data.subjectName,
    data.incomeDate,
    data.amount,
    data.summary,
    data.note,
    data.payer,
    data.paymentStatus,
    data.paymentDate,
    evidenceResult ? true : false,
    evidenceResult ? evidenceResult.evidenceId : '',
    evidenceResult ? evidenceResult.fileName : '',
    evidenceResult ? evidenceResult.mimeType : '',
    evidenceResult ? evidenceResult.driveFileId : '',
    evidenceResult ? evidenceResult.driveUrl : '',
    now,
    now,
    currentUser.name,
    currentUser.name
  ]]);

  return { ok: true, voucherNo: voucherNo, evidenceId: evidenceResult ? evidenceResult.evidenceId : '' };
}

function updateIncomeVoucher_(payload) {
  const currentUser = validateCurrentUser_(payload.currentUser);
  const voucherNo = trim_(payload.voucherNo);
  if (!voucherNo) throw new Error('伝票番号が必要です');

  const data = normalizeIncomeVoucherPayload_(payload.data || {});
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_INCOME_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, voucherNo, 2);
  if (row < 0) throw new Error('収入伝票が見つかりません');

  const oldValues = sheet.getRange(row, 1, 1, ACCOUNTING_INCOME_HEADERS.length).getValues()[0];
  const oldObj = {};
  ACCOUNTING_INCOME_HEADERS.forEach(function(header, i) { oldObj[header] = oldValues[i]; });

  let evidenceResult = null;
  const evidenceOp = trim_(payload.evidenceOp);

  if (evidenceOp === 'remove' && trim_(oldObj['証憑ID'])) {
    deleteEvidenceById_(trim_(oldObj['証憑ID']));
  } else if ((evidenceOp === 'replace' || evidenceOp === 'attach') && payload.evidence && payload.evidence.base64) {
    if (trim_(oldObj['証憑ID'])) deleteEvidenceById_(trim_(oldObj['証憑ID']));
    evidenceResult = saveEvidenceFile_({
      fiscalYear: data.fiscalYear,
      voucherType: '収入',
      voucherNo: voucherNo,
      fileName: payload.evidence.fileName,
      mimeType: payload.evidence.mimeType,
      base64: payload.evidence.base64,
      currentUser: currentUser
    });
  } else if (trim_(oldObj['証憑ID'])) {
    evidenceResult = {
      evidenceId: trim_(oldObj['証憑ID']),
      fileName: trim_(oldObj['証憑ファイル名']),
      mimeType: trim_(oldObj['証憑MIMEタイプ']),
      driveFileId: trim_(oldObj['証憑DriveFileId']),
      driveUrl: trim_(oldObj['証憑DriveUrl'])
    };
  }

  sheet.getRange(row, 2, 1, ACCOUNTING_INCOME_HEADERS.length - 1).setValues([[
    data.fiscalYear,
    data.subjectCode,
    data.subjectName,
    data.incomeDate,
    data.amount,
    data.summary,
    data.note,
    data.payer,
    data.paymentStatus,
    data.paymentDate,
    evidenceResult ? true : false,
    evidenceResult ? evidenceResult.evidenceId : '',
    evidenceResult ? evidenceResult.fileName : '',
    evidenceResult ? evidenceResult.mimeType : '',
    evidenceResult ? evidenceResult.driveFileId : '',
    evidenceResult ? evidenceResult.driveUrl : '',
    oldObj['登録日時'],
    nowString_(),
    oldObj['登録者'],
    currentUser.name
  ]]);

  return { ok: true, voucherNo: voucherNo, evidenceId: evidenceResult ? evidenceResult.evidenceId : '' };
}

function deleteIncomeVoucher_(payload) {
  const voucherNo = trim_(payload.voucherNo);
  if (!voucherNo) throw new Error('伝票番号が必要です');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_INCOME_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, voucherNo, 2);
  if (row < 0) throw new Error('収入伝票が見つかりません');

  const values = sheet.getRange(row, 1, 1, ACCOUNTING_INCOME_HEADERS.length).getValues()[0];
  const evidenceId = trim_(values[12]);
  if (payload.withEvidence && evidenceId) deleteEvidenceById_(evidenceId);

  sheet.deleteRow(row);
  return { ok: true, voucherNo: voucherNo };
}

function saveEvidenceFile_(args) {
  const currentUser = validateCurrentUser_(args.currentUser);
  const blob = parseBase64File_(args.base64, args.mimeType, args.fileName);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const evidenceSheet = ss.getSheetByName(ACCOUNTING_EVIDENCE_SHEET_NAME);
  const evidenceId = generateAccountingId_(EVIDENCE_PREFIX, args.fiscalYear, evidenceSheet, 1);

  const folder = buildEvidenceFolder_(args.fiscalYear, args.voucherType, args.voucherNo);
  const file = folder.createFile(blob);
  const driveUrl = file.getUrl();

  const row = findFirstEmptyRowByColumn_(evidenceSheet, 1, 2);
  evidenceSheet.getRange(row, 1, 1, ACCOUNTING_EVIDENCE_HEADERS.length).setValues([[
    evidenceId,
    args.fiscalYear,
    args.voucherType,
    args.voucherNo,
    args.fileName,
    args.mimeType,
    blob.getBytes().length,
    file.getId(),
    driveUrl,
    folder.getId(),
    nowString_(),
    currentUser.name
  ]]);

  return {
    evidenceId: evidenceId,
    fileName: args.fileName,
    mimeType: args.mimeType,
    driveFileId: file.getId(),
    driveUrl: driveUrl,
    driveFolderId: folder.getId()
  };
}

function listEvidences_(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_EVIDENCE_SHEET_NAME);
  const rows = getSheetDataObjects_(sheet, ACCOUNTING_EVIDENCE_HEADERS);
  const voucherType = trim_(params.voucherType);
  const voucherNo = trim_(params.voucherNo);
  const fiscalYear = trim_(params.fiscalYear);

  const items = rows.filter(function(row) {
    if (voucherType && trim_(row['伝票種別']) !== voucherType) return false;
    if (voucherNo && trim_(row['伝票番号']) !== voucherNo) return false;
    if (fiscalYear && String(row['年度']) !== fiscalYear) return false;
    return true;
  });

  return { ok: true, evidences: items };
}

function getVoucherEvidence_(params) {
  const evidenceId = trim_(params.evidenceId);
  if (!evidenceId) throw new Error('証憑IDが必要です');
  return { ok: true, evidence: getEvidenceById_(evidenceId) };
}

function getEvidenceById_(evidenceId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_EVIDENCE_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, evidenceId, 2);
  if (row < 0) return null;

  const values = sheet.getRange(row, 1, 1, ACCOUNTING_EVIDENCE_HEADERS.length).getValues()[0];
  const obj = {};
  ACCOUNTING_EVIDENCE_HEADERS.forEach(function(header, i) { obj[header] = values[i]; });
  return obj;
}

function uploadEvidence_(payload) {
  const currentUser = validateCurrentUser_(payload.currentUser);
  const voucherType = trim_(payload.voucherType);
  const voucherNo = trim_(payload.voucherNo);
  const fiscalYear = Number(payload.fiscalYear);

  if (!voucherType) throw new Error('伝票種別が必要です');
  if (!voucherNo) throw new Error('伝票番号が必要です');
  if (!fiscalYear) throw new Error('年度が必要です');

  let oldEvidenceId = '';
  if (voucherType === '支出') {
    const current = getExpenseVoucher_({ voucherNo: voucherNo });
    oldEvidenceId = current && current.voucher ? trim_(current.voucher['証憑ID']) : '';
  } else if (voucherType === '収入') {
    const current = getIncomeVoucher_({ voucherNo: voucherNo });
    oldEvidenceId = current && current.voucher ? trim_(current.voucher['証憑ID']) : '';
  }
  if (oldEvidenceId) deleteEvidenceById_(oldEvidenceId);

  const evidence = saveEvidenceFile_({
    fiscalYear: fiscalYear,
    voucherType: voucherType,
    voucherNo: voucherNo,
    fileName: payload.fileName,
    mimeType: payload.mimeType,
    base64: payload.base64,
    currentUser: currentUser
  });

  syncVoucherEvidenceMeta_(voucherType, voucherNo, evidence);
  return { ok: true, evidenceId: evidence.evidenceId, evidence: evidence };
}

function deleteEvidence_(payload) {
  const evidenceId = trim_(payload.evidenceId);
  if (!evidenceId) throw new Error('証憑IDが必要です');

  const evidence = getEvidenceById_(evidenceId);
  if (evidence) {
    syncVoucherEvidenceMeta_(trim_(evidence['伝票種別']), trim_(evidence['伝票番号']), null);
  }
  deleteEvidenceById_(evidenceId);
  return { ok: true, evidenceId: evidenceId };
}

function deleteEvidenceById_(evidenceId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_EVIDENCE_SHEET_NAME);
  const row = findRowByColumnValue_(sheet, 1, evidenceId, 2);
  if (row < 0) return;

  const values = sheet.getRange(row, 1, 1, ACCOUNTING_EVIDENCE_HEADERS.length).getValues()[0];
  const driveFileId = trim_(values[7]);
  if (driveFileId) {
    try {
      DriveApp.getFileById(driveFileId).setTrashed(true);
    } catch (e) {
    }
  }
  sheet.deleteRow(row);
}

function listTravelRecordsForTransfer_(params) {
  const fiscalYear = trim_(params.fiscalYear);
  const keyword = trim_(params.keyword);
  const records = listTravelRecords();
  const expenseRows = listExpenseVouchers_({}).vouchers || [];
  const transferredMap = {};
  expenseRows.forEach(function(row) {
    const key = trim_(row['関連旅費管理番号']);
    if (key) transferredMap[key] = row['伝票番号'];
  });

  const items = records.filter(function(record) {
    if (fiscalYear && String(record.fiscalYear) !== fiscalYear) return false;
    if (keyword) {
      const joined = [record.controlNo, record.tripName, record.driverName, record.travelDate].join(' ');
      if (joined.indexOf(keyword) === -1) return false;
    }
    return true;
  }).map(function(record) {
    return {
      controlNo: record.controlNo,
      fiscalYear: record.fiscalYear,
      travelDate: record.travelDate,
      tripName: record.tripName,
      driverName: record.driverName,
      paymentAmount: record.paymentAmount,
      paidFlag: record.paidFlag,
      transferredVoucherNo: transferredMap[record.controlNo] || ''
    };
  });

  return { ok: true, travels: items };
}

function getTravelRecordForTransfer_(params) {
  const controlNo = trim_(params.controlNo);
  if (!controlNo) throw new Error('管理番号が必要です');

  const records = listTravelRecords();
  const record = records.find(function(item) {
    return trim_(item.controlNo) === controlNo;
  });
  if (!record) throw new Error('対象旅費が見つかりません');
  return { ok: true, travel: record };
}

function checkTravelTransferDuplicate_(params) {
  const controlNo = trim_(params.controlNo);
  if (!controlNo) throw new Error('管理番号が必要です');

  const expenseRows = listExpenseVouchers_({}).vouchers || [];
  const existing = expenseRows.find(function(row) {
    return trim_(row['関連旅費管理番号']) === controlNo;
  });

  return {
    ok: true,
    duplicate: !!existing,
    existingVoucherNo: existing ? existing['伝票番号'] : ''
  };
}

function createExpenseVoucherFromTravel_(payload) {
  const currentUser = validateCurrentUser_(payload.currentUser);
  const controlNo = trim_(payload.controlNo);
  if (!controlNo) throw new Error('旅費管理番号が必要です');

  const duplicateCheck = checkTravelTransferDuplicate_({ controlNo: controlNo });
  if (duplicateCheck.duplicate) {
    return {
      ok: false,
      duplicate: true,
      existingVoucherNo: duplicateCheck.existingVoucherNo,
      error: 'すでに転記済みです'
    };
  }

  const result = getTravelRecordForTransfer_({ controlNo: controlNo });
  const travel = result.travel;
  const overrides = payload.expenseOverrides || {};

  return createExpenseVoucher_({
    currentUser: currentUser,
    data: {
      fiscalYear: travel.fiscalYear,
      subjectCode: trim_(overrides.subjectCode) || DEFAULT_TRAVEL_EXPENSE_SUBJECT_CODE,
      subjectName: trim_(overrides.subjectName) || DEFAULT_TRAVEL_EXPENSE_SUBJECT_NAME,
      expenseDate: travel.travelDate,
      amount: toNumber_(travel.paymentAmount),
      summary: trim_(overrides.summary) || [travel.tripName, travel.driverName].filter(Boolean).join(' / '),
      note: trim_(overrides.note),
      payee: trim_(overrides.payee) || travel.driverName,
      paymentStatus: trim_(overrides.paymentStatus) || '未払',
      paymentDate: trim_(overrides.paymentDate),
      relatedTravelControlNo: travel.controlNo
    }
  });
}

function listBudgetRows_(params) {
  const fiscalYear = trim_(params.fiscalYear);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_BUDGET_SHEET_NAME);
  const rows = getSheetDataObjects_(sheet, ACCOUNTING_BUDGET_HEADERS);
  const items = rows.filter(function(row) {
    return !fiscalYear || String(row['年度']) === fiscalYear;
  });
  return { ok: true, rows: items };
}

function saveBudgetRows_(payload) {
  const currentUser = validateCurrentUser_(payload.currentUser);
  const fiscalYear = Number(payload.fiscalYear);
  const rows = payload.rows || [];
  if (!fiscalYear) throw new Error('年度が必要です');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_BUDGET_SHEET_NAME);
  const all = getSheetDataObjects_(sheet, ACCOUNTING_BUDGET_HEADERS);
  const existingIndexMap = {};
  all.forEach(function(row, i) {
    const key = [row['年度'], row['収支区分'], row['科目コード']].join('|');
    existingIndexMap[key] = i + 2;
  });

  rows.forEach(function(item) {
    const key = [fiscalYear, trim_(item.type), trim_(item.subjectCode)].join('|');
    const budgetTotal = toNumber_(item.initialBudget) + toNumber_(item.revisedBudget);
    const rowData = [
      fiscalYear,
      trim_(item.type),
      trim_(item.subjectCode),
      trim_(item.subjectName),
      toNumber_(item.initialBudget),
      toNumber_(item.revisedBudget),
      budgetTotal,
      toNumber_(item.actualAmount),
      budgetTotal - toNumber_(item.actualAmount),
      trim_(item.note),
      nowString_(),
      nowString_(),
      currentUser.name,
      currentUser.name
    ];

    if (existingIndexMap[key]) {
      const existingRow = existingIndexMap[key];
      const existingValues = sheet.getRange(existingRow, 1, 1, ACCOUNTING_BUDGET_HEADERS.length).getValues()[0];
      rowData[10] = existingValues[10] || nowString_();
      rowData[12] = existingValues[12] || currentUser.name;
      sheet.getRange(existingRow, 1, 1, ACCOUNTING_BUDGET_HEADERS.length).setValues([rowData]);
    } else {
      const row = findFirstEmptyRowByColumn_(sheet, 1, 2);
      sheet.getRange(row, 1, 1, ACCOUNTING_BUDGET_HEADERS.length).setValues([rowData]);
    }
  });

  return { ok: true, fiscalYear: fiscalYear, count: rows.length };
}

function buildSettlementSummary_(params) {
  const fiscalYear = trim_(params.fiscalYear);
  if (!fiscalYear) throw new Error('年度が必要です');

  const expenses = listExpenseVouchers_({ fiscalYear: fiscalYear }).vouchers || [];
  const incomes = listIncomeVouchers_({ fiscalYear: fiscalYear }).vouchers || [];
  const budgets = listBudgetRows_({ fiscalYear: fiscalYear }).rows || [];
  const map = {};

  budgets.forEach(function(row) {
    const key = [row['収支区分'], row['科目コード']].join('|');
    map[key] = {
      fiscalYear: Number(fiscalYear),
      type: row['収支区分'],
      subjectCode: row['科目コード'],
      subjectName: row['科目名'],
      budgetAmount: toNumber_(row['予算合計額']),
      actualAmount: 0
    };
  });

  expenses.forEach(function(row) {
    const key = ['支出', row['科目コード']].join('|');
    if (!map[key]) {
      map[key] = {
        fiscalYear: Number(fiscalYear),
        type: '支出',
        subjectCode: row['科目コード'],
        subjectName: row['科目名'],
        budgetAmount: 0,
        actualAmount: 0
      };
    }
    map[key].actualAmount += toNumber_(row['支出金額']);
  });

  incomes.forEach(function(row) {
    const key = ['収入', row['科目コード']].join('|');
    if (!map[key]) {
      map[key] = {
        fiscalYear: Number(fiscalYear),
        type: '収入',
        subjectCode: row['科目コード'],
        subjectName: row['科目名'],
        budgetAmount: 0,
        actualAmount: 0
      };
    }
    map[key].actualAmount += toNumber_(row['収入金額']);
  });

  const items = Object.keys(map).sort().map(function(key) {
    const item = map[key];
    item.diffAmount = item.budgetAmount - item.actualAmount;
    return item;
  });

  const incomeTotal = incomes.reduce(function(sum, row) { return sum + toNumber_(row['収入金額']); }, 0);
  const expenseTotal = expenses.reduce(function(sum, row) { return sum + toNumber_(row['支出金額']); }, 0);

  return {
    ok: true,
    fiscalYear: Number(fiscalYear),
    summary: items,
    incomeTotal: incomeTotal,
    expenseTotal: expenseTotal,
    balance: incomeTotal - expenseTotal
  };
}


function ensureBudgetPdfSheetInitialized_(ss) {
  const sheet = ensureSheet_(ss, ACCOUNTING_BUDGET_OUTPUT_SHEET_NAME);
  ensureSheetSize_(sheet, 120, 10);
  return sheet;
}

function toJapaneseEraYearLabel_(year) {
  const numericYear = Number(year);
  if (!numericYear) return String(year) + '年度';
  if (numericYear >= 2019) {
    const reiwa = numericYear - 2018;
    return '令和' + reiwa + '年度';
  }
  if (numericYear >= 1989) {
    const heisei = numericYear - 1988;
    return '平成' + heisei + '年度';
  }
  return String(numericYear) + '年度';
}

function formatJapaneseEraDate_(date) {
  const value = date instanceof Date ? date : new Date(date);
  if (isNaN(value.getTime())) return '';
  const year = value.getFullYear();
  const month = value.getMonth() + 1;
  const day = value.getDate();
  if (year >= 2019) return '令和' + (year - 2018) + '年' + month + '月' + day + '日';
  if (year >= 1989) return '平成' + (year - 1988) + '年' + month + '月' + day + '日';
  return year + '年' + month + '月' + day + '日';
}

function getBudgetSubjectMetaMap_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_SUBJECT_SHEET_NAME);
  const rows = getSheetDataObjects_(sheet, ACCOUNTING_SUBJECT_HEADERS);
  const map = {};
  rows.forEach(function(row) {
    const key = [trim_(row['収支区分']), trim_(row['科目コード'])].join('|');
    map[key] = {
      sortOrder: toNumber_(row['表示順']),
      enabled: String(row['使用可否']) !== 'false',
      subjectName: trim_(row['科目名']),
      note: trim_(row['備考'])
    };
  });
  return map;
}

function buildBudgetPdfData_(fiscalYear) {
  const subjectMap = getBudgetSubjectMetaMap_();
  const budgetRows = listBudgetRows_({ fiscalYear: String(fiscalYear) }).rows || [];
  let rows = [];

  if (budgetRows.length) {
    rows = budgetRows.map(function(row) {
      const key = [trim_(row['収支区分']), trim_(row['科目コード'])].join('|');
      const meta = subjectMap[key] || {};
      const budgetAmount = toNumber_(row['当初予算額']) + toNumber_(row['補正予算額']) || toNumber_(row['予算合計額']);
      return {
        type: trim_(row['収支区分']),
        subjectCode: trim_(row['科目コード']),
        subjectName: trim_(row['科目名']) || meta.subjectName || '',
        budgetAmount: budgetAmount,
        note: trim_(row['備考']),
        sortOrder: typeof meta.sortOrder === 'number' ? meta.sortOrder : 0,
        enabled: meta.enabled !== false
      };
    });
  } else {
    rows = Object.keys(subjectMap).map(function(key) {
      const parts = key.split('|');
      const meta = subjectMap[key];
      return {
        type: parts[0] || '',
        subjectCode: parts[1] || '',
        subjectName: meta.subjectName || '',
        budgetAmount: 0,
        note: '',
        sortOrder: meta.sortOrder || 0,
        enabled: meta.enabled !== false
      };
    }).filter(function(row) {
      return row.enabled;
    });
  }

  rows.sort(function(a, b) {
    const typeOrder = { '収入': 0, '支出': 1 };
    const aType = typeOrder.hasOwnProperty(a.type) ? typeOrder[a.type] : 9;
    const bType = typeOrder.hasOwnProperty(b.type) ? typeOrder[b.type] : 9;
    if (aType !== bType) return aType - bType;
    const aSort = Number(a.sortOrder || 0);
    const bSort = Number(b.sortOrder || 0);
    if (aSort !== bSort) return aSort - bSort;
    return String(a.subjectCode || '').localeCompare(String(b.subjectCode || ''), 'ja');
  });

  const incomeRows = rows.filter(function(row) { return row.type === '収入'; });
  const expenseRows = rows.filter(function(row) { return row.type === '支出'; });
  const incomeTotal = incomeRows.reduce(function(sum, row) { return sum + toNumber_(row.budgetAmount); }, 0);
  const expenseTotal = expenseRows.reduce(function(sum, row) { return sum + toNumber_(row.budgetAmount); }, 0);

  return {
    fiscalYear: Number(fiscalYear),
    title: toJapaneseEraYearLabel_(fiscalYear) + ' 宍粟市野球部　一般会計予算書（案）',
    incomeRows: incomeRows,
    expenseRows: expenseRows,
    incomeTotal: incomeTotal,
    expenseTotal: expenseTotal,
    balance: incomeTotal - expenseTotal,
    outputDate: formatJapaneseEraDate_(new Date())
  };
}

function applyBudgetTableSection_(sheet, startRow, title, rows, totalAmount) {
  sheet.getRange(startRow, 1, 1, 10).merge();
  sheet.getRange(startRow, 1)
    .setValue(title)
    .setFontWeight('bold')
    .setFontSize(10)
    .setHorizontalAlignment('left');

  const headerRow = startRow + 1;
  sheet.getRange(headerRow, 1, 1, 3).merge();
  sheet.getRange(headerRow, 4, 1, 2).merge();
  sheet.getRange(headerRow, 6, 1, 5).merge();
  sheet.getRange(headerRow, 1).setValue('科　目');
  sheet.getRange(headerRow, 4).setValue('予算額');
  sheet.getRange(headerRow, 6).setValue('備　考');
  sheet.getRange(headerRow, 1, 1, 10)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);

  var rowIndex = headerRow + 1;
  rows.forEach(function(item, idx) {
    sheet.getRange(rowIndex, 1, 1, 3).merge();
    sheet.getRange(rowIndex, 4, 1, 2).merge();
    sheet.getRange(rowIndex, 6, 1, 5).merge();
    sheet.getRange(rowIndex, 1).setValue((idx + 1) + '. ' + trim_(item.subjectName || item.subjectCode));
    sheet.getRange(rowIndex, 4).setValue(toNumber_(item.budgetAmount));
    sheet.getRange(rowIndex, 6).setValue(trim_(item.note));
    sheet.getRange(rowIndex, 1, 1, 10)
      .setVerticalAlignment('middle')
      .setWrap(true)
      .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
    sheet.getRange(rowIndex, 4).setNumberFormat('#,##0"円"').setHorizontalAlignment('right');
    sheet.getRange(rowIndex, 1).setHorizontalAlignment('left');
    sheet.getRange(rowIndex, 6).setHorizontalAlignment('left');
    sheet.setRowHeight(rowIndex, 28);
    rowIndex += 1;
  });

  sheet.getRange(rowIndex, 1, 1, 3).merge();
  sheet.getRange(rowIndex, 4, 1, 2).merge();
  sheet.getRange(rowIndex, 6, 1, 5).merge();
  sheet.getRange(rowIndex, 1).setValue('合　計').setFontWeight('bold');
  sheet.getRange(rowIndex, 4).setValue(totalAmount).setFontWeight('bold');
  sheet.getRange(rowIndex, 1, 1, 10)
    .setVerticalAlignment('middle')
    .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sheet.getRange(rowIndex, 4).setNumberFormat('#,##0"円"').setHorizontalAlignment('right');
  sheet.getRange(rowIndex, 1).setHorizontalAlignment('left');
  sheet.setRowHeight(rowIndex, 28);

  return rowIndex;
}

function writeBudgetPdfSheet_(sheet, data) {
  ensureSheetSize_(sheet, 120, 10);
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).breakApart();
  sheet.clear();
  sheet.clearFormats();
  sheet.clearConditionalFormatRules();
  sheet.setHiddenGridlines(true);

  const widths = [52, 52, 92, 72, 72, 92, 92, 92, 92, 92];
  widths.forEach(function(width, index) {
    sheet.setColumnWidth(index + 1, width);
  });

  sheet.getRange(2, 1, 1, 10).merge();
  sheet.getRange(2, 1)
    .setValue(data.title)
    .setFontSize(14)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(2, 30);

  var lastIncomeRow = applyBudgetTableSection_(sheet, 4, '【収入の部】', data.incomeRows, data.incomeTotal);
  var expenseStartRow = lastIncomeRow + 2;
  var lastExpenseRow = applyBudgetTableSection_(sheet, expenseStartRow, '【支出の部】', data.expenseRows, data.expenseTotal);

  var summaryStartRow = lastExpenseRow + 2;
  var labels = ['収　入　額', '支　出　額', '差　引　額'];
  var values = [data.incomeTotal, data.expenseTotal, data.balance];
  for (var i = 0; i < labels.length; i++) {
    var row = summaryStartRow + i;
    sheet.getRange(row, 2, 1, 2).merge();
    sheet.getRange(row, 4, 1, 2).merge();
    sheet.getRange(row, 2).setValue(labels[i]).setFontWeight('bold').setHorizontalAlignment('center');
    sheet.getRange(row, 4).setValue(values[i]).setNumberFormat('#,##0"円"').setHorizontalAlignment('right');
    sheet.getRange(row, 2, 1, 4).setVerticalAlignment('middle');
    sheet.setRowHeight(row, 24);
  }
  sheet.getRange(summaryStartRow + 2, 1, 1, 6).setBorder(false, false, true, false, false, false, '#000000', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);

  var footerRow = summaryStartRow + 5;
  sheet.getRange(footerRow, 1, 1, 4).merge();
  sheet.getRange(footerRow, 1).setValue('上記のとおり提案いたします。').setHorizontalAlignment('left');
  sheet.getRange(footerRow, 6, 1, 5).merge();
  sheet.getRange(footerRow, 6).setValue(data.outputDate).setHorizontalAlignment('center');

  sheet.getRange(footerRow + 1, 6, 1, 2).merge();
  sheet.getRange(footerRow + 1, 6).setValue('監　督').setHorizontalAlignment('center');
  sheet.getRange(footerRow + 1, 8, 1, 3).merge();
  sheet.getRange(footerRow + 1, 8).setValue('　　　　　　　　　印').setHorizontalAlignment('left');

  sheet.getRange(footerRow + 2, 6, 1, 2).merge();
  sheet.getRange(footerRow + 2, 6).setValue('会　計').setHorizontalAlignment('center');
  sheet.getRange(footerRow + 2, 8, 1, 3).merge();
  sheet.getRange(footerRow + 2, 8).setValue('　　　　　　　　　印').setHorizontalAlignment('left');

  sheet.getRange(1, 1, footerRow + 2, 10).setFontSize(10).setFontFamily('Noto Sans JP');
}

function buildBudgetPdfExportUrl_(spreadsheetId, sheetId) {
  const params = {
    format: 'pdf',
    exportFormat: 'pdf',
    gid: sheetId,
    size: 'A4',
    portrait: 'true',
    fitw: 'true',
    sheetnames: 'false',
    printtitle: 'false',
    pagenumbers: 'false',
    gridlines: 'false',
    fzr: 'false',
    horizontal_alignment: 'CENTER',
    vertical_alignment: 'TOP',
    top_margin: '0.50',
    bottom_margin: '0.50',
    left_margin: '0.40',
    right_margin: '0.40',
    attachment: 'true'
  };

  const query = Object.keys(params).map(function(key) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
  }).join('&');
  return 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/export?' + query;
}

function exportBudgetSheetPdfBlob_(sheet, fileName) {
  SpreadsheetApp.flush();
  Utilities.sleep(1000);
  const url = buildBudgetPdfExportUrl_(sheet.getParent().getId(), sheet.getSheetId());
  const response = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  });
  const code = response.getResponseCode();
  if (code >= 400) throw new Error('予算書PDFの出力に失敗しました');
  return response.getBlob().setName(fileName);
}

function generateBudgetPdf_(payload) {
  validateCurrentUser_(payload.currentUser);
  const fiscalYear = Number(payload.fiscalYear);
  if (!fiscalYear) throw new Error('年度が必要です');

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ensureBudgetPdfSheetInitialized_(ss);
  const data = buildBudgetPdfData_(fiscalYear);
  writeBudgetPdfSheet_(sheet, data);

  const timestamp = Utilities.formatDate(new Date(), APP_TIMEZONE, 'yyyyMMdd_HHmmss');
  const fileName = '一般会計予算書_' + fiscalYear + '年度_' + timestamp + '.pdf';
  const pdfBlob = exportBudgetSheetPdfBlob_(sheet, fileName);

  return {
    ok: true,
    fiscalYear: fiscalYear,
    fileName: fileName,
    mimeType: 'application/pdf',
    pdfBase64: Utilities.base64Encode(pdfBlob.getBytes()),
    createdAt: nowString_()
  };
}

function exportSettlementSheet_(payload) {
  const fiscalYear = trim_(payload.fiscalYear);
  if (!fiscalYear) throw new Error('年度が必要です');

  const result = buildSettlementSummary_({ fiscalYear: fiscalYear });
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ACCOUNTING_SETTLEMENT_OUTPUT_SHEET_NAME);
  sheet.clear();
  sheet.clearFormats();

  sheet.getRange(1, 1).setValue('決算書（' + fiscalYear + '年度）').setFontWeight('bold').setFontSize(16);
  sheet.getRange(3, 1, 1, ACCOUNTING_SETTLEMENT_HEADERS.length).setValues([ACCOUNTING_SETTLEMENT_HEADERS]);
  sheet.getRange(3, 1, 1, ACCOUNTING_SETTLEMENT_HEADERS.length)
    .setFontWeight('bold')
    .setBackground('#2563eb')
    .setFontColor('#ffffff');

  const rows = result.summary.map(function(item) {
    return [
      item.fiscalYear,
      item.type,
      item.subjectCode,
      item.subjectName,
      item.budgetAmount,
      item.actualAmount,
      item.diffAmount
    ];
  });

  if (rows.length > 0) {
    sheet.getRange(4, 1, rows.length, ACCOUNTING_SETTLEMENT_HEADERS.length).setValues(rows);
  }

  const footerRow = rows.length > 0 ? 4 + rows.length + 1 : 4;
  sheet.getRange(footerRow, 1, 1, 7).setValues([[
    Number(fiscalYear),
    '合計',
    '',
    '',
    '',
    result.expenseTotal,
    result.balance
  ]]);

  return {
    ok: true,
    fiscalYear: Number(fiscalYear),
    incomeTotal: result.incomeTotal,
    expenseTotal: result.expenseTotal,
    balance: result.balance
  };
}

function createMemberFromAccounting_(payload) {
  validateCurrentUser_(payload.currentUser);
  const name = trim_(payload.name || (payload.data && payload.data.name));
  return addMember(name);
}

function updateMemberFromAccounting_(payload) {
  validateCurrentUser_(payload.currentUser);
  const oldName = trim_(payload.oldName || (payload.data && payload.data.oldName));
  const newName = trim_(payload.newName || (payload.data && payload.data.newName));
  return updateMember(oldName, newName);
}

function deleteMemberFromAccounting_(payload) {
  validateCurrentUser_(payload.currentUser);
  const name = trim_(payload.name || (payload.data && payload.data.name));
  return deleteMember(name);
}

/*********************************
 * 非破壊セットアップ補助
 *********************************/
function ensureSheetWithHeaders_(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  ensureSheetSize_(sheet, 200, headers.length);
  const currentHeaders = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const isBlankHeader = currentHeaders.every(function(v) {
    return trim_(v) === '';
  });

  if (isBlankHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#2563eb')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
    return sheet;
  }

  const headerMismatch = headers.some(function(header, index) {
    return trim_(currentHeaders[index]) !== header;
  });
  if (headerMismatch) {
    throw new Error('既存シート「' + sheetName + '」のヘッダーが想定と一致しません。データ保護のため setupDatabase を中断しました。');
  }

  sheet.setFrozenRows(1);
  ensureHeaderStyle_(sheet, headers.length);
  return sheet;
}

function ensureHeaderStyle_(sheet, headerLength) {
  sheet.getRange(1, 1, 1, headerLength)
    .setFontWeight('bold')
    .setBackground('#2563eb')
    .setFontColor('#ffffff');
}

function ensureReceiptSheetInitialized_(ss) {
  const sheet = ensureSheet_(ss, RECEIPT_SHEET_NAME);
  ensureSheetSize_(sheet, 200, RECEIPT_HEADERS.length);

  const titleCell = trim_(sheet.getRange(1, 1).getValue());
  const headerValues = sheet.getRange(RECEIPT_HEADER_ROW, 1, 1, RECEIPT_HEADERS.length).getValues()[0];
  const headerMatches = RECEIPT_HEADERS.every(function(header, index) {
    return trim_(headerValues[index]) === header;
  });

  if (!titleCell && !headerMatches) {
    formatReceiptSheet_(sheet);
  }

  return sheet;
}

