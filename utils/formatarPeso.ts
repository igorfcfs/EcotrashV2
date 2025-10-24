export default function formatarPeso(valor) {
  if (!valor) return "0 g";

  if (valor >= 1000) {
    const kg = (valor / 1000).toFixed(2); // duas casas decimais
    return `${kg} kg`;
  }

  return `${valor} g`;
}
