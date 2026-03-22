import jsPDF from "jspdf";
import { Invoice } from "./types";

export function generateInvoicePDF(invoice: Invoice): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  const fmt = (val: string | number) =>
    parseFloat(String(val)).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Header - Company name
  doc.setFontSize(22);
  doc.setTextColor(220, 38, 38);
  doc.setFont("helvetica", "bold");
  doc.text("SpikeX Logistics", margin, y);

  // "INVOICE" label on the right
  doc.setFontSize(28);
  doc.setTextColor(55, 65, 81);
  doc.text("INVOICE", pageWidth - margin, y, { align: "right" });

  y += 10;
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.text("Reliable Parcel Delivery Services", margin, y);

  // Invoice meta on the right
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  doc.text(`Invoice #: ${invoice.invoice_number}`, pageWidth - margin, y - 3, {
    align: "right",
  });
  y += 5;
  doc.text(`Issued: ${invoice.issued_date}`, pageWidth - margin, y, {
    align: "right",
  });
  y += 5;
  doc.text(`Due: ${invoice.due_date}`, pageWidth - margin, y, {
    align: "right",
  });
  y += 5;
  doc.setFont("helvetica", "bold");
  const statusLabel = invoice.payment_status_display || invoice.payment_status;
  doc.text(`Status: ${statusLabel.toUpperCase()}`, pageWidth - margin, y, {
    align: "right",
  });

  // Divider
  y += 10;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  // Bill From / Bill To
  y += 12;
  const colMid = pageWidth / 2;

  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.setFont("helvetica", "bold");
  doc.text("BILL FROM", margin, y);
  doc.text("BILL TO", colMid + 10, y);

  y += 7;
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text(invoice.shipment.sender_name, margin, y);
  doc.text(invoice.shipment.receiver_name, colMid + 10, y);

  y += 6;
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.shipment.sender_email, margin, y);
  doc.text(invoice.shipment.receiver_email, colMid + 10, y);

  y += 5;
  doc.text(invoice.shipment.sender_phone, margin, y);
  doc.text(invoice.shipment.receiver_phone, colMid + 10, y);

  // Divider
  y += 12;
  doc.line(margin, y, pageWidth - margin, y);

  // Shipment Details header
  y += 10;
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.setFont("helvetica", "bold");
  doc.text("SHIPMENT DETAILS", margin, y);

  y += 8;
  // Table header
  doc.setFillColor(249, 250, 251);
  doc.rect(margin, y - 4, pageWidth - margin * 2, 10, "F");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text("TRACKING CODE", margin + 4, y + 2);
  doc.text("ORIGIN", margin + 50, y + 2);
  doc.text("DESTINATION", margin + 95, y + 2);
  doc.text("WEIGHT", margin + 140, y + 2);

  // Table row
  y += 12;
  doc.setFontSize(9);
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.shipment.tracking_code, margin + 4, y + 2);
  doc.text(
    invoice.shipment.origin.substring(0, 22),
    margin + 50,
    y + 2
  );
  doc.text(
    invoice.shipment.destination.substring(0, 22),
    margin + 95,
    y + 2
  );
  doc.text(`${invoice.shipment.weight} kg`, margin + 140, y + 2);

  if (invoice.shipment.description) {
    y += 10;
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("Description:", margin + 4, y);
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    const descLines = doc.splitTextToSize(
      invoice.shipment.description,
      pageWidth - margin * 2 - 8
    );
    y += 5;
    doc.text(descLines, margin + 4, y);
    y += descLines.length * 4;
  }

  // Divider
  y += 10;
  doc.line(margin, y, pageWidth - margin, y);

  // Pricing section
  y += 12;
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.setFont("helvetica", "bold");
  doc.text("PRICING BREAKDOWN", margin, y);

  const priceX = pageWidth - margin;
  const labelX = priceX - 60;

  y += 12;
  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  doc.setFont("helvetica", "normal");

  doc.text("Shipping Fee", labelX, y);
  doc.text(`$${fmt(invoice.shipping_fee)}`, priceX, y, { align: "right" });

  y += 8;
  doc.text(`Tax (${fmt(invoice.tax_rate)}%)`, labelX, y);
  doc.text(`$${fmt(invoice.tax_amount)}`, priceX, y, { align: "right" });

  y += 8;
  doc.text("Discount", labelX, y);
  doc.setTextColor(220, 38, 38);
  doc.text(`-$${fmt(invoice.discount)}`, priceX, y, { align: "right" });

  // Total line
  y += 5;
  doc.setDrawColor(17, 24, 39);
  doc.setLineWidth(0.3);
  doc.line(labelX - 5, y, priceX, y);

  y += 8;
  doc.setFontSize(14);
  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "bold");
  doc.text("Total", labelX, y);
  doc.text(`$${fmt(invoice.total_amount)}`, priceX, y, { align: "right" });

  // Notes
  if (invoice.notes) {
    y += 18;
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.setFont("helvetica", "bold");
    doc.text("NOTES", margin, y);
    y += 7;
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.setFont("helvetica", "normal");
    const noteLines = doc.splitTextToSize(
      invoice.notes,
      pageWidth - margin * 2
    );
    doc.text(noteLines, margin, y);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Thank you for using SpikeX Logistics",
    pageWidth / 2,
    footerY,
    { align: "center" }
  );
  doc.text(
    "www.spikexlogistics.com",
    pageWidth / 2,
    footerY + 5,
    { align: "center" }
  );

  doc.save(`${invoice.invoice_number}.pdf`);
}
