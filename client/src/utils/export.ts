/**
 * Export helpers to CSV / Excel-compatible formats
 */

export function exportToCSV(filename: string, rows: Record<string, unknown>[]): void {
  if (!rows || rows.length === 0) {
    alert('ไม่มีข้อมูลสำหรับส่งออก (No data to export)');
    return;
  }

  const headers = Object.keys(rows[0]);
  const csvContent = [
    // Add UTF-8 BOM so Excel opens Thai fonts correctly
    '\uFEFF' + headers.join(','),
    ...rows.map(row =>
      headers
        .map(header => {
          const val = row[header] ?? '';
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    )
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
