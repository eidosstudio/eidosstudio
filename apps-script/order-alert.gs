// ── 에이도스 사이트(eidosstudio.co.kr) 새 주문 메일 알림 ──
// 5분마다 Firestore orders 컬렉션에서 새 주문을 찾아 대표 메일로 알려준다.
// 처음 한 번 setup 을 실행해 권한을 승인하면 자동으로 돌아간다. (사이트 코드와는 별개)
const PROJECT = 'eidos-studio-26f16';
const TO = 'eidosstudio01@gmail.com';
const SITE = 'https://eidosstudio.co.kr';

// 처음 한 번만 실행: 5분마다 확인하는 자동 실행을 설치한다
function setup() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'checkNewOrders') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('checkNewOrders').timeBased().everyMinutes(5).create();
  PropertiesService.getScriptProperties().setProperty('lastCreatedAt', new Date().toISOString());
  Logger.log('설치 완료: 지금부터 들어오는 새 주문을 5분마다 확인해 ' + TO + ' 로 알립니다.');
}

// 알림을 끄고 싶을 때 실행
function stop() {
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  Logger.log('알림을 껐습니다.');
}

function checkNewOrders() {
  const props = PropertiesService.getScriptProperties();
  const last = props.getProperty('lastCreatedAt') || new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const url = 'https://firestore.googleapis.com/v1/projects/' + PROJECT + '/databases/(default)/documents:runQuery';
  const query = { structuredQuery: {
    from: [{ collectionId: 'orders' }],
    where: { fieldFilter: { field: { fieldPath: 'createdAt' }, op: 'GREATER_THAN', value: { timestampValue: last } } },
    orderBy: [{ field: { fieldPath: 'createdAt' }, direction: 'ASCENDING' }],
    limit: 50
  } };
  const res = UrlFetchApp.fetch(url, {
    method: 'post', contentType: 'application/json', payload: JSON.stringify(query),
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('주문 조회 실패: ' + res.getContentText().slice(0, 300));
  const rows = JSON.parse(res.getContentText()).filter(function (r) { return r.document; });
  let newest = last;
  rows.forEach(function (r) {
    const f = r.document.fields || {};
    sendOrderMail_(f);
    if (f.createdAt && f.createdAt.timestampValue) newest = f.createdAt.timestampValue;
  });
  props.setProperty('lastCreatedAt', newest);
}

function sendOrderMail_(f) {
  const str = function (v) { return v ? (v.stringValue || v.integerValue || v.doubleValue || '') : ''; };
  const b = (f.buyer && f.buyer.mapValue && f.buyer.mapValue.fields) || {};
  const items = ((f.items && f.items.arrayValue && f.items.arrayValue.values) || []).map(function (v) {
    const i = v.mapValue.fields;
    const qty = Number(str(i.qty)) || 0, price = Number(str(i.price)) || 0;
    return '- ' + str(i.name) + ' × ' + qty + '  (KRW ' + (price * qty).toLocaleString() + ')';
  });
  const total = Number(str(f.total)) || 0;
  const orderNo = str(f.orderNo);
  const lines = [
    '에이도스 사이트에 새 주문이 들어왔습니다.',
    '',
    '주문번호: ' + orderNo,
    '상태: ' + str(f.status),
    '결제 금액: KRW ' + total.toLocaleString() + ' (배송비 착불)',
    '',
    '받는 분: ' + str(b.name) + ' / ' + str(b.phone) + (str(b.email) ? ' / ' + str(b.email) : ''),
    '주소: ' + (str(b.zip) ? '(' + str(b.zip) + ') ' : '') + str(b.address) + ' ' + str(b.address2),
    str(b.memo) ? '요청사항: ' + str(b.memo) : '',
    '',
    '상품',
    items.join('\n'),
    '',
    '페이앱 판매자 앱에서 상품명 끝 주문번호(' + orderNo + ')와 금액이 같은 결제가 들어왔는지 확인한 뒤,',
    '사이트 ≡ 메뉴 › 주문 관리에서 상태를 "결제확인"으로 바꿔 주세요.',
    SITE
  ].filter(function (x, i, a) { return !(x === '' && a[i - 1] === ''); });
  MailApp.sendEmail({
    to: TO,
    subject: '[에이도스 새 주문] ' + orderNo + ' · KRW ' + total.toLocaleString() + ' · ' + str(b.name),
    body: lines.join('\n')
  });
}
