import { jsPDF } from "jspdf";

/**
 * Generates an official, beautifully styled PDF Vehicle Health Report
 * matching the user's standardized diagnostic template.
 *
 * @param {Object} report - Structured vehicle health report data
 */
export function generateVehicleHealthReportPdf(report) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let y = margin;

  // Helper for page break check
  const checkPageBreak = (neededHeight = 20) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin + 6;
      drawPageBorder();
    }
  };

  const drawPageBorder = () => {
    // Subtle top red brand stripe
    doc.setFillColor(229, 37, 42); // Hauloop Red
    doc.rect(0, 0, pageWidth, 5, "F");

    // Page footer note
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `HAULOOP VEHICLE CARE · Report ID: ${report.reportId} · Page ${doc.internal.getNumberOfPages()}`,
      margin,
      pageHeight - 6
    );
  };

  drawPageBorder();
  y += 4;

  // ==========================================
  // 1. BRAND HEADER & REPORT TITLE
  // ==========================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(229, 37, 42); // Brand red
  doc.text("HAULOOP", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("VEHICLE CARE · FMC650 TELEMATICS", margin + 34, y - 0.5);

  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text("VEHICLE HEALTH REPORT", margin, y);

  // Meta block on the right
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 43, 73);
  const metaLines = [
    `Report ID: ${report.reportId}`,
    `Generated On: ${report.generatedOn}`,
    `Report Period: ${report.reportPeriod}`
  ];

  let metaY = margin + 3;
  metaLines.forEach((m) => {
    doc.text(m, pageWidth - margin, metaY, { align: "right" });
    metaY += 4.5;
  });

  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // ==========================================
  // 2. VEHICLE IDENTITY BANNER
  // ==========================================
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");

  // Left red accent stripe
  doc.setFillColor(229, 37, 42);
  doc.rect(margin, y, 3, 14, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("VEHICLE NO", margin + 6, y + 4.5);
  doc.text("MODEL", margin + 46, y + 4.5);
  doc.text("VIN", margin + 88, y + 4.5);
  doc.text("DRIVER", margin + 132, y + 4.5);
  doc.text("ODOMETER", margin + 158, y + 4.5);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(229, 37, 42);
  doc.text(report.vehicleNo, margin + 6, y + 10.5);

  doc.setTextColor(15, 23, 42);
  doc.text(report.model, margin + 46, y + 10.5);
  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.text(report.vin, margin + 88, y + 10.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(report.driver, margin + 132, y + 10.5);
  doc.text(report.odometer, margin + 158, y + 10.5);

  y += 18;

  // ==========================================
  // 3. OVERALL STATUS & HEALTH BADGES
  // ==========================================
  const badgeWidth = (contentWidth - 6) / 3;

  const getStatusColor = (val) => {
    const s = (val || "").toLowerCase();
    if (s.includes("health")) return { fill: [220, 252, 231], text: [21, 128, 61] }; // green
    if (s.includes("attention") || s.includes("maintenance")) return { fill: [254, 243, 199], text: [180, 83, 9] }; // amber
    if (s.includes("critical") || s.includes("inspection") || s.includes("offline")) return { fill: [254, 226, 226], text: [185, 28, 28] }; // red
    return { fill: [241, 245, 249], text: [100, 116, 139] };
  };

  const badges = [
    { label: "Overall Vehicle Status", val: report.overallStatus },
    { label: "Vehicle Health", val: report.vehicleHealth },
    { label: "Assessment", val: report.assessment }
  ];

  badges.forEach((b, i) => {
    const bx = margin + i * (badgeWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(bx, y, badgeWidth, 15, 1.5, 1.5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(b.label.toUpperCase(), bx + 4, y + 4.5);

    const colors = getStatusColor(b.val);
    doc.setFillColor(colors.fill[0], colors.fill[1], colors.fill[2]);
    doc.roundedRect(bx + 4, y + 6.5, badgeWidth - 8, 6.5, 1, 1, "F");

    doc.setFontSize(8.5);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.text(`[${b.val}]`, bx + (badgeWidth / 2), y + 11, { align: "center" });
  });

  y += 20;

  // ==========================================
  // 4. SUMMARY SECTION
  // ==========================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Summary:", margin, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  const summaryLines = doc.splitTextToSize(report.summary, contentWidth - 8);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y - 2, contentWidth, summaryLines.length * 4.5 + 5, 1.5, 1.5, "FD");
  doc.setFillColor(2, 132, 199);
  doc.rect(margin, y - 2, 2.5, summaryLines.length * 4.5 + 5, "F");

  doc.text(summaryLines, margin + 6, y + 2.5);
  y += summaryLines.length * 4.5 + 9;

  // ==========================================
  // 5. ISSUE EXPLANATION SECTION
  // ==========================================
  checkPageBreak(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Issue explanation:", margin, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  const issueLines = doc.splitTextToSize(report.issueExplanation, contentWidth - 8);

  doc.setFillColor(255, 251, 235);
  doc.setDrawColor(254, 243, 199);
  doc.roundedRect(margin, y - 2, contentWidth, issueLines.length * 4.5 + 5, 1.5, 1.5, "FD");
  doc.setFillColor(245, 158, 11);
  doc.rect(margin, y - 2, 2.5, issueLines.length * 4.5 + 5, "F");

  doc.text(issueLines, margin + 6, y + 2.5);
  y += issueLines.length * 4.5 + 9;

  // ==========================================
  // 6. IMPORTANT NOTICE
  // ==========================================
  checkPageBreak(18);
  const warnText =
    "Important: Critical warnings should be assessed promptly. Follow the vehicle manufacturer's instructions and arrange a physical inspection where necessary.\nOnly include parameters supported by the connected vehicle and diagnostic device. Show \"Unavailable\" when reliable data is not available.";
  const warnLines = doc.splitTextToSize(warnText, contentWidth - 10);

  doc.setFillColor(255, 241, 242);
  doc.setDrawColor(254, 205, 211);
  doc.roundedRect(margin, y - 2, contentWidth, warnLines.length * 4 + 6, 1.5, 1.5, "FD");
  doc.setFillColor(225, 29, 72);
  doc.rect(margin, y - 2, 2.5, warnLines.length * 4 + 6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.2);
  doc.setTextColor(159, 18, 57);
  doc.text(warnLines, margin + 6, y + 2.5);
  y += warnLines.length * 4 + 10;

  // ==========================================
  // 7. DIAGNOSTIC PARAMETERS TABLE
  // ==========================================
  checkPageBreak(50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Diagnostic Parameters (Supported vs Unavailable):", margin, y);
  y += 4.5;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, y, contentWidth, 6, "FD");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text("PARAMETER NAME", margin + 4, y + 4);
  doc.text("OBSERVED READING", margin + 74, y + 4);
  doc.text("DEVICE TELEMETRY STATUS", margin + 128, y + 4);
  y += 6;

  (report.supportedParameters || []).forEach((p, idx) => {
    checkPageBreak(6);
    const rowBg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 5.5, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.2);
    doc.setTextColor(15, 23, 42);
    doc.text(p.name, margin + 4, y + 3.8);

    if (p.value === "Unavailable") {
      doc.setFont("helvetica", "italic");
      doc.setTextColor(148, 163, 184);
      doc.text("Unavailable", margin + 74, y + 3.8);
    } else {
      doc.setFont("helvetica", "bold");
      if (p.warning) {
        doc.setTextColor(217, 119, 6);
      } else {
        doc.setTextColor(15, 23, 42);
      }
      doc.text(p.value, margin + 74, y + 3.8);
    }

    if (p.status === "Unavailable") {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text("Unavailable", margin + 128, y + 3.8);
    } else {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(5, 150, 105);
      doc.text("Supported (CAN J1939)", margin + 128, y + 3.8);
    }

    y += 5.5;
  });

  y += 4;

  // ==========================================
  // 8. TECHNICAL FAULT CODES & RAW CAN VALUES
  // ==========================================
  checkPageBreak(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Technical fault codes and raw CAN values:", margin, y);
  y += 4.5;

  let appendixText = "";
  if (report.faultCodes && report.faultCodes.length > 0) {
    appendixText = report.faultCodes
      .map((f) => `• [${f.status}] ${f.code}: ${f.description}`)
      .join("\n");
  } else {
    appendixText = "• No active Diagnostic Trouble Codes detected (0 Active DTCs in ECU memory).";
  }
  appendixText += `\n• Monitored CAN Frame IDs: ${(report.rawCanIds || []).join(", ")}`;

  const appendixLines = doc.splitTextToSize(appendixText, contentWidth - 10);
  const appHeight = appendixLines.length * 4.2 + 6;

  doc.setFillColor(15, 23, 42); // dark slate card for technical appendix
  doc.roundedRect(margin, y - 2, contentWidth, appHeight, 1.5, 1.5, "F");

  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.setTextColor(248, 250, 252);
  doc.text(appendixLines, margin + 5, y + 2.5);

  y += appHeight + 5;

  // ==========================================
  // 9. TELEMATICS METADATA
  // ==========================================
  checkPageBreak(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Telematics Metadata:", margin, y);
  y += 4.5;

  const metaItems = [
    `Last Data Received: ${report.lastDataReceived}`,
    `Connection Status: [${report.connectionStatus}]`,
    `Data Freshness: [${report.dataFreshness}]`,
    `Unavailable Parameters: ${report.unavailableParameters}`,
    `Report Limitations: ${report.reportLimitations}`
  ];

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);

  let metaBoxLines = [];
  metaItems.forEach((item) => {
    const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 10);
    metaBoxLines = metaBoxLines.concat(lines);
  });

  const mHeight = metaBoxLines.length * 4.2 + 5;
  doc.roundedRect(margin, y - 2, contentWidth, mHeight, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(metaBoxLines, margin + 5, y + 2.5);

  y += mHeight + 5;

  // ==========================================
  // 10. ASSESSMENT & CUSTOMER SUMMARY
  // ==========================================
  checkPageBreak(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`Assessment: [${report.assessment}]`, margin, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text("Summary for the Customer:", margin, y);
  y += 4.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52);
  const custLines = doc.splitTextToSize(report.summaryForCustomer, contentWidth - 8);

  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y - 2, contentWidth, custLines.length * 4.5 + 5, 1.5, 1.5, "FD");
  doc.setFillColor(22, 163, 74);
  doc.rect(margin, y - 2, 2.5, custLines.length * 4.5 + 5, "F");

  doc.text(custLines, margin + 6, y + 2.5);
  y += custLines.length * 4.5 + 8;

  // ==========================================
  // 11. FOOTER & DISCLAIMER
  // ==========================================
  checkPageBreak(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text("Generated by: Hauloop Vehicle Care", margin, y);
  y += 4.5;

  const disclaimerText =
    "Report Disclaimer: This report summarizes the data available from the connected vehicle and diagnostic system at the time of reporting. It does not replace a physical inspection or the vehicle manufacturer's maintenance guidance. Missing, delayed, or unsupported data may affect the assessment.";
  const discLines = doc.splitTextToSize(disclaimerText, contentWidth);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(discLines, margin, y);
  y += discLines.length * 3.5 + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("— End of Report —", pageWidth / 2, y, { align: "center" });

  // Save the PDF file
  const fileName = `Vehicle_Health_Report_${report.vehicleNo.replace(/\s+/g, "_")}_2026.pdf`;

  // On Mobile / Android APK: Support native Android share/open drawer
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile && navigator.canShare) {
    try {
      const pdfBlob = doc.output("blob");
      const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });
      if (navigator.canShare({ files: [pdfFile] })) {
        navigator.share({
          files: [pdfFile],
          title: `Vehicle Health Report - ${report.vehicleNo}`,
          text: `Hauloop Vehicle Health Diagnostic Report for ${report.vehicleNo} (Year 2026)`
        }).catch(() => {
          doc.save(fileName);
        });
        return;
      }
    } catch (err) {
      console.warn("Mobile share fallback to doc.save:", err);
    }
  }

  doc.save(fileName);
}
