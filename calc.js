// 취등록세 계산기. src/tax.ts의 acquisitionTax와 같은 식이며 테스트가 두 결과를 비교한다.
function acquisitionTax(priceWithVat, permille, reliefCap) {
  var base = Math.floor((priceWithVat * 10) / 11)
  var gross = Math.floor((base * permille) / 1000 / 10) * 10
  var relief = Math.min(gross, reliefCap)
  return { base: base, gross: gross, relief: relief, net: gross - relief }
}

function wonText(n) {
  return n.toLocaleString('ko-KR') + '원'
}

function renderResult(form) {
  var out = form.elements.result
  var manwon = Number(String(form.elements.price.value).replace(/[^0-9.]/g, ''))
  if (!manwon) { out.textContent = '가격을 넣으면 계산합니다.'; return }
  var kind = form.elements.kind.value.split(':')
  var r = acquisitionTax(Math.round(manwon * 10000), Number(kind[0]), Number(kind[1]))
  var lines = [['과세표준(부가세 제외)', wonText(r.base)], ['취득세', wonText(r.gross)]]
  if (r.relief) lines.push(['감면', '−' + wonText(r.relief)])
  // 내는 금액을 먼저 크게, 그 아래에 계산 과정을 줄마다 적는다.
  var rows = lines.map(function (l) { return '<span><span>' + l[0] + '</span><b>' + l[1] + '</b></span>' })
  out.innerHTML = '<span class="res-label">내는 금액</span><b class="res-total">' + wonText(r.net) + '</b><span class="res-lines">' + rows.join('') + '</span>'
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('form[data-calc]').forEach(function (form) {
    form.addEventListener('input', function () { renderResult(form) })
    form.addEventListener('change', function () { renderResult(form) })
  })
}
