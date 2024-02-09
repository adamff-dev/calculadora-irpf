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

commonContingenciesContibutionRate = 4.82; // cotización cont. comúm
vocationalTrainingContibutionRate = 0.1; // cotización formación
unemploymentContributioRate = 1.55; // cotización desempleo

let $salary,
  $salaryPayments,
  $totalIrpf,
  $totalIrpfRate,
  $annualNet,
  $mensualNet;

window.addEventListener("load", function () {
  [
    $salary,
    $salaryPayments,
    $totalIrpf,
    $totalIrpfRate,
    $annualNet,
    $mensualNet,
    $commonContingenciesContibution,
    $vocationalTrainingContibution,
    $unemploymentContribution,
  ] = getDocumentElements();

  $salary.addEventListener("input", calcular);
  $salaryPayments.addEventListener("input", calcular);
});

function calcular() {
  const salary = parseFloat($salary.value);
  const salaryPayments = parseFloat($salaryPayments.value);
  let pending = salary;
  let totalIrpf = calculateTotalTax(pending);
  const totalIrpfRate = (totalIrpf * 100) / salary;

  const commonContingenciesContibution =
    (salary * commonContingenciesContibutionRate) / 100;
  const vocationalTrainingContibution =
    (salary * vocationalTrainingContibutionRate) / 100;
  const unemploymentContribution = (salary * unemploymentContributioRate) / 100;

  const annualNet =
    salary -
    totalIrpf -
    commonContingenciesContibution -
    vocationalTrainingContibution -
    unemploymentContribution;
  const mensualNet = annualNet / salaryPayments;

  setResults(
    totalIrpf,
    totalIrpfRate,
    annualNet,
    mensualNet,
    commonContingenciesContibution,
    vocationalTrainingContibution,
    unemploymentContribution
  );
}

function setResults(
  totalIrpf,
  totalIrpfRate,
  annualNet,
  mensualNet,
  commonContingenciesContibution,
  vocationalTrainingContibution,
  unemploymentContribution
) {
  $totalIrpf.innerText = formatNumber(totalIrpf);
  $totalIrpfRate.innerText = formatNumber(totalIrpfRate, "%");
  $annualNet.innerText = formatNumber(annualNet);
  $mensualNet.innerText = formatNumber(mensualNet);
  $commonContingenciesContibution.innerText = formatNumber(
    commonContingenciesContibution
  );
  $vocationalTrainingContibution.innerText = formatNumber(
    vocationalTrainingContibution
  );
  $unemploymentContribution.innerText = formatNumber(unemploymentContribution);
}

function formatNumber(value, suffix = "€") {
  const parts = value.toFixed(2).toString().split(".");

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return parts.join(",") + " " + suffix;
}

function getDocumentElements() {
  const $salary = document.getElementById("salary");
  const $salaryPayments = document.getElementById("salaryPayments");
  const $totalIrpf = document.getElementById("totalIrpf");
  const $totalIrpfRate = document.getElementById("totalIrpfRate");
  const $annualNet = document.getElementById("annualNet");
  const $mensualNet = document.getElementById("mensualNet");
  const $commonContingenciesContibution = document.getElementById(
    "commonContingenciesContibution"
  );
  const $vocationalTrainingContibution = document.getElementById(
    "vocationalTrainingContibution"
  );
  const $unemploymentContribution = document.getElementById(
    "unemploymentContribution"
  );
  return [
    $salary,
    $salaryPayments,
    $totalIrpf,
    $totalIrpfRate,
    $annualNet,
    $mensualNet,
    $commonContingenciesContibution,
    $vocationalTrainingContibution,
    $unemploymentContribution,
  ];
}

function calculateTotalTax(pending) {
  let totalIrpf = 0;

  for (const section of irpfSections) {
    const [lower, upper, rate] = section;

    if (pending > upper) {
      totalIrpf += (upper - lower) * (rate / 100);
    } else {
      totalIrpf += (pending - lower) * (rate / 100);
      break;
    }
  }
  return totalIrpf;
}
