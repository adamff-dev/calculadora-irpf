/**
 * Desde 0 hasta 12.450 euros: retención del 19%.
 * Desde 12.450 hasta 20.199 euros: retención del 24%.
 * Desde 20.200 hasta 35.199 euros: retención del 30%.
 * Desde 35.200 hasta 59.999 euros: retención del 37%.
 * Desde 60.000 hasta 299.999 euros: retención del 45%.
 * Más de 300.000 euros: retención del 47%.
 */

irpfSections = [
  [0, 12450, 19],
  [12450, 20199, 24],
  [20200, 35199, 30],
  [35200, 59999, 37],
  [60000, 299999, 45],
  [300000, 100000000, 47],
];

let $salary, $salaryPayments, $totalTax, $totalTaxRate, $annualNet, $mensualNet;

window.addEventListener("load", function () {
  [
    $salary,
    $salaryPayments,
    $totalTax,
    $totalTaxRate,
    $annualNet,
    $mensualNet,
  ] = getDocumentElements();

  $salary.addEventListener("input", calcular);
  $salaryPayments.addEventListener("input", calcular);
});

function calcular() {
  const salary = parseFloat($salary.value);
  const salaryPayments = parseFloat($salaryPayments.value);
  let pending = salary;
  let totalTax = calculateTotalTax(pending);

  const totalTaxRate = (totalTax * 100) / salary;
  const annualNet = salary - totalTax;
  const mensualNet = annualNet / salaryPayments;

  setResults(
    $totalTax,
    totalTax,
    $totalTaxRate,
    totalTaxRate,
    $annualNet,
    annualNet,
    $mensualNet,
    mensualNet
  );
}

function setResults(
  $totalTax,
  totalTax,
  $totalTaxRate,
  totalTaxRate,
  $annualNet,
  annualNet,
  $mensualNet,
  mensualNet
) {
  $totalTax.innerText = formatNumber(totalTax);
  $totalTaxRate.innerText = formatNumber(totalTaxRate, "%");
  $annualNet.innerText = formatNumber(annualNet);
  $mensualNet.innerText = formatNumber(mensualNet);
}

function formatNumber(value, suffix = "€") {
  const parts = value.toFixed(2).toString().split(".");

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return parts.join(",") + " " + suffix;
}

function getDocumentElements() {
  const $salary = document.getElementById("salary");
  const $salaryPayments = document.getElementById("salaryPayments");
  const $totalTax = document.getElementById("totalTax");
  const $totalTaxRate = document.getElementById("totalTaxRate");
  const $annualNet = document.getElementById("annualNet");
  const $mensualNet = document.getElementById("mensualNet");
  return [
    $salary,
    $salaryPayments,
    $totalTax,
    $totalTaxRate,
    $annualNet,
    $mensualNet,
  ];
}

function calculateTotalTax(pending) {
  let totalTax = 0;

  for (const section of irpfSections) {
    const [lower, upper, rate] = section;

    if (pending > upper) {
      totalTax += (upper - lower) * (rate / 100);
    } else {
      totalTax += (pending - lower) * (rate / 100);
      break;
    }
  }
  return totalTax;
}
